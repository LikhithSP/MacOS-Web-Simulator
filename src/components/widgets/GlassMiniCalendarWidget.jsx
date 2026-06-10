import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, startOfMonth, isSameDay } from 'date-fns';

export default function GlassMiniCalendarWidget() {
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
    <div className="w-40 h-40 bg-gradient-to-b from-white/12 to-white/4 backdrop-blur-xl border border-white/20 rounded-3xl p-3 flex flex-col justify-between shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(0,0,0,0.2)] text-white select-none shrink-0 pointer-events-auto relative overflow-hidden">
      {/* Liquid Glass Overlay Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 pointer-events-none" />

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
                ${!isCurrentMonth ? 'text-white/20' : 'text-white/85'}
                ${isToday ? 'bg-white text-gray-900 shadow-sm font-bold scale-105' : ''}
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
