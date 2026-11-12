import React, { useState } from "react";
import { motion } from "framer-motion";

export default function SetupScreen({ goNext, onSkip }) {
  const languages = [
    "English",
    "Español (EE. UU.)",
    "Español (Latinoamérica)",
    "Español",
    "English (Australia)",
    "English (Canada)",
    "English (India)",
    "English (Philippines)",
    "English (UK)",
    "Français",
    "Deutsch",
    "简体中文",
    "繁體中文",
    "繁體中文 (香港)",
    "日本語",
    "Italiano",
    "Nederlands",
    "Português (Brasil)",
    "Português (Portugal)",
    "Русский",
    "한국어"
  ];
  
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setTimeout(() => {
      goNext(selectedLanguage);
    }, 450);
  };

  return (
    <div 
      className="w-screen h-screen flex flex-col items-center justify-center relative overflow-hidden bg-cover bg-center select-none font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Text','SF_Pro_Display','Segoe_UI',Helvetica,Arial,sans-serif]"
      style={{ backgroundImage: "url('/icons/hello.png')" }}
    >
      {/* Background Blur Overlay */}
      <div className="absolute inset-0 backdrop-blur-[60px] bg-black/10 z-0" />

      {/* Main Container for Card + Subtitle line */}
      <div className="flex flex-col items-center z-10">
        {/* Main Card */}
        <motion.div 
          key="setup-screen"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-[780px] h-[590px] bg-[#fbfbfd]/95 backdrop-blur-3xl rounded-[28px] shadow-[0_24px_70px_rgba(0,0,0,0.28)] border border-white/60 flex flex-col items-center pt-10 pb-8 px-10 relative overflow-hidden"
        >
          {/* Skip Button */}
          {onSkip && (
            <button
              onClick={onSkip}
              className="absolute top-6 right-6 px-3.5 py-1 rounded-full text-[13px] font-medium text-[#007AFF] hover:bg-black/5 active:bg-black/10 transition-colors flex items-center gap-1 cursor-pointer select-none"
              title="Skip setup"
            >
              <span>Skip</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 4 15 12 5 20 5 4"></polygon>
                <line x1="19" y1="5" x2="19" y2="19"></line>
              </svg>
            </button>
          )}

          {/* Globe Icon */}
          <div className="mb-3">
            <svg
              width="80"
              height="80"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#007AFF]"
            >
              {/* Globe rim */}
              <circle
                cx="50"
                cy="50"
                r="44"
                stroke="currentColor"
                strokeWidth="5.5"
                fill="none"
              />

              {/* Equator */}
              <line
                x1="6"
                y1="50"
                x2="94"
                y2="50"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
              />

              {/* North parallel */}
              <path
                d="M 17.5 28 Q 50 38 82.5 28"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />

              {/* South parallel */}
              <path
                d="M 17.5 72 Q 50 62 82.5 72"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Prime meridian */}
              <line
                x1="50"
                y1="6"
                x2="50"
                y2="94"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
              />

              {/* Meridians (ellipses) */}
              <ellipse
                cx="50"
                cy="50"
                rx="22"
                ry="44"
                stroke="currentColor"
                strokeWidth="5"
                fill="none"
              />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-[26px] font-semibold text-[#1d1d1f] mb-4 tracking-[-0.015em]">
            Language
          </h2>

          {/* Language List Box without scrollbar */}
          <div className="w-[330px] h-[310px] bg-white rounded-none border border-[#d2d2d7]/70 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-0">
            {languages.map((lang, idx) => {
              const isSelected = selectedLanguage === lang;
              return (
                <div 
                  key={idx}
                  onClick={() => {
                    if (!isSubmitting) setSelectedLanguage(lang);
                  }}
                  className={`px-3 py-1 text-[13px] leading-5 text-center transition-colors select-none rounded-none ${
                    isSubmitting ? "cursor-default" : "cursor-pointer"
                  } ${
                    isSelected 
                      ? isSubmitting
                        ? "bg-[#8E8E93] text-white font-medium"
                        : "bg-[#007AFF] text-white font-medium" 
                      : isSubmitting
                        ? "text-[#8e8e93]"
                        : "text-[#1d1d1f] hover:bg-[#f5f5f7]"
                  }`}
                >
                  {lang}
                </div>
              );
            })}
          </div>

          {/* Next / Arrow Button */}
          <button 
            onClick={handleNext}
            disabled={isSubmitting}
            className={`absolute bottom-6 right-6 p-2 text-gray-500 hover:text-gray-900 active:scale-95 transition-all flex items-center justify-center ${
              isSubmitting ? "opacity-50 cursor-default" : "cursor-pointer"
            }`}
            aria-label="Next"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="12" x2="20" y2="12"></line>
              <polyline points="13 5 20 12 13 19"></polyline>
            </svg>
          </button>
        </motion.div>

        {/* Text just below the card: a little bold (medium / 500) */}
        <div className="mt-3.5 text-center px-4 max-w-[820px]">
          <p className="text-white font-medium text-[12.5px] leading-relaxed opacity-95 tracking-normal">
            By using this software, you agree to the terms of the software license agreement for the software. You can view the<br/>terms of the software license agreement at https://www.apple.com/legal/sla/
          </p>
        </div>
      </div>
    </div>
  );
}
