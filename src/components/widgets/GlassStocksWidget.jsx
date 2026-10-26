import React from "react";
import { GlassSurface } from "../ui/glass-surface";

export default function GlassStocksWidget() {
  return (
    <div className="relative h-40 w-40 overflow-hidden rounded-3xl p-3.5 text-white select-none">
      <GlassSurface tint={0.1} tintColor="47,98,133" radius={24} blur={18} chroma={0.25} className="absolute inset-0 -z-10" />
      <div className="relative z-10 flex items-center justify-between text-[13px] font-semibold leading-none">
        <span className="flex items-center gap-1 text-white/85"><span className="text-[11px]">▼</span> SPCX</span>
        <span className="text-white/75">145.47</span>
      </div>
      <svg className="relative z-10 mt-1.5 h-[43px] w-full" viewBox="0 0 170 54" fill="none" aria-label="SPCX price chart">
        <path d="M0 10h170M0 27h170M0 44h170" stroke="rgba(255,255,255,.16)" strokeDasharray="2 3" />
        <path d="M0 18L9 23L17 20L25 31L34 26L43 30L52 22L61 29L70 27L79 33L88 29L97 31L106 36L115 33L124 37L133 34L142 41L151 38L160 45L170 42" stroke="rgba(255,255,255,.82)" strokeWidth="2" />
      </svg>
      <div className="relative z-10 mt-1 text-[11px] leading-[1.18] text-white/80">
        MT Newswire
        <br />Google, Meta,
        <br />OpenAI, Anthropic
        <br />Set to Testify at...
      </div>
    </div>
  );
}
