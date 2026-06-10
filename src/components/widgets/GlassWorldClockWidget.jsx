import React, { useState, useEffect } from 'react';

function AnalogClock({ timezone, cityCode }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate local time for timezone
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
    <svg width="56" height="56" viewBox="0 0 60 60" className="text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
      {/* Outer Dial Circle */}
      <circle cx="30" cy="30" r="28" stroke="currentColor" strokeWidth="1" fill="none" className="text-white/15" />
      
      {/* City Code inside clock */}
      <text x="30" y="22" textAnchor="middle" fontSize="6" fontWeight="bold" className="fill-white/60 uppercase letter-spacing-widest">
        {cityCode}
      </text>

      {/* Markers/Numbers */}
      <text x="30" y="11" textAnchor="middle" fontSize="5" className="fill-white/65">12</text>
      <text x="30" y="55" textAnchor="middle" fontSize="5" className="fill-white/65">6</text>
      <text x="10" y="32" textAnchor="middle" fontSize="5" className="fill-white/65">9</text>
      <text x="50" y="32" textAnchor="middle" fontSize="5" className="fill-white/65">3</text>
      
      {/* Small number markers for others */}
      <text x="40" y="15" textAnchor="middle" fontSize="4.5" className="fill-white/40">1</text>
      <text x="48" y="23" textAnchor="middle" fontSize="4.5" className="fill-white/40">2</text>
      <text x="48" y="41" textAnchor="middle" fontSize="4.5" className="fill-white/40">4</text>
      <text x="40" y="49" textAnchor="middle" fontSize="4.5" className="fill-white/40">5</text>
      <text x="20" y="49" textAnchor="middle" fontSize="4.5" className="fill-white/40">7</text>
      <text x="12" y="41" textAnchor="middle" fontSize="4.5" className="fill-white/40">8</text>
      <text x="12" y="23" textAnchor="middle" fontSize="4.5" className="fill-white/40">10</text>
      <text x="20" y="15" textAnchor="middle" fontSize="4.5" className="fill-white/40">11</text>

      {/* Hour Hand */}
      <line 
        x1="30" y1="30" 
        x2={30 + 12 * Math.sin((hrAngle * Math.PI) / 180)} 
        y2={30 - 12 * Math.cos((hrAngle * Math.PI) / 180)} 
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" 
      />
      {/* Minute Hand */}
      <line 
        x1="30" y1="30" 
        x2={30 + 18 * Math.sin((minAngle * Math.PI) / 180)} 
        y2={30 - 18 * Math.cos((minAngle * Math.PI) / 180)} 
        stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" 
      />
      {/* Second Hand */}
      <line 
        x1="30" y1="30" 
        x2={30 + 20 * Math.sin((secAngle * Math.PI) / 180)} 
        y2={30 - 20 * Math.cos((secAngle * Math.PI) / 180)} 
        stroke="#ff453a" strokeWidth="0.6" strokeLinecap="round" 
      />
      
      {/* Center Pin */}
      <circle cx="30" cy="30" r="1.5" fill="currentColor" />
      <circle cx="30" cy="30" r="0.6" fill="#303030" />
    </svg>
  );
}

import { useAppStore } from '../../store/Appstore';

export default function GlassWorldClockWidget() {
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const clocks = [
    { name: 'Cupertino', tz: 'America/Los_Angeles', code: 'SF', offset: '+0HRS', rel: 'Today' },
    { name: 'Tokyo', tz: 'Asia/Tokyo', code: 'TOK', offset: '+16HRS', rel: 'Tomorrow' },
    { name: 'Sydney', tz: 'Australia/Sydney', code: 'SYD', offset: '+17HRS', rel: 'Tomorrow' },
    { name: 'Paris', tz: 'Europe/Paris', code: 'PAR', offset: '+9HRS', rel: 'Today' }
  ];

  return (
    <div className={`w-80 h-40 backdrop-blur-xl rounded-3xl p-4 flex flex-col justify-between text-white select-none shrink-0 pointer-events-auto relative overflow-hidden transition-all duration-300
      ${isDarkMode 
        ? 'bg-gradient-to-b from-black/40 to-black/15 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_8px_32px_0_rgba(0,0,0,0.3)]' 
        : 'bg-gradient-to-b from-white/12 to-white/4 border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(0,0,0,0.2)]'
      }`}>
      {/* Liquid Glass Overlay Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 pointer-events-none" />

      {/* Clocks Layout */}
      <div className="relative z-10 flex justify-between items-center w-full px-1 mt-1">
        {clocks.map((clock, idx) => (
          <div key={idx} className="flex flex-col items-center">
            {/* Clock Dial */}
            <AnalogClock timezone={clock.tz} cityCode={clock.code} />
            
            {/* Clock Labels */}
            <span className="text-[10px] font-bold text-white/95 mt-2 leading-none">
              {clock.name}
            </span>
            <span className="text-[8.5px] text-white/50 font-medium leading-none mt-1">
              {clock.rel}
            </span>
            <span className="text-[8.5px] text-white/40 font-semibold leading-none mt-0.5">
              {clock.offset}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
