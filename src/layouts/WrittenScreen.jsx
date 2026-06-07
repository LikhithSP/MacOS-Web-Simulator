import React from "react";
import { motion } from "framer-motion";

export default function WrittenScreen({ goNext, goBack, selectedLanguage, selectedCountry }) {
  
  // Basic mapping logic for dictation based on selected country/language
  let dictationLocale = selectedLanguage;
  if (selectedCountry === "United Kingdom") dictationLocale = "English (United Kingdom)";
  else if (selectedCountry === "United States") dictationLocale = "English (United States)";
  else if (selectedLanguage === "English (UK)") dictationLocale = "English (United Kingdom)";
  
  let inputSource = "British";
  if (selectedCountry === "United States" || selectedLanguage === "English") inputSource = "U.S.";

  return (
    <div 
      className="w-screen h-screen flex flex-col items-center justify-center relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/Wallpaper/GtB-Ex7WYAA9yAD.jpeg')" }}
    >
      {/* Background Blur Overlay */}
      <div className="absolute inset-0 backdrop-blur-[60px] bg-black/5 z-0" />

      {/* Top Right Keyboard layout indicator */}
      <div className="absolute top-5 right-6 flex items-center gap-2 text-white text-xs font-medium z-10 drop-shadow-md">
        {inputSource}
        <svg width="22" height="14" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="1" y="1" width="22" height="14" rx="2"></rect>
          <line x1="6" y1="4" x2="6" y2="4.01"></line>
          <line x1="10" y1="4" x2="10" y2="4.01"></line>
          <line x1="14" y1="4" x2="14" y2="4.01"></line>
          <line x1="18" y1="4" x2="18" y2="4.01"></line>
          <line x1="8" y1="11" x2="16" y2="11"></line>
        </svg>
      </div>

      {/* Main Card */}
      <motion.div 
        key="written-screen"
        initial={{ opacity: 0, scale: 0.95, x: 20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.95, x: -20 }}
        transition={{ duration: 0.4 }}
        className="w-[700px] h-[520px] bg-white rounded-3xl shadow-2xl z-10 flex flex-col py-12 px-[100px] relative overflow-hidden"
      >
        {/* Back Button */}
        <button 
          onClick={goBack}
          className="absolute top-6 left-6 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors bg-gray-50 text-[#0066cc]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        {/* Header Icon */}
        <div className="flex justify-center text-[#0066cc] mb-6">
          <svg width="68" height="68" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        </div>

        {/* Title & Description */}
        <h2 className="text-xl font-bold text-gray-900 mb-2 tracking-tight text-center">Written and Spoken Languages</h2>
        <p className="text-[13px] text-gray-600 text-center leading-relaxed mb-8 max-w-[420px] mx-auto">
          The following languages are commonly used in your region. You can set up your Mac to use these settings or customise them individually.
        </p>

        {/* Settings List */}
        <div className="flex flex-col gap-6 ml-6">
          {/* Preferred Languages */}
          <div className="flex items-start gap-4">
            <div className="text-[#0066cc] mt-[2px]">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            </div>
            <div>
              <div className="text-[13px] font-bold text-gray-900 leading-tight">Preferred Languages</div>
              <div className="text-[13px] text-gray-500">{selectedLanguage}</div>
            </div>
          </div>

          {/* Input Sources */}
          <div className="flex items-start gap-4">
            <div className="text-[#0066cc] mt-[2px]">
              <svg width="28" height="20" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="1" y="1" width="22" height="14" rx="3"></rect>
                <line x1="6" y1="5" x2="6" y2="5.01"></line>
                <line x1="10" y1="5" x2="10" y2="5.01"></line>
                <line x1="14" y1="5" x2="14" y2="5.01"></line>
                <line x1="18" y1="5" x2="18" y2="5.01"></line>
                <line x1="8" y1="11" x2="16" y2="11"></line>
              </svg>
            </div>
            <div>
              <div className="text-[13px] font-bold text-gray-900 leading-tight">Input Sources</div>
              <div className="text-[13px] text-gray-500">{inputSource}</div>
            </div>
          </div>

          {/* Dictation */}
          <div className="flex items-start gap-4">
            <div className="text-[#0066cc] mt-[2px]">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="22"></line>
              </svg>
            </div>
            <div>
              <div className="text-[13px] font-bold text-gray-900 leading-tight">Dictation</div>
              <div className="text-[13px] text-gray-500">{dictationLocale}</div>
            </div>
          </div>
        </div>

        {/* Bottom Buttons Container */}
        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
          <button 
            className="px-4 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-[13px] font-medium transition-colors"
          >
            Customise Settings
          </button>
          
          <button 
            onClick={goNext}
            className="px-5 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-[13px] font-medium transition-colors"
          >
            Continue
          </button>
        </div>
      </motion.div>
    </div>
  );
}