import React from 'react';

// Custom weather SVG icons for premium styling
const SunIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" fill="currentColor" className="text-yellow-300 stroke-none" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

const MoonIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" fill="currentColor" className="text-indigo-200 stroke-none" />
  </svg>
);

const SunsetIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 18a5 5 0 0 0-10 0" />
    <path d="M12 2v10M19 12l-7 7-7-7" />
    <path d="M2 22h20" />
  </svg>
);

import { useAppStore } from '../../store/Appstore';

export default function GlassWeatherWidget() {
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const hourlyData = [
    { time: '5 PM', temp: '78°', icon: <SunIcon /> },
    { time: '6 PM', temp: '77°', icon: <SunIcon /> },
    { time: '7 PM', temp: '75°', icon: <SunIcon /> },
    { time: '8 PM', temp: '70°', icon: <SunIcon /> },
    { time: '8:18 PM', temp: '66°', icon: <SunsetIcon /> },
    { time: '9 PM', temp: '66°', icon: <MoonIcon /> }
  ];

  return (
    <div className={`w-80 h-40 backdrop-blur-xl rounded-3xl p-4 flex flex-col justify-between text-white select-none shrink-0 pointer-events-auto relative overflow-hidden transition-all duration-300
      ${isDarkMode 
        ? 'bg-gradient-to-b from-black/40 to-black/15 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_8px_32px_0_rgba(0,0,0,0.3)]' 
        : 'bg-gradient-to-b from-white/12 to-white/4 border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(0,0,0,0.2)]'
      }`}>
      {/* Liquid Glass Overlay Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 pointer-events-none" />

      {/* Top Section */}
      <div className="relative z-10 flex justify-between items-start w-full">
        {/* Left Info */}
        <div>
          <div className="flex items-center gap-1 text-[13px] font-bold text-white/95 leading-none">
            Weymouth
            {/* Location Navigation Arrow */}
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-white/85">
              <path d="M21 3L3 10.53v.98l6.84 2.65L12.5 21h.98L21 3z" />
            </svg>
          </div>
          <div className="text-4xl font-light text-white/95 mt-1 leading-none">
            78°
          </div>
        </div>

        {/* Right Info */}
        <div className="flex flex-col items-end text-right">
          <SunIcon className="w-6 h-6 text-yellow-300 drop-shadow-[0_0_6px_rgba(253,224,71,0.5)] mb-1" />
          <div className="text-[12px] font-semibold text-white/95 leading-none">
            Mostly Sunny
          </div>
          <div className="text-[10px] text-white/60 font-medium tracking-tight mt-1 leading-none">
            H:78° L:54°
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="relative z-10 h-[1px] bg-white/10 my-2" />

      {/* Hourly Forecast */}
      <div className="relative z-10 flex justify-between items-center w-full px-1">
        {hourlyData.map((hour, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1">
            <span className="text-[9px] font-semibold text-white/50 uppercase leading-none">
              {hour.time}
            </span>
            <div className="my-0.5 text-white/90">
              {hour.icon}
            </div>
            <span className="text-[11px] font-bold text-white/90 leading-none">
              {hour.temp}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
