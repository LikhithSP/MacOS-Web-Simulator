import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAppStore } from "../store/Appstore";
import { songs } from "../constants/songs";
import { FiShuffle } from "react-icons/fi";
import { BsFillPlayFill, BsFillPauseFill, BsFillSkipForwardFill, BsFillSkipBackwardFill } from "react-icons/bs";

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

export default function LockScreen({ goNext, isLocked }) {
  const isAudioPlaying = useAppStore((state) => state.isAudioPlaying);
  const currentTrack = useAppStore((state) => state.currentTrack);
  const toggleAudio = useAppStore((state) => state.toggleAudio);
  const nextTrack = useAppStore((state) => state.nextTrack);
  const prevTrack = useAppStore((state) => state.prevTrack);
  const windows = useAppStore((state) => state.windows);
  
  const isMusicOpen = windows.some((w) => w.appId === "Music");

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);

  const [isUnlocking, setIsUnlocking] = useState(false);
  const [time, setTime] = useState(new Date());
  const [lockscreenWallpaper, setLockscreenWallpaper] = useState(() => {
    return localStorage.getItem("lockscreen_wallpaper") || "/Wallpaper/GoldenGate_6k.png";
  });
  const [depthEnabled, setDepthEnabled] = useState(() => {
    return localStorage.getItem("lockscreen_depth_effect") === "true";
  });
  const [depthSubjectTop, setDepthSubjectTop] = useState(() => {
    return parseInt(localStorage.getItem("lockscreen_depth_subject_top") || "30", 10);
  });
  const [depthForeground, setDepthForeground] = useState(() => {
    return localStorage.getItem("lockscreen_depth_foreground") || "";
  });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [clockPos, setClockPos] = useState(() => {
    const saved = localStorage.getItem("lockscreen_clock_pos");
    return saved ? JSON.parse(saved) : { x: 0, y: 0 };
  });
  const [isDraggingClock, setIsDraggingClock] = useState(false);
  const dragStartRef = useRef(null);

  const [passwordInput, setPasswordInput] = useState("");
  const [isWrongPassword, setIsWrongPassword] = useState(false);

  useEffect(() => {
    if (isLocked) {
      setIsUnlocking(false);
      setPasswordInput("");
    }
  }, [isLocked]);

  // Sync with active audio element duration & time updates
  useEffect(() => {
    if (!isAudioPlaying) return;
    const interval = setInterval(() => {
      const audioEl = document.querySelector("audio");
      if (audioEl) {
        setCurrentTime(audioEl.currentTime);
        setDuration(audioEl.duration || 0);
      }
    }, 250);
    return () => clearInterval(interval);
  }, [isAudioPlaying, currentTrack.title]);

  const formatTime = (secs) => {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const formatRemainingTime = (secs, dur) => {
    if (isNaN(secs) || isNaN(dur) || dur === 0) return "-0:00";
    const diff = Math.max(0, dur - secs);
    const m = Math.floor(diff / 60);
    const s = Math.floor(diff % 60);
    return `-${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // User profile state
  const [username, setUsername] = useState(() => localStorage.getItem("lock_username") || "Likhith SP");
  const [profilePhoto, setProfilePhoto] = useState(() => localStorage.getItem("lock_profile_photo") || "https://i.pinimg.com/originals/bf/57/02/bf57026ee75af2f414000cec322f7404.gif");
  const [profileBg, setProfileBg] = useState(() => localStorage.getItem("lock_profile_bg") || "");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhoto, setEditPhoto] = useState("");
  const fileInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (showEditModal) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (document.activeElement !== passwordInputRef.current) {
        if (passwordInputRef.current) {
          passwordInputRef.current.focus();
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [showEditModal]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Preload the lockscreen wallpaper image for faster boot
  useEffect(() => {
    const img = new Image();
    img.src = localStorage.getItem("lockscreen_wallpaper") || "/Wallpaper/GoldenGate_6k.png";
  }, []);

  useEffect(() => {
    const savedWallpaper = localStorage.getItem("lockscreen_wallpaper");
    if (savedWallpaper) setLockscreenWallpaper(savedWallpaper);
  }, []);

  // Listen for depth effect setting changes
  useEffect(() => {
    const handleDepthChange = () => {
      // Also refresh the wallpaper since it may have changed together with depth settings
      const savedWallpaper = localStorage.getItem("lockscreen_wallpaper");
      if (savedWallpaper) setLockscreenWallpaper(savedWallpaper);
      setDepthEnabled(localStorage.getItem("lockscreen_depth_effect") === "true");
      setDepthSubjectTop(parseInt(localStorage.getItem("lockscreen_depth_subject_top") || "30", 10));
      setDepthForeground(localStorage.getItem("lockscreen_depth_foreground") || "");
    };
    window.addEventListener("lockscreenDepthChanged", handleDepthChange);
    return () => window.removeEventListener("lockscreenDepthChanged", handleDepthChange);
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
    setTimeout(() => goNext(), 450);
  }, [enterFullscreen, goNext]);

  // Clock drag handlers for depth mode
  const handleClockDragStart = useCallback((e) => {
    if (!depthEnabled) return;
    e.preventDefault();
    setIsDraggingClock(true);
    dragStartRef.current = {
      startX: e.clientX - clockPos.x,
      startY: e.clientY - clockPos.y,
    };
  }, [depthEnabled, clockPos]);

  useEffect(() => {
    if (!isDraggingClock) return;
    const handleMove = (e) => {
      if (!dragStartRef.current) return;
      const newX = e.clientX - dragStartRef.current.startX;
      const newY = e.clientY - dragStartRef.current.startY;
      setClockPos({ x: newX, y: newY });
    };
    const handleUp = () => {
      setIsDraggingClock(false);
      dragStartRef.current = null;
      localStorage.setItem("lockscreen_clock_pos", JSON.stringify(clockPos));
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [isDraggingClock, clockPos]);



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
    localStorage.setItem("lock_profile_bg", "");
    setProfileBg("");
    setShowEditModal(false);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setShowEditModal(false);
  };

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
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
        transition-transform duration-[450ms] [transition-timing-function:cubic-bezier(0.25,1,0.5,1)] transform-gpu will-change-transform
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
        @keyframes soundWave {
          0%, 100% { height: 4px; }
          50% { height: 14px; }
        }
        .wave-bar {
          animation: soundWave 0.8s ease-in-out infinite;
        }
      `}</style>
      
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url('${lockscreenWallpaper}')`,
          zIndex: 0,
        }}
      />

      {/* Subtle Overlay */}
      <div className="absolute inset-0 bg-black/10" style={{ zIndex: 1 }} />

      {/* Depth Effect Foreground Layer */}
      {depthEnabled && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
          style={{
            backgroundImage: depthForeground ? `url('${depthForeground}')` : `url('${lockscreenWallpaper}')`,
            zIndex: 10,
            ...(depthForeground ? {} : {
              WebkitMaskImage: `linear-gradient(to bottom, transparent ${depthSubjectTop - 5}%, black ${depthSubjectTop + 8}%)`,
              maskImage: `linear-gradient(to bottom, transparent ${depthSubjectTop - 5}%, black ${depthSubjectTop + 8}%)`,
            }),
          }}
        />
      )}

      {/* Top Right Icons */}
      <div
        className="absolute top-4 right-5 z-20 flex items-center gap-3 text-white"
        style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }}
      >
        <MacWifiIcon />
        <MacBatteryIcon />
      </div>

      {/* Clock & Media Widget Container */}
      <div className="relative w-full h-full flex flex-col items-center pt-24 pointer-events-none" style={{ zIndex: depthEnabled ? 5 : 10 }}>
        <div
          className={`flex flex-col items-center text-center ${
            depthEnabled ? 'pointer-events-auto cursor-grab active:cursor-grabbing' : ''
          }`}
          style={depthEnabled ? {
            transform: `translate(${clockPos.x}px, ${clockPos.y}px)`,
            userSelect: 'none',
            transition: isDraggingClock ? 'none' : 'transform 0.15s ease-out',
          } : undefined}
          onMouseDown={depthEnabled ? handleClockDragStart : undefined}
        >
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
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4 w-[440px]">
        {/* Music Widget */}
        {isMusicOpen && currentTrack && (
          <div 
            className="w-[420px] relative overflow-hidden border border-white/20 shadow-2xl rounded-[24px] p-4 text-white flex flex-col gap-3 transition-all duration-300 backdrop-blur-xl"
            style={{
              background: "rgba(0, 0, 0, 0.2)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)"
            }}
          >

            {/* Content Container */}
            <div className="relative z-10 flex flex-col gap-4">
              {/* Top row: Centered track details & menu */}
              <div className="flex flex-col items-center text-center mt-1 px-16 relative">
                {/* Small album art on far left */}
                <img 
                  src={currentTrack?.img} 
                  alt="Album Art" 
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-14 h-14 rounded-[8px] object-cover shadow-md border border-white/10 select-none pointer-events-none" 
                />
                <span className="font-bold text-[15px] text-white tracking-wide truncate max-w-[280px] leading-snug">
                  {currentTrack?.title}
                </span>
                <span className="text-[12.5px] text-white/60 truncate max-w-[280px] mt-0.5 leading-none">
                  {currentTrack?.artist}
                </span>
                {/* Options menu on far right */}
                <button className="absolute right-0 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                    <circle cx="5" cy="12" r="1" />
                  </svg>
                </button>
              </div>

              {/* Middle row: Progress slider inline with timestamps */}
              <div className="flex items-center gap-3 px-1 mt-1">
                <span className="text-[10px] font-semibold text-white/50 w-8 text-right select-none">
                  {formatTime(currentTime)}
                </span>
                <div 
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const percentage = clickX / rect.width;
                    const audioEl = document.querySelector("audio");
                    if (audioEl && duration) {
                      audioEl.currentTime = percentage * duration;
                      setCurrentTime(percentage * duration);
                    }
                  }}
                  className="h-6 flex-1 relative flex items-center cursor-pointer group select-none"
                >
                  <style>{`
                    @keyframes squiggly-wave {
                      0% { transform: translate3d(0, 0, 0); }
                      100% { transform: translate3d(-40px, 0, 0); }
                    }
                    .animate-squiggly {
                      animation: squiggly-wave 1.2s linear infinite;
                    }
                  `}</style>
                  
                  {/* Background Track (Flat line) */}
                  <div className="absolute left-0 right-0 h-1 bg-white/20 rounded-full" />
                  
                  {/* Active Track (Squiggly when playing, flat when paused) */}
                  <div 
                    className="absolute left-0 h-4 overflow-hidden pointer-events-none flex items-center"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  >
                    {isAudioPlaying ? (
                      <div className="w-[1000px] h-4 flex-shrink-0 animate-squiggly flex items-center text-white">
                        <svg width="1000" height="16" viewBox="0 0 1000 16" fill="none" className="overflow-visible">
                          <path 
                            d="M 0 8 Q 5 2, 10 8 T 20 8 T 30 8 T 40 8 T 50 8 T 60 8 T 70 8 T 80 8 T 90 8 T 100 8 T 110 8 T 120 8 T 130 8 T 140 8 T 150 8 T 160 8 T 170 8 T 180 8 T 190 8 T 200 8 T 210 8 T 220 8 T 230 8 T 240 8 T 250 8 T 260 8 T 270 8 T 280 8 T 290 8 T 300 8 T 310 8 T 320 8 T 330 8 T 340 8 T 350 8 T 360 8 T 370 8 T 380 8 T 390 8 T 400 8 T 410 8 T 420 8 T 430 8 T 440 8 T 450 8 T 460 8 T 470 8 T 480 8 T 490 8 T 500 8 T 510 8 T 520 8 T 530 8 T 540 8 T 550 8 T 560 8 T 570 8 T 580 8 T 590 8 T 600 8 T 610 8 T 620 8 T 630 8 T 640 8 T 650 8 T 660 8 T 670 8 T 680 8 T 690 8 T 700 8 T 710 8 T 720 8 T 730 8 T 740 8 T 750 8 T 760 8 T 770 8 T 780 8 T 790 8 T 800 8 T 810 8 T 820 8 T 830 8 T 840 8 T 850 8 T 860 8 T 870 8 T 880 8 T 890 8 T 900 8 T 910 8 T 920 8 T 930 8 T 940 8 T 950 8 T 960 8 T 970 8 T 980 8 T 990 8 T 1000 8" 
                            stroke="currentColor" 
                            strokeWidth="2.5" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-[1000px] h-0.5 bg-white rounded-full" />
                    )}
                  </div>
                  
                  {/* Slider Knob */}
                  <div 
                    className="absolute w-2.5 h-2.5 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ left: `calc(${duration ? (currentTime / duration) * 100 : 0}% - 5px)` }}
                  />
                </div>
                <span className="text-[10px] font-semibold text-white/50 w-8 text-left select-none">
                  {formatRemainingTime(currentTime, duration)}
                </span>
              </div>

              {/* Bottom row: Favorite star, Playback controls, Headphones output */}
              <div className="flex items-center justify-between px-3 mt-1 mb-1">
                {/* Favorite Star Button */}
                <button className="text-white/60 hover:text-white transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </button>

                {/* Centered playback controls */}
                <div className="flex items-center gap-7">
                  <button 
                    onClick={prevTrack}
                    className="text-white hover:text-white/80 active:scale-95 transition-all"
                    title="Previous Track"
                  >
                    <BsFillSkipBackwardFill size={20} />
                  </button>

                  <button 
                    onClick={toggleAudio}
                    className="text-white hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
                    title={isAudioPlaying ? "Pause" : "Play"}
                  >
                    {isAudioPlaying ? (
                      <BsFillPauseFill size={36} />
                    ) : (
                      <BsFillPlayFill size={36} />
                    )}
                  </button>

                  <button 
                    onClick={nextTrack}
                    className="text-white hover:text-white/80 active:scale-95 transition-all"
                    title="Next Track"
                  >
                    <BsFillSkipForwardFill size={20} />
                  </button>
                </div>

                {/* Headphone Audio Output Button */}
                <button className="text-white/60 hover:text-white transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Clickable profile area (hidden when music app is open) */}
        {!isMusicOpen && (
          <div
            className="flex flex-col items-center gap-3 group cursor-pointer"
            onClick={openEditModal}
            title="Click to edit profile"
          >
            {/* Avatar */}
            <div className="relative w-16 h-16">
              <div 
                className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/30 shadow-lg group-hover:border-white/60 transition-all flex items-center justify-center"
                style={{ backgroundColor: profileBg || 'transparent' }}
              >
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
        )}

        {/* Password Entry */}
        <div className="flex flex-col items-center gap-2 w-full">
          <form 
            onSubmit={handleSubmitPassword}
            className={`relative w-48 mt-1 ${isWrongPassword ? 'shake-animation' : ''}`}
          >
            <input
              ref={passwordInputRef}
              type="password"
              placeholder="Enter Password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full h-8 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 text-white text-[13px] placeholder-white/60 outline-none focus:border-white/50 transition-all"
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