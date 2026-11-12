import React, { useState } from "react";
import { motion } from "framer-motion";

export default function RegionScreen({ goNext, goBack }) {
  const countries = [
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
    "Kiribati",
    "Kosovo",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macao",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Martinique",
    "Mauritania",
    "Mauritius",
    "Mayotte",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Montserrat",
    "Morocco",
    "Mozambique",
    "Myanmar (Burma)",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Caledonia",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "Niue",
    "Norfolk Island",
    "North Korea",
    "North Macedonia",
    "Northern Mariana Islands",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestinian Territories",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Pitcairn Islands",
    "Poland",
    "Portugal",
    "Puerto Rico",
    "Qatar",
    "Réunion",
    "Romania",
    "Russia",
    "Rwanda",
    "Samoa",
    "San Marino",
    "São Tomé & Príncipe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Sint Maarten",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Korea",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "St. Barthélemy",
    "St. Helena",
    "St. Kitts & Nevis",
    "St. Lucia",
    "St. Martin",
    "St. Pierre & Miquelon",
    "St. Vincent & Grenadines",
    "Sudan",
    "Suriname",
    "Svalbard & Jan Mayen",
    "Sweden",
    "Switzerland",
    "Syria",
    "Taiwan",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tokelau",
    "Tonga",
    "Trinidad & Tobago",
    "Tunisia",
    "Türkiye",
    "Turkmenistan",
    "Turks & Caicos Islands",
    "Tuvalu",
    "U.S. Outlying Islands",
    "U.S. Virgin Islands",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Vatican City",
    "Venezuela",
    "Vietnam",
    "Wallis & Futuna",
    "Western Sahara",
    "Yemen",
    "Zambia",
    "Zimbabwe"
  ];
  
  const [selectedCountry, setSelectedCountry] = useState("United States");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setTimeout(() => {
      goNext(selectedCountry);
    }, 400);
  };

  return (
    <div 
      className="w-screen h-screen flex flex-col items-center justify-center relative overflow-hidden bg-cover bg-center select-none font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Text','SF_Pro_Display','Segoe_UI',Helvetica,Arial,sans-serif]"
      style={{ backgroundImage: "url('/icons/hello.png')" }}
    >
      {/* Background Blur Overlay */}
      <div className="absolute inset-0 backdrop-blur-[60px] bg-black/10 z-0" />

      {/* Top Bar Indicators */}
      <div className="absolute top-3 left-6 flex items-center text-white/90 z-20 drop-shadow">
        <svg viewBox="0 0 170 170" className="w-4 h-4 fill-current">
          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.197-2.12-9.973-3.17-14.34-3.17-4.58 0-9.492 1.05-14.746 3.17-5.262 2.13-9.501 3.24-12.742 3.35-4.929.21-9.842-1.96-14.746-6.52-3.13-2.73-7.045-7.41-11.735-14.04-5.032-7.08-9.169-15.29-12.41-24.65-3.471-10.11-5.211-19.9-5.211-29.378 0-10.857 2.346-20.221 7.045-28.068 3.693-6.303 8.606-11.275 14.755-14.925s12.793-5.51 19.948-5.629c3.915 0 9.049 1.211 15.429 3.591 6.362 2.388 10.447 3.599 12.238 3.599 1.339 0 5.877-1.416 13.57-4.239 7.275-2.618 13.415-3.702 18.445-3.275 13.63 1.1 23.87 6.473 30.68 16.153-12.19 7.386-18.22 17.731-18.1 31.002.11 10.337 3.86 18.939 11.23 25.769 3.34 3.17 7.07 5.62 11.22 7.36-.9 2.61-1.85 5.11-2.86 7.51zM119.11 7.24c0 8.102-2.96 15.667-8.86 22.669-7.12 8.324-15.732 13.134-25.071 12.375a25.222 25.222 0 0 1-.188-3.07c0-7.778 3.386-16.102 9.399-22.908 3.002-3.446 6.82-6.311 11.45-8.597 4.62-2.252 8.99-3.497 13.1-3.71.12 1.083.17 2.166.17 3.24z" />
        </svg>
      </div>

      <div className="absolute top-3 right-6 flex items-center gap-3 text-white/90 text-[12px] font-medium z-20 drop-shadow">
        <span>ABC</span>
        <svg width="20" height="13" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="1" y="1" width="22" height="14" rx="2"></rect>
          <line x1="6" y1="4" x2="6" y2="4.01"></line>
          <line x1="10" y1="4" x2="10" y2="4.01"></line>
          <line x1="14" y1="4" x2="14" y2="4.01"></line>
          <line x1="18" y1="4" x2="18" y2="4.01"></line>
          <line x1="8" y1="11" x2="16" y2="11"></line>
        </svg>
        <svg width="18" height="10" viewBox="0 0 24 14" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="1" y="1" width="20" height="12" rx="2"></rect>
          <path d="M23 5v4"></path>
          <rect x="3" y="3" width="12" height="8" fill="currentColor"></rect>
        </svg>
        <span>12:27 PM</span>
      </div>

      {/* Main Container */}
      <div className="flex flex-col items-center z-10">
        {/* Main Card */}
        <motion.div 
          key="region-screen"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-[780px] h-[590px] bg-[#fbfbfd]/95 backdrop-blur-3xl rounded-[28px] shadow-[0_24px_70px_rgba(0,0,0,0.28)] border border-white/60 flex flex-col items-center pt-14 pb-8 px-10 relative overflow-hidden"
        >
          {/* Back Button */}
          <button 
            onClick={goBack}
            className="absolute top-7 left-7 w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-black/5 active:scale-95 transition-all cursor-pointer"
            aria-label="Back"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          {/* Left-Aligned Header Block: Globe & Title */}
          <div className="w-[470px] flex flex-col items-start mb-3">
            {/* Apple Official Americas Globe Outline */}
            <div className="mb-3">
              <svg
                width="92"
                height="92"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#007AFF]"
              >
                {/* Globe Rim */}
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  stroke="currentColor"
                  strokeWidth="4.5"
                  fill="none"
                />

                {/* North America (Alaska, Canada, USA, Mexico, Florida) */}
                <path
                  d="M 32 23
                     C 30 20, 36 16, 42 15
                     C 48 14, 52 17, 56 16
                     C 61 15, 66 18, 64 24
                     C 62 28, 56 26, 53 29
                     C 50 32, 57 35, 54 40
                     C 52 43, 47 43, 45 46
                     C 43 49, 47 52, 45 54
                     C 43 55, 38 49, 36 44
                     C 34 39, 38 36, 36 32
                     C 34 28, 30 26, 32 23 Z"
                  stroke="currentColor"
                  strokeWidth="3.8"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Central America connection bridge */}
                <path
                  d="M 45 54 Q 48 57 50 60"
                  stroke="currentColor"
                  strokeWidth="3.8"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* South America (Colombia, Brazil bump, Chile/Argentina tip) */}
                <path
                  d="M 50 60
                     C 54 59, 60 62, 64 66
                     C 68 70, 67 76, 62 81
                     C 58 85, 54 86, 52 82
                     C 50 77, 53 72, 50 68
                     C 48 64, 47 62, 50 60 Z"
                  stroke="currentColor"
                  strokeWidth="3.8"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </div>

            {/* Title */}
            <h2 className="text-[17px] font-semibold text-[#1d1d1f] tracking-tight text-left mt-1 mb-1">
              Select Your Country or Region
            </h2>
          </div>

          {/* Country List Box */}
          <div className="w-[470px] h-[260px] bg-white rounded-none border border-[#7cb5ec] shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-0">
            {countries.map((country, idx) => {
              const isSelected = selectedCountry === country;
              return (
                <div 
                  key={idx}
                  onClick={() => {
                    if (!isSubmitting) setSelectedCountry(country);
                  }}
                  className={`px-3 py-[2px] cursor-default text-[13px] leading-4 text-left transition-colors select-none rounded-none ${
                    isSelected 
                      ? isSubmitting
                        ? "bg-[#8E8E93] text-white font-medium"
                        : "bg-[#007AFF] text-white font-medium" 
                      : isSubmitting
                        ? "text-[#8e8e93]"
                        : "text-[#1d1d1f] hover:bg-[#f5f5f7]"
                  }`}
                >
                  {country}
                </div>
              );
            })}
          </div>

          {/* Safety & Handling Card Inset */}
          <div className="w-[470px] mt-4 p-3 rounded-lg bg-black/[0.03] border border-black/[0.04] flex items-start gap-3">
            <div className="mt-0.5 text-gray-500">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                <line x1="8" y1="6" x2="16" y2="6"></line>
                <line x1="12" y1="18" x2="12.01" y2="18"></line>
              </svg>
            </div>
            <div className="text-left text-[11px] leading-snug">
              <span className="font-bold text-gray-900 block text-[11.5px] mb-0.5">Safety &amp; Handling</span>
              <p className="text-gray-500 font-normal">
                See important safety and handling information for your device.<br/>
                <span className="text-[#007AFF] hover:underline cursor-pointer">Learn More…</span>
              </p>
            </div>
          </div>

          {/* Continue Button */}
          <div className="absolute bottom-6 right-6">
            <button 
              onClick={handleContinue}
              disabled={isSubmitting}
              className={`px-6 py-1.5 rounded-full text-[13px] font-medium transition-all select-none shadow-sm cursor-pointer ${
                isSubmitting
                  ? "bg-[#E5E5EA] text-[#8e8e93] cursor-default"
                  : "bg-[#E5E5EA]/90 hover:bg-[#D1D1D6] active:bg-[#C7C7CC] text-[#1d1d1f]"
              }`}
            >
              Continue
            </button>
          </div>
        </motion.div>

        {/* Accessibility Footer Text */}
        <div className="mt-4 text-center px-4 max-w-[720px]">
          <p className="text-white font-medium text-[11.5px] leading-relaxed opacity-90 tracking-normal drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
            Press the escape key to hear how to set up your Mac with VoiceOver.<br/>
            Triple-click Touch ID to view accessibility options.
          </p>
        </div>
      </div>
    </div>
  );
}
