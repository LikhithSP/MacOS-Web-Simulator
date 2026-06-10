import React, { useState } from 'react';
import { useAppStore } from '../../store/Appstore';

export default function GlassRemindersWidget() {
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const [reminders, setReminders] = useState([
    { id: 1, text: 'Spring cleaning', completed: false },
    { id: 2, text: 'Volunteer project', completed: false },
    { id: 3, text: 'Family vacation', completed: false }
  ]);

  const toggleReminder = (id) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  const activeCount = 7 - reminders.filter(r => r.completed).length; // Dynamic total based on default 7

  return (
    <div className={`w-40 h-40 backdrop-blur-xl rounded-3xl p-4 flex flex-col justify-between text-white select-none shrink-0 pointer-events-auto relative overflow-hidden transition-all duration-300
      ${isDarkMode 
        ? 'bg-gradient-to-b from-black/40 to-black/15 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_8px_32px_0_rgba(0,0,0,0.3)]' 
        : 'bg-gradient-to-b from-white/12 to-white/4 border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(0,0,0,0.2)]'
      }`}>
      {/* Liquid Glass Overlay Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center w-full">
        <span className="text-[12px] font-bold text-white/95">
          Reminders
        </span>
        <span className="text-[14px] font-bold text-white/60">
          {activeCount}
        </span>
      </div>

      {/* List */}
      <div className="relative z-10 flex flex-col gap-2.5 mt-2 flex-1 justify-center">
        {reminders.map(item => (
          <div 
            key={item.id} 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => toggleReminder(item.id)}
          >
            {/* Custom Circular Checkbox */}
            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${item.completed ? 'bg-white/25 border-white/40' : 'border-white/35 group-hover:border-white/60 bg-transparent'}`}>
              {item.completed && (
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </div>
            {/* Text */}
            <span className={`text-[11px] font-medium transition-all ${item.completed ? 'line-through text-white/40' : 'text-white/90 group-hover:text-white'}`}>
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
