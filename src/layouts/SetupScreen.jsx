import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SetupScreen({ goNext, onSkip }) {
  const languages = [
    "English (UK)",
    "English",
    "Français",
    "Deutsch",
    "Español",
    "English (Australia)",
    "English (India)",
    "简体中文",
    "繁體中文",
    "繁體中文 (香港)",
    "日本語",
    "Español (América Latina)"
  ];
  
  const [selectedLanguage, setSelectedLanguage] = useState("English (UK)");

  return (
    <div 
      className="w-screen h-screen flex flex-col items-center justify-center relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/Wallpaper/GoldenGate_6k.png')" }}
    >
      {/* Background Blur Overlay */}
      <div className="absolute inset-0 backdrop-blur-[60px] bg-black/5 z-0" />

      {/* Main Card */}
      <motion.div 
        key="setup-screen"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4 }}
        className="w-[700px] h-[520px] bg-white rounded-2xl shadow-2xl z-10 flex flex-col items-center py-12 relative overflow-hidden"
      >
        {/* Skip Button */}
        <button 
          onClick={onSkip}
          className="absolute top-6 right-6 px-4 py-1.5 rounded-full hover:bg-gray-100 transition-colors text-[13px] font-medium text-[#0066cc] z-20"
        >
          Skip
        </button>

        {/* Globe Icon */}
        <div className="text-[#007aff] mb-4">
          <svg width="84" height="84" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            <path d="M3.6 9h16.8"></path>
            <path d="M3.6 15h16.8"></path>
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-[22px] font-bold text-gray-900 mb-6 tracking-tight">Language</h2>

        {/* List */}
        <div className="w-[300px] h-[240px] overflow-y-auto pr-1 scrollbar-thin">
          {languages.map((lang, idx) => (
            <div 
              key={idx}
              onClick={() => setSelectedLanguage(lang)}
              className={`px-4 py-1.5 cursor-pointer text-[13px] rounded-md transition-colors text-center font-medium ${
                selectedLanguage === lang 
                  ? "bg-[#007aff] text-white" 
                  : "text-gray-700 hover:bg-gray-100/80"
              }`}
            >
              {lang}
            </div>
          ))}
        </div>

        {/* Next Button */}
        <button 
          onClick={() => goNext(selectedLanguage)}
          className="absolute bottom-8 right-8 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </motion.div>

      {/* Footer Text */}
      <div className="absolute bottom-8 left-0 right-0 text-center z-10 px-8">
        <p className="text-white font-medium text-[11px] max-w-3xl mx-auto leading-relaxed shadow-sm drop-shadow-md opacity-90">
          By using this software, you agree to the terms of the software licence agreement for the software. You can view the<br/>terms of the software licence agreement at https://www.apple.com/uk/legal/sla/
        </p>
      </div>
    </div>
  );
}
