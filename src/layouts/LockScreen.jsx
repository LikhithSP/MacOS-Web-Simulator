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
  <svg width="18" height="14" viewBox="0 0 24 18" fill="currentColor">
    <path d="M12 15.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/>
    <path d="M12 10c2.2 0 4.2.9 5.7 2.3a1 1 0 0 1-1.4 1.4A6 6 0 0 0 12 12a6 6 0 0 0-4.3 1.7 1 1 0 1 1-1.4-1.4A8 8 0 0 1 12 10z"/>
    <path d="M12 4.5c3.5 0 6.7 1.4 9 3.8a1 1 0 0 1-1.4 1.4A10.5 10.5 0 0 0 12 6.5c-2.9 0-5.6 1.2-7.6 3.2a1 1 0 0 1-1.4-1.4A12.5 12.5 0 0 1 12 4.5z"/>
    <path d="M12 0c4.4 0 8.4 1.7 11.4 4.5a1 1 0 0 1-1.4 1.4A14 14 0 0 0 12 2 14 14 0 0 0 2 5.9a1 1 0 0 1-1.4-1.4A16 16 0 0 1 12 0z"/>
  </svg>
);

// macOS Style Battery Icon (Full)
const MacBatteryIcon = () => (
  <svg width="28" height="14" viewBox="0 0 28 14" fill="currentColor">
    <rect x="0.5" y="0.5" width="24" height="13" rx="3" ry="3" stroke="currentColor" strokeWidth="1.2" fill="none"/>
    <rect x="2.5" y="2.5" width="20" height="9" rx="1.5" ry="1.5" fill="currentColor"/>
    <path d="M25.5 4v6a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2z" fill="currentColor"/>
  </svg>
);

export default function LockScreen({ goNext }) {
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [time, setTime] = useState(new Date());
  const [lockscreenWallpaper, setLockscreenWallpaper] = useState("/Wallpaper/GtB-Ex7WYAA9yAD.jpeg");

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

  useEffect(() => {
    const onKeyDown = (event) => {
      if (showEditModal) return;
      if (event.code === "Space" || event.key === " " || event.code === "Enter" || event.key === "Enter") {
        event.preventDefault();
        handleUnlock();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleUnlock, showEditModal]);

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

  const formattedTime = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  const weekday = time.toLocaleDateString("en-US", { weekday: "long" });
  const day = time.getDate();
  const month = time.toLocaleDateString("en-US", { month: "long" });
  const formattedDate = `${weekday}, ${month} ${day}`;

  return (
    <div
      onClick={!showEditModal ? handleUnlock : undefined}
      className={`relative w-screen h-screen overflow-hidden text-white font-sans select-none cursor-pointer
        transition-transform duration-700 ease-in-out
        ${isUnlocking ? "-translate-y-full" : "translate-y-0"}`}
    >
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
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        {/* Clickable profile area */}
        <div
          className="flex flex-col items-center gap-2 group cursor-pointer"
          onClick={openEditModal}
          title="Click to edit profile"
        >
          {/* Avatar */}
          <div className="relative w-12 h-12">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/30 shadow-lg group-hover:border-white/60 transition-all">
              <img src={profilePhoto} alt="user" className="w-full h-full object-cover" />
            </div>
            {/* Edit hint icon */}
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg width="8" height="8" viewBox="0 0 12 12" fill="white">
                <path d="M8.5 1.5a1.5 1.5 0 0 1 2.12 2.12L9.5 4.74 7.26 2.5 8.5 1.5zM6.5 3.26L1 8.76V11h2.24l5.5-5.5L6.5 3.26z"/>
              </svg>
            </div>
          </div>
          {/* Name */}
          <span
            className="text-[18px] font-medium text-white group-hover:text-white/80 transition-colors"
            style={{
              textShadow: "0 1px 3px rgba(0,0,0,0.4)",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
            }}
          >
            {username}
          </span>
        </div>

        <span
          className="text-[11px] text-white/60"
          style={{
            textShadow: "0 1px 2px rgba(0,0,0,0.3)",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
          }}
        >
          Click anywhere to unlock
        </span>
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