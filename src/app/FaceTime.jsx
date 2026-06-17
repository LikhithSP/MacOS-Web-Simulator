import React, { useState, useEffect, useRef } from "react";
import { useAppStore } from "../store/Appstore";
import { Video, Phone, Users, Sliders, Menu, ArrowUpRight, Camera } from "lucide-react";

// Custom sidebar menu icon (descending line lengths)
const CustomMenuIcon = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="6" y1="12" x2="18" y2="12" />
    <line x1="8" y1="18" x2="16" y2="18" />
  </svg>
);

// Traffic lights component inside FaceTime Sidebar
const TrafficLights = ({ windowId }) => {
  const close = useAppStore((s) => s.closeApp);
  const minimize = useAppStore((s) => s.minimizeApp);
  const toggleMaximize = useAppStore((s) => s.toggleMaximize);
  const windows = useAppStore((s) => s.windows);
  const win = windows.find(w => w.id === windowId);
  const maximized = win ? win.maximized : false;

  return (
    <div className="flex items-center gap-2 group shrink-0">
      <div
        className="w-3 h-3 bg-[#ff5f57] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#ff4136] transition-all duration-150 shadow-sm"
        onClick={() => close(windowId)}
        title="Close"
      >
        <svg className="w-1.5 h-1.5 text-[#820005] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
          <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <div
        className="w-3 h-3 bg-[#febc2e] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#ff9500] transition-all duration-150 shadow-sm"
        onClick={() => minimize(windowId)}
        title="Minimize"
      >
        <svg className="w-1.5 h-1.5 text-[#9a6400] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
          <path d="M1 5H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <div
        className="w-3 h-3 bg-[#28c840] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#1aab29] transition-all duration-150 shadow-sm"
        onClick={() => toggleMaximize(windowId)}
        title={maximized ? "Restore" : "Maximize"}
      >
        <svg className="w-1.5 h-1.5 text-[#006500] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
          {maximized ? (
            <>
              <rect x="1.5" y="3.5" width="5" height="5" fill="none" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M3.5 3.5V1.5H8.5V6.5H6.5" fill="none" stroke="currentColor" strokeWidth="1.2"/>
            </>
          ) : (
            <>
              <path d="M1 1L4 4M1 1V3.5M1 1H3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M9 9L6 6M9 9V6.5M9 9H6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </>
          )}
        </svg>
      </div>
    </div>
  );
};

export default function FaceTime({ windowId }) {
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hasWebcam, setHasWebcam] = useState(false);
  const [activeCall, setActiveCall] = useState(null);
  const videoRef = useRef(null);

  const startCall = (contact) => {
    setActiveCall(contact);
    setIsSidebarOpen(false);
  };

  const endCall = () => {
    setActiveCall(null);
    setIsSidebarOpen(true);
  };

  // Try to bind Webcam
  useEffect(() => {
    let activeStream = null;
    let isMounted = true;

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then((stream) => {
        if (!isMounted) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          activeStream = stream;
          setHasWebcam(true);
        }
      })
      .catch((err) => {
        console.log("Webcam not available:", err.message);
        if (isMounted) setHasWebcam(false);
      });

    return () => {
      isMounted = false;
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const contacts = [
    {
      id: "trev",
      name: "Trev",
      avatar: "/icons/PngItem_5031003.png",
      sub: "Suggested",
      type: "audio",
      avatarBg: "#c7d5f5",
      bgLight: "bg-slate-200/40 hover:bg-slate-200/60",
      bgDark: "bg-slate-800/45 hover:bg-slate-800/65"
    },
    {
      id: "christian",
      name: "Christian",
      avatar: "/icons/PngItem_4082636.png",
      sub: "Video 9:39 AM",
      type: "video",
      avatarBg: "#f5c7c7",
      bgLight: "bg-rose-200/40 hover:bg-rose-200/60",
      bgDark: "bg-rose-900/20 hover:bg-rose-900/40"
    },
    {
      id: "andre",
      name: "Andre",
      avatar: "/icons/PngItem_4608119.png",
      sub: "Video 9:20 AM",
      type: "video",
      avatarBg: "#c7e6f5",
      bgLight: "bg-sky-200/40 hover:bg-sky-200/60",
      bgDark: "bg-sky-900/20 hover:bg-sky-900/40"
    },
    {
      id: "brian",
      name: "Brian",
      avatar: "/icons/PngItem_4409921.png",
      sub: "Audio Yesterday",
      type: "audio",
      avatarBg: "#c7f5db",
      bgLight: "bg-emerald-200/35 hover:bg-emerald-200/55",
      bgDark: "bg-emerald-900/15 hover:bg-emerald-900/35"
    },
    {
      id: "will",
      name: "Will",
      avatar: "/icons/PngItem_6304991.png",
      sub: "Suggested",
      type: "audio",
      avatarBg: "#d5c7f5",
      bgLight: "bg-zinc-200/40 hover:bg-zinc-200/60",
      bgDark: "bg-zinc-800/45 hover:bg-zinc-800/65"
    },
    {
      id: "guillermo",
      name: "Guillermo Castillo,...",
      avatar: "/icons/PngItem_6452863.png",
      sub: "Suggested",
      type: "video",
      isGroup: true,
      avatarBg: "#f5e4c7",
      bgLight: "bg-amber-200/35 hover:bg-amber-200/55",
      bgDark: "bg-amber-900/15 hover:bg-amber-900/35"
    }
  ];

  return (
    <div className="facetime-container w-full h-full select-none text-[13px] rounded-xl overflow-hidden font-sans bg-[#121212] text-white relative">
      
      {/* 1. Left Sidebar (FaceTime Contacts Feed) */}
      {isSidebarOpen && (
        <aside
          className={`absolute left-5 top-5 bottom-5 w-[280px] z-10 flex flex-col rounded-3xl overflow-hidden transition-all duration-300 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
          style={{
            backdropFilter: "blur(40px) saturate(180%)",
            WebkitBackdropFilter: "blur(40px) saturate(180%)",
            background: isDarkMode
              ? "linear-gradient(160deg, rgba(28,28,30,0.82) 0%, rgba(20,20,22,0.88) 100%)"
              : "linear-gradient(160deg, rgba(255,255,255,0.88) 0%, rgba(245,245,247,0.82) 100%)",
            border: isDarkMode
              ? "1px solid rgba(255,255,255,0.10)"
              : "1px solid rgba(255,255,255,0.90)",
            boxShadow: isDarkMode
              ? "0 8px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)"
              : "0 8px 32px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,1.0)",
          }}
        >
          {/* Header Controls */}
          <div className="window-drag-handle p-4 pb-2 shrink-0 flex items-center justify-between">
            {/* Left: Traffic lights only */}
            <TrafficLights windowId={windowId} />

            {/* Right: Hide sidebar + New button */}
            <div className="flex items-center gap-2">
              <button
                className={`p-1.5 rounded-lg transition flex items-center justify-center ${
                  isDarkMode ? "hover:bg-white/10 text-gray-300" : "hover:bg-black/5 text-gray-600"
                }`}
              >
                <CustomMenuIcon size={16} />
              </button>

              {/* New FaceTime call button — pill shape */}
              <button className="bg-[#00D166] text-white hover:bg-[#00B155] active:scale-95 px-3 py-1.5 rounded-full font-semibold flex items-center gap-1.5 transition text-[12.5px]">
                <Video size={13} className="fill-white/10" />
                <span>New</span>
              </button>
            </div>
          </div>

          {/* Contacts List Grid */}
          <div className="flex-1 overflow-y-auto px-3 py-2 notes-no-scrollbar" style={{ scrollbarWidth: "none" }}>
            <div className="grid grid-cols-2 gap-2.5">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => startCall(contact)}
                  className={`rounded-[18px] flex flex-col h-[175px] transition-all duration-200 cursor-pointer relative group overflow-hidden ${
                    isDarkMode
                      ? `${contact.bgDark} text-white`
                      : `${contact.bgLight} text-gray-900`
                  }`}
                >
                  {/* Top: Name */}
                  <div className="px-3 pt-3 pb-1 shrink-0">
                    <span className={`font-semibold text-[12px] truncate block ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      {contact.name}
                    </span>
                  </div>

                  {/* Center: Large Avatar */}
                  <div className="flex-1 flex items-center justify-center py-1">
                    <div
                      className="w-[78px] h-[78px] rounded-full overflow-hidden flex items-center justify-center shadow-md"
                      style={{ backgroundColor: contact.avatarBg }}
                    >
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="w-[68px] h-[68px] object-contain"
                      />
                    </div>
                  </div>

                  {/* Bottom: call info + icon */}
                  <div className="px-3 pb-3 shrink-0 flex items-center justify-between gap-1">
                    {contact.sub === "Suggested" ? (
                      /* Suggested layout — no arrow, just label */
                      <>
                        <span className={`text-[10px] font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                          Suggested
                        </span>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition ${
                          isDarkMode
                            ? "bg-white/10 group-hover:bg-white/20 text-white"
                            : "bg-black/8 group-hover:bg-black/14 text-gray-700"
                        }`}>
                          {contact.type === "video" ? <Video size={15} /> : <Phone size={15} />}
                        </div>
                      </>
                    ) : (
                      /* Recent call layout — arrow + type + time */
                      <>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-0.5">
                            <ArrowUpRight size={11} className={`shrink-0 ${
                              contact.type === "video" ? "text-[#00D166]" : isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`} />
                            <span className={`text-[10px] font-medium truncate ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                              {contact.type === "video" ? "Video" : "Audio"}
                            </span>
                          </div>
                          <span className={`text-[10px] truncate leading-tight ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                            {contact.sub.replace("Video ", "").replace("Audio ", "")}
                          </span>
                        </div>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition ${
                          isDarkMode
                            ? "bg-white/10 group-hover:bg-white/20 text-white"
                            : "bg-black/8 group-hover:bg-black/14 text-gray-700"
                        }`}>
                          {contact.type === "video" ? <Video size={15} /> : <Phone size={15} />}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      )}

      {/* 2. Main FaceTime Call Screen Viewer */}
      <section className="window-drag-handle absolute inset-0 w-full h-full z-0 overflow-hidden bg-black flex items-center justify-center">

        {/* Video Frame — always visible */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`window-drag-handle w-full h-full object-cover transform scale-x-[-1] absolute inset-0 ${
            hasWebcam ? "block" : "hidden"
          }`}
        />

        {/* Fallback Camera Off Screen — Apple FaceTime style */}
        {!hasWebcam && (
          <div className={`window-drag-handle absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10 ${
            isDarkMode ? "bg-black" : "bg-[#f2f2f7]"
          }`}>
            <div className="w-[72px] h-[72px] rounded-[18px] flex items-center justify-center mb-5 shadow-2xl"
              style={{ backgroundColor: "#1bc85a" }}
            >
              <svg viewBox="0 0 24 24" className="w-9 h-9" fill="white">
                <path d="M2 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1.5l4.5-2.25A.5.5 0 0 1 21 7.75v8.5a.5.5 0 0 1-.72.45L16 14.5V16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8z"/>
              </svg>
            </div>
            <h2 className={`text-[17px] font-semibold mb-1.5 tracking-tight ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}>Camera Off</h2>
            <p className={`text-[13px] leading-snug max-w-[200px] ${
              isDarkMode ? "text-white/45" : "text-gray-400"
            }`}>Allow browser camera access to start using FaceTime.</p>
          </div>
        )}

        {/* Always visible Top-right controls: Portrait, Aperture, and optionally Show Contacts */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          {/* Portrait Mode Button */}
          <button
            className={`w-8 h-8 rounded-full active:scale-95 transition flex items-center justify-center shadow ${
              isDarkMode ? "text-white" : "text-gray-700"
            }`}
            style={{
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              background: isDarkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.8)",
              border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.08)",
            }}
            title="Portrait Mode"
          >
            <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <circle cx="12" cy="12" r="9" strokeDasharray="2 2" opacity="0.4" />
              <path d="M6 9h12M6 12h12M6 15h12" strokeDasharray="1.5 2.5" opacity="0.4" />
              <path d="M9 6v12M12 6v12M15 6v12" strokeDasharray="1.5 2.5" opacity="0.4" />
              <circle cx="12" cy="9.5" r="2.5" />
              <path d="M17 17a5 5 0 0 0-10 0" />
            </svg>
          </button>

          {/* ƒ Aperture Button */}
          <button
            className={`w-8 h-8 rounded-full active:scale-95 transition flex items-center justify-center shadow ${
              isDarkMode ? "text-white" : "text-gray-700"
            }`}
            style={{
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              background: isDarkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.8)",
              border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.08)",
            }}
            title="Aperture (f-stop)"
          >
            <span className="font-serif italic text-[16px] font-medium select-none mt-[-2px]">ƒ</span>
          </button>

          {/* Show Contacts Menu Button — only when sidebar is hidden */}
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={`w-8 h-8 rounded-full active:scale-95 transition flex items-center justify-center shadow ${
                isDarkMode ? "text-white" : "text-gray-700"
              }`}
              style={{
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                background: isDarkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.8)",
                border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.08)",
              }}
              title="Show Contacts"
            >
              <CustomMenuIcon size={14} />
            </button>
          )}
        </div>

        {/* ── When sidebar is hidden and in a call: full in-call chrome ── */}
        {!isSidebarOpen && activeCall && (
          <>
            {/* Top-left: traffic lights + caller name pill */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <TrafficLights windowId={windowId} />
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold transition shadow-sm ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
                style={{
                  backdropFilter: "blur(20px) saturate(180%)",
                  WebkitBackdropFilter: "blur(20px) saturate(180%)",
                  background: isDarkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.8)",
                  border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.08)",
                }}
              >
                <div
                  className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center shrink-0"
                  style={{ backgroundColor: activeCall.avatarBg }}
                >
                  <img src={activeCall.avatar} alt={activeCall.name} className="w-full h-full object-contain" />
                </div>
                <span>{activeCall.name}</span>
                <svg className={`w-3 h-3 ml-0.5 ${isDarkMode ? "text-white/60" : "text-gray-800/60"}`} viewBox="0 0 10 10" fill="none">
                  <path d="M2.5 4L5 6.5L7.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Bottom-left: PiP — active contact's memoji */}
            <div
              className="absolute bottom-5 left-4 z-20 w-[20%] min-w-[90px] max-w-[180px] rounded-2xl overflow-hidden border border-white/20 shadow-xl"
              style={{ backgroundColor: activeCall?.avatarBg || "#c7d5f5", aspectRatio: "1.6" }}
            >
              <img
                src={activeCall?.avatar || "/icons/PngItem_5031003.png"}
                alt={activeCall?.name || "Contact"}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Bottom-right: individual floating control circles */}
            <div className="absolute bottom-5 right-5 z-20 flex items-center gap-2">
              {/* Video camera — theme bg */}
              <button
                className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition active:scale-90 hover:brightness-105 ${
                  isDarkMode ? "bg-[#1c1c1e]" : "bg-white"
                }`}
              >
                <svg viewBox="0 0 24 24" className="w-[15px] h-[15px]" fill="#30d158">
                  <path d="M2 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1.5l4.5-2.25A.5.5 0 0 1 21 7.75v8.5a.5.5 0 0 1-.5.5.5.5 0 0 1-.22-.05L16 14.5V16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8z"/>
                </svg>
              </button>

              {/* Mic — theme bg */}
              <button
                className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition active:scale-90 hover:brightness-105 ${
                  isDarkMode ? "bg-[#1c1c1e]" : "bg-white"
                }`}
              >
                <svg viewBox="0 0 24 24" className="w-[15px] h-[15px]" fill="#ff9f0a">
                  <path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm-1 17.93V21h-2v2h6v-2h-2v-2.07A8.001 8.001 0 0 0 20 12h-2a6 6 0 0 1-12 0H4a8.001 8.001 0 0 0 7 7.93z"/>
                </svg>
              </button>

              {/* More — liquid glass */}
              <button
                className="w-9 h-9 rounded-full flex items-center justify-center shadow-md transition active:scale-90"
                style={{
                  backdropFilter: "blur(20px) saturate(180%)",
                  WebkitBackdropFilter: "blur(20px) saturate(180%)",
                  background: isDarkMode
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(255,255,255,0.45)",
                  border: "1px solid rgba(255,255,255,0.30)",
                  color: isDarkMode ? "white" : "#1c1c1e",
                }}
              >
                <svg viewBox="0 0 24 24" className="w-[15px] h-[15px]" fill="currentColor">
                  <circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>
                </svg>
              </button>

              {/* End call — red */}
              <button
                onClick={endCall}
                className="w-9 h-9 rounded-full bg-[#ff3b30] hover:brightness-110 flex items-center justify-center text-white shadow-md transition active:scale-90"
              >
                <svg viewBox="0 0 24 24" className="w-[15px] h-[15px] fill-white">
                  <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
                </svg>
              </button>
            </div>
          </>
        )}

      </section>

    </div>
  );
}
