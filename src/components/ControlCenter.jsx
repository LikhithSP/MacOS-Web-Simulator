import React, { useState } from 'react';
import {
  FiWifi, 
  FiBluetooth, 
  FiMoon, 
  FiSun, 
  FiVolume,
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

  // Glass effect class helper
  const glassPanelClass = `backdrop-blur-2xl border transition-all duration-300 ${
    isDarkMode 
      ? 'bg-gradient-to-b from-black/40 to-black/15 border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)]' 
      : 'bg-gradient-to-b from-white/12 to-white/4 border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_rgba(0,0,0,0.2)]'
  }`;
  
  const glassCircleClass = `w-[68px] h-[68px] rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 backdrop-blur-2xl border ${
    isDarkMode 
      ? 'bg-gradient-to-b from-black/40 to-black/15 border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)]' 
      : 'bg-gradient-to-b from-white/12 to-white/4 border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_32px_rgba(0,0,0,0.2)]'
  }`;

  return (
    <div className="w-[330px] flex flex-col gap-3 text-white p-1 select-none transition-all duration-300">
      {/* Top Section */}
      <div className="flex gap-3">
        
        {/* Left Column (Wi-Fi, BT/Airdrop, Focus) */}
        <div className="w-1/2 flex flex-col gap-3">
          {/* Wi-Fi Card */}
          <div 
            onClick={() => setWifiOn(prev => !prev)}
            className={`${glassPanelClass} rounded-[36px] p-2.5 flex items-center gap-3 cursor-pointer h-[68px] hover:bg-white/[0.12]`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
              wifiOn 
                ? 'bg-white text-[#0a84ff] shadow-[0_2px_10px_rgba(10,132,255,0.3)]' 
                : 'bg-white/10 text-white/70'
            }`}>
              <FiWifi size={18} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-tight overflow-hidden">
              <span className="font-bold text-[12px] tracking-wide">Wi-Fi</span>
              <span className="text-[10px] text-white/50 truncate w-[75px]">{wifiOn ? 'Home' : 'Off'}</span>
            </div>
          </div>

          {/* Quick Toggles Row (Bluetooth & AirDrop) */}
          <div className="flex justify-between px-0.5">
            {/* Bluetooth */}
            <div 
              onClick={() => setBluetoothOn(prev => !prev)}
              className={bluetoothOn 
                ? `w-[68px] h-[68px] rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 bg-white text-[#0a84ff] shadow-[0_2px_10px_rgba(10,132,255,0.3)]`
                : `${glassCircleClass} hover:bg-white/[0.12] text-white/80`
              }
            >
              <FiBluetooth size={24} strokeWidth={2.5} />
            </div>

            {/* AirDrop */}
            <div 
              onClick={() => setAirdropOn(prev => !prev)}
              className={airdropOn 
                ? `w-[68px] h-[68px] rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 bg-white text-[#0a84ff] shadow-[0_2px_10px_rgba(10,132,255,0.3)]`
                : `${glassCircleClass} hover:bg-white/[0.12] text-white/80`
              }
            >
              <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" className={airdropOn ? 'text-[#0a84ff]' : 'text-white'} />
                <path d="M 9.1 15.4 A 4.5 4.5 0 1 1 14.9 15.4" />
                <path d="M 7.2 17.7 A 7.5 7.5 0 1 1 16.8 17.7" />
                <path d="M 5.2 20.0 A 10.5 10.5 0 1 1 18.8 20.0" />
              </svg>
            </div>
          </div>

          {/* Focus Card */}
          <div 
            onClick={() => setFocusOn(prev => !prev)}
            className={`${glassPanelClass} rounded-[36px] p-2.5 flex items-center gap-3 cursor-pointer h-[68px] hover:bg-white/[0.12]`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${
              focusOn 
                ? 'bg-white text-[#ff9f0a] shadow-[0_2px_10px_rgba(255,159,10,0.3)]' 
                : 'bg-white/10 text-white/80'
            }`}>
              <FiMoon size={18} fill="currentColor" stroke="none" />
            </div>
            <div className="flex flex-col leading-tight overflow-hidden">
              <span className="font-bold text-[12px] tracking-wide">Focus</span>
              <span className="text-[10px] text-white/50 truncate w-[75px]">{focusOn ? 'On' : 'Off'}</span>
            </div>
          </div>
        </div>

        {/* Right Column (Media Player & Toggles) */}
        <div className="w-1/2 flex flex-col gap-3">
          {/* Media Player Card */}
          <div className={`${glassPanelClass} rounded-[28px] p-3 flex flex-col justify-between h-[148px] hover:bg-white/[0.12]`}>
            <div className="flex flex-col gap-1 items-start min-w-0 w-full">
              <img 
                src={currentTrack.img} 
                alt="Album" 
                className="w-[42px] h-[42px] rounded-[12px] object-cover shadow-md border border-white/10 shrink-0" 
              />
              <div className="flex flex-col leading-tight min-w-0 w-full mt-1">
                <span className="font-semibold text-[11.5px] text-white/95 truncate tracking-wide block w-full" title={currentTrack.title}>{currentTrack.title}</span>
                <span className="text-[9.5px] text-white/50 truncate tracking-normal mt-0.5 block w-full">{currentTrack.artist}</span>
              </div>
            </div>
            {/* Playback Controls */}
            <div className="flex items-center justify-between w-full px-1.5 mb-0.5">
              <BsFillSkipBackwardFill size={20} className="text-white/85 hover:text-white cursor-pointer transition-colors" />
              <button 
                onClick={toggleAudio} 
                className="text-white hover:scale-110 active:scale-95 cursor-pointer transition-all flex items-center justify-center"
              >
                {isAudioPlaying ? (
                  <BsFillPauseFill size={32} />
                ) : (
                  <BsFillPlayFill size={32} />
                )}
              </button>
              <BsFillSkipForwardFill size={20} className="text-white/85 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Manager & Mirroring Row */}
          <div className="flex justify-between px-0.5">
            {/* Stage Manager */}
            <div 
              onClick={() => setStageManagerOn(prev => !prev)}
              className={stageManagerOn 
                ? `w-[68px] h-[68px] rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 bg-white/20 border border-white/25 text-white shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)]`
                : `${glassCircleClass} hover:bg-white/[0.12] text-white/80`
              }
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="5" width="11" height="14" rx="2"></rect>
                <path d="M4 7h2"></path>
                <path d="M4 12h2"></path>
                <path d="M4 17h2"></path>
              </svg>
            </div>
            {/* Screen Mirroring */}
            <div 
              onClick={() => setMirroringOn(prev => !prev)}
              className={mirroringOn 
                ? `w-[68px] h-[68px] rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 bg-white/20 border border-white/25 text-white shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)]`
                : `${glassCircleClass} hover:bg-white/[0.12] text-white/80`
              }
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="4" width="12" height="12" rx="2"></rect>
                <path d="M8 20h12V8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Display Slider Card */}
      <div className={`${glassPanelClass} rounded-[28px] p-3 flex flex-col gap-2 h-[72px] justify-center hover:bg-white/[0.10]`}>
        <span className="font-bold text-[12px] ml-1 tracking-wide">Display</span>
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
      <div className={`${glassPanelClass} rounded-[28px] p-3 flex flex-col gap-2 h-[72px] justify-center hover:bg-white/[0.10]`}>
        <span className="font-bold text-[12px] ml-1 tracking-wide">Sound</span>
        <div className="flex items-center gap-3">
          <FiVolume size={15} className="text-white/60 shrink-0 ml-0.5" />
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
          <FiVolume2 size={16} className="text-white/70 shrink-0" />
          {/* Airplay/Sound Output Button */}
          <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-white hover:bg-white/20 cursor-pointer shadow-sm border border-white/10 transition-colors">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" className="text-white" />
              <path d="M 9.1 15.4 A 4.5 4.5 0 1 1 14.9 15.4" />
              <path d="M 7.2 17.7 A 7.5 7.5 0 1 1 16.8 17.7" />
              <path d="M 5.2 20.0 A 10.5 10.5 0 1 1 18.8 20.0" />
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom Circle Action Controls */}
      <div className="flex justify-between items-center px-0.5 mt-0.5">
        {/* Contrast / Dark Mode toggle */}
        <div 
          onClick={toggleDarkMode}
          className={`${glassCircleClass} w-[68px] h-[68px] hover:bg-white/[0.12]`}
        >
          <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="M12 18a6 6 0 1 0 0-12v12z" fill="currentColor" />
          </svg>
        </div>

        {/* Calculator */}
        <div className={`${glassCircleClass} w-[68px] h-[68px] hover:bg-white/[0.12]`}>
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
        <div className={`${glassCircleClass} w-[68px] h-[68px] hover:bg-white/[0.12]`}>
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>

        {/* Screenshot */}
        <div className={`${glassCircleClass} w-[68px] h-[68px] hover:bg-white/[0.12]`}>
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        </div>
      </div>

      {/* Edit Controls Button */}
      <div className="flex justify-center mt-1 pb-0.5">
        <button className={`${glassPanelClass} rounded-full px-5 py-2 text-[11px] font-bold hover:bg-white/[0.15]`}>
          Edit Controls
        </button>
      </div>
    </div>
  );
}