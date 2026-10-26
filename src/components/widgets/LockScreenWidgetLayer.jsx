import React, { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "lockscreen_widgets";
const DEFAULT_WIDGETS = [
  { id: "calendar", x: 4, y: 5 },
  { id: "quote", x: 4, y: 31 },
  { id: "apps", x: 4, y: 48 },
  { id: "sunrise", x: 4, y: 59 },
  { id: "day", x: 4, y: 86 },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function WidgetShell({ children, className = "", onPointerDown, label, style }) {
  return (
    <div
      className={`absolute select-none touch-none ${className}`}
      onPointerDown={onPointerDown}
      style={style}
      role="group"
      aria-label={`${label} widget. Drag to move`}
    >
      {children}
    </div>
  );
}

function CalendarWidget() {
  const date = new Date();
  const month = date.toLocaleDateString("en-US", { month: "long" }).toUpperCase();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const cells = Array.from({ length: 35 }, (_, index) => {
    const day = index - firstDay + 1;
    return day > 0 && day <= daysInMonth ? day : "";
  });

  return (
    <div className="w-[150px] text-white/85 drop-shadow-[0_1px_3px_rgba(0,0,0,0.35)]">
      <div className="mb-2 text-[12px] font-semibold tracking-[0.18em] text-white/80">{month}</div>
      <div className="grid grid-cols-7 gap-y-1 text-center text-[8px] font-medium text-white/60">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}
        {cells.map((day, index) => (
          <span key={index} className={`flex h-[15px] items-center justify-center ${day === date.getDate() ? "rounded-full bg-white font-bold text-sky-700" : ""}`}>
            {day}
          </span>
        ))}
      </div>
    </div>
  );
}

function QuoteWidget() {
  return (
    <div className="w-[164px] text-[10px] leading-[1.35] text-white/80 drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
      &quot;The flowers appear on the earth, the time of pruning the vines has come,
      and the song of the turtledove is heard in our land.&quot; Song of Songs 2:12
    </div>
  );
}

function AppShortcut({ type, label }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-white/30 bg-white/25 text-white/90 shadow-[0_4px_14px_rgba(0,0,0,0.12)] backdrop-blur-md">
        {type === "notion" ? (
          <span className="rounded-[3px] border-2 border-white px-1 text-[19px] font-black leading-5">N</span>
        ) : (
          <svg width="25" height="25" viewBox="0 0 25 25" aria-hidden="true">
            <path d="M12.5 2.5c1.7 6.2 3.8 9.3 10 10-6.2.7-8.3 3.8-10 10-1.7-6.2-3.8-9.3-10-10 6.2-.7 8.3-3.8 10-10Z" fill="currentColor" />
          </svg>
        )}
      </div>
      <span className="text-[8px] font-medium text-white/75">{label}</span>
    </div>
  );
}

function AppsWidget() {
  return <div className="flex gap-3"><AppShortcut type="notion" label="Notion" /><AppShortcut type="gemini" label="Gemini" /></div>;
}

function SunriseWidget() {
  return (
    <div className="w-[168px] text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.35)]">
      <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] text-white/80"><span className="text-[15px]">☀</span> SUNRISE</div>
      <div className="mt-1 text-[26px] font-medium tracking-tight">5:35AM</div>
      <svg className="mt-1 h-[45px] w-full overflow-visible" viewBox="0 0 168 45" fill="none" aria-hidden="true">
        <path d="M1 39C22 39 22 7 45 7s22 32 44 32 24-32 40-32 17 32 38 32" stroke="rgba(255,255,255,.62)" strokeWidth="1.5" />
        <path d="M1 40h166" stroke="rgba(255,255,255,.35)" />
      </svg>
      <div className="mt-1 flex justify-between text-[10px] text-white/65"><span>Sunrise: 5:35AM</span><span>Sunset: 6:28PM</span></div>
    </div>
  );
}

function DayWidget() {
  return <div className="w-[150px] text-[11px] font-medium text-white/80 drop-shadow-[0_1px_3px_rgba(0,0,0,0.35)]"><div className="mb-1 text-[12px] font-semibold">World of the Day</div><div className="text-[10px] text-white/65">Make today a little brighter.</div></div>;
}

const WIDGETS = {
  calendar: { label: "Calendar", component: <CalendarWidget />, width: 170, height: 150 },
  quote: { label: "Quote", component: <QuoteWidget />, width: 180, height: 80 },
  apps: { label: "Notion and Gemini", component: <AppsWidget />, width: 120, height: 70 },
  sunrise: { label: "Sunrise", component: <SunriseWidget />, width: 180, height: 120 },
  day: { label: "World of the Day", component: <DayWidget />, width: 170, height: 60 },
};

export default function LockScreenWidgetLayer() {
  const [widgets, setWidgets] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      return Array.isArray(saved) && saved.length ? saved : DEFAULT_WIDGETS;
    } catch {
      return DEFAULT_WIDGETS;
    }
  });
  const layerRef = useRef(null);
  const dragRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
  }, [widgets]);

  const handlePointerDown = useCallback((event, widget) => {
    if (event.button !== 0 || !layerRef.current) return;
    event.preventDefault();
    dragRef.current = {
      id: widget.id,
      startX: event.clientX,
      startY: event.clientY,
      startWidgetX: widget.x,
      startWidgetY: widget.y,
      bounds: layerRef.current.getBoundingClientRect(),
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }, []);

  const handlePointerMove = useCallback((event) => {
    const drag = dragRef.current;
    if (!drag) return;
    const widgetInfo = WIDGETS[drag.id];
    const xDelta = ((event.clientX - drag.startX) / drag.bounds.width) * 100;
    const yDelta = ((event.clientY - drag.startY) / drag.bounds.height) * 100;
    const maxX = 100 - (widgetInfo.width / drag.bounds.width) * 100;
    const maxY = 100 - (widgetInfo.height / drag.bounds.height) * 100;
    setWidgets((current) => current.map((item) => item.id === drag.id
      ? { ...item, x: clamp(drag.startWidgetX + xDelta, 1, Math.max(1, maxX)), y: clamp(drag.startWidgetY + yDelta, 1, Math.max(1, maxY)) }
      : item));
  }, []);

  const stopDragging = useCallback(() => { dragRef.current = null; }, []);

  return (
    <div ref={layerRef} className="pointer-events-none absolute inset-0 z-[12] hidden sm:block" onPointerMove={handlePointerMove} onPointerUp={stopDragging} onPointerCancel={stopDragging}>
      {widgets.map((widget) => {
        const definition = WIDGETS[widget.id];
        if (!definition) return null;
        return (
          <WidgetShell key={widget.id} label={definition.label} onPointerDown={(event) => handlePointerDown(event, widget)} className="pointer-events-auto cursor-grab active:cursor-grabbing" style={{ left: `${widget.x}%`, top: `${widget.y}%` }}>
            {definition.component}
          </WidgetShell>
        );
      })}
    </div>
  );
}
