import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/Appstore';

export default function ClockWidget() {
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const rawHours = time.getHours();
  const displayHours = (rawHours % 12 || 12).toString();
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const currentSecond = time.getSeconds();

  const w = 142; 
  const h = 142; 
  const R = 34;  
  const cx = 80; 
  const cy = 80; 

  const S = w - 2 * R;
  const A = (Math.PI / 2) * R;
  const totalPerimeter = 4 * S + 4 * A;

  const ticks = [];
  const tickLength = 7;

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
      x = cx + d;
      y = cy - halfH;
      nx = 0;
      ny = -1;
    } else if (d < p2) {
      const theta = ((d - p1) / A) * (Math.PI / 2);
      const angle = -Math.PI / 2 + theta;
      x = cx + halfW - R + R * Math.cos(angle);
      y = cy - halfH + R + R * Math.sin(angle);
      nx = Math.cos(angle);
      ny = Math.sin(angle);
    } else if (d < p3) {
      x = cx + halfW;
      y = cy - halfH + R + (d - p2);
      nx = 1;
      ny = 0;
    } else if (d < p4) {
      const theta = ((d - p3) / A) * (Math.PI / 2);
      const angle = theta;
      x = cx + halfW - R + R * Math.cos(angle);
      y = cy + halfH - R + R * Math.sin(angle);
      nx = Math.cos(angle);
      ny = Math.sin(angle);
    } else if (d < p5) {
      x = cx + halfW - R - (d - p4);
      y = cy + halfH;
      nx = 0;
      ny = 1;
    } else if (d < p6) {
      const theta = ((d - p5) / A) * (Math.PI / 2);
      const angle = Math.PI / 2 + theta;
      x = cx - halfW + R + R * Math.cos(angle);
      y = cy + halfH - R + R * Math.sin(angle);
      nx = Math.cos(angle);
      ny = Math.sin(angle);
    } else if (d < p7) {
      x = cx - halfW;
      y = cy + halfH - R - (d - p6);
      nx = -1;
      ny = 0;
    } else if (d < p8) {
      const theta = ((d - p7) / A) * (Math.PI / 2);
      const angle = Math.PI + theta;
      x = cx - halfW + R + R * Math.cos(angle);
      y = cy - halfH + R + R * Math.sin(angle);
      nx = Math.cos(angle);
      ny = Math.sin(angle);
    } else {
      x = cx - halfW + R + (d - p8);
      y = cy - halfH;
      nx = 0;
      ny = -1;
    }

    return { x, y, nx, ny };
  }

  for (let i = 0; i < 60; i++) {
    const d = (i * totalPerimeter) / 60;
    const { x, y, nx, ny } = getRoundedRectPointAndNormal(d);

    const x1 = x;
    const y1 = y;
    const x2 = x - tickLength * nx;
    const y2 = y - tickLength * ny;

    const isActive = i <= currentSecond;
    
    let strokeColor;
    if (isDarkMode) {
      strokeColor = isActive ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.15)';
    } else {
      strokeColor = isActive ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.12)';
    }

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
    <div className={`w-40 h-40 rounded-[32px] flex flex-col items-center justify-center select-none shrink-0 pointer-events-auto relative overflow-hidden transition-all duration-300 shadow-lg
      ${isDarkMode 
        ? 'bg-[#1c1c1e] text-white border border-white/5' 
        : 'bg-white text-black border border-black/[0.04]'
      }`}>
      
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 160 160">
        {ticks}
      </svg>

      <div className="relative z-10 flex flex-col items-center">
        <div 
          className="text-[48px] font-black tracking-tight leading-none transition-colors duration-300"
          style={{
            transform: 'scaleY(1.75)',
            transformOrigin: 'center',
            display: 'inline-block'
          }}
        >
          <span className={isDarkMode ? 'text-white' : 'text-neutral-900'}>
            {displayHours}:{minutes}
          </span>
        </div>
      </div>
    </div>
  );
}
