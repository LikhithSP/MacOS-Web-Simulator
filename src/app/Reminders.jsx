import React, { useState, useEffect, useRef } from "react";
import { useAppStore } from "../store/Appstore";
import {
  Calendar,
  CalendarDays,
  CalendarClock,
  Inbox,
  Flag,
  Check,
  Plus,
  Search,
  Share2,
  ChevronDown,
  ChevronRight,
  Heart,
  Star,
  Triangle,
  Carrot,
  BookOpen,
  Sun,
  Leaf,
  List,
  Trash2,
  X,
  MoreHorizontal
} from "lucide-react";

// Helper: get today's date as YYYY-MM-DD string
const getTodayStr = () => new Date().toISOString().split("T")[0];

// Helper: format a date string for display
const formatDateDisplay = (dateStr) => {
  if (!dateStr) return "";
  const today = getTodayStr();
  if (dateStr === today) return "Today";
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (dateStr === tomorrow.toISOString().split("T")[0]) return "Tomorrow";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// Helper: map list bg class to list text class explicitly so Tailwind compiles the classes
const getColorTextClass = (bgClass) => {
  switch (bgClass) {
    case "bg-[#007AFF]": return "text-[#007AFF]";
    case "bg-[#FF2D55]": return "text-[#FF2D55]";
    case "bg-[#FF9500]": return "text-[#FF9500]";
    case "bg-[#FFCC00]": return "text-[#FFCC00]";
    case "bg-[#34C759]": return "text-[#34C759]";
    case "bg-[#AF52DE]": return "text-[#AF52DE]";
    case "bg-[#A2845E]": return "text-[#A2845E]";
    default: return "text-[#007AFF]";
  }
};

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

const defaultLists = [
  { id: "reminders", name: "Reminders", icon: "list", color: "bg-[#007AFF]", text: "text-[#007AFF]", count: 0 }
];

const defaultReminders = [];

export default function RemindersApp({ windowId }) {
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  
  const [lists, setLists] = useState(() => {
    const saved = localStorage.getItem("os_reminders_lists");
    if (saved && saved.includes("bookclub")) {
      localStorage.removeItem("os_reminders_lists");
      localStorage.removeItem("os_reminders_tasks");
      return defaultLists;
    }
    return saved ? JSON.parse(saved) : defaultLists;
  });

  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem("os_reminders_tasks");
    if (localStorage.getItem("os_reminders_lists") === null) {
      return defaultReminders;
    }
    return saved ? JSON.parse(saved) : defaultReminders;
  });

  const [selectedListId, setSelectedListId] = useState("reminders");
  const [filterType, setFilterType] = useState(null); // 'today', 'scheduled', 'all', 'flagged', 'completed'
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);

  // Collapsed sections within Book Club or custom lists
  const [collapsedSections, setCollapsedSections] = useState({});

  // Add/Edit list popup modal
  const [showListModal, setShowListModal] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListColor, setNewListColor] = useState("bg-[#007AFF]");
  const [newListIcon, setNewListIcon] = useState("list");

  // Inline new reminder inputs
  const [newReminderText, setNewReminderText] = useState("");
  const [newReminderSection, setNewReminderSection] = useState("");
  const [sectionInputText, setSectionInputText] = useState("");
  const [newSubtaskText, setNewSubtaskText] = useState("");
  const [addingSubtaskId, setAddingSubtaskId] = useState(null);
  const [newReminderDate, setNewReminderDate] = useState(""); // date for the bottom bar add form
  const [showDatePicker, setShowDatePicker] = useState(false);
  const mainInputRef = useRef(null);
  const dateInputRef = useRef(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitleText, setEditingTitleText] = useState("");
  const [collapsedSubtasks, setCollapsedSubtasks] = useState({});

  // Context menu for list actions
  const [listContextMenu, setListContextMenu] = useState(null);

  const handleAddSubtask = (e, parentId) => {
    e.preventDefault();
    if (!newSubtaskText.trim()) return;
    const parentTask = reminders.find(r => r.id === parentId);
    if (!parentTask) return;

    const newSub = {
      id: `sub_${Date.now()}`,
      listId: parentTask.listId,
      section: parentTask.section,
      text: newSubtaskText,
      completed: false,
      flagged: false,
      parentId: parentId
    };

    setReminders(prev => [...prev, newSub]);
    setNewSubtaskText("");
    setAddingSubtaskId(null);
  };

  useEffect(() => {
    localStorage.setItem("os_reminders_lists", JSON.stringify(lists));
  }, [lists]);

  useEffect(() => {
    localStorage.setItem("os_reminders_tasks", JSON.stringify(reminders));
  }, [reminders]);

  const toggleReminder = (id) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  const toggleFlag = (id) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, flagged: !r.flagged } : r));
  };

  const toggleSubtasks = (taskId) => {
    setCollapsedSubtasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const deleteReminder = (id) => {
    // Also delete any subtasks belonging to this parent
    setReminders(prev => prev.filter(r => r.id !== id && r.parentId !== id));
  };

  const deleteList = (listId) => {
    // Don't delete the default list
    if (listId === "reminders") return;
    // Remove the list
    setLists(prev => prev.filter(l => l.id !== listId));
    // Remove all reminders in this list
    setReminders(prev => prev.filter(r => r.listId !== listId));
    // Switch to default list
    if (selectedListId === listId) {
      setSelectedListId("reminders");
    }
    setListContextMenu(null);
  };

  const handleAddReminder = (e, sectionName = "") => {
    e.preventDefault();
    if (!newReminderText.trim()) return;

    const today = getTodayStr();
    // Determine date: explicit pick > filter-implied > none
    let date = newReminderDate || undefined;
    if (!date && (filterType === "today")) date = today;
    if (!date && (filterType === "scheduled")) date = today;

    const newReminder = {
      id: `rem_${Date.now()}`,
      listId: filterType ? "reminders" : selectedListId,
      section: sectionName || newReminderSection || "",
      text: newReminderText,
      completed: false,
      flagged: false,
      date: date || undefined
    };

    setReminders(prev => [...prev, newReminder]);
    setNewReminderText("");
    setNewReminderDate("");
    setShowDatePicker(false);
    setIsInputFocused(false);
    mainInputRef.current?.blur();
  };

  const setReminderDate = (id, date) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, date: date || undefined } : r));
  };

  const toggleReminderToday = (id) => {
    const today = getTodayStr();
    setReminders(prev => prev.map(r => {
      if (r.id !== id) return r;
      // If already set to today, remove date; otherwise set to today
      return { ...r, date: r.date === today ? undefined : today };
    }));
  };

  const handleCreateList = (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    const newList = {
      id: `list_${Date.now()}`,
      name: newListName,
      icon: newListIcon,
      color: newListColor,
      text: getColorTextClass(newListColor),
      count: 0
    };

    setLists(prev => [...prev, newList]);
    setSelectedListId(newList.id);
    setFilterType(null);
    setNewListName("");
    setShowListModal(false);
  };

  const renameList = (listId, newName) => {
    if (!newName.trim()) return;
    setLists(prev => prev.map(l => l.id === listId ? { ...l, name: newName.trim() } : l));
  };

  const clearCompleted = () => {
    setReminders(prev => prev.filter(r => !(r.completed && (filterType ? true : r.listId === selectedListId))));
  };

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Get counts for sidebar filter categories
  const todayStr = getTodayStr();
  const getFilterCounts = () => {
    return {
      today: reminders.filter(r => !r.completed && r.date === todayStr).length,
      scheduled: reminders.filter(r => !r.completed && r.date).length,
      all: reminders.filter(r => !r.completed).length,
      flagged: reminders.filter(r => !r.completed && r.flagged).length,
      completed: reminders.filter(r => r.completed).length
    };
  };

  const counts = getFilterCounts();

  // Get active list count
  const getListCount = (listId) => {
    return reminders.filter(r => r.listId === listId && !r.completed).length;
  };

  // Filter reminders for display
  const getDisplayReminders = () => {
    let result = [...reminders];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r => r.text.toLowerCase().includes(q));
    }

    // FilterType vs List Selection
    if (filterType) {
      if (filterType === "today") result = result.filter(r => r.date === todayStr);
      else if (filterType === "scheduled") result = result.filter(r => r.date);
      else if (filterType === "flagged") result = result.filter(r => r.flagged);
      else if (filterType === "completed") result = result.filter(r => r.completed);
    } else {
      result = result.filter(r => r.listId === selectedListId);
    }

    // Show/Hide Completed
    if (!showCompleted && filterType !== "completed") {
      result = result.filter(r => !r.completed);
    }

    return result;
  };

  const displayReminders = getDisplayReminders();

  // Get list title and details
  const activeList = lists.find(l => l.id === selectedListId);
  const activeTitle = filterType 
    ? filterType.charAt(0).toUpperCase() + filterType.slice(1)
    : activeList ? activeList.name : "Reminders";

  const activeColor = filterType
    ? filterType === "today" ? "text-[#007AFF]" : filterType === "scheduled" ? "text-[#FF2D55]" : filterType === "flagged" ? "text-[#FF9500]" : "text-gray-500"
    : activeList ? getColorTextClass(activeList.color) : "text-[#007AFF]";

  const listItemsCount = displayReminders.filter(r => !r.completed).length;
  const completedCount = displayReminders.filter(r => r.completed).length;

  // Group parent reminders by section if applicable
  const parentReminders = displayReminders.filter(r => !r.parentId);
  const subReminders = displayReminders.filter(r => r.parentId);

  const groupedReminders = parentReminders.reduce((acc, curr) => {
    const sec = curr.section || "No Section";
    if (!acc[sec]) acc[sec] = [];
    acc[sec].push(curr);
    return acc;
  }, {});

  const renderIcon = (iconName, size = 16, className = "") => {
    switch (iconName) {
      case "heart": return <Heart size={size} className={className} />;
      case "star": return <Star size={size} className={className} />;
      case "triangle": return <Triangle size={size} className={className} />;
      case "carrot": return <Carrot size={size} className={className} />;
      case "book": return <BookOpen size={size} className={className} />;
      case "sun": return <Sun size={size} className={className} />;
      case "leaf": return <Leaf size={size} className={className} />;
      default: return <List size={size} className={className} />;
    }
  };

  return (
    <div className={`flex h-full w-full select-none text-[13px] font-sans rounded-b-xl overflow-hidden ${
      isDarkMode ? "bg-[#1E1E1E] text-white" : "bg-white text-gray-800"
    }`}>
      
      {/* ── 1. Sidebar Panel ── */}
      {isSidebarOpen && (
        <aside className={`w-[310px] flex flex-col shrink-0 border-r rounded-r-2xl ${
          isDarkMode ? "border-white/10 bg-[#1E1E1E]" : "border-black/[0.08] bg-[#F6F6F6]"
        }`}>
          {/* Header Controls (Left) */}
          <div className="window-drag-handle h-12 flex items-center justify-between px-4 shrink-0 select-none">
            <TrafficLights windowId={windowId} />
            
            <div className={`flex items-center border rounded-full px-1 py-0.5 shadow-3xs gap-0.5 backdrop-blur-md ${
              isDarkMode 
                ? "bg-white/[0.06] border-white/20 text-gray-300" 
                : "bg-white/40 border-black/[0.12] text-gray-600"
            }`}>
              {/* New List button */}
              <button 
                onClick={() => setShowListModal(true)}
                className={`p-1.5 rounded-full transition flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5`}
                title="Add New List"
              >
                <svg width="15" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.5" y="0.5" width="17" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="5" cy="5" r="0.8" fill="currentColor" />
                  <circle cx="5" cy="10" r="0.8" fill="currentColor" />
                  <line x1="8" y1="5" x2="14" y2="5" stroke="currentColor" strokeWidth="1.2" />
                  <line x1="8" y1="10" x2="11" y2="10" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="14" cy="10" r="3.5" fill={isDarkMode ? "#1E1E1E" : "#FFFFFF"} stroke="currentColor" strokeWidth="1" />
                  <path d="M14 8.5V11.5M12.5 10H15.5" stroke="currentColor" strokeWidth="1" />
                </svg>
              </button>
              {/* Hide Sidebar button */}
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className={`p-1.5 rounded-full transition flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5`}
                title="Hide Sidebar"
              >
                <svg width="15" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.5" y="0.5" width="17" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.2" />
                  <line x1="5.5" y1="0.5" x2="5.5" y2="14.5" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </button>
            </div>
          </div>

          {/* Filter Categories Grids */}
          <div className="px-3 py-2 grid grid-cols-2 gap-2.5 shrink-0">
            {/* Today */}
            <div 
              onClick={() => { setFilterType("today"); setSelectedListId(null); }}
              className={`p-2.5 rounded-lg cursor-pointer flex flex-col justify-between h-[64px] transition bg-[#549CDE] text-white ${
                filterType === "today" 
                  ? "ring-2 ring-white/60 dark:ring-blue-500/70 scale-[1.02] shadow-md" 
                  : "opacity-90 hover:opacity-100"
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <div className="p-1.5 rounded-full flex items-center justify-center bg-white/20 text-white">
                  <Calendar size={15} />
                </div>
                <span className="text-[20px] font-bold tracking-tight">{counts.today}</span>
              </div>
              <span className="text-[11px] font-semibold text-white/95">Today</span>
            </div>

            {/* Scheduled */}
            <div 
              onClick={() => { setFilterType("scheduled"); setSelectedListId(null); }}
              className={`p-2.5 rounded-lg cursor-pointer flex flex-col justify-between h-[64px] transition bg-[#E26A6A] text-white ${
                filterType === "scheduled" 
                  ? "ring-2 ring-white/60 dark:ring-red-500/70 scale-[1.02] shadow-md" 
                  : "opacity-90 hover:opacity-100"
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <div className="p-1.5 rounded-full flex items-center justify-center bg-white/20 text-white">
                  <CalendarDays size={15} />
                </div>
                <span className="text-[20px] font-bold tracking-tight">{counts.scheduled}</span>
              </div>
              <span className="text-[11px] font-semibold text-white/95">Scheduled</span>
            </div>

            {/* All */}
            <div 
              onClick={() => { setFilterType("all"); setSelectedListId(null); }}
              className={`p-2.5 rounded-lg cursor-pointer flex flex-col justify-between h-[64px] transition bg-[#4C4C4C] text-white ${
                filterType === "all" 
                  ? "ring-2 ring-white/60 dark:ring-gray-500/70 scale-[1.02] shadow-md" 
                  : "opacity-90 hover:opacity-100"
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <div className="p-1.5 rounded-full flex items-center justify-center bg-white/20 text-white">
                  <Inbox size={15} />
                </div>
                <span className="text-[20px] font-bold tracking-tight">{counts.all}</span>
              </div>
              <span className="text-[11px] font-semibold text-white/95">All</span>
            </div>

            {/* Flagged */}
            <div 
              onClick={() => { setFilterType("flagged"); setSelectedListId(null); }}
              className={`p-2.5 rounded-lg cursor-pointer flex flex-col justify-between h-[64px] transition bg-[#EAA16E] text-white ${
                filterType === "flagged" 
                  ? "ring-2 ring-white/60 dark:ring-orange-500/70 scale-[1.02] shadow-md" 
                  : "opacity-90 hover:opacity-100"
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <div className="p-1.5 rounded-full flex items-center justify-center bg-white/20 text-white">
                  <Flag size={15} className="fill-current" />
                </div>
                <span className="text-[20px] font-bold tracking-tight">{counts.flagged}</span>
              </div>
              <span className="text-[11px] font-semibold text-white/95">Flagged</span>
            </div>

            {/* Completed */}
            <div 
              onClick={() => { setFilterType("completed"); setSelectedListId(null); }}
              className={`p-2.5 rounded-lg cursor-pointer flex flex-col justify-between h-[64px] transition bg-[#808487] text-white ${
                filterType === "completed" 
                  ? "ring-2 ring-white/60 dark:ring-gray-400/70 scale-[1.02] shadow-md" 
                  : "opacity-90 hover:opacity-100"
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <div className="p-1.5 rounded-full flex items-center justify-center bg-white/20 text-white">
                  <Check size={15} strokeWidth={3} />
                </div>
                <span className="text-[20px] font-bold tracking-tight">{counts.completed}</span>
              </div>
              <span className="text-[11px] font-semibold text-white/95">Completed</span>
            </div>
          </div>

          {/* List Headers heading */}
          <div className="px-5 pt-3 pb-1 text-[11px] font-semibold text-gray-400 tracking-wider">My Lists</div>

          {/* User Custom Lists scroll area */}
          <div className="flex-1 overflow-y-auto px-2 pb-4 notes-no-scrollbar" style={{ scrollbarWidth: "none" }}>
            <div className="space-y-0.5">
              {lists.map(list => {
                const isSelected = selectedListId === list.id && !filterType;
                const listCount = getListCount(list.id);
                return (
                  <div
                    key={list.id}
                    onClick={() => { setSelectedListId(list.id); setFilterType(null); setListContextMenu(null); }}
                    onContextMenu={(e) => {
                      if (list.id === "reminders") return; // Don't allow deleting default list
                      e.preventDefault();
                      setListContextMenu(listContextMenu === list.id ? null : list.id);
                    }}
                    className={`flex items-center justify-between px-3 py-1.5 rounded-lg cursor-pointer transition relative group ${
                      isSelected 
                        ? "bg-[#007AFF] text-white shadow-2xs" 
                        : isDarkMode ? "hover:bg-white/5 text-gray-300" : "hover:bg-black/[0.03] text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 flex-1 min-w-0 mr-12">
                      <div className={`w-[24px] h-[24px] rounded-full overflow-hidden flex items-center justify-center shrink-0 shadow-3xs text-white ${list.color}`}>
                        {renderIcon(list.icon, 13)}
                      </div>
                      <span className={`text-[13px] truncate ${isSelected ? "text-white font-medium" : isDarkMode ? "text-white" : "text-gray-900"}`}>
                        {list.name}
                      </span>
                    </div>
                    <div className="relative flex items-center justify-end shrink-0 w-12">
                      {list.id !== "reminders" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Are you sure you want to delete the list "${list.name}"?`)) {
                              deleteList(list.id);
                            }
                          }}
                          className={`absolute right-6 p-0.5 rounded-md opacity-0 group-hover:opacity-100 hover:opacity-100 transition shrink-0 ${
                            isSelected ? "text-white/60 hover:text-white" : "text-gray-400 hover:text-red-500"
                          }`}
                          title="Delete List"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                      <span className={`text-[12px] font-medium text-right ${isSelected ? "text-white/80" : "text-gray-400"}`}>
                        {listCount}
                      </span>
                    </div>

                    {/* Delete list dropdown */}
                    {listContextMenu === list.id && (
                      <div
                        className={`absolute right-0 top-full mt-1 z-50 rounded-lg shadow-xl border py-1 w-36 ${
                          isDarkMode ? "bg-[#2A2A2A] border-white/10" : "bg-white border-black/10"
                        }`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => deleteList(list.id)}
                          className={`w-full text-left px-3 py-1.5 text-[12px] font-medium flex items-center gap-2 transition ${
                            isDarkMode ? "text-red-400 hover:bg-white/5" : "text-red-500 hover:bg-red-50"
                          }`}
                        >
                          <Trash2 size={12} />
                          Delete List
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      )}

      {/* ── 2. Main Right Details Area ── */}
      <main className={`flex-1 flex flex-col min-w-0 h-full relative overflow-hidden ${isDarkMode ? "bg-[#1E1E1E]" : "bg-white"}`} onClick={() => setListContextMenu(null)}>
        
        {/* Header Toolbar */}
        <div className={`window-drag-handle h-12 flex items-center justify-between px-6 shrink-0 select-none ${
          isDarkMode ? "bg-[#1E1E1E]" : "bg-[#FFFFFF]"
        }`}>
          {/* Left: Sidebar restore toggle */}
          <div className="flex items-center gap-2">
            {!isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className={`p-1.5 rounded-lg flex items-center justify-center border transition backdrop-blur-md ${
                  isDarkMode 
                    ? "hover:bg-white/10 border-white/20 bg-white/[0.06] text-gray-400" 
                    : "hover:bg-black/5 border-black/[0.12] bg-white/40 text-gray-600"
                }`}
                title="Show Sidebar"
              >
                <svg width="15" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.5" y="0.5" width="17" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.2" />
                  <line x1="5.5" y1="0.5" x2="5.5" y2="14.5" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </button>
            )}
          </div>

          {/* Right Toolbar Actions */}
          <div className="flex items-center gap-3">
            {/* Pill grouped actions container */}
            <div className={`flex items-center border rounded-full px-1 py-0.5 shadow-2xs gap-0.5 backdrop-blur-md ${
              isDarkMode 
                ? "bg-white/[0.06] border-white/20 text-gray-300" 
                : "bg-white/40 border-black/[0.12] text-gray-600"
            }`}>
              {/* Share button */}
              <button className={`p-1.5 rounded-full transition flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5`} title="Share">
                <Share2 size={13} />
              </button>

              {/* Add List icon button */}
              <button 
                onClick={() => setShowListModal(true)}
                className={`p-1.5 rounded-full transition flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5`}
                title="New List"
              >
                <svg width="14" height="14" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.5" y="0.5" width="17" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="5" cy="5" r="0.8" fill="currentColor" />
                  <circle cx="5" cy="10" r="0.8" fill="currentColor" />
                  <line x1="8" y1="5" x2="14" y2="5" stroke="currentColor" strokeWidth="1.2" />
                  <line x1="8" y1="10" x2="11" y2="10" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="14" cy="10" r="3.5" fill={isDarkMode ? "#1E1E1E" : "#FFFFFF"} stroke="currentColor" strokeWidth="1" />
                  <path d="M14 8.5V11.5M12.5 10H15.5" stroke="currentColor" strokeWidth="1" />
                </svg>
              </button>

              {/* Add Reminder button */}
              <button 
                onClick={() => mainInputRef.current?.focus()}
                className={`p-1.5 rounded-full transition flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5`}
                title="Add Reminder"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Search Input Bar */}
            <div className={`relative flex items-center rounded-full px-2.5 py-1 border transition backdrop-blur-md ${
              isDarkMode 
                ? "bg-white/[0.08] border-white/20 text-gray-300 focus-within:ring-1 focus-within:ring-blue-500/50" 
                : "bg-white/30 border-black/[0.12] text-gray-600 focus-within:bg-white/60 focus-within:ring-1 focus-within:ring-blue-500/30"
            }`} style={{ width: "160px" }}>
              <Search size={13} className="text-gray-400 mr-1.5 shrink-0" />
              <input 
                type="text" 
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-[11px] outline-none placeholder-gray-500 text-inherit font-medium"
              />
            </div>
          </div>
        </div>

        {/* Content details pane */}
        <div className={`flex-1 px-8 pt-2 pb-6 flex flex-col justify-between overflow-hidden ${isDarkMode ? "bg-[#1E1E1E]" : "bg-white"}`}>
          <div className="flex-1 overflow-y-auto notes-no-scrollbar pr-1" style={{ scrollbarWidth: "none" }}>
            
            {/* Main Title & Total Count Header */}
            <div className={`flex justify-between items-end mb-4 border-b ${isDarkMode ? "border-white/[0.04]" : "border-black/[0.04]"} pb-4 select-text`}>
              <div>
                {isEditingTitle && !filterType ? (
                  <input
                    type="text"
                    value={editingTitleText}
                    onChange={(e) => setEditingTitleText(e.target.value)}
                    onBlur={() => {
                      renameList(selectedListId, editingTitleText);
                      setIsEditingTitle(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        renameList(selectedListId, editingTitleText);
                        setIsEditingTitle(false);
                      } else if (e.key === "Escape") {
                        setIsEditingTitle(false);
                      }
                    }}
                    autoFocus
                    className={`text-[36px] font-bold leading-none bg-transparent outline-none border-b border-blue-500/50 w-64 ${activeColor}`}
                  />
                ) : (
                  <h1 
                    onClick={() => {
                      if (!filterType) {
                        setIsEditingTitle(true);
                        setEditingTitleText(activeTitle);
                      }
                    }}
                    title={!filterType ? "Click to rename list" : undefined}
                    className={`text-[36px] font-bold leading-none select-none ${
                      !filterType ? "cursor-pointer hover:opacity-85 transition-opacity" : ""
                    } ${activeColor}`}
                  >
                    {activeTitle}
                  </h1>
                )}
                <div className="flex items-center gap-1.5 text-[12px] text-gray-400 mt-2 font-medium">
                  <span>{completedCount} Completed</span>
                  <span>•</span>
                  <button onClick={clearCompleted} className={`hover:underline ${activeColor}`}>Clear</button>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className={`text-[42px] font-bold leading-none tracking-tight opacity-90 ${activeColor}`}>
                  {listItemsCount}
                </div>
                <div className="text-[11px] font-semibold text-gray-400 select-none">
                  <button 
                    onClick={() => setShowCompleted(!showCompleted)} 
                    className={`hover:underline ${activeColor}`}
                  >
                    {showCompleted ? "Hide Completed" : "Show Completed"}
                  </button>
                </div>
              </div>
            </div>

            {/* Task lists grouped by Collapsible Sections */}
            <div className="space-y-6">
              {Object.keys(groupedReminders).map(section => {
                const isCollapsed = collapsedSections[section];
                const items = groupedReminders[section];
                
                return (
                  <div key={section} className="flex flex-col">
                    {/* Section Title Header */}
                    {section !== "No Section" && (
                      <div 
                        onClick={() => toggleSection(section)}
                        className="flex items-center justify-between cursor-pointer py-1.5 group select-none text-[14px] font-bold text-slate-800 dark:text-white"
                      >
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center">
                            <Check size={11} className="opacity-0 group-hover:opacity-100 text-gray-400 transition" />
                          </div>
                          <span>{section}</span>
                        </div>
                        {isCollapsed ? <ChevronRight size={15} /> : <ChevronDown size={15} />}
                      </div>
                    )}

                    {/* Section Tasks */}
                    {!isCollapsed && (
                      <div className="mt-1 space-y-1 pl-6">
                        {items.map(item => {
                          const itemSubtasks = subReminders.filter(sub => sub.parentId === item.id);
                          return (
                            <div key={item.id} className="flex flex-col">
                              {/* Parent Task Row */}
                              <div className="flex items-center justify-between py-2 group hover:bg-black/[0.01] dark:hover:bg-white/[0.01] rounded-xl px-2.5 transition">
                                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                                  {/* Circular interactive checkbox */}
                                  <button
                                    onClick={() => toggleReminder(item.id)}
                                    className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center transition shrink-0 shadow-3xs ${
                                      item.completed
                                        ? "bg-blue-500 border-blue-600 text-white"
                                        : "border-black/25 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 text-transparent"
                                    }`}
                                  >
                                    <Check size={13} strokeWidth={3} className={item.completed ? "opacity-100" : "opacity-0"} />
                                  </button>

                                  {/* Task details text info */}
                                  <div className="flex flex-col min-w-0">
                                    <span className={`text-[14px] outline-none text-slate-800 dark:text-white ${
                                      item.completed ? "line-through text-gray-400 dark:text-gray-500 font-medium" : "font-semibold"
                                    }`}>
                                      {item.text}
                                    </span>
                                    {item.date && (
                                      <span className={`text-[10px] font-bold mt-0.5 flex items-center gap-1 ${
                                        item.date === todayStr ? "text-blue-500" : item.date < todayStr ? "text-red-500" : "text-orange-500"
                                      }`}>
                                        <CalendarClock size={10} />
                                        {formatDateDisplay(item.date)}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Actions: Today, Schedule, Flag, Add Subtask & Delete */}
                                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition mr-1.5 shrink-0">
                                  <button
                                    onClick={() => toggleReminderToday(item.id)}
                                    className={`p-1.5 rounded-lg transition ${item.date === todayStr ? "text-blue-500 hover:bg-blue-500/10" : "text-gray-400 hover:bg-gray-500/10"}`}
                                    title={item.date === todayStr ? "Remove from Today" : "Set to Today"}
                                  >
                                    <Calendar size={13} className={item.date === todayStr ? "fill-blue-500/20" : ""} />
                                  </button>
                                  <div className="relative">
                                    <button
                                      onClick={() => {
                                        // Open a native date picker via a hidden input
                                        const input = document.createElement('input');
                                        input.type = 'date';
                                        input.value = item.date || getTodayStr();
                                        input.style.position = 'absolute';
                                        input.style.opacity = '0';
                                        input.style.pointerEvents = 'none';
                                        document.body.appendChild(input);
                                        input.showPicker?.();
                                        input.addEventListener('change', () => {
                                          setReminderDate(item.id, input.value);
                                          document.body.removeChild(input);
                                        });
                                        input.addEventListener('blur', () => {
                                          if (document.body.contains(input)) document.body.removeChild(input);
                                        });
                                      }}
                                      className={`p-1.5 rounded-lg transition ${item.date && item.date !== todayStr ? "text-orange-500 hover:bg-orange-500/10" : "text-gray-400 hover:bg-gray-500/10"}`}
                                      title="Schedule"
                                    >
                                      <CalendarDays size={13} />
                                    </button>
                                  </div>
                                  <button
                                    onClick={() => toggleFlag(item.id)}
                                    className={`p-1.5 rounded-lg transition ${item.flagged ? "text-orange-500 hover:bg-orange-500/10" : "text-gray-400 hover:bg-gray-500/10"}`}
                                    title={item.flagged ? "Remove Flag" : "Flag"}
                                  >
                                    <Flag size={13} className={item.flagged ? "fill-current" : ""} />
                                  </button>
                                  <button
                                    onClick={() => deleteReminder(item.id)}
                                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition"
                                    title="Delete"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>

                                {/* Toggle Subtasks Chevron */}
                                {itemSubtasks.length > 0 && (
                                  <button
                                    onClick={() => toggleSubtasks(item.id)}
                                    className="p-1 rounded-md text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 transition shrink-0 ml-1 select-none"
                                    title={collapsedSubtasks[item.id] ? "Show Subtasks" : "Hide Subtasks"}
                                  >
                                    {collapsedSubtasks[item.id] ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                                  </button>
                                )}
                              </div>

                              {/* Subtasks List */}
                              {itemSubtasks.length > 0 && !collapsedSubtasks[item.id] && (
                                <div className={`pl-8 space-y-1 mt-0.5 border-l ml-5 ${isDarkMode ? "border-white/5" : "border-black/5"}`}>
                                  {itemSubtasks.map(sub => (
                                    <div key={sub.id} className={`flex items-center justify-between py-1.5 rounded-lg px-2 transition subtask-row ${isDarkMode ? "hover:bg-white/[0.01]" : "hover:bg-black/[0.01]"}`}>
                                      <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <button
                                          onClick={() => toggleReminder(sub.id)}
                                          className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition shrink-0 ${
                                            sub.completed
                                              ? "bg-blue-500 border-blue-600 text-white"
                                              : isDarkMode ? "border-white/20 hover:bg-white/5 text-transparent" : "border-black/25 hover:bg-black/5 text-transparent"
                                          }`}
                                        >
                                          <Check size={11} strokeWidth={3} className={sub.completed ? "opacity-100" : "opacity-0"} />
                                        </button>
                                        <span className={`text-[13px] ${
                                          sub.completed
                                            ? isDarkMode ? "line-through text-gray-500" : "line-through text-gray-400"
                                            : isDarkMode ? "text-gray-300" : "text-slate-700"
                                        }`}>
                                          {sub.text}
                                        </span>
                                      </div>
                                      <button
                                        onClick={() => deleteReminder(sub.id)}
                                        className="subtask-delete-btn opacity-0 p-1 rounded-md hover:bg-red-500/10 text-red-500 transition mr-1"
                                        title="Delete Subtask"
                                      >
                                        <Trash2 size={11} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}


                            </div>
                          );
                        })}


                      </div>
                    )}
                  </div>
                );
              })}

              {parentReminders.length === 0 && (
                <div className="text-center text-gray-400 mt-12 py-10 select-none">
                  <Inbox size={42} className="mx-auto mb-3 opacity-30" />
                  <p className="text-[14px] font-semibold">No Reminders</p>
                  <p className="text-[11px] opacity-75 mt-1">Add items or change your search/filters.</p>
                </div>
              )}
            </div>
          </div>

          {/* Persistent bottom Add Reminder bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddReminder(e);
            }}
            onFocus={() => setIsInputFocused(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setIsInputFocused(false);
              }
            }}
            className={`mt-4 p-3 border rounded-full flex items-center gap-3 shrink-0 select-none transition-all duration-300 ease-out transform ${
              isInputFocused
                ? `-translate-y-2 border-blue-500/30 shadow-[0_0_10px_rgba(0,122,255,0.15)] dark:shadow-[0_0_12px_rgba(0,122,255,0.25)] ${
                    isDarkMode 
                      ? "bg-[#252527]" 
                      : "bg-[#F1F1F2]"
                  }`
                : `${
                    isDarkMode 
                      ? "bg-white/[0.04] border-white/5" 
                      : "bg-black/[0.03] border-black/[0.06]"
                  }`
            }`}
          >
            <Plus size={16} className="text-gray-400" />
            <input
              ref={mainInputRef}
              type="text"
              placeholder="Add a reminder..."
              value={newReminderText}
              onChange={(e) => setNewReminderText(e.target.value)}
              className={`flex-1 bg-transparent text-[14px] outline-none placeholder-gray-400 font-semibold ${isDarkMode ? "text-white" : "text-slate-800"}`}
            />
            {/* Date controls for the add bar */}
            <div className="flex items-center gap-1 shrink-0">
              {newReminderDate && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  newReminderDate === getTodayStr() 
                    ? "bg-blue-500/10 text-blue-500" 
                    : "bg-orange-500/10 text-orange-500"
                }`}>
                  <CalendarClock size={10} />
                  {formatDateDisplay(newReminderDate)}
                  <button
                    type="button"
                    onClick={() => setNewReminderDate("")}
                    className="ml-0.5 hover:text-red-500 transition"
                  >
                    <X size={9} />
                  </button>
                </span>
              )}
              <button
                type="button"
                onClick={() => setNewReminderDate(newReminderDate === getTodayStr() ? "" : getTodayStr())}
                className={`p-1.5 rounded-lg transition ${
                  newReminderDate === getTodayStr() ? "text-blue-500 hover:bg-blue-500/10" : "text-gray-400 hover:bg-gray-500/10"
                }`}
                title="Set to Today"
              >
                <Calendar size={14} />
              </button>
              <div className="relative">
                <input
                  ref={dateInputRef}
                  type="date"
                  value={newReminderDate}
                  onChange={(e) => setNewReminderDate(e.target.value)}
                  className="absolute inset-0 opacity-0 w-6 h-6 cursor-pointer"
                  tabIndex={-1}
                />
                <button
                  type="button"
                  onClick={() => dateInputRef.current?.showPicker?.()}
                  className={`p-1.5 rounded-lg transition ${
                    newReminderDate && newReminderDate !== getTodayStr() ? "text-orange-500 hover:bg-orange-500/10" : "text-gray-400 hover:bg-gray-500/10"
                  }`}
                  title="Schedule for a date"
                >
                  <CalendarDays size={14} />
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* ── 3. Create List Modal Dialog ── */}
      {showListModal && (
        <div className="absolute inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center z-[99999] select-none animate-fade">
          <form 
            onSubmit={handleCreateList}
            className={`w-[360px] rounded-2xl p-5 border shadow-2xl flex flex-col gap-4 animate-scale ${
              isDarkMode ? "bg-[#2A2A2A] border-white/10 text-white" : "bg-white border-black/10 text-gray-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-[15px]">New List</span>
              <button 
                type="button"
                onClick={() => setShowListModal(false)}
                className={`p-1.5 rounded-full transition ${isDarkMode ? "hover:bg-white/10 text-gray-400" : "hover:bg-black/5 text-gray-500"}`}
              >
                <X size={15} />
              </button>
            </div>

            {/* List details name input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase text-gray-400">List Name</label>
              <input 
                type="text" 
                required
                placeholder="List Name"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className={`w-full px-3 py-2.5 text-[13px] rounded-xl border outline-none font-semibold ${
                  isDarkMode 
                    ? "bg-[#1E1E1E] border-white/10 text-white focus:border-blue-500" 
                    : "bg-gray-50 border-black/10 text-gray-800 focus:border-blue-500"
                }`}
              />
            </div>

            {/* List Color selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase text-gray-400">List Color</label>
              <div className="flex items-center gap-2">
                {[
                  "bg-[#007AFF]", // Blue
                  "bg-[#FF2D55]", // Red
                  "bg-[#FF9500]", // Orange
                  "bg-[#FFCC00]", // Yellow
                  "bg-[#34C759]", // Green
                  "bg-[#AF52DE]", // Purple
                  "bg-[#A2845E]"  // Brown
                ].map(col => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setNewListColor(col)}
                    className={`w-6 h-6 rounded-full cursor-pointer relative shadow-3xs transition-transform ${col} ${
                      newListColor === col ? "ring-2 ring-blue-500 scale-110" : ""
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* List Icon selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase text-gray-400">List Icon</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { name: "list", label: "List" },
                  { name: "heart", label: "Heart" },
                  { name: "star", label: "Star" },
                  { name: "triangle", label: "Triangle" },
                  { name: "carrot", label: "Carrot" },
                  { name: "book", label: "Book" },
                  { name: "sun", label: "Sun" },
                  { name: "leaf", label: "Leaf" }
                ].map(ic => (
                  <button
                    key={ic.name}
                    type="button"
                    onClick={() => setNewListIcon(ic.name)}
                    className={`p-2 rounded-xl border flex items-center justify-center cursor-pointer transition ${
                      newListIcon === ic.name 
                        ? "bg-blue-500 border-blue-600 text-white shadow-sm" 
                        : isDarkMode ? "bg-white/5 border-white/5 text-gray-300 hover:bg-white/10" : "bg-black/[0.03] border-transparent text-gray-700 hover:bg-black/[0.06]"
                    }`}
                    title={ic.label}
                  >
                    {renderIcon(ic.name, 16)}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal actions footer */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/5 dark:border-white/5">
              <button 
                type="button"
                onClick={() => setShowListModal(false)}
                className={`px-4 py-2 text-[12px] font-semibold rounded-xl transition ${
                  isDarkMode ? "hover:bg-white/5 text-gray-300" : "hover:bg-black/5 text-gray-600"
                }`}
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-[12px] font-bold rounded-xl shadow-sm"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
