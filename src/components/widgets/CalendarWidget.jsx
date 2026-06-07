import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, isSameDay } from 'date-fns';

export default function CalendarWidget() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const monthStart = startOfMonth(date);
  const startDate = startOfWeek(monthStart);
  
  const days = [];
  let currentDay = startDate;
  
  for (let i = 0; i < 42; i++) {
    days.push(currentDay);
    currentDay = addDays(currentDay, 1);
  }

  return (
    <div className="w-40 h-40 bg-white rounded-3xl p-3 flex flex-col shadow-sm select-none shrink-0 pointer-events-auto">
      <div className="text-[#ff3b30] text-[10px] font-bold uppercase tracking-wider mb-1.5 ml-1 leading-none">
        {format(date, 'MMMM')}
      </div>
      <div className="flex justify-between px-1 mb-1.5">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="text-[8px] font-bold text-gray-400 w-full text-center leading-none">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-[2px] gap-x-0 w-full place-items-center flex-1">
        {days.map((day, i) => {
          const isToday = isSameDay(day, date);
          const isCurrentMonth = day.getMonth() === date.getMonth();
          return (
            <div 
              key={i} 
              className={`text-[9px] font-medium w-4 h-4 flex items-center justify-center rounded-full
                ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-800'}
                ${isToday ? 'bg-[#ff3b30] text-white' : ''}
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
