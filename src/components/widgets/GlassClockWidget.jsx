import React, { useState, useEffect } from 'react';

export default function GlassClockWidget() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');

  // Generate ticks conforming to the card shape (a rounded square)
  // We can do this by using a circular layout and stretching/scaling it, 
  // or a clean concentric design. Let's draw a beautiful radial tick system.
  const ticks = [];
  for (let i = 0; i < 60; i++) {
    const angle = (i * 6) * Math.PI / 180;
    const isHour = i % 5 === 0;
    const length = isHour ? 8 : 4;
    
    // Scale radius to make it slightly square-ish (rounded rect projection)
    const cosVal = Math.cos(angle);
    const sinVal = Math.sin(angle);
    const scale = 1 / Math.max(Math.abs(cosVal), Math.abs(sinVal));
    // Interpolate between circle (scale = 1) and square (scale = square_scale) to get a rounded rect look
    const r1 = 66 * (1 + (scale - 1) * 0.18); 
    const r2 = r1 - length;

    const x1 = 80 + r1 * sinVal;
    const y1 = 80 - r1 * cosVal;
    const x2 = 80 + r2 * sinVal;
    const y2 = 80 - r2 * cosVal;

    ticks.push(
      <line 
        key={i} 
        x1={x1} 
        y1={y1} 
        x2={x2} 
        y2={y2} 
        stroke="currentColor" 
        strokeWidth={isHour ? 1.5 : 0.8} 
        className={isHour ? 'text-white/60' : 'text-white/25'}
      />
    );
  }

  return (
    <div className="w-40 h-40 bg-gradient-to-b from-white/12 to-white/4 backdrop-blur-xl border border-white/20 rounded-3xl flex flex-col items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(0,0,0,0.2)] text-white select-none shrink-0 pointer-events-auto relative overflow-hidden">
      {/* Liquid Glass Overlay Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 pointer-events-none" />
      
      {/* Analog Ticks Background */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 160 160">
        {ticks}
      </svg>

      {/* Time Display */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="text-[42px] font-semibold tracking-tighter leading-none text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
          {hours}:{minutes}
        </div>
      </div>
    </div>
  );
}
