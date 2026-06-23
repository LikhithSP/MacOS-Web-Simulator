import React, { useState } from 'react';
import { useAppStore } from '../../store/Appstore';
import { GlassSurface } from '../ui/glass-surface';

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
    <div className="w-40 h-40 p-4 flex flex-col justify-between text-white select-none shrink-0 pointer-events-auto relative overflow-hidden transition-all duration-300 rounded-3xl">
      <GlassSurface
        tint={0}
        radius={24}
        blur={8}
        chroma={0.3}
        className="absolute inset-0 -z-10"
      />

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
            <span className={`text-[10px] font-normal transition-all ${item.completed ? 'line-through text-white/40' : 'text-white/90 group-hover:text-white'}`}>
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}


