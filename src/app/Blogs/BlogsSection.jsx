import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiPlus, 
  FiTrash2, 
  FiSearch, 
  FiChevronRight, 
  FiFolderPlus, 
  FiMoreHorizontal, 
  FiShare, 
  FiLock,
  FiUnlock, 
  FiGrid, 
  FiEdit, 
  FiEye,
  FiColumns
} from "react-icons/fi";
import { 
  BsFolder2, 
  BsTrash, 
  BsTag, 
  BsPeople, 
  BsCardList, 
  BsTable, 
  BsPaperclip, 
  BsCheck2Square 
} from "react-icons/bs";
import { useAppStore } from "../../store/Appstore";

// Traffic lights inside the Notes sidebar (for default mac style top bar layout)
const TrafficLights = ({ windowId }) => {
  const close = useAppStore((s) => s.closeApp);
  const minimize = useAppStore((s) => s.minimizeApp);
  const toggleMaximize = useAppStore((s) => s.toggleMaximize);
  const windows = useAppStore((s) => s.windows);
  const win = windows.find(w => w.id === windowId);
  const maximized = win ? win.maximized : false;

  return (
    <div className="flex items-center gap-2 group mr-4">
      <div
        className="w-3 h-3 bg-[#ff5f57] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#ff4136] transition-all duration-150 shadow-sm"
        onClick={() => close(windowId)}
        title="Close"
      >
        <svg className="w-1.5 h-1.5 text-[#820005] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
          <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div
        className="w-3 h-3 bg-[#febc2e] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#ff9500] transition-all duration-150 shadow-sm"
        onClick={() => minimize(windowId)}
        title="Minimize"
      >
        <svg className="w-1.5 h-1.5 text-[#9a6400] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
          <path d="M1 5H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
              <rect x="1.5" y="3.5" width="5" height="5" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M3.5 3.5V1.5H8.5V6.5H6.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </>
          ) : (
            <>
              <path d="M1 1L4 4M1 1V3.5M1 1H3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M9 9L6 6M9 9V6.5M9 9H6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </>
          )}
        </svg>
      </div>
    </div>
  );
};

// macOS Sidebar Toggle Icon
const SidebarToggleIcon = () => (
  <svg width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500 dark:text-gray-400">
    <rect x="0.5" y="0.5" width="17" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.2" />
    <line x1="5.5" y1="0.5" x2="5.5" y2="14.5" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

// High-fidelity Supernova Sketch mockup from reference
const SupernovaSketch = () => (
  <div className="w-full max-w-[500px] h-auto my-4 border border-black/5 dark:border-white/10 rounded-2xl bg-[#fafaf8] dark:bg-[#252528] p-4 shadow-sm select-none relative overflow-hidden transition-colors duration-300">
    {/* Grid Paper Overlay */}
    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{
      backgroundImage: `radial-gradient(circle, #007aff 1px, transparent 1.5px)`,
      backgroundSize: '16px 16px'
    }} />

    {/* Hand-drawn content container */}
    <div className="relative flex flex-col items-center">
      {/* Title */}
      <div className="text-center font-serif italic font-extrabold text-[#007aff] dark:text-[#30d158] tracking-widest text-[12px] uppercase">
        THE EVOLUTION OF MASSIVE STARS:
      </div>
      
      {/* Curved Banner */}
      <div className="my-2 bg-[#ff9f0a] px-6 py-1.5 rounded-lg shadow-sm border border-[#e0a96d]/40">
        <span className="font-serif italic font-black text-white text-[16px] tracking-widest">SUPERNOVAE</span>
      </div>

      {/* Main Exploding Star Centerpiece */}
      <div className="relative w-36 h-36 flex items-center justify-center my-2">
        {/* Shockwave outer glow */}
        <div className="absolute w-28 h-28 rounded-full bg-yellow-400/20 animate-pulse blur-xl" />
        
        {/* Explosion ray lines */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-amber-500 dark:text-yellow-400">
          <path d="M 50,50 L 20,20 M 50,50 L 80,20 M 50,50 L 20,80 M 50,50 L 80,80 M 50,50 L 50,10 M 50,50 L 50,90 M 50,50 L 10,50 M 50,50 L 90,50" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3,3" />
        </svg>

        {/* Outer Exploding core */}
        <svg viewBox="0 0 60 60" className="w-16 h-16 text-[#ff453a]">
          <path d="M 30,5 L 35,22 L 52,22 L 38,32 L 43,50 L 30,39 L 17,50 L 22,32 L 8,22 L 25,22 Z" fill="currentColor" />
        </svg>
        
        {/* Inner core */}
        <div className="absolute w-6 h-6 rounded-full bg-white dark:bg-yellow-200 shadow-md border border-amber-300" />
      </div>

      {/* Side Descriptions */}
      <div className="w-full grid grid-cols-2 gap-4 text-[11px] font-serif text-gray-700 dark:text-gray-300 leading-relaxed pt-2 border-t border-black/5 dark:border-white/5">
        <div className="space-y-1.5">
          <div className="px-2 py-0.5 border border-black/40 dark:border-white/40 rounded w-fit font-bold font-mono text-[9px]">TYPE I</div>
          <p className="italic">
            A supernova is the colossal explosion of a star, generally occurring at the final stage of a massive star's life cycle.
          </p>
        </div>

        <div className="space-y-1.5 text-right">
          <div className="px-2 py-0.5 border border-black/40 dark:border-white/40 rounded w-fit font-bold font-mono text-[9px] ml-auto">TYPE II</div>
          <p className="italic">
            The Type II supernova is typically a result of a core collapse. During its life cycle, a star is held intact by the balance between opposing forces.
          </p>
        </div>
      </div>
    </div>
  </div>
);

const defaultNotes = [
  {
    id: 10,
    title: "Hello, Welcome to Mac",
    subtitle: "1 photo",
    content: "Welcome to your new macOS simulator! Experience the premium design, fluid animations, and custom integrated applications.",
    date: "6/9/26",
    pinned: true,
    folder: "notes",
    thumbnail: "/images/macos27.png",
    images: ["/images/macos27.png"],
    updatedAt: "2026-06-09T10:00:00Z"
  }
];

export default function Blogs({ windowId }) {
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("os_notes");
    const parsed = saved ? JSON.parse(saved) : defaultNotes;
    const filtered = parsed.filter(n => n.id > 8);
    if (!filtered.some(n => n.id === 10)) {
      return [defaultNotes[0], ...filtered];
    }
    return filtered;
  });
  
  const [selectedFolder, setSelectedFolder] = useState("notes");
  const [selectedNote, setSelectedNote] = useState(10); // default to welcome note
  const [searchQuery, setSearchQuery] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem("os_notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    if (selectedNote !== null) {
      const note = notes.find((n) => n.id === selectedNote);
      if (note) {
        setEditTitle(note.title);
        setEditContent(note.content);
      }
    }
  }, [selectedNote, notes]);

  const visibleNotes = notes.filter((n) => {
    if (selectedFolder !== "all" && n.folder !== selectedFolder) return false;
    if (searchQuery && !n.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !n.content.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Split visible notes into Pinned and Month groups
  const pinnedNotes = visibleNotes.filter(n => n.pinned);
  const otherNotes = visibleNotes.filter(n => !n.pinned);

  // Group other notes by month/category
  const aprilNotes = otherNotes.filter(n => n.date && n.date.startsWith("4/"));
  const marchNotes = otherNotes.filter(n => n.date && n.date.startsWith("3/"));
  const olderNotes = otherNotes.filter(n => !n.date || (!n.date.startsWith("4/") && !n.date.startsWith("3/")));

  const handleNewNote = () => {
    const newNote = {
      id: Date.now(),
      title: "New Note",
      subtitle: "New text note",
      content: "",
      date: `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear().toString().slice(-2)}`,
      folder: selectedFolder === "all" ? "notes" : selectedFolder,
      pinned: false,
      updatedAt: new Date().toISOString(),
    };
    setNotes((prev) => [newNote, ...prev]);
    setSelectedNote(newNote.id);
  };

  const handleDeleteNote = (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selectedNote === id) setSelectedNote(null);
  };

  const handleUpdateNote = (id, title, content) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? { 
              ...n, 
              title, 
              content, 
              subtitle: content.slice(0, 30) || "No additional text",
              updatedAt: new Date().toISOString() 
            }
          : n
      )
    );
  };

  const activeNote = notes.find((n) => n.id === selectedNote);

  const handlePaste = (e) => {
    if (!activeNote) return;
    const items = e.clipboardData?.items;
    if (!items) return;
    
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        e.preventDefault();
        const file = items[i].getAsFile();
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target.result;
          const currentImages = activeNote.images || [];
          const updatedImages = [...currentImages, base64];
          
          setNotes((prev) =>
            prev.map((n) =>
              n.id === activeNote.id
                ? { 
                    ...n, 
                    images: updatedImages,
                    thumbnail: base64,
                    subtitle: `${updatedImages.length} photo${updatedImages.length > 1 ? 's' : ''}`,
                    updatedAt: new Date().toISOString() 
                  }
                : n
            )
          );
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div 
      className="flex h-full w-full overflow-hidden rounded-b-xl select-none"
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
        background: isDarkMode ? "#1e1e1e" : "#ffffff"
      }}
    >
      {/* 1. Sidebar Panel */}
      {isSidebarOpen && (
        <aside
          className="w-52 flex flex-col flex-shrink-0 m-2 rounded-2xl border window-drag-handle overflow-hidden shadow-sm"
          style={{
            background: isDarkMode ? "rgba(37, 37, 37, 0.9)" : "rgba(250, 250, 248, 0.9)",
            borderColor: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"
          }}
        >
          {/* Top Bar area */}
          <div className="h-[52px] flex items-center justify-between px-4 mt-2">
            <div className="flex items-center">
              <TrafficLights windowId={windowId} />
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                title="Hide Sidebar"
              >
                <SidebarToggleIcon />
              </button>
            </div>
            
            <button className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400">
              <FiFolderPlus size={16} />
            </button>
          </div>

          {/* Sidebar folder items */}
          <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-4">
            <div>
              <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                <BsPeople size={12} className="opacity-70" />
                <span>Shared</span>
              </div>
              <div className="mt-1 space-y-0.5">
                <button
                  onClick={() => setSelectedFolder("shared")}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                    selectedFolder === "shared"
                      ? "bg-amber-500/10 text-amber-500"
                      : "text-gray-700 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <BsPeople size={14} />
                    <span>Shared</span>
                  </div>
                  <span className="text-[11px] opacity-40">{notes.filter(n => n.folder === "shared").length}</span>
                </button>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 select-none">iCloud</span>
              <div className="mt-1 space-y-0.5">
                <button
                  onClick={() => setSelectedFolder("all")}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                    selectedFolder === "all"
                      ? "bg-amber-500/10 text-amber-500"
                      : "text-gray-700 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <BsFolder2 size={14} className="text-amber-500" />
                    <span>All iCloud</span>
                  </div>
                  <span className="text-[11px] opacity-40">{notes.length}</span>
                </button>

                <button
                  onClick={() => setSelectedFolder("notes")}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                    selectedFolder === "notes"
                      ? "bg-amber-500/10 text-amber-500"
                      : "text-gray-700 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <BsFolder2 size={14} className="text-amber-500" />
                    <span>Notes</span>
                  </div>
                  <span className="text-[11px] opacity-40">{notes.filter(n => n.folder === "notes").length}</span>
                </button>

                <button
                  onClick={() => setSelectedFolder("imported")}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                    selectedFolder === "imported"
                      ? "bg-amber-500/10 text-amber-500"
                      : "text-gray-700 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <BsFolder2 size={14} className="text-amber-500" />
                    <span>Imported Notes</span>
                  </div>
                  <span className="text-[11px] opacity-40">0</span>
                </button>
              </div>
            </div>

            {/* Tags Header */}
            <div>
              <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 select-none">Tags</span>
              <div className="mt-1 space-y-0.5 px-3 py-1.5 text-xs text-gray-400 dark:text-gray-500 italic">
                No Tags
              </div>
            </div>
          </nav>
        </aside>
      )}

      {/* 2. Middle Panel: Notes List */}
      <div 
        className="w-56 h-full flex flex-col flex-shrink-0 border-r"
        style={{
          background: isDarkMode ? "#1e1e1e" : "#ffffff",
          borderColor: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"
        }}
      >
        {/* Title & Count Header */}
        <div className="h-[52px] flex items-center justify-between px-4 mt-2 border-b border-black/[0.05] dark:border-white/5">
          <div>
            <div className="text-[14px] font-semibold text-gray-800 dark:text-white leading-none">Notes</div>
            <div className="text-[10px] text-gray-400 mt-1 select-none font-medium">
              {visibleNotes.length} {visibleNotes.length === 1 ? 'note' : 'notes'}
            </div>
          </div>
          <button className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400">
            <FiMoreHorizontal size={16} />
          </button>
        </div>

        {/* Note List Scroll View */}
        <div className="flex-1 overflow-y-auto px-2 py-1 space-y-3 notes-no-scrollbar" style={{ scrollbarWidth: 'none' }}>
          {/* Search bar inside note list */}
          <div className="my-1.5 flex items-center gap-1.5 bg-black/[0.04] dark:bg-white/[0.06] rounded-full px-3 py-1">
            <FiSearch size={13} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-[12px] placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-white outline-none w-full"
            />
          </div>

          {/* Pinned notes */}
          {pinnedNotes.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-gray-400 uppercase px-2 mb-1">Pinned</div>
              <div className="space-y-1">
                {pinnedNotes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => setSelectedNote(note.id)}
                    className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                      selectedNote === note.id
                        ? "bg-amber-500/20 shadow-sm border border-amber-500/25"
                        : "hover:bg-black/[0.04] dark:hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="text-[12px] font-semibold text-gray-800 dark:text-white truncate">{note.title || "Untitled Note"}</div>
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                        <span className="font-semibold">{note.date}</span>
                        <span className="truncate">{note.subtitle || "No attachment"}</span>
                      </div>
                    </div>
                    {note.thumbnail && (
                      <img src={note.thumbnail} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" alt="" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* April notes */}
          {aprilNotes.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-gray-400 uppercase px-2 mb-1">April</div>
              <div className="space-y-1">
                {aprilNotes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => setSelectedNote(note.id)}
                    className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                      selectedNote === note.id
                        ? "bg-amber-500/20 shadow-sm border border-amber-500/25"
                        : "hover:bg-black/[0.04] dark:hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="text-[12px] font-semibold text-gray-800 dark:text-white truncate">{note.title || "Untitled Note"}</div>
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                        <span className="font-semibold">{note.date}</span>
                        <span className="truncate">{note.subtitle || "No attachment"}</span>
                      </div>
                    </div>
                    {note.thumbnail && (
                      <img src={note.thumbnail} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" alt="" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* March notes */}
          {marchNotes.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-gray-400 uppercase px-2 mb-1">March</div>
              <div className="space-y-1">
                {marchNotes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => setSelectedNote(note.id)}
                    className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                      selectedNote === note.id
                        ? "bg-amber-500/20 shadow-sm border border-amber-500/25"
                        : "hover:bg-black/[0.04] dark:hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="text-[12px] font-semibold text-gray-800 dark:text-white truncate">{note.title || "Untitled Note"}</div>
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                        <span className="font-semibold">{note.date}</span>
                        <span className="truncate">{note.subtitle || "No attachment"}</span>
                      </div>
                    </div>
                    {note.thumbnail && (
                      <img src={note.thumbnail} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" alt="" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Older notes */}
          {olderNotes.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-gray-400 uppercase px-2 mb-1">Previous</div>
              <div className="space-y-1">
                {olderNotes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => setSelectedNote(note.id)}
                    className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                      selectedNote === note.id
                        ? "bg-amber-500/20 shadow-sm border border-amber-500/25"
                        : "hover:bg-black/[0.04] dark:hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="text-[12px] font-semibold text-gray-800 dark:text-white truncate">{note.title || "Untitled Note"}</div>
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                        <span className="font-semibold">{note.date || "Unknown"}</span>
                        <span className="truncate">{note.subtitle || "No attachment"}</span>
                      </div>
                    </div>
                    {note.thumbnail && (
                      <img src={note.thumbnail} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" alt="" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Right Panel: Editor/Viewer Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Editor Toolbar */}
        <header
          className="h-[52px] flex items-center justify-between px-5 select-none border-b window-drag-handle"
          style={{ 
            background: isDarkMode ? "#1e1e1e" : "#ffffff",
            borderColor: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"
          }}
        >
          {/* Left: Sidebar restore button (if sidebar closed) */}
          <div className="flex items-center gap-2">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="w-8 h-8 rounded-full flex items-center justify-center border transition backdrop-blur-md border-black/5 bg-white/40 hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 shadow-2xs mr-1"
                title="Show Sidebar"
              >
                <SidebarToggleIcon />
              </button>
            )}
            
            {/* Create New Note button */}
            <button 
              onClick={handleNewNote}
              className="w-8 h-8 rounded-full flex items-center justify-center border transition backdrop-blur-md border-black/5 bg-white/40 hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 text-amber-500 shadow-2xs"
              title="New Note"
            >
              <FiEdit size={14} />
            </button>
          </div>

          {/* Center Format Tools */}
          <div className="flex items-center gap-1.5 bg-black/[0.03] dark:bg-white/[0.04] px-2.5 py-1 rounded-full border border-black/5 dark:border-white/5">
            <button className="px-2 py-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-md text-xs font-semibold text-gray-500 dark:text-gray-400">Aa</button>
            <button className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-md text-gray-500 dark:text-gray-400" title="Checklist"><BsCheck2Square size={13} /></button>
            <button className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-md text-gray-500 dark:text-gray-400" title="Table"><BsTable size={13} /></button>
            <button className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-md text-gray-500 dark:text-gray-400" title="Attachment"><BsPaperclip size={13} /></button>
            <button className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-md text-gray-500 dark:text-gray-400" title="Lock Note"><FiLock size={13} /></button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5">
            <button className="w-8 h-8 rounded-full flex items-center justify-center border transition backdrop-blur-md border-black/5 bg-white/40 hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 shadow-2xs" title="Share"><FiShare size={14} /></button>
            <button className="w-8 h-8 rounded-full flex items-center justify-center border transition backdrop-blur-md border-black/5 bg-white/40 hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 shadow-2xs" title="More Options"><FiMoreHorizontal size={15} /></button>
            <button className="w-8 h-8 rounded-full flex items-center justify-center border transition backdrop-blur-md border-black/5 bg-white/40 hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 shadow-2xs" title="Search Note"><FiSearch size={14} /></button>
            
            {activeNote && (
              <button 
                onClick={() => handleDeleteNote(activeNote.id)}
                className="w-8 h-8 rounded-full flex items-center justify-center border transition backdrop-blur-md border-red-500/10 bg-red-500/5 hover:bg-red-500/10 dark:border-red-500/20 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-500 shadow-2xs"
                title="Delete Note"
              >
                <FiTrash2 size={14} />
              </button>
            )}
          </div>
        </header>

        {/* Editor Body */}
        <div 
          className="flex-1 overflow-y-auto px-8 py-6 select-text notes-no-scrollbar"
          onPaste={handlePaste}
        >
          {activeNote ? (
            <div className="max-w-xl mx-auto flex flex-col h-full">
              {/* Date display centered like macOS Notes */}
              <div className="text-center text-[11px] text-gray-400 dark:text-gray-500 select-none mb-4">
                {new Date(activeNote.updatedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric"
                })} at {new Date(activeNote.updatedAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </div>

              {/* Title Input */}
              <input
                type="text"
                value={editTitle}
                onChange={(e) => {
                  setEditTitle(e.target.value);
                  handleUpdateNote(activeNote.id, e.target.value, editContent);
                }}
                className="w-full bg-transparent text-[22px] font-bold text-gray-800 dark:text-white outline-none placeholder-gray-300 dark:placeholder-gray-700 leading-tight mb-4"
                placeholder="New Note"
              />

              {/* Special handwritten sketch display for massive stars note */}
              {activeNote.hasSketch && <SupernovaSketch />}

              {/* Display pasted images */}
              {activeNote.images && activeNote.images.length > 0 && (
                <div className="flex flex-col gap-4 mb-4 w-full">
                  {activeNote.images.map((img, idx) => (
                    <div key={idx} className="relative group rounded-xl overflow-hidden border border-black/10 dark:border-white/10 shadow-sm w-full bg-black/5 dark:bg-white/5 p-1">
                      <img src={img} className="w-full h-auto max-h-[600px] object-contain rounded-lg mx-auto" alt="Pasted attachment" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const updatedImages = activeNote.images.filter((_, i) => i !== idx);
                          setNotes((prev) =>
                            prev.map((n) =>
                              n.id === activeNote.id
                                ? { 
                                    ...n, 
                                    images: updatedImages,
                                    thumbnail: updatedImages.length > 0 ? updatedImages[0] : null,
                                    subtitle: updatedImages.length > 0 
                                      ? `${updatedImages.length} photo${updatedImages.length > 1 ? 's' : ''}` 
                                      : (n.content?.slice(0, 30) || "No additional text"),
                                    updatedAt: new Date().toISOString() 
                                  }
                                : n
                            )
                          );
                        }}
                        className="absolute top-3 right-3 bg-black/75 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 text-xs cursor-pointer shadow-md"
                        title="Remove Image"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Body Textarea */}
              <textarea
                value={editContent}
                onChange={(e) => {
                  setEditContent(e.target.value);
                  handleUpdateNote(activeNote.id, editTitle, e.target.value);
                }}
                className="flex-1 bg-transparent text-[14px] text-gray-700 dark:text-gray-200 outline-none resize-none leading-relaxed placeholder-gray-300 dark:placeholder-gray-700 min-h-[300px]"
                placeholder="Start writing..."
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-400 dark:text-gray-500 h-full">
              <BsFolder2 size={48} className="opacity-40" />
              <p className="text-[14px] font-medium">No Note Selected</p>
              <button 
                onClick={handleNewNote}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg text-xs font-semibold hover:bg-amber-600 transition-colors shadow-sm"
              >
                Create Note
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
