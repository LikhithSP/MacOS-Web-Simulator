import React, { useState } from 'react';
import { useAppStore } from '../../store/Appstore';
import { FiList } from 'react-icons/fi';
import { GlassSurface } from '../ui/glass-surface';

export default function GlassWideRemindersWidget() {
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  
  const [reminders, setReminders] = useState([
    { id: 1, text: 'Update presentation images', completed: false },
    { id: 2, text: 'Edit speaker notes', completed: false },
    { id: 3, text: 'Compile sources', completed: false },
    { id: 4, text: 'Email draft to Brian', completed: false }
  ]);

  const toggleReminder = (id) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  const activeCount = reminders.filter(r => !r.completed).length;

  return (
    <div className="w-80 h-40 flex text-white p-5 select-none shrink-0 pointer-events-auto relative overflow-hidden transition-all duration-300 rounded-3xl">
      <GlassSurface
        tint={isDarkMode ? 0.05 : 0.02}
        radius={24}
        blur={20}
        chroma={0.1}
        className="absolute inset-0 -z-10"
      />

      {/* Left Column - Indicator Panel */}
      <div className="relative z-10 w-[28%] flex flex-col justify-between h-full pr-1">
        {/* Bullet List Icon with Circle Background */}
        <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-[0_2px_8px_rgba(0,0,0,0.15)]
          ${isDarkMode ? 'bg-white/10 hover:bg-white/15' : 'bg-white/20 hover:bg-white/25'}`}>
          <FiList className="w-5 h-5 text-white/90" />
        </div>

        {/* Counter and Label */}
        <div className="flex flex-col mt-auto select-none cursor-default">
          <span className="text-[36px] font-semibold leading-none tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
            {activeCount}
          </span>
          <span className="text-[10px] font-semibold text-white/50 leading-tight tracking-wide mt-1 uppercase">
            Don't forget
          </span>
        </div>
      </div>

      {/* Right Column - Checklist */}
      <div className="relative z-10 flex-1 flex flex-col justify-center gap-3.5 pl-4 h-full">
        {reminders.map(item => (
          <div 
            key={item.id} 
            className="flex items-center gap-3 cursor-pointer group py-0.5"
            onClick={() => toggleReminder(item.id)}
          >
            {/* Custom Circular Checkbox matching screenshot style */}
            <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-all shrink-0
              ${item.completed 
                ? 'bg-white/90 border-white text-neutral-800 shadow-sm' 
                : 'border-white/35 group-hover:border-white/55 bg-white/5'}`}>
              {item.completed && (
                <svg className="w-2.5 h-2.5 text-neutral-900" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              )}
            </div>
            
            {/* Text */}
            <span className={`text-[11.5px] font-normal leading-none transition-all tracking-wide
              ${item.completed ? 'line-through text-white/40' : 'text-white/90 group-hover:text-white'}`}>
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}


