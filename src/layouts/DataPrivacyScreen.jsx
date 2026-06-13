import React from 'react';
import { motion } from 'framer-motion';

export default function DataPrivacyScreen({ goNext, goBack }) {
  const savedLang = localStorage.getItem('setup_lang') || 'English';
  const selectedCountry = localStorage.getItem('setup_country') || 'United Kingdom';

  const topBarLang = savedLang.includes('French') ? 'ABC - AZERTY' :
    selectedCountry === 'United States' ? 'U.S.' :
      selectedCountry === 'India' ? 'ABC - India' : 'British';

  return (
    <div
      className="w-screen h-screen flex flex-col items-center justify-center relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/Wallpaper/GoldenGate_6k.png')" }}
    >
      {/* Background Blur Overlay */}
      <div className="absolute inset-0 backdrop-blur-[60px] bg-black/5 z-0" />

      {/* Top Right Keyboard layout indicator */}
      <div className="absolute top-5 right-6 flex items-center gap-2 text-white text-[13px] font-medium z-10 drop-shadow-md">
        {topBarLang}
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
        key="dataprivacy-screen"
        initial={{ opacity: 0, scale: 0.95, x: 20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.95, x: -20 }}
        transition={{ duration: 0.4 }}
        className="w-[700px] h-[520px] bg-white rounded-2xl shadow-2xl z-10 flex flex-col px-[100px] pt-8 pb-10 relative overflow-hidden"
      >
        {/* Back Button */}
        <button
          onClick={goBack}
          className="absolute top-6 left-6 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors bg-white text-[#0066cc] shadow-sm z-20"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <div className="flex-1 flex flex-col items-start w-full mt-1">
          {/* Data & Privacy Icon */}
          <div className="flex justify-start mb-4 ml-[150px]">
            <svg width="88" height="88" viewBox="0 0 64 64" fill="none">
              <circle cx="26" cy="20" r="7.5" fill="#0066cc" />
              <circle cx="42" cy="20" r="7.5" fill="#8bb4f0" />
              {/* Left Person Body */}
              <path d="M26 31C16.5 31 13 38 13 45V50C13 51.1 13.9 52 15 52H29L38 41L26 31Z" fill="#0066cc" />
              {/* Right Person Body */}
              <path d="M42 31C51.5 31 55 38 55 45V50C55 51.1 54.1 52 53 52H33L22 41L42 31Z" fill="#8bb4f0" />
              {/* Handshake overlap */}
              <path d="M25 45.5L31 38.5L34 40.5L38 45.5C36 48 31 52 31 52H23L25 45.5Z" fill="#0052a3" />
            </svg>
          </div>

          <div className="w-full text-left mt-1">
            <h2 className="text-[21px] font-bold text-gray-900 mb-2">Data & Privacy</h2>

            <p className="text-[15px] text-gray-500 leading-relaxed mb-3.5">
              This icon appears when an Apple feature asks to use your personal information.
            </p>

            <p className="text-[15px] text-gray-500 leading-relaxed mb-3.5">
              You won't see this with every feature since Apple collects this information only when needed to enable features, secure our services or personalise your experience.
            </p>

            <p className="text-[15px] text-gray-500 leading-relaxed mb-4">
              Apple believes privacy is a fundamental human right, so every Apple product is designed to minimise the collection and use of your data, use on-device processing whenever possible, and provide transparency and control over your information.
            </p>

            <div className="flex items-center text-[#0066cc] cursor-pointer hover:underline text-[14px] font-medium">
              <svg className="mr-1.5" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM12 9C11.45 9 11 8.55 11 8C11 7.45 11.45 7 12 7C12.55 7 13 7.45 13 8C13 8.55 12.55 9 12 9Z"></path>
              </svg>
              Learn More...
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="absolute bottom-8 right-8">
          <button
            onClick={goNext}
            className="px-6 py-1.5 rounded-full bg-[#f5f5f7] hover:bg-gray-200 text-gray-800 text-[13px] font-medium transition-colors border border-black/5 shadow-sm"
          >
            Continue
          </button>
        </div>
      </motion.div>
    </div>
  );
}
