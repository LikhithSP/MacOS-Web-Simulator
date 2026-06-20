import React, { useState, useEffect } from "react";
import { useAppStore } from "../store/Appstore";
import { 
  MessageSquare, 
  Phone, 
  Video, 
  Mail, 
  Search, 
  Plus, 
  ChevronRight, 
  X,
  Check,
  MapPin,
  Calendar
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

const defaultContacts = [
  {
    id: "antonio",
    firstName: "Antonio",
    lastName: "Manriquez",
    avatar: "/icons/PngItem_6452863.png",
    avatarBg: "bg-orange-100 dark:bg-orange-950/40",
    gradient: "from-[#ff9f0a]/80 to-[#ff3b30]/80",
    phone: "(919) 555-0192",
    email: "antonio.m@icloud.com",
    workEmail: "amanriquez@trioceramics.com",
    address: "124 Market St, San Francisco CA 94102",
    birthday: "Jan 12",
    notes: "Met at the ceramics workshop."
  },
  {
    id: "magico",
    firstName: "Magico",
    lastName: "Martinez",
    avatar: "/icons/PngItem_5031003.png",
    avatarBg: "bg-emerald-100 dark:bg-emerald-950/40",
    gradient: "from-[#30d158]/80 to-[#116928]/80",
    phone: "(919) 555-0143",
    email: "magico.m@icloud.com",
    workEmail: "mmartinez@apple.com",
    address: "455 Cupertino Way, Cupertino CA 95014",
    birthday: "Mar 05",
    notes: "App designer."
  },
  {
    id: "graham",
    firstName: "Graham",
    lastName: "McBride",
    avatar: "/icons/PngItem_4409921.png",
    avatarBg: "bg-purple-100 dark:bg-purple-950/40",
    gradient: "from-[#bf5af2]/80 to-[#5e5ce6]/80",
    phone: "(919) 555-0177",
    email: "graham@icloud.com",
    workEmail: "gmcbride@trioceramics.com",
    address: "789 Pine St, Seattle WA 98101",
    birthday: "Jul 19",
    notes: "Exhibition art coordinator."
  },
  {
    id: "jay",
    firstName: "Jay",
    lastName: "Mung",
    avatar: "/icons/PngItem_4608119.png",
    avatarBg: "bg-sky-100 dark:bg-sky-950/40",
    gradient: "from-[#0a84ff]/80 to-[#0040dd]/80",
    phone: "(919) 555-0128",
    email: "jay.mung@icloud.com",
    workEmail: "jmung@trioceramics.com",
    address: "321 Oak Ave, Portland OR 97201",
    birthday: "Nov 02",
    notes: "Monstera collector."
  },
  {
    id: "sarah",
    firstName: "Sarah",
    lastName: "Murguia",
    avatar: "/icons/PngItem_4082636.png",
    avatarBg: "bg-pink-100 dark:bg-pink-950/40",
    gradient: "from-[#e46e88] to-[#993b50]",
    phone: "(919) 555-2481",
    email: "SarMurguia@icloud.com",
    workEmail: "hello@trioceramics.com",
    address: "2399 Elm St, Raleigh NC 27601",
    birthday: "Sep 21",
    notes: "Lead ceramic designer."
  },
  {
    id: "ryan",
    firstName: "Ryan",
    lastName: "Notch",
    avatar: "/icons/PngItem_5031003.png",
    avatarBg: "bg-blue-100 dark:bg-blue-950/40",
    gradient: "from-[#64d2ff]/80 to-[#0a84ff]/80",
    phone: "(919) 555-0185",
    email: "ryan.notch@icloud.com",
    workEmail: "rnotch@trioceramics.com",
    address: "567 Birch Rd, Asheville NC 28801",
    birthday: "May 14",
    notes: "Monstera delivery coordinator."
  },
  {
    id: "aga",
    firstName: "Aga",
    lastName: "Orlova",
    avatar: "/icons/PngItem_4608119.png",
    avatarBg: "bg-rose-100 dark:bg-rose-950/40",
    gradient: "from-[#ff6482]/80 to-[#ff2d55]/80",
    phone: "(919) 555-0133",
    email: "aga.orlova@icloud.com",
    workEmail: "aorlova@trioceramics.com",
    address: "890 Spruce St, Denver CO 80202",
    birthday: "Dec 30",
    notes: "Photographer."
  },
  {
    id: "mayuri",
    firstName: "Mayuri",
    lastName: "Patel",
    avatar: "/icons/PngItem_4082636.png",
    avatarBg: "bg-amber-100 dark:bg-amber-950/40",
    gradient: "from-[#ffd60a]/80 to-[#ff9f0a]/80",
    phone: "(919) 555-0144",
    email: "mayuri.patel@icloud.com",
    workEmail: "mpatel@trioceramics.com",
    address: "432 Cedar Ln, Raleigh NC 27603",
    birthday: "Oct 08",
    notes: "Monstera layout planner."
  }
];

const gradientOptions = [
  { name: "Pink/Rose", value: "from-[#e46e88] to-[#993b50]" },
  { name: "Orange/Red", value: "from-[#ff9f0a]/80 to-[#ff3b30]/80" },
  { name: "Green/Dark Green", value: "from-[#30d158]/80 to-[#116928]/80" },
  { name: "Purple/Indigo", value: "from-[#bf5af2]/80 to-[#5e5ce6]/80" },
  { name: "Sky/Blue", value: "from-[#0a84ff]/80 to-[#0040dd]/80" },
  { name: "Teal/Aqua", value: "from-[#64d2ff]/80 to-[#0a84ff]/80" },
  { name: "Gold/Amber", value: "from-[#ffd60a]/80 to-[#ff9f0a]/80" }
];

export default function ContactsApp({ windowId }) {
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  
  const [contacts, setContacts] = useState(() => {
    const saved = localStorage.getItem("os_contacts");
    return saved ? JSON.parse(saved) : defaultContacts;
  });

  const [selectedId, setSelectedId] = useState("graham");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Modal states for Create/Edit
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' or 'edit'
  
  // Field states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [address, setAddress] = useState("");
  const [birthday, setBirthday] = useState("");
  const [notesField, setNotesField] = useState("");
  const [gradient, setGradient] = useState(gradientOptions[0].value);

  useEffect(() => {
    localStorage.setItem("os_contacts", JSON.stringify(contacts));
  }, [contacts]);

  // Filter contacts by search
  const filteredContacts = contacts.filter(c => {
    const full = `${c.firstName} ${c.lastName}`.toLowerCase();
    return full.includes(searchQuery.toLowerCase()) || 
           c.phone.includes(searchQuery) || 
           c.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Group filtered contacts by last name's first letter alphabetically
  const groupedContacts = filteredContacts.reduce((groups, contact) => {
    const firstLetter = (contact.lastName || "Unknown").charAt(0).toUpperCase();
    if (!groups[firstLetter]) {
      groups[firstLetter] = [];
    }
    groups[firstLetter].push(contact);
    return groups;
  }, {});

  // Sort groups and items alphabetically
  const sortedKeys = Object.keys(groupedContacts).sort();
  sortedKeys.forEach(k => {
    groupedContacts[k].sort((a, b) => a.lastName.localeCompare(b.lastName));
  });

  const activeContact = contacts.find(c => c.id === selectedId) || contacts[0];

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setFirstName("");
    setLastName("");
    setPhone("");
    setEmail("");
    setWorkEmail("");
    setAddress("");
    setBirthday("");
    setNotesField("");
    setGradient(gradientOptions[0].value);
    setShowModal(true);
  };

  const handleOpenEditModal = () => {
    if (!activeContact) return;
    setModalMode("edit");
    setFirstName(activeContact.firstName || "");
    setLastName(activeContact.lastName || "");
    setPhone(activeContact.phone || "");
    setEmail(activeContact.email || "");
    setWorkEmail(activeContact.workEmail || "");
    setAddress(activeContact.address || "");
    setBirthday(activeContact.birthday || "");
    setNotesField(activeContact.notes || "");
    setGradient(activeContact.gradient || gradientOptions[0].value);
    setShowModal(true);
  };

  const handleSaveContact = (e) => {
    e.preventDefault();
    if (modalMode === "create") {
      const newContact = {
        id: `contact_${Date.now()}`,
        firstName,
        lastName,
        avatar: "/icons/PngItem_4082636.png", // default memoji
        avatarBg: "bg-blue-100 dark:bg-blue-950/40",
        gradient,
        phone,
        email,
        workEmail,
        address,
        birthday,
        notes: notesField
      };
      setContacts(prev => [...prev, newContact]);
      setSelectedId(newContact.id);
    } else {
      setContacts(prev => prev.map(c => c.id === activeContact.id ? {
        ...c,
        firstName,
        lastName,
        gradient,
        phone,
        email,
        workEmail,
        address,
        birthday,
        notes: notesField
      } : c));
    }
    setShowModal(false);
  };

  const handleDeleteContact = () => {
    if (!activeContact) return;
    if (confirm(`Are you sure you want to delete ${activeContact.firstName} ${activeContact.lastName}?`)) {
      setContacts(prev => prev.filter(c => c.id !== activeContact.id));
      setShowModal(false);
      setSelectedId(null);
    }
  };

  const resolveAvatarBg = (contact) => {
    if (!contact) return "bg-gray-100";
    const bgString = contact.avatarBg || "";
    const parts = bgString.split(" ");
    const darkPart = parts.find(p => p.startsWith("dark:bg-"));
    const lightPart = parts.find(p => !p.startsWith("dark:"));
    if (isDarkMode && darkPart) {
      return darkPart.replace("dark:", "");
    }
    return lightPart || "bg-gray-200";
  };

  return (
    <div className={`flex h-full w-full select-none text-[13px] font-sans rounded-b-xl overflow-hidden ${
      isDarkMode ? "bg-[#1E1E1E] text-white" : "bg-white text-gray-800"
    }`}>
      
      {/* ── 1. Sidebar Panel (Split Layout Left) ── */}
      {isSidebarOpen && (
        <aside className={`w-[50%] flex flex-col shrink-0 border-r ${
          isDarkMode ? "border-white/10 bg-[#1E1E1E]" : "border-black/[0.08] bg-[#F6F6F6]"
        }`}>
          {/* Header Controls (Left) */}
          <div className="window-drag-handle h-12 flex items-center px-4 shrink-0 select-none">
            <TrafficLights windowId={windowId} />
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className={`p-1.5 rounded-full flex items-center justify-center border transition ${
                isDarkMode ? "hover:bg-white/5 border-white/5 text-gray-400" : "hover:bg-black/5 border-black/[0.05] text-gray-600"
              }`}
              title="Hide Sidebar"
            >
              <svg width="15" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" y="0.5" width="17" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.2" />
                <line x1="5.5" y1="0.5" x2="5.5" y2="14.5" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
          </div>

          {/* Contact scroll list */}
          <div className="flex-1 overflow-y-auto px-2 pb-4 notes-no-scrollbar" style={{ scrollbarWidth: "none" }}>
            {sortedKeys.map(key => (
              <div key={key} className="mb-4">
                <div className="px-3 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{key}</div>
                <div className="mt-0.5 space-y-0.5">
                  {groupedContacts[key].map(contact => {
                    const isSelected = activeContact?.id === contact.id;
                    return (
                      <div
                        key={contact.id}
                        onClick={() => setSelectedId(contact.id)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition ${
                          isSelected 
                            ? "bg-[#007AFF] text-white shadow-2xs" 
                            : isDarkMode ? "hover:bg-white/5 text-gray-300" : "hover:bg-black/[0.03] text-gray-700"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full overflow-hidden flex items-center justify-center shrink-0 shadow-3xs p-0.5 ${resolveAvatarBg(contact)}`}>
                          <img src={contact.avatar} alt="" className="w-full h-full object-contain" />
                        </div>
                        <span className={`text-[13px] truncate ${isSelected ? "text-white" : isDarkMode ? "text-white" : "text-gray-900"}`}>
                          {contact.firstName} <span className="font-semibold">{contact.lastName}</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            {filteredContacts.length === 0 && (
              <div className="text-center text-gray-400 mt-10">No Contacts Found</div>
            )}
          </div>
        </aside>
      )}

      {/* ── 2. Main Right Details Area ── */}
      <main className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden">
        
        {/* Header toolbar */}
        <div className={`window-drag-handle h-12 border-b flex items-center justify-between px-6 shrink-0 select-none ${
          isDarkMode ? "border-white/10 bg-[#1E1E1E]" : "border-black/[0.08] bg-[#F6F6F6]"
        }`}>
          {/* Left: Sidebar restore toggle and Traffic Lights */}
          <div className="flex items-center gap-2">
            {!isSidebarOpen && (
              <>
                <TrafficLights windowId={windowId} />
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className={`p-1.5 rounded-full flex items-center justify-center border transition ${
                    isDarkMode ? "hover:bg-white/5 border-white/5 text-gray-400" : "hover:bg-black/5 border-black/[0.05] text-gray-600"
                  }`}
                  title="Show Sidebar"
                >
                  <svg width="15" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.5" y="0.5" width="17" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.2" />
                    <line x1="5.5" y1="0.5" x2="5.5" y2="14.5" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Right: Actions and Search Input Bar */}
          <div className="flex items-center gap-2 relative">
            {/* Edit Button */}
            {activeContact && (
              <button 
                onClick={handleOpenEditModal}
                className={`px-3.5 py-1 text-[11px] font-semibold border rounded-full transition ${
                  isDarkMode 
                    ? "border-white/10 bg-white/5 hover:bg-white/10 text-white" 
                    : "border-black/[0.08] bg-white hover:bg-gray-50 text-gray-700 shadow-2xs"
                }`}
              >
                Edit
              </button>
            )}

            {/* Create Contact Button */}
            <button 
              onClick={handleOpenCreateModal}
              className={`w-7 h-7 rounded-full flex items-center justify-center border transition ${
                isDarkMode 
                  ? "border-white/10 bg-white/5 hover:bg-white/10 text-white" 
                  : "border-black/[0.08] bg-white hover:bg-gray-50 text-gray-700 shadow-2xs"
              }`}
              title="Add Contact"
            >
              <Plus size={14} />
            </button>

            {/* Search input bar */}
            <div className={`relative flex items-center rounded-full px-3 py-1 border transition ${
              isDarkMode 
                ? "bg-white/[0.08] border-white/5 text-gray-300 focus-within:ring-1 focus-within:ring-blue-500/50" 
                : "bg-[#E5E5E7] border-transparent text-gray-600 focus-within:bg-[#E5E5E7] focus-within:ring-1 focus-within:ring-blue-500/30"
            }`} style={{ width: "220px" }}>
              <Search size={13} className="text-gray-400 mr-1.5 shrink-0" />
              <input 
                type="text" 
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-[11px] outline-none placeholder-gray-500 text-inherit"
              />
            </div>
          </div>
        </div>

        {/* Contact details view */}
        <div className="flex-1 p-3 flex flex-col overflow-hidden relative">
          {activeContact ? (
            <div 
              className={`flex-1 rounded-[16px] overflow-hidden relative flex flex-col justify-between p-6 pb-6 shadow-xl transition-all duration-300 ${resolveAvatarBg(activeContact)} text-slate-800 dark:text-white`}
            >
              {/* Top Section Profile name & Memoji */}
              <div className="z-10 flex flex-col items-center pt-6 shrink-0">
                <div className="w-28 h-28 rounded-full overflow-hidden flex items-center justify-center p-1.5 shadow-2xl mb-4 bg-black/5 dark:bg-white/20 backdrop-blur-md">
                  <img src={activeContact.avatar} alt="" className="w-full h-full object-contain" />
                </div>
                
                <h1 className="text-slate-800 dark:text-white text-[32px] font-bold tracking-wide text-center drop-shadow-md select-text mb-4">
                  {activeContact.firstName} {activeContact.lastName}
                </h1>

                {/* 4 circle glass utility action buttons */}
                <div className="flex items-center justify-center gap-4 mb-2">
                  <button className="w-10 h-10 rounded-full bg-black/10 hover:bg-black/15 dark:bg-white/15 dark:hover:bg-white/25 border border-black/10 dark:border-white/20 backdrop-blur-md text-slate-800 dark:text-white flex items-center justify-center transition shadow-md active:scale-95" title="Message">
                    <MessageSquare size={16} className="fill-current text-slate-800 dark:text-white" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-black/10 hover:bg-black/15 dark:bg-white/15 dark:hover:bg-white/25 border border-black/10 dark:border-white/20 backdrop-blur-md text-slate-800 dark:text-white flex items-center justify-center transition shadow-md active:scale-95" title="Call">
                    <Phone size={16} className="fill-current text-slate-800 dark:text-white" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-black/10 hover:bg-black/15 dark:bg-white/15 dark:hover:bg-white/25 border border-black/10 dark:border-white/20 backdrop-blur-md text-slate-800 dark:text-white flex items-center justify-center transition shadow-md active:scale-95" title="FaceTime">
                    <Video size={16} className="fill-current text-slate-800 dark:text-white" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-black/10 hover:bg-black/15 dark:bg-white/15 dark:hover:bg-white/25 border border-black/10 dark:border-white/20 backdrop-blur-md text-slate-800 dark:text-white flex items-center justify-center transition shadow-md active:scale-95" title="Email">
                    <Mail size={16} className="text-slate-800 dark:text-white" />
                  </button>
                </div>
              </div>

              {/* Details sections listed below (Scrollable) */}
              <div className="z-10 flex-1 overflow-y-auto notes-no-scrollbar mt-4 pr-1 flex flex-col gap-3" style={{ scrollbarWidth: "none" }}>
                {/* Poster Navigation bar */}
                <div className="w-full bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/15 backdrop-blur-md rounded-2xl px-4 py-2.5 flex items-center justify-between shadow-sm cursor-pointer hover:bg-black/10 dark:hover:bg-white/20 transition text-slate-800 dark:text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full overflow-hidden border border-black/10 dark:border-white/30 bg-black/10 flex items-center justify-center p-0.5">
                      <img src={activeContact.avatar} alt="" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-[12px] font-semibold">Contact Photo & Poster</span>
                  </div>
                  <ChevronRight size={14} className="opacity-70" />
                </div>

                {/* Sub Card content list details */}
                <div className="w-full bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/15 backdrop-blur-md rounded-2xl p-4 flex flex-col gap-3.5 shadow-sm text-[12px] text-slate-800 dark:text-white">
                  
                  {/* Phone block */}
                  {activeContact.phone && (
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-slate-800/60 dark:text-white/60 tracking-wider font-semibold">mobile</span>
                        <span className="font-medium mt-0.5 text-slate-900 dark:text-white">{activeContact.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 border border-black/10 dark:border-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-150 active:scale-90 shadow-sm" title="Call">
                          <Phone size={13} className="text-slate-800 dark:text-white" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Email block */}
                  {activeContact.email && (
                    <div className="flex items-center justify-between border-t border-black/5 dark:border-white/5 pt-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-slate-800/60 dark:text-white/60 tracking-wider font-semibold">home</span>
                        <span className="font-medium mt-0.5 text-slate-900 dark:text-white">{activeContact.email}</span>
                      </div>
                      <button className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 border border-black/10 dark:border-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-150 active:scale-90 shadow-sm" title="Mail">
                        <Mail size={13} className="text-slate-800 dark:text-white" />
                      </button>
                    </div>
                  )}

                  {/* Work Email block */}
                  {activeContact.workEmail && (
                    <div className="flex items-center justify-between border-t border-black/5 dark:border-white/5 pt-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-slate-800/60 dark:text-white/60 tracking-wider font-semibold">work</span>
                        <span className="font-medium mt-0.5 text-slate-900 dark:text-white">{activeContact.workEmail}</span>
                      </div>
                      <button className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 border border-black/10 dark:border-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-150 active:scale-90 shadow-sm" title="Mail">
                        <Mail size={13} className="text-slate-800 dark:text-white" />
                      </button>
                    </div>
                  )}

                  {/* Address block */}
                  {activeContact.address && (
                    <div className="flex items-center justify-between border-t border-black/5 dark:border-white/5 pt-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-slate-800/60 dark:text-white/60 tracking-wider font-semibold">home</span>
                        <span className="font-medium mt-0.5 text-slate-900 dark:text-white">{activeContact.address}</span>
                      </div>
                      <button className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 border border-black/10 dark:border-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-150 active:scale-90 shadow-sm" title="Location">
                        <MapPin size={13} className="text-slate-800 dark:text-white" />
                      </button>
                    </div>
                  )}

                  {/* Birthday block */}
                  {activeContact.birthday && (
                    <div className="flex items-center justify-between border-t border-black/5 dark:border-white/5 pt-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-slate-800/60 dark:text-white/60 tracking-wider font-semibold">birthday</span>
                        <span className="font-medium mt-0.5 text-slate-900 dark:text-white">{activeContact.birthday}</span>
                      </div>
                      <button className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 border border-black/10 dark:border-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-150 active:scale-90 shadow-sm" title="Calendar">
                        <Calendar size={13} className="text-slate-800 dark:text-white" />
                      </button>
                    </div>
                  )}

                  {/* Notes block */}
                  {activeContact.notes && (
                    <div className="flex flex-col border-t border-black/5 dark:border-white/5 pt-2">
                      <span className="text-[10px] uppercase text-slate-800/60 dark:text-white/60 tracking-wider font-semibold">Notes</span>
                      <span className="mt-0.5 leading-relaxed text-slate-800/90 dark:text-white/90">{activeContact.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400 mt-20">
              <span>Select a contact to view details</span>
            </div>
          )}
        </div>
      </main>

      {/* ── 3. Create / Edit Contact Modal Dialog ── */}
      {showModal && (
        <div className="absolute inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center z-[99999] select-none animate-fade">
          <form 
            onSubmit={handleSaveContact}
            className={`w-[380px] rounded-2xl p-5 border shadow-2xl flex flex-col gap-4 animate-scale ${
              isDarkMode ? "bg-[#2A2A2A] border-white/10 text-white" : "bg-white border-black/10 text-gray-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-[15px]">{modalMode === "create" ? "New Contact" : "Edit Contact"}</span>
              <button 
                type="button"
                onClick={() => setShowModal(false)}
                className={`p-1.5 rounded-full transition ${isDarkMode ? "hover:bg-white/10 text-gray-400" : "hover:bg-black/5 text-gray-500"}`}
              >
                <X size={15} />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto max-h-[380px] flex flex-col gap-3.5 pr-1 notes-no-scrollbar" style={{ scrollbarWidth: "none" }}>
              
              {/* Names row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400">First Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="First"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={`w-full px-3 py-2 text-[12px] rounded-lg border outline-none ${
                      isDarkMode 
                        ? "bg-[#1E1E1E] border-white/10 text-white focus:border-blue-500" 
                        : "bg-gray-50 border-black/10 text-gray-800 focus:border-blue-500"
                    }`}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400">Last Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Last"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={`w-full px-3 py-2 text-[12px] rounded-lg border outline-none ${
                      isDarkMode 
                        ? "bg-[#1E1E1E] border-white/10 text-white focus:border-blue-500" 
                        : "bg-gray-50 border-black/10 text-gray-800 focus:border-blue-500"
                    }`}
                  />
                </div>
              </div>

              {/* Phone number */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-gray-400">Phone</label>
                <input 
                  type="text" 
                  placeholder="(555) 555-5555"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full px-3 py-2 text-[12px] rounded-lg border outline-none ${
                    isDarkMode 
                      ? "bg-[#1E1E1E] border-white/10 text-white focus:border-blue-500" 
                      : "bg-gray-50 border-black/10 text-gray-800 focus:border-blue-500"
                  }`}
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-gray-400">Home Email</label>
                <input 
                  type="email" 
                  placeholder="name@icloud.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-3 py-2 text-[12px] rounded-lg border outline-none ${
                    isDarkMode 
                      ? "bg-[#1E1E1E] border-white/10 text-white focus:border-blue-500" 
                      : "bg-gray-50 border-black/10 text-gray-800 focus:border-blue-500"
                  }`}
                />
              </div>

              {/* Work Email */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-gray-400">Work Email</label>
                <input 
                  type="email" 
                  placeholder="work@company.com"
                  value={workEmail}
                  onChange={(e) => setWorkEmail(e.target.value)}
                  className={`w-full px-3 py-2 text-[12px] rounded-lg border outline-none ${
                    isDarkMode 
                      ? "bg-[#1E1E1E] border-white/10 text-white focus:border-blue-500" 
                      : "bg-gray-50 border-black/10 text-gray-800 focus:border-blue-500"
                  }`}
                />
              </div>

              {/* Address */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-gray-400">Address</label>
                <input 
                  type="text" 
                  placeholder="Street, City, State"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`w-full px-3 py-2 text-[12px] rounded-lg border outline-none ${
                    isDarkMode 
                      ? "bg-[#1E1E1E] border-white/10 text-white focus:border-blue-500" 
                      : "bg-gray-50 border-black/10 text-gray-800 focus:border-blue-500"
                  }`}
                />
              </div>

              {/* Birthday */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-gray-400">Birthday</label>
                <input 
                  type="text" 
                  placeholder="e.g. Sep 21"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className={`w-full px-3 py-2 text-[12px] rounded-lg border outline-none ${
                    isDarkMode 
                      ? "bg-[#1E1E1E] border-white/10 text-white focus:border-blue-500" 
                      : "bg-gray-50 border-black/10 text-gray-800 focus:border-blue-500"
                  }`}
                />
              </div>

              {/* Poster Theme Gradient Picker */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase text-gray-400">Poster Color Theme</label>
                <div className="grid grid-cols-4 gap-2">
                  {gradientOptions.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => setGradient(opt.value)}
                      className={`h-7 rounded-lg bg-gradient-to-br ${opt.value} border flex items-center justify-center relative shadow-3xs cursor-pointer ${
                        gradient === opt.value ? "border-white scale-105 ring-2 ring-blue-500/55" : "border-transparent"
                      }`}
                      title={opt.name}
                    >
                      {gradient === opt.value && <Check size={12} className="text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-gray-400">Notes</label>
                <textarea 
                  placeholder="Notes about contact..."
                  value={notesField}
                  onChange={(e) => setNotesField(e.target.value)}
                  className={`w-full px-3 py-2 text-[12px] rounded-lg border outline-none resize-none h-16 ${
                    isDarkMode 
                      ? "bg-[#1E1E1E] border-white/10 text-white focus:border-blue-500" 
                      : "bg-gray-50 border-black/10 text-gray-800 focus:border-blue-500"
                  }`}
                />
              </div>

            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-3 pt-3 mt-1 border-t border-black/5 dark:border-white/5">
              {modalMode === "edit" ? (
                <button
                  type="button"
                  onClick={handleDeleteContact}
                  className="flex items-center gap-1.5 text-red-500 hover:bg-red-500/10 px-3.5 py-1.5 rounded-lg text-[12px] font-semibold transition mr-auto"
                >
                  Delete
                </button>
              ) : (
                <div />
              )}
              
              <div className="flex items-center gap-3">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={`px-4 py-2 text-[12px] font-semibold rounded-lg transition ${
                    isDarkMode ? "hover:bg-white/5 text-gray-300" : "hover:bg-black/5 text-gray-600"
                  }`}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-[12px] font-bold rounded-lg shadow-sm"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
