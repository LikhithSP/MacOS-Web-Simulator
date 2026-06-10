import React, { useState, useEffect, useCallback, useRef } from "react";

// macOS Style Signal Bars Icon
const MacSignalIcon = () => (
  <svg width="18" height="14" viewBox="0 0 18 14" fill="currentColor">
    <rect x="0" y="10" width="3" height="4" rx="0.5"/>
    <rect x="5" y="7" width="3" height="7" rx="0.5"/>
    <rect x="10" y="4" width="3" height="10" rx="0.5"/>
    <rect x="15" y="0" width="3" height="14" rx="0.5"/>
  </svg>
);

// macOS Style Wifi Icon
const MacWifiIcon = () => (
  <svg width="18" height="14" viewBox="0 0 24 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-white">
    <circle cx="12" cy="18" r="2" fill="currentColor" stroke="none" />
    <path d="M8.5 14.5a5 5 0 0 1 7 0" />
    <path d="M5 11a10 10 0 0 1 14 0" />
    <path d="M1.5 7.5a15 15 0 0 1 21 0" />
  </svg>
);

// macOS Style Battery Icon (Full)
const MacBatteryIcon = () => (
  <svg width="28" height="14" viewBox="0 0 28 14" fill="currentColor" className="text-white">
    <rect x="0" y="0" width="24" height="14" rx="4.5" fill="currentColor" />
    <rect x="25.5" y="4" width="2" height="6" rx="1" fill="currentColor" />
  </svg>
);

export default function LockScreen({ goNext }) {
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [time, setTime] = useState(new Date());
  const [lockscreenWallpaper, setLockscreenWallpaper] = useState("/Wallpaper/GtB-Ex7WYAA9yAD.jpeg");
  
  const [passwordInput, setPasswordInput] = useState("");
  const [isWrongPassword, setIsWrongPassword] = useState(false);

  // User profile state
  const [username, setUsername] = useState(() => localStorage.getItem("lock_username") || "Likhith SP");
  const [profilePhoto, setProfilePhoto] = useState(() => localStorage.getItem("lock_profile_photo") || "https://i.pinimg.com/originals/bf/57/02/bf57026ee75af2f414000cec322f7404.gif");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhoto, setEditPhoto] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Preload the lockscreen wallpaper image for faster boot
  useEffect(() => {
    const img = new Image();
    img.src = localStorage.getItem("lockscreen_wallpaper") || "/Wallpaper/GtB-Ex7WYAA9yAD.jpeg";
  }, []);

  useEffect(() => {
    const savedWallpaper = localStorage.getItem("lockscreen_wallpaper");
    if (savedWallpaper) setLockscreenWallpaper(savedWallpaper);
  }, []);

  const enterFullscreen = useCallback(() => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) elem.requestFullscreen();
    else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
    else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
  }, []);

  const handleUnlock = useCallback(() => {
    enterFullscreen();
    setIsUnlocking(true);
    setTimeout(() => goNext(), 500);
  }, [enterFullscreen, goNext]);

  const handleSubmitPassword = useCallback((e) => {
    if (e) e.preventDefault();
    
    const requiredPassword = localStorage.getItem("lock_password") || "";
    if (passwordInput === requiredPassword) {
      setIsWrongPassword(false);
      handleUnlock();
    } else {
      setIsWrongPassword(true);
      setPasswordInput("");
      setTimeout(() => setIsWrongPassword(false), 500); // Reset shake after animation
    }
  }, [passwordInput, handleUnlock]);

  const openEditModal = (e) => {
    e.stopPropagation();
    setEditName(username);
    setEditPhoto(profilePhoto);
    setShowEditModal(true);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setEditPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = (e) => {
    e.stopPropagation();
    const name = editName.trim() || "User";
    setUsername(name);
    setProfilePhoto(editPhoto);
    localStorage.setItem("lock_username", name);
    localStorage.setItem("lock_profile_photo", editPhoto);
    setShowEditModal(false);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setShowEditModal(false);
  };

  const tz = localStorage.getItem("setup_timezone") || Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  let formattedTime;
  let formattedDate;

  try {
    formattedTime = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz
    }).format(time);
    
    const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: tz }).format(time);
    const day = new Intl.DateTimeFormat('en-US', { day: 'numeric', timeZone: tz }).format(time);
    const month = new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: tz }).format(time);
    formattedDate = `${weekday}, ${month} ${day}`;
  } catch (e) {
    formattedTime = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    const weekday = time.toLocaleDateString("en-US", { weekday: "long" });
    const day = time.getDate();
    const month = time.toLocaleDateString("en-US", { month: "long" });
    formattedDate = `${weekday}, ${month} ${day}`;
  }

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden text-white font-sans select-none
        transition-transform duration-700 ease-in-out
        ${isUnlocking ? "-translate-y-full" : "translate-y-0"}`}
    >
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
        }
        .shake-animation {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
      
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${lockscreenWallpaper}')` }}
      />

      {/* Subtle Overlay */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Top Right Icons */}
      <div
        className="absolute top-4 right-5 z-20 flex items-center gap-3 text-white"
        style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }}
      >
        <MacWifiIcon />
        <MacBatteryIcon />
      </div>

      {/* Clock */}
      <div className="relative z-10 w-full h-full flex flex-col items-center pt-24">
        <div className="flex flex-col items-center text-center">
          <span
            className="text-[25px] tracking-wide"
            style={{
              color: "rgba(255,255,255,0.75)",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            {formattedDate}
          </span>
          <span
            className="text-[120px] leading-none mt-0"
            style={{
              color: "rgba(255,255,255,0.75)",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
              fontWeight: 500,
              letterSpacing: "-0.02em",
            }}
          >
            {formattedTime}
          </span>
        </div>
      </div>

      {/* Bottom Avatar & Name */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4 w-72">
        {/* Clickable profile area */}
        <div
          className="flex flex-col items-center gap-3 group cursor-pointer"
          onClick={openEditModal}
          title="Click to edit profile"
        >
          {/* Avatar */}
          <div className="relative w-16 h-16">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/30 shadow-lg group-hover:border-white/60 transition-all">
              <img src={profilePhoto} alt="user" className="w-full h-full object-cover" />
            </div>
            {/* Edit hint icon */}
            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="white">
                <path d="M8.5 1.5a1.5 1.5 0 0 1 2.12 2.12L9.5 4.74 7.26 2.5 8.5 1.5zM6.5 3.26L1 8.76V11h2.24l5.5-5.5L6.5 3.26z"/>
              </svg>
            </div>
          </div>
          {/* Name */}
          <span
            className="text-[20px] font-medium text-white group-hover:text-white/80 transition-colors"
            style={{
              textShadow: "0 1px 3px rgba(0,0,0,0.4)",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
            }}
          >
            {username}
          </span>
        </div>

        {/* Password Entry */}
        <div className="flex flex-col items-center gap-2 w-full">
          <form 
            onSubmit={handleSubmitPassword}
            className={`relative w-48 mt-1 ${isWrongPassword ? 'shake-animation' : ''}`}
          >
            <input
              type="password"
              placeholder="Enter Password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full h-8 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 text-white text-[13px] placeholder-white/60 outline-none focus:bg-white/30 focus:border-white/50 transition-all"
              style={{
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
              }}
              autoFocus
            />
            {passwordInput && (
              <button 
                type="submit" 
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/30 hover:bg-white/40 flex items-center justify-center transition-colors"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="M12 5l7 7-7 7"></path>
                </svg>
              </button>
            )}
          </form>

          <span
            className="text-[12px] text-white/80 mt-1"
            style={{
              textShadow: "0 1px 2px rgba(0,0,0,0.3)",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
            }}
          >
            Touch ID or Enter Password
          </span>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCancel} />

          {/* Modal */}
          <div
            className="relative z-10 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-6 w-72 shadow-2xl flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              className="text-white text-[15px] font-semibold"
              style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}
            >
              Edit Profile
            </h2>

            {/* Photo preview + upload */}
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/40 shadow-lg">
                <img src={editPhoto} alt="preview" className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                  <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2a6 6 0 1 1 0-12 6 6 0 0 1 0 12zM9 2h6l1.5 2H20a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3.5L9 2z"/>
                </svg>
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            <p className="text-white/40 text-[11px] -mt-2">Click photo to change</p>

            {/* Name input */}
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSave(e); if (e.key === "Escape") handleCancel(e); }}
              placeholder="Your name"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-[14px] outline-none focus:border-white/50 placeholder-white/30 text-center"
              style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" }}
              autoFocus
            />

            {/* Buttons */}
            <div className="flex gap-2 w-full">
              <button
                onClick={handleCancel}
                className="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 text-[13px] transition-colors border border-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2 rounded-lg bg-white/25 hover:bg-white/35 text-white text-[13px] font-medium transition-colors border border-white/20"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}