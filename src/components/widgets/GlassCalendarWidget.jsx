import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useAppStore } from '../../store/Appstore';

export default function GlassCalendarWidget() {
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const dayOfWeek = format(date, 'EEEE').toUpperCase();
  const dayNumber = format(date, 'd');

  return (
    <div className={`w-40 h-40 backdrop-blur-xl rounded-3xl p-4 flex flex-col justify-between text-white select-none shrink-0 pointer-events-auto relative overflow-hidden transition-all duration-300
      ${isDarkMode 
        ? 'bg-gradient-to-b from-black/40 to-black/15 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_8px_32px_0_rgba(0,0,0,0.3)]' 
        : 'bg-gradient-to-b from-white/12 to-white/4 border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(0,0,0,0.2)]'
      }`}>
      {/* Liquid Glass Overlay Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10">
        <div className="text-[10px] font-bold text-white/50 tracking-wider uppercase leading-none">
          {dayOfWeek}
        </div>
        <div className="text-4xl font-light text-white/95 mt-1 leading-none">
          {dayNumber}
        </div>
      </div>

      {/* Center Event Counts */}
      <div className="relative z-10 flex items-center gap-1.5 mt-1">
        {/* Overlapping circle avatars */}
        <div className="flex -space-x-1.5">
          <div className="w-3.5 h-3.5 rounded-full border border-white/20 bg-[#ff453a]" />
          <div className="w-3.5 h-3.5 rounded-full border border-white/20 bg-[#30d158]" />
          <div className="w-3.5 h-3.5 rounded-full border border-white/20 bg-[#0a84ff]" />
        </div>
        <span className="text-[11px] font-medium text-white/80 leading-none">
          3 all-day events
        </span>
      </div>

      {/* Bottom Event Detail Card */}
      <div className="relative z-10 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-2 mt-auto">
        <div className="flex items-center gap-1.5">
          {/* Vertical line indicator */}
          <div className="w-[3px] h-6 rounded-full bg-[#ff9f0a]" />
          <div>
            <div className="text-[11px] font-semibold text-white leading-tight">
              Supper Club
            </div>
            <div className="text-[9px] text-white/60 font-medium leading-none mt-0.5">
              5:30 – 6:30 PM
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
