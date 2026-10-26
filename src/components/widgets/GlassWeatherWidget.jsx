import React from "react";
import { GlassSurface } from "../ui/glass-surface";

export default function GlassWeatherWidget() {
  return (
    <div className="relative h-40 w-40 overflow-hidden rounded-3xl p-3.5 text-white select-none">
      <GlassSurface tint={0.1} tintColor="76,154,205" radius={24} blur={18} chroma={0.25} className="absolute inset-0 -z-10" />
      <div className="relative z-10 text-[13px] font-semibold text-white/95">Starbase</div>
      <div className="relative z-10 mt-1 text-[38px] font-light leading-none tracking-tight">32°</div>
      <div className="relative z-10 mt-3.5 text-[20px] leading-none text-white/90">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-label="Sunny">
          <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
          <path d="M12 1.5v3M12 19.5v3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M1.5 12h3M19.5 12h3M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1" strokeLinecap="round" />
        </svg>
      </div>
      <div className="relative z-10 mt-1 text-[13px] font-medium leading-none text-white/90">Mostly Sunny</div>
      <div className="relative z-10 mt-1 text-[11px] leading-none text-white/75">H:32° L:27°</div>
    </div>
  );
}
