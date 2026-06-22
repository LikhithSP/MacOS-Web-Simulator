import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/Appstore';

export default function GlassDayWidget() {
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const [day, setDay] = useState('');

  useEffect(() => {
    const updateDay = () => {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const currentDay = days[new Date().getDay()];
      setDay(currentDay);
    };
    updateDay();
    const interval = setInterval(updateDay, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center text-white select-none shrink-0 pointer-events-auto relative transition-all duration-300 min-w-[180px] min-h-[80px]">
      {/* Load Calligraphy Fonts for Frutilla style */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playball&family=Dancing+Script&display=swap');
        .frutilla-text {
          font-family: 'Great Vibes', 'Dancing Script', 'Playball', cursive;
          text-shadow: 0 4px 20px rgba(255, 255, 255, 0.4), 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}} />

      {/* Day display */}
      <span className="frutilla-text text-[60px] text-center text-white/95 leading-none select-text cursor-default">
        {day}
      </span>
    </div>
  );
}


