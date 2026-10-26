import React, { useEffect, useState } from "react";
import { addDays, format, startOfMonth, startOfWeek } from "date-fns";
import { GlassSurface } from "../ui/glass-surface";

export default function GlassCalendarWidget() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const monthStart = startOfMonth(date);
  const firstDay = startOfWeek(monthStart);
  const days = Array.from({ length: 35 }, (_, index) => addDays(firstDay, index));

  return (
    <div className="relative h-40 w-40 overflow-hidden rounded-3xl p-3.5 text-white select-none">
      <GlassSurface tint={0.1} tintColor="34,133,203" radius={24} blur={18} chroma={0.25} className="absolute inset-0 -z-10" />
      <div className="relative z-10 flex items-baseline gap-1 text-[11px] font-semibold tracking-wide text-white/90">
        <span>{format(date, "MMM").toUpperCase()}</span>
        <span className="text-white/55">{format(date, "d")} {format(date, "EEEE").toUpperCase()}</span>
      </div>
      <div className="relative z-10 mt-2.5 grid grid-cols-7 gap-y-0.5 text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => <span key={`${day}-${index}`} className="text-[9px] font-semibold text-white/70">{day}</span>)}
        {days.map((day) => {
          const isToday = format(day, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
          const isCurrentMonth = day.getMonth() === date.getMonth();
          return (
            <span key={day.toISOString()} className={`mx-auto flex h-4 w-4 items-center justify-center rounded-full text-[9px] ${isToday ? "bg-white text-sky-700 shadow-sm" : isCurrentMonth ? "text-white/90" : "text-white/30"}`}>
              {format(day, "d")}
            </span>
          );
        })}
      </div>
    </div>
  );
}
