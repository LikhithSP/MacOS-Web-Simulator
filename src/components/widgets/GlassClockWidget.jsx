import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/Appstore';
import { GlassSurface } from '../ui/glass-surface';

export default function GlassClockWidget() {
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const rawHours = time.getHours();
  // 12-hour format for the classic clock widget look
  const displayHours = (rawHours % 12 || 12).toString();
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const currentSecond = time.getSeconds();

  // Parameters for the rounded rectangle tick track
  const w = 142; // width of tick boundary
  const h = 142; // height of tick boundary
  const R = 34;  // corner radius
  const cx = 80; // center X of SVG (160x160)
  const cy = 80; // center Y of SVG (160x160)

  const S = w - 2 * R;
  const A = (Math.PI / 2) * R;
  const totalPerimeter = 4 * S + 4 * A;

  const ticks = [];
  const tickLength = 7;

  // Helper to get point and normal on rounded rect perimeter
  function getRoundedRectPointAndNormal(d) {
    const halfS = S / 2;
    const p1 = halfS;
    const p2 = p1 + A;
    const p3 = p2 + S;
    const p4 = p3 + A;
    const p5 = p4 + S;
    const p6 = p5 + A;
    const p7 = p6 + S;
    const p8 = p7 + A;

    const halfW = w / 2;
    const halfH = h / 2;

    let x, y, nx, ny;

    if (d < p1) {
      // Top-right straight segment
      x = cx + d;
      y = cy - halfH;
      nx = 0;
      ny = -1;
    } else if (d < p2) {
      // Top-right corner
      const theta = ((d - p1) / A) * (Math.PI / 2);
      const angle = -Math.PI / 2 + theta;
      x = cx + halfW - R + R * Math.cos(angle);
      y = cy - halfH + R + R * Math.sin(angle);
      nx = Math.cos(angle);
      ny = Math.sin(angle);
    } else if (d < p3) {
      // Right straight segment
      x = cx + halfW;
      y = cy - halfH + R + (d - p2);
      nx = 1;
      ny = 0;
    } else if (d < p4) {
      // Bottom-right corner
      const theta = ((d - p3) / A) * (Math.PI / 2);
      const angle = theta;
      x = cx + halfW - R + R * Math.cos(angle);
      y = cy + halfH - R + R * Math.sin(angle);
      nx = Math.cos(angle);
      ny = Math.sin(angle);
    } else if (d < p5) {
      // Bottom straight segment
      x = cx + halfW - R - (d - p4);
      y = cy + halfH;
      nx = 0;
      ny = 1;
    } else if (d < p6) {
      // Bottom-left corner
      const theta = ((d - p5) / A) * (Math.PI / 2);
      const angle = Math.PI / 2 + theta;
      x = cx - halfW + R + R * Math.cos(angle);
      y = cy + halfH - R + R * Math.sin(angle);
      nx = Math.cos(angle);
      ny = Math.sin(angle);
    } else if (d < p7) {
      // Left straight segment
      x = cx - halfW;
      y = cy + halfH - R - (d - p6);
      nx = -1;
      ny = 0;
    } else if (d < p8) {
      // Top-left corner
      const theta = ((d - p7) / A) * (Math.PI / 2);
      const angle = Math.PI + theta;
      x = cx - halfW + R + R * Math.cos(angle);
      y = cy - halfH + R + R * Math.sin(angle);
      nx = Math.cos(angle);
      ny = Math.sin(angle);
    } else {
      // Top-left straight segment
      x = cx - halfW + R + (d - p8);
      y = cy - halfH;
      nx = 0;
      ny = -1;
    }

    return { x, y, nx, ny };
  }

  // Generate 60 ticks around the rounded rect
  for (let i = 0; i < 60; i++) {
    // Calculate distance along the perimeter.
    // 0 is top-center, moving clockwise.
    const d = (i * totalPerimeter) / 60;
    const { x, y, nx, ny } = getRoundedRectPointAndNormal(d);

    const x1 = x;
    const y1 = y;
    const x2 = x - tickLength * nx;
    const y2 = y - tickLength * ny;

    // Active color: black/dark in light mode, white/bright in dark mode.
    // Ticks up to the current second are highlighted/active.
    const isActive = i <= currentSecond;
    
    const strokeColor = isActive ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.2)';

    ticks.push(
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={strokeColor}
        strokeWidth={2}
        strokeLinecap="round"
      />
    );
  }

  return (
    <div className="w-40 h-40 flex flex-col items-center justify-center text-white select-none shrink-0 pointer-events-auto relative overflow-hidden transition-all duration-300 rounded-3xl">
      <GlassSurface
        tint={isDarkMode ? 0.05 : 0.02}
        radius={24}
        blur={20}
        chroma={0.1}
        className="absolute inset-0 -z-10"
      />

      {/* Analog Ticks Background */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 160 160">
        {ticks}
      </svg>

      {/* Time Display */}
      <div className="relative z-10 flex flex-col items-center">
        <div 
          className="text-[48px] font-black tracking-tight leading-none transition-colors duration-300 text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
          style={{
            transform: 'scaleY(1.75)',
            transformOrigin: 'center',
            display: 'inline-block'
          }}
        >
          <span>
            {displayHours}:{minutes}
          </span>
        </div>
      </div>
    </div>
  );
}


