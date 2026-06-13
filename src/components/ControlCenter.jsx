import React, { useState } from 'react';
import { 
  FiWifi, 
  FiBluetooth, 
  FiMoon, 
  FiSun, 
  FiVolume2
} from 'react-icons/fi';
import { BsFillPlayFill, BsFillSkipForwardFill, BsFillSkipBackwardFill, BsFillPauseFill } from 'react-icons/bs';
import { useAppStore } from '../store/Appstore';

export default function ControlCenter() {
  const isAudioPlaying = useAppStore((state) => state.isAudioPlaying);
  const toggleAudio = useAppStore((state) => state.toggleAudio);
  const currentTrack = useAppStore((state) => state.currentTrack);

  // States for toggles
  const [wifiOn, setWifiOn] = useState(true);
  const [bluetoothOn, setBluetoothOn] = useState(true);
  const [airdropOn, setAirdropOn] = useState(true);
  const [focusOn, setFocusOn] = useState(false);
  const [stageManagerOn, setStageManagerOn] = useState(false);
  const [mirroringOn, setMirroringOn] = useState(false);
  
  // States for sliders
  const [brightness, setBrightness] = useState(65);
  const [volume, setVolume] = useState(50);

  // Dark Mode states from Zustand store
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const toggleDarkMode = useAppStore((state) => state.toggleDarkMode);

  const handleSliderClick = (e, setter) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(100, Math.round((x / rect.width) * 100)));
    setter(pct);
  };

  return (
    <div className={`w-[330px] flex flex-col gap-3 text-white backdrop-blur-3xl border rounded-[32px] p-3.5 transition-all duration-300 select-none
      ${isDarkMode 
        ? 'bg-black/60 border-white/10 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.1),0_20px_50px_rgba(0,0,0,0.55)]' 
        : 'bg-gradient-to-b from-white/12 to-white/2 border-white/20 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.4),0_20px_50px_rgba(0,0,0,0.3)]'
      }`}>
      {/* Top Section */}
      <div className="flex gap-3">
        
        {/* Left Column (Wi-Fi, BT/Airdrop, Focus) */}
        <div className="w-1/2 flex flex-col gap-3">
          {/* Wi-Fi Card */}
          <div 
            onClick={() => setWifiOn(prev => !prev)}
            className={`border rounded-[22px] p-2.5 flex items-center gap-2.5 cursor-pointer h-[64px] transition-all duration-300
              ${isDarkMode 
                ? 'bg-black/50 border-white/5 hover:bg-black/60 shadow-[inset_0_0.5px_1px_rgba(255,255,255,0.08)]' 
                : 'bg-white/5 hover:bg-white/10 border-white/10 shadow-[inset_0_0.5px_1px_rgba(255,255,255,0.2)]'
              }`}
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all ${wifiOn ? 'bg-white text-[#0066ff] shadow-sm' : 'bg-white/10 text-white/70'}`}>
              <FiWifi size={16} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-tight overflow-hidden">
              <span className="font-bold text-[12px]">Wi-Fi</span>
              <span className="text-[10px] text-white/50 truncate w-[75px]">{wifiOn ? 'JioFiber 5G' : 'Off'}</span>
            </div>
          </div>

          {/* Quick Toggles Row (Bluetooth & AirDrop) */}
          <div className="flex gap-3">
            {/* Bluetooth */}
            <div 
              onClick={() => setBluetoothOn(prev => !prev)}
              className={`w-[48px] h-[48px] rounded-full flex items-center justify-center cursor-pointer transition-all duration-300
                ${bluetoothOn 
                  ? 'bg-white text-[#0066ff] shadow-sm' 
                  : (isDarkMode ? 'bg-black/40 border border-white/5 hover:bg-black/55 text-white/70' : 'bg-white/10 border border-white/10 hover:bg-white/15 text-white/80')
                }`}
            >
              <FiBluetooth size={18} strokeWidth={2.5} />
            </div>

            {/* AirDrop */}
            <div 
              onClick={() => setAirdropOn(prev => !prev)}
              className={`w-[48px] h-[48px] rounded-full flex items-center justify-center cursor-pointer transition-all duration-300
                ${airdropOn 
                  ? 'bg-white text-[#0066ff] shadow-sm' 
                  : (isDarkMode ? 'bg-black/40 border border-white/5 hover:bg-black/55 text-white/70' : 'bg-white/10 border border-white/10 hover:bg-white/15 text-white/80')
                }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="16" r="2" fill="currentColor" stroke="none" className={airdropOn ? 'text-[#0066ff]' : 'text-white/70'} />
                <path d="M8 11a6 6 0 0 1 8 0" />
                <path d="M4 6a12 12 0 0 1 16 0" />
              </svg>
            </div>
          </div>

          {/* Focus Card */}
          <div 
            onClick={() => setFocusOn(prev => !prev)}
            className={`border rounded-[22px] p-2.5 flex items-center gap-2.5 cursor-pointer h-[44px] transition-all duration-300
              ${isDarkMode 
                ? `${focusOn ? 'bg-white/20 border-white/15' : 'bg-black/50 border-white/5 hover:bg-black/60 shadow-[inset_0_0.5px_1px_rgba(255,255,255,0.08)]'}`
                : `${focusOn ? 'bg-white/20 border-white/15' : 'bg-white/5 border-white/10 hover:bg-white/10 shadow-[inset_0_0.5px_1px_rgba(255,255,255,0.2)]'}`
              }`}
          >
            <div className={`w-[26px] h-[26px] rounded-full flex items-center justify-center shrink-0 transition-colors ${focusOn ? 'bg-[#ff9f0a] text-white' : 'bg-white/10 text-white/80'}`}>
              <FiMoon size={13} fill="currentColor" stroke="none" />
            </div>
            <span className="font-bold text-[12px]">{focusOn ? 'Do Not Disturb' : 'Focus'}</span>
          </div>
        </div>

        {/* Right Column (Media Player & Toggles) */}
        <div className="w-1/2 flex flex-col gap-3">
          {/* Media Player Card */}
          <div className={`border rounded-[24px] p-3 flex flex-col justify-between h-[124px] transition-all duration-300
            ${isDarkMode ? 'bg-black/50 border-white/5 shadow-[inset_0_0.5px_1px_rgba(255,255,255,0.08)]' : 'bg-white/5 border-white/10 shadow-[inset_0_0.5px_1px_rgba(255,255,255,0.25)]'}`}>
            <div className="flex gap-3 items-center min-w-0">
              <img 
                src={currentTrack.img} 
                alt="Album" 
                className="w-[52px] h-[52px] rounded-[11px] object-cover shadow-md border border-white/10 shrink-0" 
              />
              <div className="flex flex-col justify-center leading-tight flex-1 min-w-0">
                <span className="font-bold text-[12px] text-white/95 truncate" title={currentTrack.title}>{currentTrack.title}</span>
                <span className="text-[10.5px] text-white/50 mt-0.5 truncate">{currentTrack.artist}</span>
              </div>
            </div>
            {/* Playback Controls */}
            <div className="flex items-center justify-around mt-1">
              <BsFillSkipBackwardFill size={14} className="text-white/80 hover:text-white cursor-pointer transition-colors" />
              <button 
                onClick={toggleAudio} 
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white cursor-pointer transition-all shadow-sm"
              >
                {isAudioPlaying ? (
                  <BsFillPauseFill size={16} />
                ) : (
                  <BsFillPlayFill size={16} className="ml-0.5" />
                )}
              </button>
              <BsFillSkipForwardFill size={14} className="text-white/80 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Manager & Mirroring Row */}
          <div className="flex gap-3 h-[44px]">
            {/* Stage Manager */}
            <div 
              onClick={() => setStageManagerOn(prev => !prev)}
              className={`w-[48px] h-[48px] rounded-full flex items-center justify-center cursor-pointer transition-all duration-300
                ${stageManagerOn 
                  ? 'bg-white/20 border-white/15 text-white' 
                  : (isDarkMode ? 'bg-black/40 border border-white/5 hover:bg-black/55 text-white/80' : 'bg-white/10 border border-white/10 hover:bg-white/15 text-white/85')
                }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="5" width="11" height="14" rx="2"></rect>
                <path d="M4 7h2"></path>
                <path d="M4 12h2"></path>
                <path d="M4 17h2"></path>
              </svg>
            </div>
            {/* Screen Mirroring */}
            <div 
              onClick={() => setMirroringOn(prev => !prev)}
              className={`w-[48px] h-[48px] rounded-full flex items-center justify-center cursor-pointer transition-all duration-300
                ${mirroringOn 
                  ? 'bg-white/20 border-white/15 text-white' 
                  : (isDarkMode ? 'bg-black/40 border border-white/5 hover:bg-black/55 text-white/80' : 'bg-white/10 border border-white/10 hover:bg-white/15 text-white/85')
                }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="4" width="12" height="12" rx="2"></rect>
                <path d="M8 20h12V8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Display Slider Card */}
      <div className={`border rounded-[22px] p-3 flex flex-col gap-2 h-[68px] justify-center transition-all duration-300
        ${isDarkMode ? 'bg-black/50 border-white/5 shadow-[inset_0_0.5px_1px_rgba(255,255,255,0.08)]' : 'bg-white/5 border-white/10 shadow-[inset_0_0.5px_1px_rgba(255,255,255,0.25)]'}`}>
        <span className="font-bold text-[12px] ml-1">Display</span>
        <div className="flex items-center gap-3">
          <FiSun size={13} className="text-white/60 shrink-0 ml-0.5" />
          {/* Slider track */}
          <div 
            onClick={(e) => handleSliderClick(e, setBrightness)}
            className="h-6 flex-1 bg-white/15 rounded-full relative overflow-hidden cursor-pointer border border-white/5"
          >
            <div 
              className="absolute top-0 left-0 bottom-0 bg-white/95 rounded-full transition-all duration-150"
              style={{ width: `${brightness}%` }}
            />
          </div>
          <FiSun size={16} className="text-white/70 shrink-0 mr-0.5" />
        </div>
      </div>

      {/* Sound Slider Card */}
      <div className={`border rounded-[22px] p-3 flex flex-col gap-2 h-[68px] justify-center transition-all duration-300
        ${isDarkMode ? 'bg-black/50 border-white/5 shadow-[inset_0_0.5px_1px_rgba(255,255,255,0.08)]' : 'bg-white/5 border-white/10 shadow-[inset_0_0.5px_1px_rgba(255,255,255,0.25)]'}`}>
        <span className="font-bold text-[12px] ml-1">Sound</span>
        <div className="flex items-center gap-3">
          <FiVolume2 size={15} className="text-white/60 shrink-0 ml-0.5" />
          {/* Slider track */}
          <div 
            onClick={(e) => handleSliderClick(e, setVolume)}
            className="h-6 flex-1 bg-white/15 rounded-full relative overflow-hidden cursor-pointer border border-white/5"
          >
            <div 
              className="absolute top-0 left-0 bottom-0 bg-white/95 rounded-full transition-all duration-150"
              style={{ width: `${volume}%` }}
            />
          </div>
          {/* Airplay/Sound Output Button */}
          <div className="w-6.5 h-6.5 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-white hover:bg-white/20 cursor-pointer shadow-sm border border-white/5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom Circle Action Controls */}
      <div className="flex justify-between items-center px-1 mt-0.5">
        {/* Contrast / Dark Mode toggle */}
        <div 
          onClick={toggleDarkMode}
          className={`w-11 h-11 rounded-full border flex items-center justify-center cursor-pointer transition-all shadow-[inset_0_0.5px_1.5px_rgba(255,255,255,0.25)] 
            ${isDarkMode 
              ? 'bg-white text-gray-900 border-white shadow-md scale-105' 
              : 'bg-white/5 hover:bg-white/10 border-white/15'}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="M12 18a6 6 0 1 0 0-12v12z" fill="currentColor" />
          </svg>
        </div>

        {/* Calculator */}
        <div className={`w-11 h-11 rounded-full border flex items-center justify-center cursor-pointer transition-all shadow-[inset_0_0.5px_1.5px_rgba(255,255,255,0.25)]
          ${isDarkMode ? 'bg-black/40 border-white/5 hover:bg-black/55' : 'bg-white/5 hover:bg-white/10 border-white/15'}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
            <line x1="8" y1="6" x2="16" y2="6" />
            <line x1="16" y1="14" x2="16" y2="18" />
            <path d="M16 10h.01" />
            <path d="M12 10h.01" />
            <path d="M8 10h.01" />
            <path d="M12 14h.01" />
            <path d="M8 14h.01" />
            <path d="M12 18h.01" />
            <path d="M8 18h.01" />
          </svg>
        </div>

        {/* Timer */}
        <div className={`w-11 h-11 rounded-full border flex items-center justify-center cursor-pointer transition-all shadow-[inset_0_0.5px_1.5px_rgba(255,255,255,0.25)]
          ${isDarkMode ? 'bg-black/40 border-white/5 hover:bg-black/55' : 'bg-white/5 hover:bg-white/10 border-white/15'}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>

        {/* Screenshot */}
        <div className={`w-11 h-11 rounded-full border flex items-center justify-center cursor-pointer transition-all shadow-[inset_0_0.5px_1.5px_rgba(255,255,255,0.25)]
          ${isDarkMode ? 'bg-black/40 border-white/5 hover:bg-black/55' : 'bg-white/5 hover:bg-white/10 border-white/15'}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        </div>
      </div>

      {/* Edit Controls Button */}
      <div className="flex justify-center mt-1 pb-0.5">
        <button className={`px-4 py-1.5 border rounded-full text-[11px] font-bold shadow-sm transition-colors
          ${isDarkMode ? 'bg-black/40 border-white/5 hover:bg-black/55 text-white/90' : 'bg-white/10 border-white/15 hover:bg-white/20 text-white/95'}`}>
          Edit Controls
        </button>
      </div>
    </div>
  );
}