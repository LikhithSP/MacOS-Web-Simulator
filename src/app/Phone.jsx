import React, { useState } from "react";
import { useAppStore } from "../store/Appstore";
import { 
  Phone, 
  MessageSquare, 
  Video, 
  Mail, 
  Search, 
  ChevronRight, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ChevronDown, 
  Grid, 
  Delete,
  X
} from "lucide-react";

// Traffic lights component
const TrafficLights = ({ windowId }) => {
  const close = useAppStore((s) => s.closeApp);
  const minimize = useAppStore((s) => s.minimizeApp);
  const toggleMaximize = useAppStore((s) => s.toggleMaximize);
  const windows = useAppStore((s) => s.windows);
  const win = windows.find(w => w.id === windowId);
  const maximized = win ? win.maximized : false;

  return (
    <div className="flex items-center gap-2 group mr-4 shrink-0">
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

export default function PhoneApp({ windowId }) {
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  const [selectedContactId, setSelectedContactId] = useState("chris");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDialer, setShowDialer] = useState(false);
  const [dialedNumber, setDialedNumber] = useState("");
  const [rightTab, setRightTab] = useState("details"); // 'details' or 'voicemails'
  const [activeCallContact, setActiveCallContact] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const [callIntervalId, setCallIntervalId] = useState(null);

  // Helper to resolve light/dark pastel colors dynamically
  const getAvatarBg = (contact) => {
    if (!contact) return "bg-gray-200";
    const bgString = contact.avatarBg || "";
    const parts = bgString.split(" ");
    const darkPart = parts.find(p => p.startsWith("dark:bg-"));
    const lightPart = parts.find(p => !p.startsWith("dark:"));
    if (isDarkMode && darkPart) {
      return darkPart.replace("dark:", "");
    }
    return lightPart || "bg-gray-200";
  };

  const getFavBg = (fav) => {
    if (!fav) return "bg-gray-200";
    const bgString = fav.bgClass || "";
    const parts = bgString.split(" ");
    const darkPart = parts.find(p => p.startsWith("dark:bg-"));
    const lightPart = parts.find(p => !p.startsWith("dark:"));
    if (isDarkMode && darkPart) {
      return darkPart.replace("dark:", "");
    }
    return lightPart || "bg-gray-200";
  };

  // Initial Seed Contacts
  const [contacts, setContacts] = useState([
    {
      id: "chris",
      name: "Chris",
      avatar: "/icons/PngItem_4082636.png",
      avatarBg: "bg-red-100 dark:bg-red-950/60",
      device: "mobile",
      type: "mobile",
      time: "Yesterday",
      dateLabel: "Yesterday",
      isOutgoing: false,
      email: "chris@icloud.com",
      history: [
        { type: "Incoming Call", time: "Yesterday - 1:45 PM", duration: "10 mins 15 secs" }
      ]
    },
    {
      id: "guillermo",
      name: "Guillermo Castillo",
      avatar: "/icons/PngItem_6452863.png",
      avatarBg: "bg-orange-200 dark:bg-orange-950/60",
      device: "iPhone",
      type: "mobile",
      time: "9:30 AM",
      dateLabel: "Today",
      isOutgoing: true,
      email: "guillermo.c@apple.com",
      history: [
        { type: "Outgoing Call", time: "Today - 9:30 AM", duration: "31 seconds" },
        { type: "Incoming Call", time: "Yesterday - 4:15 PM", duration: "2 mins 40 secs" },
        { type: "Missed Call", time: "Monday - 11:02 AM", duration: "Missed" }
      ]
    },
    {
      id: "rigo",
      name: "Rigo Rangel",
      avatar: "/icons/PngItem_5031003.png",
      avatarBg: "bg-sky-100 dark:bg-sky-950/60",
      device: "mobile",
      type: "mobile",
      time: "Yesterday",
      dateLabel: "Yesterday",
      isOutgoing: false,
      email: "rigo.rangel@icloud.com",
      history: [
        { type: "Incoming Call", time: "Yesterday - 5:20 PM", duration: "4 mins 12 secs" },
        { type: "Outgoing Call", time: "3/28/25 - 10:15 AM", duration: "1 min 5 secs" }
      ]
    },
    {
      id: "brian",
      name: "Brian",
      avatar: "/icons/PngItem_4409921.png",
      avatarBg: "bg-amber-100 dark:bg-amber-950/60",
      device: "mobile",
      type: "mobile",
      time: "3/30/25",
      dateLabel: "3/30/25",
      isOutgoing: false,
      email: "brian@apple.com",
      history: [
        { type: "Incoming Call", time: "3/30/25 - 2:00 PM", duration: "45 seconds" }
      ]
    },
    {
      id: "mayuri",
      name: "Mayuri",
      avatar: "/icons/PngItem_4608119.png",
      avatarBg: "bg-purple-100 dark:bg-purple-950/60",
      device: "mobile",
      type: "mobile",
      time: "3/30/25",
      dateLabel: "3/30/25",
      isOutgoing: false,
      email: "mayuri@yahoo.com",
      history: [
        { type: "Incoming Call", time: "3/30/25 - 9:15 AM", duration: "1 min 22 secs" }
      ]
    },
    {
      id: "liz",
      name: "Liz Dizon",
      avatar: "/icons/PngItem_4082636.png",
      avatarBg: "bg-rose-200 dark:bg-rose-950/60",
      device: "iPhone",
      type: "mobile",
      time: "3/29/25",
      dateLabel: "3/29/25",
      isOutgoing: false,
      email: "liz.dizon@hotmail.com",
      history: [
        { type: "Incoming Call", time: "3/29/25 - 6:40 PM", duration: "5 mins 8 secs" }
      ]
    }
  ]);

  // Favourites list
  const favourites = [
    { id: "chris", name: "Chris", avatar: "/icons/PngItem_4082636.png", bgClass: "bg-red-100 dark:bg-red-950/60", iconType: "phone" },
    { id: "brian", name: "Brian", avatar: "/icons/PngItem_4409921.png", bgClass: "bg-amber-100 dark:bg-amber-950/60", iconType: "message" },
    { id: "mayuri", name: "Mayuri", avatar: "/icons/PngItem_4608119.png", bgClass: "bg-purple-100 dark:bg-purple-950/60", iconType: "message" },
    { id: "rigo_fav", name: "Rigo", avatar: "/icons/PngItem_5031003.png", bgClass: "bg-sky-100 dark:bg-sky-950/60", iconType: "video" }
  ];

  // Handle contact selection
  const handleSelectContact = (contact) => {
    setSelectedContactId(contact.id);
    setShowDialer(false);
  };

  const selectedContact = contacts.find(c => c.id === selectedContactId) || contacts[0];

  const handleDialButton = (num) => {
    setDialedNumber(prev => prev + num);
  };

  const handleBackspace = () => {
    setDialedNumber(prev => prev.slice(0, -1));
  };

  // Place mock call
  const handlePlaceCall = (contactInfo) => {
    let name = "Unknown";
    let avatar = "/icons/PngItem_5031003.png";
    let bg = "linear-gradient(135deg, #757f9a 0%, #d7dde8 100%)";

    if (contactInfo) {
      name = contactInfo.name;
      avatar = contactInfo.avatar;
      bg = contactInfo.avatarBg || "linear-gradient(135deg, #757f9a 0%, #d7dde8 100%)";
    } else if (dialedNumber) {
      name = dialedNumber;
    }

    setActiveCallContact({ name, avatar, avatarBg: bg });
    setCallDuration(0);

    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    setCallIntervalId(interval);
  };

  const handleEndCall = () => {
    if (callIntervalId) {
      clearInterval(callIntervalId);
      setCallIntervalId(null);
    }

    // Add to Recents list if call lasted > 0
    const newRecentId = "call_" + Date.now();
    const formattedDuration = `${Math.floor(callDuration / 60)}m ${callDuration % 60}s`;
    const newCallLog = {
      id: newRecentId,
      name: activeCallContact.name,
      avatar: activeCallContact.avatar,
      avatarBg: activeCallContact.avatarBg,
      device: "mobile",
      type: "mobile",
      time: "Just Now",
      dateLabel: "Today",
      isOutgoing: true,
      email: "unknown@icloud.com",
      history: [
        { type: "Outgoing Call", time: `Today - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, duration: formattedDuration }
      ]
    };

    setContacts(prev => [newCallLog, ...prev]);
    setSelectedContactId(newRecentId);
    setActiveCallContact(null);
    setDialedNumber("");
    setShowDialer(false);
  };

  // Format call duration string
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const filteredRecents = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`phone-app-container flex h-full w-full select-none text-[13px] rounded-xl overflow-hidden font-sans ${
      isDarkMode ? "bg-[#F4F4F4] text-gray-800" : "bg-[#F4F4F4] text-gray-800"
    }`} style={{ background: isDarkMode ? "#1e1e1e" : "#f5f5f7" }}>
      
      {/* ── Left Sidebar (List of Recents / Favourites) ── */}
      <aside className={`w-[340px] flex flex-col shrink-0 border-r ${
        isDarkMode ? "border-white/10 bg-[#1E1E1E]" : "border-black/5 bg-[#F6F6F6]"
      }`}>
        
        {/* Header Controls (Left) */}
        <div className="window-drag-handle h-14 flex items-center px-4 shrink-0 justify-between select-none">
          <div className="flex items-center gap-3">
            <TrafficLights windowId={windowId} />
            
            {/* Rounded Edit dropdown */}
            <button className={`flex items-center gap-1.5 px-3 py-1 border rounded-full text-[12px] font-medium shadow-xs transition ${
              isDarkMode 
                ? "border-white/10 bg-white/5 text-gray-200 hover:bg-white/10" 
                : "border-black/[0.08] bg-white text-gray-700 hover:bg-gray-50"
            }`}>
              <span>Edit</span>
              <ChevronDown size={12} className="text-gray-400" />
            </button>
            
            {/* Rounded Menu/Filter type dropdown */}
            <button className={`p-1.5 border rounded-full flex items-center justify-center shadow-xs transition ${
              isDarkMode 
                ? "border-white/10 bg-white/5 text-gray-200 hover:bg-white/10" 
                : "border-black/[0.08] bg-white text-gray-700 hover:bg-gray-50"
            }`} title="Filter Recents">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="6" y1="12" x2="18" y2="12" />
                <line x1="8" y1="18" x2="16" y2="18" />
              </svg>
              <ChevronDown size={11} className="text-gray-400 ml-0.5" />
            </button>
          </div>
        </div>

        {/* Favourites list (4 Contacts grid) */}
        <div className="px-4 py-2 grid grid-cols-4 gap-3 shrink-0">
          {favourites.map(fav => (
            <div 
              key={fav.id} 
              onClick={() => {
                const matched = contacts.find(c => c.name.toLowerCase().includes(fav.name.toLowerCase()));
                if (matched) {
                  handleSelectContact(matched);
                } else {
                  const fallback = contacts.find(c => c.id === "chris");
                  if (fallback) handleSelectContact(fallback);
                }
              }}
              className="flex flex-col items-center cursor-pointer group text-center"
            >
              <div 
                className={`relative w-[72px] h-[112px] rounded-[16px] flex items-center justify-center shadow-md p-1 overflow-hidden transition duration-150 active:scale-95 group-hover:brightness-105 ${getFavBg(fav)}`}
              >
                <img src={fav.avatar} alt={fav.name} className="w-[72px] h-[72px] object-contain mt-2" />
              </div>
              <span className={`text-[10px] font-semibold truncate w-full mt-1.5 flex items-center justify-center gap-1 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}>
                {fav.iconType === "phone" && <Phone size={10} className="stroke-[2.5]" />}
                {fav.iconType === "message" && <MessageSquare size={10} className="stroke-[2.5]" />}
                {fav.iconType === "video" && <Video size={10} className="stroke-[2.5]" />}
                <span>{fav.name}</span>
              </span>
            </div>
          ))}
        </div>

        {/* Recents list heading */}
        <div className="px-5 pt-4 pb-1 shrink-0">
          <span className={`font-extrabold text-[15px] ${isDarkMode ? "text-white" : "text-gray-900"}`}>Recents</span>
        </div>

        {/* Recents List Scrollable */}
        <div className="flex-1 overflow-y-auto px-3 pb-3" style={{ scrollbarWidth: "none" }}>
          {filteredRecents.map((recent, index) => {
            const isSelected = selectedContactId === recent.id;
            return (
              <React.Fragment key={recent.id}>
                <div 
                  onClick={() => handleSelectContact(recent)}
                  className={`flex items-center justify-between px-3.5 py-2 rounded-xl mb-0.5 cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? isDarkMode 
                        ? "bg-white/[0.12] text-white" 
                        : "bg-black/[0.08] text-gray-900"
                      : isDarkMode 
                        ? "hover:bg-white/5 text-gray-300" 
                        : "hover:bg-black/[0.03] text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div 
                      className={`w-9 h-9 rounded-full overflow-hidden flex items-center justify-center shrink-0 shadow-sm p-0.5 ${getAvatarBg(recent)}`}
                    >
                      <img src={recent.avatar} alt={recent.name} className="w-full h-full object-contain" />
                    </div>
                    
                    <div className="flex flex-col min-w-0">
                      <span className={`font-bold text-[13.5px] truncate ${
                        isSelected 
                          ? isDarkMode ? "text-white" : "text-black"
                          : isDarkMode ? "text-white" : "text-gray-900"
                      }`}>
                        {recent.name}
                      </span>
                      <div className={`flex items-center text-[10.5px] mt-0.5 ${
                        isSelected 
                          ? isDarkMode ? "text-white/80" : "text-gray-500 font-medium"
                          : "text-gray-400"
                      }`}>
                        {recent.isOutgoing ? (
                          <ArrowUpRight size={11} className="mr-0.5 text-blue-400" />
                        ) : (
                          <ArrowDownLeft size={11} className="mr-0.5 text-green-400" />
                        )}
                        <span>{recent.device}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-[11px] ${
                      isSelected 
                        ? isDarkMode ? "text-white/80" : "text-gray-600 font-medium"
                        : "text-gray-400"
                    }`}>
                      {recent.time}
                    </span>
                    
                    {/* Phone action circle */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlaceCall(recent);
                      }}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-150 active:scale-90 ${
                        isSelected 
                          ? isDarkMode ? "bg-white/20 hover:bg-white/30 text-white" : "bg-black/[0.12] hover:bg-black/[0.18] text-blue-600"
                          : isDarkMode ? "bg-white/5 hover:bg-white/10 text-blue-400" : "bg-black/[0.04] hover:bg-black/[0.08] text-blue-500"
                      }`}
                    >
                      <Phone size={12} className="fill-current" />
                    </button>
                  </div>
                </div>
                {index < filteredRecents.length - 1 && (
                  <div className="border-b border-black/[0.05] dark:border-white/[0.05] mx-3 my-0.5" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </aside>

      {/* ── Right Content Area (Unified Layout) ── */}
      <main className="flex-1 flex flex-col min-w-0 relative h-full">

        {/* Header Controls (Right) - Contains Dialpad and Search Bar */}
        <div className="window-drag-handle h-14 flex items-center px-4 shrink-0 justify-between select-none border-b border-black/[0.03] dark:border-white/[0.03]">
          <div></div> {/* Spacer to align elements to top right */}
          <div className="flex items-center gap-3">
            {/* Dialer grid Toggle */}
            <button 
              onClick={() => {
                setShowDialer(!showDialer);
                setSelectedContactId(null);
              }}
              className={`w-8 h-8 flex items-center justify-center rounded-full border transition ${
                showDialer 
                  ? "bg-blue-500 text-white border-blue-600 shadow-sm" 
                  : isDarkMode 
                    ? "border-white/10 bg-white/5 text-gray-200 hover:bg-white/10" 
                    : "border-black/[0.08] bg-white text-gray-700 hover:bg-gray-50"
              }`}
              title="Keypad Dialer"
            >
              <Grid size={16} />
            </button>

            {/* Search Input Bar at Top Right */}
            <div className={`relative flex items-center rounded-full px-3 py-1 border transition ${
              isDarkMode 
                ? "bg-white/[0.08] border-white/5 text-gray-300 focus-within:ring-1 focus-within:ring-blue-500/50" 
                : "bg-[#E5E5E7] border-transparent text-gray-600 focus-within:bg-[#E5E5E7] focus-within:ring-1 focus-within:ring-blue-500/30"
            }`} style={{ width: "280px" }}>
              <Search size={13} className="text-gray-400 mr-1.5 shrink-0" />
              <input 
                type="text" 
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-[12px] outline-none placeholder-gray-500 text-inherit"
              />
            </div>
          </div>
        </div>

        {/* If Active Call is ongoing, show overlay screen */}
        {activeCallContact ? (
          <div className="absolute inset-0 bg-[#0c0c0c] z-50 flex flex-col items-center justify-center text-white animate-fadeSlide">
            <div 
              className={`w-24 h-24 rounded-full overflow-hidden flex items-center justify-center p-1 shadow-2xl mb-4 ${getAvatarBg(activeCallContact)}`}
            >
              <img src={activeCallContact.avatar} alt="" className="w-full h-full object-contain" />
            </div>

            <h2 className="text-xl font-bold tracking-wide">{activeCallContact.name}</h2>
            <p className="text-sm text-gray-400 mt-1">{formatTime(callDuration)}</p>
            <p className="text-xs text-green-400 mt-0.5 animate-pulse">Calling...</p>

            <div className="flex items-center gap-6 mt-12">
              <button className="w-12 h-12 rounded-full bg-[#1c1c1e] hover:brightness-125 transition flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-gray-300">
                  <path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm-1 17.93V21h-2v2h6v-2h-2v-2.07A8.001 8.001 0 0 0 20 12h-2a6 6 0 0 1-12 0H4a8.001 8.001 0 0 0 7 7.93z"/>
                </svg>
              </button>

              <button 
                onClick={handleEndCall}
                className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 transition flex items-center justify-center shadow-lg active:scale-95"
              >
                <Phone size={22} className="rotate-[135deg] fill-white text-white stroke-[2.5]" />
              </button>

              <button className="w-12 h-12 rounded-full bg-[#1c1c1e] hover:brightness-125 transition flex items-center justify-center">
                <Grid size={20} className="text-gray-300" />
              </button>
            </div>
          </div>
        ) : null}

        {/* Dialer Pad Content */}
        {showDialer ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 select-none max-w-[420px] mx-auto w-full">
            <div className="w-full flex items-center justify-between mb-8 border-b border-black/10 dark:border-white/10 pb-3">
              <input 
                type="text" 
                readOnly
                placeholder="Enter Number"
                value={dialedNumber}
                className="w-full text-center text-2xl font-bold bg-transparent outline-none border-none placeholder-gray-500 tracking-wider text-inherit"
              />
              {dialedNumber && (
                <button onClick={handleBackspace} className="p-1 hover:opacity-80 transition">
                  <Delete size={20} className="text-gray-400 hover:text-red-400" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 w-full justify-items-center mb-8">
              {[
                { n: "1", s: " " }, { n: "2", s: "A B C" }, { n: "3", s: "D E F" },
                { n: "4", s: "G H I" }, { n: "5", s: "J K L" }, { n: "6", s: "M N O" },
                { n: "7", s: "P Q R S" }, { n: "8", s: "T U V" }, { n: "9", s: "W X Y Z" },
                { n: "*", s: "" }, { n: "0", s: "+" }, { n: "#", s: "" }
              ].map(key => (
                <button 
                  key={key.n}
                  onClick={() => handleDialButton(key.n)}
                  className={`w-14 h-14 rounded-full flex flex-col items-center justify-center transition active:scale-90 ${
                    isDarkMode 
                      ? "bg-white/5 hover:bg-white/10 text-white" 
                      : "bg-black/[0.04] hover:bg-black/[0.08] text-gray-800"
                  }`}
                >
                  <span className="text-lg font-semibold">{key.n}</span>
                  {key.s && <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">{key.s}</span>}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => handlePlaceCall(null)}
                disabled={!dialedNumber}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition shadow-md active:scale-95 ${
                  dialedNumber 
                    ? "bg-[#30d158] hover:bg-[#28b84b] text-white cursor-pointer" 
                    : "bg-gray-300 dark:bg-gray-700 text-gray-400 cursor-not-allowed opacity-50"
                }`}
              >
                <Phone size={22} className="fill-current" />
              </button>
              {dialedNumber && (
                <button 
                  onClick={() => setDialedNumber("")}
                  className="px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-semibold transition"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        ) : selectedContact ? (
          
          /* ── FULL SCREEN PROFILE CONTACT CARD (Takes up the rest of the height) ── */
          <div className="flex-1 p-3 flex flex-col overflow-hidden relative">
            <div 
              className={`flex-1 rounded-[16px] overflow-hidden relative flex flex-col justify-between p-6 pb-6 transition-all duration-300 shadow-xl ${getAvatarBg(selectedContact)}`}
            >
              {/* Profile Image filling upper portion (with chest torso blurred) */}
              <div className="absolute inset-0 z-0 overflow-hidden rounded-[16px]">
                <img 
                  src={selectedContact.avatar} 
                  alt="" 
                  className="absolute top-2 left-1/2 -translate-x-1/2 h-[55%] object-contain object-top select-none pointer-events-none z-0 mt-0" 
                />
                {/* Backdrop blur container selectively placed over lower half body torso */}
                <div className="absolute top-[40%] bottom-0 left-0 right-0 backdrop-blur-[6px] bg-transparent z-1" />
              </div>

              {/* Top Row: Edit (Translucent Glass Pill Button at Top Right) */}
              <div className="z-10 flex justify-end">
                <button className="bg-black/10 hover:bg-black/15 dark:bg-white/15 dark:hover:bg-white/25 border border-black/10 dark:border-white/20 text-slate-800 dark:text-white text-[12px] font-bold px-4 py-1.5 rounded-full backdrop-blur-md transition shadow-sm">
                  Edit
                </button>
              </div>

              {/* Invisible space pushes controls down */}
              <div className="flex-1 z-10"></div>

              {/* Lower Section: Name, Buttons, Tab bar, Details Card */}
              <div className="z-20 w-full flex flex-col items-center mt-auto">
                {/* Adaptive Big Contact Name */}
                <h1 className="text-slate-800 dark:text-white text-[32px] font-extrabold tracking-wide text-center drop-shadow-md select-text mb-4">
                  {selectedContact.name}
                </h1>

                {/* 4 Adaptive Glass Circle buttons */}
                <div className="flex items-center justify-center gap-5 mb-5">
                  <button className="w-11 h-11 rounded-full bg-black/10 hover:bg-black/15 dark:bg-white/15 dark:hover:bg-white/25 border border-black/10 dark:border-white/20 backdrop-blur-md text-slate-800 dark:text-white flex items-center justify-center transition-all duration-150 shadow-md active:scale-90" title="Message">
                    <MessageSquare size={18} className="fill-current text-slate-800 dark:text-white" />
                  </button>
                  <button onClick={() => handlePlaceCall(selectedContact)} className="w-11 h-11 rounded-full bg-black/10 hover:bg-black/15 dark:bg-white/15 dark:hover:bg-white/25 border border-black/10 dark:border-white/20 backdrop-blur-md text-slate-800 dark:text-white flex items-center justify-center transition-all duration-150 shadow-md active:scale-90" title="Call">
                    <Phone size={18} className="fill-current text-slate-800 dark:text-white" />
                  </button>
                  <button className="w-11 h-11 rounded-full bg-black/10 hover:bg-black/15 dark:bg-white/15 dark:hover:bg-white/25 border border-black/10 dark:border-white/20 backdrop-blur-md text-slate-800 dark:text-white flex items-center justify-center transition-all duration-150 shadow-md active:scale-90" title="FaceTime">
                    <Video size={18} className="fill-current text-slate-800 dark:text-white" />
                  </button>
                  <button className="w-11 h-11 rounded-full bg-black/10 hover:bg-black/15 dark:bg-white/15 dark:hover:bg-white/25 border border-black/10 dark:border-white/20 backdrop-blur-md text-slate-800 dark:text-white flex items-center justify-center transition-all duration-150 shadow-md active:scale-90" title="Email">
                    <Mail size={18} className="text-slate-800 dark:text-white" />
                  </button>
                </div>

                {/* Sub-menu Tabs Selection */}
                <div className="flex items-center justify-center gap-1.5 pb-2 mb-3.5 select-none">
                  <button 
                    onClick={() => setRightTab("details")}
                    className={`text-[12px] font-bold px-4 py-1 rounded-full transition-all duration-150 ${
                      rightTab === "details"
                        ? "bg-black/15 dark:bg-white/35 text-slate-800 dark:text-white shadow-xs backdrop-blur-md"
                        : "text-slate-600 dark:text-white/80 hover:text-slate-800 dark:hover:text-white"
                    }`}
                  >
                    Details
                  </button>
                  <button 
                    onClick={() => setRightTab("voicemails")}
                    className={`text-[12px] font-bold px-4 py-1 rounded-full transition-all duration-150 ${
                      rightTab === "voicemails"
                        ? "bg-black/15 dark:bg-white/35 text-slate-800 dark:text-white shadow-xs backdrop-blur-md"
                        : "text-slate-600 dark:text-white/80 hover:text-slate-800 dark:hover:text-white"
                    }`}
                  >
                    Voicemails
                  </button>
                </div>

                {/* Details Call History translucent glass card */}
                {rightTab === "details" ? (
                  <div className="w-full max-w-[460px] bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/15 backdrop-blur-md rounded-2xl p-4 text-slate-800 dark:text-white shadow-lg transition duration-200">
                    <div className="flex justify-between items-center text-[12px] font-semibold text-slate-800/90 dark:text-white/95">
                      <span>
                        {selectedContact.history[0]?.type || "Outgoing Call"}
                      </span>
                      <span className="text-slate-600 dark:text-white/80">
                        {selectedContact.history[0]?.time.split(" - ")[0] || "Today"} - {selectedContact.history[0]?.time.split(" - ")[1] || "9:30 AM"}
                      </span>
                    </div>
                    
                    <div className="text-[15px] font-bold mt-1 text-slate-900 dark:text-white">
                      {selectedContact.history[0]?.duration || "31 seconds"}
                    </div>

                    <div className="my-3.5 border-t border-black/5 dark:border-white/10" />

                    <div className="pt-0.5 flex items-center justify-between cursor-pointer group select-none text-slate-800 dark:text-white/90 hover:text-slate-900 dark:hover:text-white">
                      <span className="text-xs font-semibold">Call History</span>
                      <ChevronRight size={14} className="text-slate-600 dark:text-white/80 group-hover:text-slate-900 group-hover:dark:text-white transition" />
                    </div>
                  </div>
                ) : (
                  <div className="w-full max-w-[460px] bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/10 backdrop-blur-md rounded-2xl p-6 text-center text-slate-700 dark:text-white/70">
                    <span className="text-xs font-semibold">No Voicemails</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 select-none">
            <Phone size={42} className="stroke-[1.5] mb-3 text-gray-500" />
            <h3 className="text-sm font-semibold">Select a contact</h3>
            <p className="text-xs text-gray-500 mt-1">Select a contact from recents to view caller details.</p>
          </div>
        )}
      </main>
    </div>
  );
}
