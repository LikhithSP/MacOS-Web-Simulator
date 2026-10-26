import React from "react";
import { GlassSurface } from "../ui/glass-surface";

const rings = [
  { value: "62%", progress: 0.62, icon: "laptop" },
  { value: "100%", progress: 1, icon: "airpods" },
  { value: "88%", progress: 0.88, icon: "battery" },
  { value: "", progress: 0, icon: "" },
];

function DeviceIcon({ type }) {
  if (type === "laptop") {
    return <svg viewBox="0 0 32 26" className="h-6 w-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-label="MacBook"><rect x="7" y="2" width="18" height="15" rx="1.5" /><path d="M3 21h26l-2 2H5l-2-2Z" /></svg>;
  }
  if (type === "airpods") {
    return <svg viewBox="0 0 32 28" className="h-6 w-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-label="AirPods"><path d="M11 8.5a4.5 4.5 0 1 0-4.5 4.5V23M21 8.5a4.5 4.5 0 1 1 4.5 4.5V23" /><circle cx="11" cy="8.5" r="1.2" fill="currentColor" /><circle cx="21" cy="8.5" r="1.2" fill="currentColor" /></svg>;
  }
  return <svg viewBox="0 0 32 26" className="h-6 w-7" fill="none" stroke="currentColor" strokeWidth="1.7" aria-label="Battery"><rect x="3" y="5" width="24" height="16" rx="4" /><path d="M29 10v6" strokeLinecap="round" /><rect x="7" y="9" width="16" height="8" rx="2" fill="currentColor" stroke="none" /></svg>;
}

function ActivityRing({ icon, value, progress }) {
  const circumference = 2 * Math.PI * 31;
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1.5">
      <div className="relative h-[70px] w-[70px]">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 72 72" aria-hidden="true">
          <circle cx="36" cy="36" r="31" fill="none" stroke="rgba(255,255,255,.13)" strokeWidth="7" />
          {value && <circle cx="36" cy="36" r="31" fill="none" stroke="rgba(255,255,255,.9)" strokeWidth="7" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - progress)} />}
        </svg>
        {icon && <span className="absolute inset-0 flex items-center justify-center text-white/85"><DeviceIcon type={icon} /></span>}
      </div>
      {value && <span className="text-[16px] font-semibold leading-none text-white/85">{value}</span>}
    </div>
  );
}

export default function GlassActivityWidget() {
  return (
    <div className="relative h-40 w-80 overflow-hidden rounded-3xl p-3 text-white select-none">
      <GlassSurface tint={0.1} tintColor="66,134,173" radius={24} blur={20} chroma={0.28} className="absolute inset-0 -z-10" />
      <div className="relative z-10 flex h-full items-center justify-between gap-1">
        {rings.map((ring, index) => <ActivityRing key={index} {...ring} />)}
      </div>
    </div>
  );
}
