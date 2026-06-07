import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const avatars = [
  { id: 'panda', emoji: '🐼', bg: 'bg-[#92e482]' },
  { id: 'cow', emoji: '🐮', bg: 'bg-[#f4ac84]' },
  { id: 'chicken', emoji: '🐔', bg: 'bg-[#e49ca4]' },
  { id: 'fox', emoji: '🦊', bg: 'bg-[#c4a4f4]' },
  { id: 'owl', emoji: '🦉', bg: 'bg-[#84c4f4]' }
];

export default function CreateAccountScreen({ goNext, goBack }) {
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);
  const [fullName, setFullName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [password, setPassword] = useState('');
  const [verify, setVerify] = useState('');
  const [hint, setHint] = useState('');
  const [allowReset, setAllowReset] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Auto-fill account name from full name
  useEffect(() => {
    if (!accountName && fullName) {
      setAccountName(fullName.toLowerCase().replace(/\s+/g, ''));
    }
  }, [fullName, accountName]);

  const handleFullNameChange = (e) => {
    setFullName(e.target.value);
    setAccountName(e.target.value.toLowerCase().replace(/\s+/g, ''));
  };

  const savedLang = localStorage.getItem('setup_lang') || 'English';
  const selectedCountry = localStorage.getItem('setup_country') || 'United Kingdom';
  const topBarLang = savedLang.includes('French') ? 'ABC - AZERTY' :
                     selectedCountry === 'United States' ? 'U.S.' :
                     selectedCountry === 'India' ? 'ABC - India' : 'British';

  const canContinue = fullName && accountName && password && password === verify;

  const handleContinue = () => {
    if (!canContinue) return;
    setIsCreating(true);
    
    // Convert emoji avatar to a data URL so it can be used everywhere as an image
    const canvas = document.createElement('canvas');
    canvas.width = 120;
    canvas.height = 120;
    const ctx = canvas.getContext('2d');
    
    // Draw background
    let bgColor = '#92e482'; // Default panda
    if (selectedAvatar.id === 'cow') bgColor = '#f4ac84';
    if (selectedAvatar.id === 'chicken') bgColor = '#e49ca4';
    if (selectedAvatar.id === 'fox') bgColor = '#c4a4f4';
    if (selectedAvatar.id === 'owl') bgColor = '#84c4f4';
    
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.arc(60, 60, 60, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw emoji
    ctx.font = '70px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(selectedAvatar.emoji, 60, 65);
    
    const photoDataUrl = canvas.toDataURL();

    // Save to local storage for LockScreen
    localStorage.setItem('lock_username', fullName);
    localStorage.setItem('lock_password', password);
    // Don't overwrite if user already changed it out of cycle, but this is setup, so we overwrite
    localStorage.setItem('lock_profile_photo', photoDataUrl);

    setTimeout(() => {
      goNext();
    }, 1500);
  };

  return (
    <div 
      className="w-screen h-screen flex flex-col items-center justify-center relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/Wallpaper/GtB-Ex7WYAA9yAD.jpeg')" }}
    >
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

      <motion.div 
        key="createaccount-screen"
        initial={{ opacity: 0, scale: 0.95, x: 20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.95, x: -20 }}
        transition={{ duration: 0.4 }}
        className="w-[700px] h-[520px] bg-white rounded-3xl shadow-2xl z-10 flex flex-col pt-12 pb-6 relative overflow-hidden"
      >
        <button 
          onClick={goBack}
          disabled={isCreating}
          className="absolute top-6 left-6 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors bg-white text-[#0066cc] shadow-sm z-20 disabled:opacity-50"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <div className="flex-1 flex flex-col items-center w-full overflow-y-auto scrollbar-thin px-14 pb-4">
          <div className="w-[480px] text-left">
            <h2 className="text-[15px] font-bold text-gray-900 mb-1">Create a Mac Account</h2>
            <p className="text-[13px] text-gray-500 leading-relaxed mb-6">
              The password you create here will be used to log in to this Mac.
            </p>

            {/* Avatar Selector */}
            <div className="flex items-center gap-5 mb-5">
              <div className="w-[50px] h-[50px] rounded-full bg-gray-200 flex items-center justify-center text-gray-400 cursor-pointer shadow-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </div>
              
              {avatars.map(avatar => (
                <div 
                  key={avatar.id}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`w-[50px] h-[50px] rounded-full flex items-center justify-center text-2xl cursor-pointer shadow-sm transition-all ${avatar.bg} ${selectedAvatar.id === avatar.id ? 'ring-[3px] ring-[#0066cc] ring-offset-2' : ''}`}
                >
                  {avatar.emoji}
                </div>
              ))}
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-[10px] w-full mt-2">
              <div>
                <input 
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={handleFullNameChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-[7px] text-[13px] focus:outline-none focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc]"
                />
              </div>

              <div>
                <input 
                  type="text"
                  placeholder="Account Name"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-[7px] text-[13px] focus:outline-none focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc]"
                />
                <p className="text-[11px] text-gray-500 mt-1 ml-1">This will be the name of your home folder.</p>
              </div>

              <div className="flex gap-3">
                <input 
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-[7px] text-[13px] focus:outline-none focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc]"
                />
                <input 
                  type="password"
                  placeholder="Verify"
                  value={verify}
                  onChange={(e) => setVerify(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-[7px] text-[13px] focus:outline-none focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc]"
                />
              </div>

              <div>
                <input 
                  type="text"
                  placeholder="Hint (Optional)"
                  value={hint}
                  onChange={(e) => setHint(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-[7px] text-[13px] focus:outline-none focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc]"
                />
              </div>

              <div className="flex items-start gap-2 mt-2">
                <input 
                  type="checkbox" 
                  id="allow-reset"
                  checked={allowReset}
                  onChange={(e) => setAllowReset(e.target.checked)}
                  className="mt-[3px] shrink-0 rounded text-[#0066cc] focus:ring-[#0066cc]"
                />
                <label htmlFor="allow-reset" className="text-[12px] text-gray-600 leading-snug">
                  Allow computer account password to be reset with your Apple Account. You must sign in with your Apple Account in the next step to use this feature.
                </label>
              </div>
            </div>
          </div>
          
          <div className="h-4 w-full flex-shrink-0"></div>
        </div>

        {/* Bottom Section */}
        <div className="w-full flex justify-between items-end mt-2 px-8 z-10 pt-2">
          <div className="flex items-center text-[12px] text-gray-500 h-[32px] ml-4">
            {isCreating && (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </>
            )}
          </div>

          <button 
            onClick={handleContinue}
            disabled={!canContinue || isCreating}
            className={`${(!canContinue || isCreating) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'} px-6 py-[6px] rounded-full bg-[#f0f0f0] text-gray-800 text-[13px] font-medium transition-colors mb-0.5 shadow-sm`}
          >
            Continue
          </button>
        </div>
      </motion.div>
    </div>
  );
}
