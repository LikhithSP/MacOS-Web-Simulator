import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/Appstore';
import { GlassSurface } from '../ui/glass-surface';

function MiniAnalogClock({ timezone, cityCode }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getLocalTime = (tz) => {
    try {
      const string = new Date().toLocaleString("en-US", { timeZone: tz });
      return new Date(string);
    } catch (e) {
      return new Date();
    }
  };

  const localTime = getLocalTime(timezone);
  const hours = localTime.getHours();
  const minutes = localTime.getMinutes();
  const seconds = localTime.getSeconds();

  const hrAngle = (hours % 12) * 30 + minutes * 0.5;
  const minAngle = minutes * 6;
  const secAngle = seconds * 6;

  return (
    <div className="flex flex-col items-center justify-center p-0 select-none">
      <svg width="63" height="63" viewBox="0 0 50 50" className="text-white/95 drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.18)]">
        {/* Outer Circle */}
        <circle cx="25" cy="25" r="23" stroke="currentColor" strokeWidth="0.8" fill="none" className="text-white/20" />
        
        {/* City Code inside clock face */}
        <text x="25" y="21" textAnchor="middle" fontSize="5.5" fontWeight="bold" className="fill-white/70 uppercase tracking-wider">
          {cityCode}
        </text>

        {/* Clean numbers matching the reference screenshot */}
        <text x="25" y="10" textAnchor="middle" fontSize="4.5" fontWeight="500" className="fill-white/75">12</text>
        <text x="9" y="19.5" textAnchor="middle" fontSize="4.5" fontWeight="500" className="fill-white/50">10</text>
        <text x="41" y="19.5" textAnchor="middle" fontSize="4.5" fontWeight="500" className="fill-white/50">2</text>
        <text x="9" y="34.5" textAnchor="middle" fontSize="4.5" fontWeight="500" className="fill-white/50">8</text>
        <text x="41" y="34.5" textAnchor="middle" fontSize="4.5" fontWeight="500" className="fill-white/50">4</text>
        <text x="25" y="44" textAnchor="middle" fontSize="4.5" fontWeight="500" className="fill-white/50">6</text>

        {/* Hour Hand */}
        <line 
          x1="25" y1="25" 
          x2={25 + 9 * Math.sin((hrAngle * Math.PI) / 180)} 
          y2={25 - 9 * Math.cos((hrAngle * Math.PI) / 180)} 
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" 
        />
        {/* Minute Hand */}
        <line 
          x1="25" y1="25" 
          x2={25 + 14 * Math.sin((minAngle * Math.PI) / 180)} 
          y2={25 - 14 * Math.cos((minAngle * Math.PI) / 180)} 
          stroke="currentColor" strokeWidth="1" strokeLinecap="round" 
        />
        {/* Second Hand */}
        <line 
          x1="25" y1="25" 
          x2={25 + 16 * Math.sin((secAngle * Math.PI) / 180)} 
          y2={25 - 16 * Math.cos((secAngle * Math.PI) / 180)} 
          stroke="#ff453a" strokeWidth="0.5" strokeLinecap="round" 
        />
        
        {/* Center Pin */}
        <circle cx="25" cy="25" r="1.2" fill="currentColor" />
        <circle cx="25" cy="25" r="0.5" fill="#303030" />
      </svg>
    </div>
  );
}

export default function GlassSmallWorldClockWidget() {
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const clocks = [
    { tz: 'America/Los_Angeles', code: 'CUP' },
    { tz: 'Asia/Tokyo', code: 'TOK' },
    { tz: 'Australia/Sydney', code: 'SYD' },
    { tz: 'Europe/Paris', code: 'PAR' }
  ];

  return (
    <div className="w-40 h-40 p-2 flex flex-col justify-center text-white select-none shrink-0 pointer-events-auto relative overflow-hidden transition-all duration-300 rounded-3xl">
      <GlassSurface
        tint={0}
        radius={24}
        blur={8}
        chroma={0.3}
        className="absolute inset-0 -z-10"
      />

      {/* 2x2 Clocks Layout */}
      <div className="relative z-10 grid grid-cols-2 gap-0.5 w-full h-full justify-items-center items-center">
        {clocks.map((clock, idx) => (
          <MiniAnalogClock key={idx} timezone={clock.tz} cityCode={clock.code} />
        ))}
      </div>
    </div>
  );
}


