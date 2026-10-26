import React from "react";
import { GlassSurface } from "../ui/glass-surface";

function BatteryGlyph({ level, label }) {
  const width = Math.max(0, Math.min(100, level)) * 0.18;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg viewBox="0 0 42 30" className="h-7 w-9 text-white/85" fill="none" aria-label={`${label} battery`}>
        <rect x="2" y="5" width="34" height="20" rx="5" stroke="currentColor" strokeWidth="2" />
        <path d="M39 11v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <rect x="6" y="9" width={width} height="12" rx="2.5" fill="currentColor" />
      </svg>
      <span className="text-[11px] font-semibold leading-none text-white/80">{level}%</span>
    </div>
  );
}

export default function GlassBatteryWidget() {
  return (
    <div className="relative flex h-40 w-80 items-center justify-around overflow-hidden rounded-3xl p-3 text-white select-none">
      <GlassSurface tint={0.1} tintColor="66,134,173" radius={24} blur={20} chroma={0.28} className="absolute inset-0 -z-10" />
      <BatteryGlyph level={62} label="MacBook" />
      <BatteryGlyph level={100} label="AirPods" />
      <BatteryGlyph level={88} label="Battery" />
      <div className="flex h-[70px] w-[70px] items-center justify-center rounded-full border-[7px] border-white/10">
        <span className="text-xl text-white/20">+</span>
      </div>
    </div>
  );
}
