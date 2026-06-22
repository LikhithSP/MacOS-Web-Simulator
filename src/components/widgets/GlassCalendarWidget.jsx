import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useAppStore } from '../../store/Appstore';
import { GlassSurface } from '../ui/glass-surface';

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
    <div className="w-40 h-40 p-4 flex flex-col justify-between text-white select-none shrink-0 pointer-events-auto relative overflow-hidden transition-all duration-300 rounded-3xl">
      <GlassSurface
        tint={isDarkMode ? 0.05 : 0.02}
        radius={24}
        blur={20}
        chroma={0.1}
        className="absolute inset-0 -z-10"
      />

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


