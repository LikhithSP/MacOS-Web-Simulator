import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function TimezoneScreen({ goNext, goBack, selectedCountry }) {
  const [autoTimezone, setAutoTimezone] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update the time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Complete Timezone Map Options
  // Array format ensures we keep exact name matching for dropdown items
  const timezones = [
    // Standard Defaults
    { label: "London - United Kingdom", tz: "Europe/London", text: "British Summer Time" },
    { label: "New York - United States", tz: "America/New_York", text: "Eastern Daylight Time" },
    { label: "New Delhi - India", tz: "Asia/Kolkata", text: "India Standard Time" },
    
    // User requested zones
    { label: "Texas - United States", tz: "America/Chicago", text: "Central Daylight Time" },
    { label: "California - United States", tz: "America/Los_Angeles", text: "Pacific Daylight Time" },
    { label: "Seoul - South Korea", tz: "Asia/Seoul", text: "Korean Standard Time" },
    { label: "Beijing - China", tz: "Asia/Shanghai", text: "China Standard Time" },
    
    // Other major hubs
    { label: "Tokyo - Japan", tz: "Asia/Tokyo", text: "Japan Standard Time" },
    { label: "Paris - France", tz: "Europe/Paris", text: "Central European Time" },
    { label: "Sydney - Australia", tz: "Australia/Sydney", text: "Australian Eastern Time" },
    { label: "Toronto - Australia", tz: "America/Toronto", text: "Eastern Daylight Time" }
  ];

  // Set default city text based on country initialization
  let initialLabel = "London - United Kingdom";
  if (selectedCountry === "United States") initialLabel = "New York - United States";
  else if (selectedCountry === "India") initialLabel = "New Delhi - India";
  else if (selectedCountry === "South Korea") initialLabel = "Seoul - South Korea";
  else if (selectedCountry === "China") initialLabel = "Beijing - China";
  
  const [selectedCity, setSelectedCity] = useState(initialLabel);

  // Derived Values from Selection
  const currentTZData = timezones.find(t => t.label === selectedCity) || { label: selectedCity, tz: Intl.DateTimeFormat().resolvedOptions().timeZone, text: "Local Time" };
  const defaultCity = currentTZData.label;
  const defaultTimezone = currentTZData.text;
  const IanaTZ = currentTZData.tz;

  // Save changes locally over navigation
  const handleNext = () => {
    localStorage.setItem("setup_timezone", IanaTZ);
    goNext();
  };

  // Format date and time according to the selected country's assigned timezone
  let dateString = "Wed 25 Jun";
  try {
    dateString = new Intl.DateTimeFormat('en-US', {
      timeZone: IanaTZ,
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit'
    }).format(currentTime);
  } catch(e) {
    // default error fallback
    dateString = currentTime.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
  }

  // Infer keyboard input layout top-bar display name
  const savedLang = localStorage.getItem("setup_lang") || "English";
  const topBarLang = savedLang.includes("French") ? "ABC - AZERTY" :
                     selectedCountry === "United States" ? "U.S." :
                     selectedCountry === "India" ? "ABC - India" : "British";

  return (
    <div 
      className="w-screen h-screen flex flex-col items-center justify-center relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/Wallpaper/GtB-Ex7WYAA9yAD.jpeg')" }}
    >
      {/* Background Blur Overlay */}
      <div className="absolute inset-0 backdrop-blur-[60px] bg-black/5 z-0" />

      {/* Top Right Date/Time indicator */}
      <div className="absolute top-5 right-6 flex items-center gap-4 text-white text-[13px] font-medium z-10 drop-shadow-md">
        <div className="flex items-center gap-2">
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
        <span>{dateString}</span>
      </div>

      {/* Main Card */}
      <motion.div 
        key="timezone-screen"
        initial={{ opacity: 0, scale: 0.95, x: 20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.95, x: -20 }}
        transition={{ duration: 0.4 }}
        className="w-[700px] h-[520px] bg-white rounded-3xl shadow-2xl z-10 flex flex-col pt-10 pb-6 relative overflow-hidden"
      >
        {/* Back Button */}
        <button 
          onClick={goBack}
          className="absolute top-6 left-6 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors bg-white text-[#0066cc] z-20 shadow-sm"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <h2 className="text-[22px] font-bold text-gray-900 mb-4 tracking-tight mt-2 text-center w-full px-12 z-10">Select Your Time Zone</h2>

        <div className="flex-1 flex flex-col items-center w-full overflow-y-auto overflow-x-hidden scrollbar-thin pb-4">
          <p className="text-[12px] text-gray-600 text-center leading-relaxed mb-6 max-w-[520px] px-8 flex-shrink-0">
            To select a time zone, click the map near your location and choose a city from the Closest City menu. 
            You can also have the time zone change automatically, if possible, based on your current location.
          </p>

          {/* Auto Checkbox */}
          <div className="flex items-center gap-3 mb-6 flex-shrink-0">
            <div 
              onClick={() => setAutoTimezone(!autoTimezone)}
              className="w-10 h-6 bg-gray-200 rounded-full relative cursor-pointer flex items-center shadow-inner"
            >
              <motion.div 
                className={`w-[20px] h-[20px] rounded-full bg-white shadow-sm absolute ${autoTimezone ? 'right-[2px] bg-[#0066cc]' : 'left-[2px]'}`}
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </div>
            <span className="text-[13px] text-gray-700 font-medium">Set time zone automatically using current location</span>
          </div>

          {/* Map Image Section */}
          <div className="w-full relative flex items-center justify-center mb-6 h-[290px] min-h-[290px] flex-shrink-0 px-2">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg" 
              alt="World Map" 
              className="w-full h-full object-contain opacity-40 select-none pointer-events-none transform scale-[1.05]"
              style={{ filter: "grayscale(100%)" }}
            />
            {/* Map Pin */}
            <div className="absolute top-[38%] left-[48%] w-2.5 h-2.5 bg-white rounded-full border-[2.5px] border-[#0066cc] shadow-sm transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          
          {/* Spacer to force scrollability to match native layout feel */}
          <div className="h-4 w-full flex-shrink-0"></div>
        </div>

        {/* Bottom Section: Controls & Continue Button */}
        <div className="w-full flex justify-between items-end mt-2 px-12 bg-white z-10 pt-2">
          {/* Settings Section */}
          <div className="flex flex-col gap-3 w-[400px]">
            <div className="flex items-center">
              <span className="w-[85px] text-right text-[13px] text-gray-800 font-semibold mr-4">Time Zone:</span>
              <span className="text-[13px] text-gray-500">{defaultTimezone}</span>
            </div>
            
            <div className="flex items-center">
              <span className="w-[85px] text-right text-[13px] text-gray-800 font-semibold mr-4">Closest City:</span>
              <div className="relative w-[280px]">
                <select 
                  className="w-full appearance-none bg-white border border-[#0066cc] rounded-md px-3 py-1.5 text-[13px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#0066cc]"
                  disabled={autoTimezone}
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  {timezones.map(tz => (
                    <option key={tz.label} value={tz.label}>{tz.label}</option>
                  ))}
                  <option value="other">Other City...</option>
                </select>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none bg-[#0066cc] rounded-[3px] p-[2px]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Next Button Container */}
          <button 
            onClick={handleNext}
            className="px-6 py-[6px] rounded-full bg-[#f0f0f0] hover:bg-gray-200 text-gray-800 text-[13px] font-medium transition-colors mb-0.5 shadow-sm"
          >
            Continue
          </button>
        </div>
      </motion.div>
    </div>
  );
}