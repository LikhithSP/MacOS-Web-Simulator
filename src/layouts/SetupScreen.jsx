import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SetupScreen({ goNext }) {
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
      style={{ backgroundImage: "url('/Wallpaper/GtB-Ex7WYAA9yAD.jpeg')" }}
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
        className="w-[700px] h-[520px] bg-white rounded-3xl shadow-2xl z-10 flex flex-col items-center py-12 relative overflow-hidden"
      >
        {/* Globe Icon */}
        <div className="text-[#0066cc] mb-4">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">Language</h2>

        {/* List */}
        <div className="w-[300px] h-[240px] overflow-y-auto bg-white/50 scrollbar-thin" style={{ border: "1px solid rgba(0,0,0,0.1)", borderRadius: "4px", scrollbarWidth: "thin", scrollbarColor: "rgba(0,0,0,0.3) transparent" }}>
          {languages.map((lang, idx) => (
            <div 
              key={idx}
              onClick={() => setSelectedLanguage(lang)}
              className={`px-4 py-1.5 cursor-pointer text-[13px] transition-colors text-center ${
                selectedLanguage === lang 
                  ? "bg-[#0058d0] text-white" 
                  : "text-gray-900 hover:bg-gray-100"
              }`}
            >
              {lang}
            </div>
          ))}
        </div>

        {/* Next Button */}
        <button 
          onClick={() => goNext(selectedLanguage)}
          className="absolute bottom-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </motion.div>

      {/* Footer Text */}
      <div className="absolute bottom-8 left-0 right-0 text-center z-10 px-8">
        <p className="text-white font-medium text-[11px] max-w-3xl mx-auto leading-relaxed shadow-sm drop-shadow-md">
          By using this software, you agree to the terms of the software licence agreement for the software. You can view the<br/>terms of the software licence agreement at https://www.apple.com/uk/legal/sla/
        </p>
      </div>
    </div>
  );
}
