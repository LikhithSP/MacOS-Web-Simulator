import React, { useState } from "react";
import { motion } from "framer-motion";

export default function RegionScreen({ goNext, goBack }) {
  const countries = [
    "United Kingdom",
    "United States",
    "Afghanistan",
    "Åland Islands",
    "Albania",
    "Algeria",
    "American Samoa",
    "Andorra",
    "Angola",
    "Anguilla",
    "Antarctica",
    "Antigua & Barbuda",
    "Argentina",
    "Armenia",
    "Aruba",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bermuda",
    "Bhutan",
    "Bolivia",
    "Bosnia & Herzegovina",
    "Botswana",
    "Bouvet Island",
    "Brazil",
    "British Indian Ocean Territory",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cambodia",
    "Cameroon",
    "Canada",
    "China",
    "Colombia",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czechia",
    "Denmark",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Estonia",
    "Ethiopia",
    "Fiji",
    "Finland",
    "France",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Guatemala",
    "Honduras",
    "Hong Kong",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kuwait",
    "Laos",
    "Latvia",
    "Lebanon",
    "Libya",
    "Lithuania",
    "Luxembourg",
    "Macao",
    "Madagascar",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Mexico",
    "Monaco",
    "Mongolia",
    "Morocco",
    "Myanmar",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Nigeria",
    "North Korea",
    "North Macedonia",
    "Norway",
    "Oman",
    "Pakistan",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Russia",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "South Africa",
    "South Korea",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Sweden",
    "Switzerland",
    "Syria",
    "Taiwan",
    "Tanzania",
    "Thailand",
    "Tunisia",
    "Turkey",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "Uruguay",
    "Uzbekistan",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe"
  ];
  
  const [selectedCountry, setSelectedCountry] = useState("United Kingdom");

  return (
    <div 
      className="w-screen h-screen flex flex-col items-center justify-center relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/Wallpaper/GtB-Ex7WYAA9yAD.jpeg')" }}
    >
      {/* Background Blur Overlay */}
      <div className="absolute inset-0 backdrop-blur-[60px] bg-black/5 z-0" />

      {/* Top Right Keyboard layout indicator */}
      <div className="absolute top-5 right-6 flex items-center gap-2 text-white text-xs font-medium z-10 drop-shadow-md">
        British
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
        key="region-screen"
        initial={{ opacity: 0, scale: 0.95, x: 20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.95, x: -20 }}
        transition={{ duration: 0.4 }}
        className="w-[700px] h-[520px] bg-white rounded-3xl shadow-2xl z-10 flex flex-col items-center py-12 relative overflow-hidden"
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

        {/* Custom Earth/Continent Icon */}
        <div className="text-[#0066cc] mb-4">
          <svg width="68" height="68" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 2c-1.5 2-2.5 4.5-2.5 8s1 6 2.5 8" opacity="0.3"></path>
            <path d="M12 22c1.5-2 2.5-4.5 2.5-8s-1-6-2.5-8" opacity="0.3"></path>
            {/* Outline mimicking landmasses */}
            <path d="M9.5 3c1 1.5 1 3 2.5 3s2.5.5 3 2-2.5 3-1 5 3 1.5 3 4-2.5 3-4 1-1.5-3-3.5-3-2-2-1.5-3c.5-1-1.5-1.5-2.5-3s2-4 3-4c1-1 0-2 0-2z" fill="#0066cc" fillOpacity="0.1"></path>
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">Select Your Country or Region</h2>

        {/* List */}
        <div className="w-[300px] h-[240px] overflow-y-auto bg-white/50 scrollbar-thin" style={{ border: "2px solid #7cb5ec", borderRadius: "4px", scrollbarWidth: "thin", scrollbarColor: "rgba(0,0,0,0.3) transparent" }}>
          {countries.map((country, idx) => (
            <div 
              key={idx}
              onClick={() => setSelectedCountry(country)}
              className={`px-4 py-1.5 cursor-pointer text-[13px] transition-colors text-left font-medium ${
                selectedCountry === country 
                  ? "bg-[#0058d0] text-white" 
                  : "text-gray-800 hover:bg-gray-100"
              }`}
            >
              {country}
            </div>
          ))}
        </div>

        {/* Next Button Container */}
        <div className="absolute bottom-6 right-6">
          <button 
            onClick={() => goNext(selectedCountry)}
            className="px-5 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-[13px] font-medium transition-colors"
          >
            Continue
          </button>
        </div>
      </motion.div>

      {/* Footer Text */}
      <div className="absolute bottom-10 left-0 right-0 text-center z-10 px-8">
        <p className="text-white font-semibold text-[13px] max-w-3xl mx-auto leading-relaxed shadow-sm drop-shadow-md">
          Press the Escape key to hear how to set up your Mac with VoiceOver.<br/>
          Press Command-Option-F5 to view accessibility options.
        </p>
      </div>
    </div>
  );
}