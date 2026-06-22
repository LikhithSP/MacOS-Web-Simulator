import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, startOfMonth, isSameDay } from 'date-fns';
import { useAppStore } from '../../store/Appstore';
import { GlassSurface } from '../ui/glass-surface';

export default function GlassMiniCalendarWidget() {
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const monthName = format(date, 'MMMM').toUpperCase();
  const monthStart = startOfMonth(date);
  const startDate = startOfWeek(monthStart);
  
  const days = [];
  let currentDay = startDate;
  
  // Create 35 days (5 weeks) of calendar cells
  for (let i = 0; i < 35; i++) {
    days.push(currentDay);
    currentDay = addDays(currentDay, 1);
  }

  return (
    <div className="w-40 h-40 p-3 flex flex-col justify-between text-white select-none shrink-0 pointer-events-auto relative overflow-hidden transition-all duration-300 rounded-3xl">
      <GlassSurface
        tint={isDarkMode ? 0.05 : 0.02}
        radius={24}
        blur={20}
        chroma={0.1}
        className="absolute inset-0 -z-10"
      />

      {/* Header Month */}
      <div className="relative z-10 text-[9px] font-bold text-white/50 tracking-wider mb-1 ml-1 leading-none uppercase">
        {monthName}
      </div>

      {/* Weekdays Header */}
      <div className="relative z-10 flex justify-between px-1 mb-1 leading-none">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="text-[7.5px] font-bold text-white/45 w-full text-center">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="relative z-10 grid grid-cols-7 gap-y-[1px] gap-x-0 w-full place-items-center flex-1 mt-0.5">
        {days.map((day, i) => {
          const isToday = isSameDay(day, date);
          const isCurrentMonth = day.getMonth() === date.getMonth();
          return (
            <div 
              key={i} 
              className={`text-[8.5px] font-semibold w-4 h-4 flex items-center justify-center rounded-full transition-all
                ${isToday 
                  ? 'bg-white text-neutral-900 shadow-sm font-bold scale-105' 
                  : (!isCurrentMonth ? 'text-white/20' : 'text-white/85')
                }
              `}
            >
              {format(day, 'd')}
            </div>
          );
        })}
      </div>
    </div>
  );
}


