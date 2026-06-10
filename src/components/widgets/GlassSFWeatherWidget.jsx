import React from 'react';

const PartlyCloudyIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v2M4.93 4.93l1.41 1.41M20 12h2M19.07 4.93l-1.41 1.41" className="text-yellow-300" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="3" fill="currentColor" className="text-yellow-300 stroke-none" />
    <path d="M17.5 19H9a5 5 0 0 1-5-5c0-2.3 1.5-4.3 3.6-4.8A6 6 0 0 1 18 13.5a5 5 0 0 1-.5 5.5Z" fill="currentColor" className="text-white/80 stroke-none" />
  </svg>
);

import { useAppStore } from '../../store/Appstore';

export default function GlassSFWeatherWidget() {
  const isDarkMode = useAppStore((state) => state.isDarkMode);

  return (
    <div className={`w-40 h-40 backdrop-blur-xl rounded-3xl p-4 flex flex-col justify-between text-white select-none shrink-0 pointer-events-auto relative overflow-hidden transition-all duration-300
      ${isDarkMode 
        ? 'bg-gradient-to-b from-black/40 to-black/15 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_8px_32px_0_rgba(0,0,0,0.3)]' 
        : 'bg-gradient-to-b from-white/12 to-white/4 border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(0,0,0,0.2)]'
      }`}>
      {/* Liquid Glass Overlay Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 pointer-events-none" />

      {/* Top half */}
      <div className="relative z-10">
        <div className="text-[13px] font-bold text-white/95 leading-none">
          San Francisco
        </div>
        <div className="text-[38px] font-light text-white/95 mt-1.5 leading-none">
          53°
        </div>
      </div>

      {/* Bottom half */}
      <div className="relative z-10 mt-auto">
        <div className="flex items-center text-yellow-300 drop-shadow-[0_0_6px_rgba(253,224,71,0.4)] mb-1">
          <PartlyCloudyIcon />
        </div>
        <div className="text-[11px] font-bold text-white/95 leading-none">
          Partly Cloudy
        </div>
        <div className="text-[9.5px] text-white/60 font-medium tracking-tight mt-1 leading-none">
          H:56° L:50°
        </div>
      </div>
    </div>
  );
}
