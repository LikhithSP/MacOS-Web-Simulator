import React from 'react';
import { 
  FiWifi, 
  FiBluetooth, 
  FiMoon, 
  FiSun
} from 'react-icons/fi';
import { BsFillPlayFill, BsFillSkipForwardFill, BsFillSkipBackwardFill, BsFillPauseFill } from 'react-icons/bs';
import { useAppStore } from '../store/Appstore';

export default function ControlCenter() {
  const isAudioPlaying = useAppStore((state) => state.isAudioPlaying);
  const toggleAudio = useAppStore((state) => state.toggleAudio);
  return (
    <div className="w-[330px] flex flex-col gap-3 text-white bg-black/15 backdrop-blur-[40px] border border-white/10 rounded-[32px] p-3.5 shadow-2xl">
      {/* Top Section */}
      <div className="flex gap-3">
        
        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-3">
          {/* Wi-Fi */}
          <div className="bg-white/10 hover:bg-white/20 transition-colors rounded-[24px] p-3 flex items-center gap-3 cursor-pointer shadow-sm border border-white/5 h-[72px]">
            <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center text-[#0066ff] shrink-0 shadow-sm">
              <FiWifi size={20} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col overflow-hidden justify-center">
              <span className="font-semibold text-[14px] leading-tight mb-0.5">Wi-Fi</span>
              <span className="text-[12px] text-white/70 leading-tight truncate">JioFiber 5G</span>
            </div>
          </div>

          {/* BT and AirDrop */}
          <div className="flex gap-3 h-[60px]">
            <div className="bg-white flex-1 rounded-[30px] flex items-center justify-center cursor-pointer shadow-sm">
              <FiBluetooth size={22} className="text-[#0066ff]" strokeWidth={2.5} />
            </div>
            <div className="bg-white flex-1 rounded-[30px] flex items-center justify-center cursor-pointer shadow-sm">
              {/* AirDrop Icon */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0066ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="16" r="2" fill="#0066ff" stroke="none" />
                <path d="M8 11a6 6 0 0 1 8 0" />
                <path d="M4 6a12 12 0 0 1 16 0" />
              </svg>
            </div>
          </div>

          {/* Focus */}
          <div className="bg-white/10 hover:bg-white/20 transition-colors rounded-[24px] p-3 flex items-center gap-3 cursor-pointer shadow-sm border border-white/5 h-[60px]">
            <div className="bg-white/20 w-[34px] h-[34px] rounded-full flex items-center justify-center text-white shrink-0">
              <FiMoon size={18} fill="currentColor" stroke="none" className="opacity-95" />
            </div>
            <span className="font-medium text-[14px]">Focus</span>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 flex flex-col gap-3">
          {/* Music */}
          <div className="bg-white/10 border border-white/5 rounded-[28px] p-4 flex-1 flex flex-col justify-between shadow-sm cursor-pointer hover:bg-white/20 transition-colors relative overflow-hidden h-[144px]">
            <div className="flex items-center gap-3">
              <img src="https://cdn-images.dzcdn.net/images/cover/64e54e307bd5e2bdb27ffeb662fd910d/1900x1900-000000-80-0-0.jpg" alt="Album" className="w-[48px] h-[48px] rounded-[10px] object-cover shadow-md" />
            </div>
            <div className="mt-1">
              <div className="font-medium text-[14px] truncate leading-tight">Wanna Be Yours</div>
              <div className="text-[12px] text-white/70 truncate mt-0.5">Arctic Monkeys</div>
            </div>
            <div className="flex items-center justify-between mt-1 px-1">
              <BsFillSkipBackwardFill size={20} className="cursor-pointer hover:text-white/70 transition-colors" />
              <button onClick={toggleAudio} className="cursor-pointer hover:text-white/70 transition-colors">
                {isAudioPlaying ? (
                  <BsFillPauseFill size={26} />
                ) : (
                  <BsFillPlayFill size={26} />
                )}
              </button>
              <BsFillSkipForwardFill size={20} className="cursor-pointer hover:text-white/70 transition-colors" />
            </div>
          </div>

          {/* Stage Manager and Screen Mirroring */}
          <div className="flex gap-3 h-[60px]">
            <div className="bg-white/10 border border-white/5 flex-1 rounded-[30px] flex items-center justify-center cursor-pointer hover:bg-white/20 shadow-sm transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <rect x="9" y="5" width="11" height="14" rx="2"></rect>
                <path d="M4 7h2"></path>
                <path d="M4 12h2"></path>
                <path d="M4 17h2"></path>
              </svg>
            </div>
            <div className="bg-white/10 border border-white/5 flex-1 rounded-[30px] flex items-center justify-center cursor-pointer hover:bg-white/20 shadow-sm transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <rect x="4" y="4" width="12" height="12" rx="2"></rect>
                <path d="M8 20h12V8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Display Slider */}
      <div className="bg-white/10 border border-white/5 rounded-[24px] p-3 shadow-sm h-[68px] flex flex-col justify-center">
        <span className="font-semibold text-[13px] ml-1 mb-2 block">Display</span>
        <div className="flex items-center gap-3">
          <FiSun size={14} className="text-white/70 shrink-0 ml-1" />
          <div className="h-6 flex-1 bg-white/20 rounded-full relative overflow-hidden shadow-inner">
            <div className="absolute top-0 left-0 bottom-0 w-[65%] bg-white rounded-full border border-black/5"></div>
          </div>
          <FiSun size={18} className="text-white/70 shrink-0 mr-1" />
        </div>
      </div>
    </div>
  );
}