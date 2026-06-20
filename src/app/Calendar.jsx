import React, { useState, useEffect, useRef } from "react";
import { useAppStore } from "../store/Appstore";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Calendar as CalendarIcon,
  Inbox,
  Check,
  Info,
  Clock,
  X,
  Trash2,
  Edit2
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

// Helper: Format Date object to YYYY-MM-DD
const formatDateString = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export default function CalendarApp({ windowId }) {
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  const [activeDate, setActiveDate] = useState(new Date()); // Default to user's current date
  const [viewMode, setViewMode] = useState("month"); // day, week, month, year
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Sidebar Calendar visibility states
  const [visibleCalendars, setVisibleCalendars] = useState({
    calendar: true,
    personal: true,
    work: true,
    family: true,
    school: true,
    reminders: true,
    birthdays: true,
  });

  // Event modal form states
  const [modalMode, setModalMode] = useState("create"); // create, edit
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState(formatDateString(new Date()));
  const [eventStartTime, setEventStartTime] = useState("10:00");
  const [eventEndTime, setEventEndTime] = useState("11:00");
  const [eventCalendar, setEventCalendar] = useState("personal");
  const [eventIsAllDay, setEventIsAllDay] = useState(false);

  // Seed events (start empty as requested)
  const [events, setEvents] = useState([]);

  // Calendar styling maps
  const calendarColors = {
    calendar: { bg: "bg-[#007AFF]", border: "border-[#007AFF]", label: "Calendar", raw: "#007AFF" },
    personal: { bg: "bg-[#007AFF]", border: "border-[#007AFF]", label: "Personal", raw: "#007AFF" },
    work: { bg: "bg-[#FF3B30]", border: "border-[#FF3B30]", label: "Work", raw: "#FF3B30" },
    family: { bg: "bg-[#34C759]", border: "border-[#34C759]", label: "Family", raw: "#34C759" },
    school: { bg: "bg-[#FFCC00]", border: "border-[#FFCC00]", label: "School", raw: "#FFCC00" },
    reminders: { bg: "bg-[#007AFF]", border: "border-[#007AFF]", label: "Reminders", raw: "#007AFF" },
    birthdays: { bg: "bg-gray-400", border: "border-gray-400", label: "Birthdays", raw: "#9CA3AF" },
  };

  // Sidebar dynamic mini-calendar state
  const [miniYear, setMiniYear] = useState(activeDate.getFullYear());
  const [miniMonth, setMiniMonth] = useState(activeDate.getMonth());

  useEffect(() => {
    setMiniYear(activeDate.getFullYear());
    setMiniMonth(activeDate.getMonth());
  }, [activeDate]);

  // Generate days for mini sidebar calendar
  const getDaysInMonth = (year, month) => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    
    const cells = [];
    
    // Previous month overlap
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      cells.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthDays - i)
      });
    }
    
    // Current month
    for (let i = 1; i <= totalDays; i++) {
      cells.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i)
      });
    }
    
    // Next month overlap
    const remaining = 42 - cells.length; // 6 rows standard grid
    for (let i = 1; i <= remaining; i++) {
      cells.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i)
      });
    }
    
    return cells;
  };

  // Toggle calendar view
  const toggleCalendarVisibility = (cal) => {
    setVisibleCalendars(prev => ({ ...prev, [cal]: !prev[cal] }));
  };

  // Filtered events
  const filteredEvents = events.filter(event => {
    const calendarActive = visibleCalendars[event.calendar];
    if (!calendarActive) return false;

    if (searchQuery.trim()) {
      return event.title.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  // Navigate dates
  const handleNavigate = (direction) => {
    let newDate = new Date(activeDate);
    if (viewMode === "day") {
      newDate.setDate(activeDate.getDate() + direction);
    } else if (viewMode === "week") {
      newDate.setDate(activeDate.getDate() + direction * 7);
    } else if (viewMode === "month") {
      newDate.setMonth(activeDate.getMonth() + direction);
    } else if (viewMode === "year") {
      newDate.setFullYear(activeDate.getFullYear() + direction);
    }
    setActiveDate(newDate);
  };

  const handleGoToday = () => {
    setActiveDate(new Date()); // Return to real current date
  };

  // Generate week days starting from Sunday for the Week View
  const getWeekDates = (date) => {
    const currentDay = date.getDay();
    const dates = [];
    const tempDate = new Date(date);
    tempDate.setDate(date.getDate() - currentDay);
    
    for (let i = 0; i < 7; i++) {
      dates.push(new Date(tempDate));
      tempDate.setDate(tempDate.getDate() + 1);
    }
    return dates;
  };

  const weekDates = getWeekDates(activeDate);

  // Month info text helper
  const getMonthName = (date) => {
    return date.toLocaleDateString("en-US", { month: "long" });
  };

  // Event crud
  const handleOpenCreateModal = (dateStr = null, timeStr = "10:00") => {
    setModalMode("create");
    setEventTitle("");
    setEventDate(dateStr || formatDateString(activeDate));
    setEventStartTime(timeStr);
    const endHour = String(parseInt(timeStr.split(":")[0]) + 1).padStart(2, "0");
    setEventEndTime(`${endHour}:00`);
    setEventCalendar("personal");
    setEventIsAllDay(false);
    setShowEventModal(true);
  };

  const handleOpenEditModal = (event) => {
    setSelectedEvent(event);
    setModalMode("edit");
    setEventTitle(event.title);
    setEventDate(event.date);
    setEventStartTime(event.startTime || "10:00");
    setEventEndTime(event.endTime || "11:00");
    setEventCalendar(event.calendar);
    setEventIsAllDay(!!event.isAllDay);
    setShowEventModal(true);
  };

  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    const calConfig = calendarColors[eventCalendar];
    const newColor = eventIsAllDay 
      ? `${calConfig.bg} text-white` 
      : `bg-${eventCalendar === "work" ? "red" : eventCalendar === "family" ? "green" : eventCalendar === "school" ? "amber" : "sky"}-100 dark:bg-${eventCalendar === "work" ? "red" : eventCalendar === "family" ? "green" : eventCalendar === "school" ? "amber" : "sky"}-950/40 text-${eventCalendar === "work" ? "red" : eventCalendar === "family" ? "green" : eventCalendar === "school" ? "amber" : "sky"}-800 dark:text-${eventCalendar === "work" ? "red" : eventCalendar === "family" ? "green" : eventCalendar === "school" ? "amber" : "sky"}-200 border-l-[3px] border-${eventCalendar === "work" ? "red" : eventCalendar === "family" ? "green" : eventCalendar === "school" ? "amber" : "sky"}-500`;

    if (modalMode === "create") {
      const newEvent = {
        id: Date.now(),
        title: eventTitle,
        date: eventDate,
        startTime: eventIsAllDay ? undefined : eventStartTime,
        endTime: eventIsAllDay ? undefined : eventEndTime,
        isAllDay: eventIsAllDay,
        calendar: eventCalendar,
        color: newColor,
        colorRaw: calConfig.raw
      };
      setEvents(prev => [...prev, newEvent]);
    } else {
      setEvents(prev => prev.map(evt => {
        if (evt.id === selectedEvent.id) {
          return {
            ...evt,
            title: eventTitle,
            date: eventDate,
            startTime: eventIsAllDay ? undefined : eventStartTime,
            endTime: eventIsAllDay ? undefined : eventEndTime,
            isAllDay: eventIsAllDay,
            calendar: eventCalendar,
            color: newColor,
            colorRaw: calConfig.raw
          };
        }
        return evt;
      }));
    }
    setShowEventModal(false);
    setSelectedEvent(null);
  };

  const handleDeleteEvent = () => {
    if (!selectedEvent) return;
    setEvents(prev => prev.filter(evt => evt.id !== selectedEvent.id));
    setShowEventModal(false);
    setSelectedEvent(null);
  };

  return (
    <div className={`flex h-full w-full select-none text-[13px] font-sans ${
      isDarkMode ? "bg-[#1E1E1E] text-white" : "bg-white text-gray-800"
    }`}>
      
      {/* ── Sidebar ── */}
      <aside className={`w-[220px] flex flex-col shrink-0 overflow-hidden select-none border-r rounded-r-2xl ${
        isDarkMode ? "border-white/10 bg-[#1E1E1E]" : "border-black/[0.08] bg-[#F6F6F6]"
      }`}>
        {/* Controls Spacer */}
        <div className="window-drag-handle h-12 flex items-center px-4 shrink-0 justify-between select-none">
          <TrafficLights windowId={windowId} />
          
          {/* Sidebar toggle and Inbox icons at right end */}
          <div className="flex items-center gap-1">
            <button className={`p-1.5 rounded transition ${isDarkMode ? "hover:bg-white/5 text-gray-400" : "hover:bg-black/5 text-gray-600"}`}>
              <CalendarIcon size={13} className="stroke-[2.5]" />
            </button>
            <button className={`p-1.5 rounded transition ${isDarkMode ? "hover:bg-white/5 text-gray-400" : "hover:bg-black/5 text-gray-600"}`}>
              <Inbox size={13} className="stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Scrollable list content */}
        <div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-6 notes-no-scrollbar" style={{ scrollbarWidth: "none" }}>
          
          {/* iCloud Calendars */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">iCloud</span>
            
            {Object.entries({
              calendar: "Calendar",
              personal: "Personal",
              work: "Work",
              family: "Family",
              school: "School"
            }).map(([key, label]) => {
              const cfg = calendarColors[key];
              const isChecked = visibleCalendars[key];
              return (
                <div key={key} className="flex items-center justify-between group py-0.5">
                  <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleCalendarVisibility(key)}>
                    <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition ${
                      isChecked 
                        ? `${cfg.bg} border-transparent text-white` 
                        : "border-gray-400 dark:border-white/20 bg-transparent"
                    }`}>
                      {isChecked && <Check size={10} className="stroke-[3.5]" />}
                    </div>
                    <span className="font-medium text-[12px]">{label}</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition cursor-pointer text-gray-400 hover:text-blue-500">
                    <Info size={11} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Other Calendars */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Other</span>
            
            {Object.entries({
              reminders: "Scheduled Reminders",
              birthdays: "Birthdays"
            }).map(([key, label]) => {
              const cfg = calendarColors[key];
              const isChecked = visibleCalendars[key];
              return (
                <div key={key} className="flex items-center justify-between group py-0.5">
                  <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleCalendarVisibility(key)}>
                    <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition ${
                      isChecked 
                        ? `${cfg.bg} border-transparent text-white` 
                        : "border-gray-400 dark:border-white/20 bg-transparent"
                    }`}>
                      {isChecked && <Check size={10} className="stroke-[3.5]" />}
                    </div>
                    <span className="font-medium text-[12px]">{label}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mini Calendar navigation */}
          <div className="mt-auto pt-4 flex flex-col select-none">
            <div className="flex items-center justify-between px-1 mb-2 font-semibold text-[11px] uppercase tracking-wide text-gray-500">
              <span>{new Date(miniYear, miniMonth).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => {
                    if (miniMonth === 0) {
                      setMiniMonth(11);
                      setMiniYear(y => y - 1);
                    } else {
                      setMiniMonth(m => m - 1);
                    }
                  }}
                  className={`p-0.5 rounded transition ${isDarkMode ? "hover:bg-white/10" : "hover:bg-black/5"}`}
                >
                  <ChevronLeft size={12} className="stroke-[2.5]" />
                </button>
                <button 
                  onClick={() => {
                    if (miniMonth === 11) {
                      setMiniMonth(0);
                      setMiniYear(y => y + 1);
                    } else {
                      setMiniMonth(m => m + 1);
                    }
                  }}
                  className={`p-0.5 rounded transition ${isDarkMode ? "hover:bg-white/10" : "hover:bg-black/5"}`}
                >
                  <ChevronRight size={12} className="stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Calendar grid headers */}
            <div className="grid grid-cols-7 text-center font-semibold text-[9.5px] mb-1">
              <span className="text-gray-400">S</span>
              <span className="text-black dark:text-white">M</span>
              <span className="text-black dark:text-white">T</span>
              <span className="text-black dark:text-white">W</span>
              <span className="text-black dark:text-white">T</span>
              <span className="text-black dark:text-white">F</span>
              <span className="text-gray-400">S</span>
            </div>

            {/* Calendar cells */}
            <div className="grid grid-cols-7 text-center text-[10.5px]">
              {getDaysInMonth(miniYear, miniMonth).map((cell, idx) => {
                const isSelected = activeDate.toDateString() === cell.date.toDateString();
                const isToday = cell.date.toDateString() === new Date().toDateString(); // Real today
                const dayOfWeek = cell.date.getDay();
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                
                return (
                  <div 
                     key={idx}
                    onClick={() => setActiveDate(cell.date)}
                    className="aspect-square flex items-center justify-center cursor-pointer relative py-0.5"
                  >
                    <span className={`w-5 h-5 flex items-center justify-center rounded-full font-medium transition ${
                      isToday
                        ? "bg-red-500 text-white font-semibold"
                        : isSelected
                          ? isDarkMode ? "bg-white/20 text-white" : "bg-black/10 text-gray-900"
                          : cell.isCurrentMonth
                            ? isWeekend
                              ? isDarkMode ? "text-white/40" : "text-gray-400"
                              : isDarkMode ? "text-white" : "text-black"
                            : isDarkMode ? "text-white/25" : "text-gray-400"
                    }`}>
                      {cell.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </aside>

      {/* ── Main View Panel ── */}
      <main className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden">
        
        {/* Header toolbar */}
        <div className={`window-drag-handle h-12 border-b flex items-center justify-between px-6 shrink-0 select-none ${
          isDarkMode ? "border-white/10 bg-[#1E1E1E]" : "border-black/[0.08] bg-[#F6F6F6]"
        }`}>
          {/* Add event button */}
          <button 
            onClick={() => handleOpenCreateModal()}
            className={`w-7 h-7 rounded-full flex items-center justify-center border transition ${
              isDarkMode 
                ? "border-white/10 bg-white/5 hover:bg-white/10 text-white" 
                : "border-black/[0.08] bg-white hover:bg-gray-50 text-gray-700 shadow-2xs"
            }`}
          >
            <Plus size={15} className="stroke-[2.5]" />
          </button>

          {/* Switch View segmented toggle */}
          <div className={`p-0.5 rounded-full flex items-center select-none ${
            isDarkMode ? "bg-white/5" : "bg-[#E3E3E5]"
          }`}>
            {["day", "week", "month", "year"].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-1 text-[11px] font-semibold rounded-full capitalize transition ${
                  viewMode === mode
                    ? isDarkMode 
                      ? "bg-white/15 text-white shadow-xs" 
                      : "bg-white text-gray-900 shadow-xs"
                    : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Search bar button toggle */}
          <div className="flex items-center gap-2 relative">
            {showSearch && (
              <input 
                type="text"
                placeholder="Search events"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`absolute right-9 w-44 px-2.5 py-1 text-[11.5px] rounded-full border outline-none ${
                  isDarkMode 
                    ? "bg-[#2D2D2D] border-white/10 text-white focus:border-blue-500" 
                    : "bg-white border-black/10 text-gray-800 focus:border-blue-500"
                }`}
                autoFocus
              />
            )}
            <button 
              onClick={() => setShowSearch(!showSearch)}
              className={`w-7 h-7 rounded-full flex items-center justify-center border transition ${
                isDarkMode 
                  ? "border-white/10 bg-white/5 hover:bg-white/10 text-gray-400" 
                  : "border-black/[0.08] bg-white hover:bg-gray-50 text-gray-600 shadow-2xs"
              }`}
            >
              <Search size={14} className="stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Calendar Nav Sub-header */}
        <div className="window-drag-handle px-6 py-4 flex items-center justify-between shrink-0 select-none">
          {/* Active Context Title */}
          <h2 className={`text-[28px] font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            {getMonthName(activeDate)} <span className="font-medium text-gray-400">{activeDate.getFullYear()}</span>
          </h2>

          {/* Nav chevrons & Today */}
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => handleNavigate(-1)}
              className={`w-7 h-7 rounded-full flex items-center justify-center border transition ${
                isDarkMode 
                  ? "border-white/10 bg-white/5 hover:bg-white/10 text-white" 
                  : "border-black/[0.08] bg-white hover:bg-gray-50 text-gray-700 shadow-2xs"
              }`}
              title="Previous"
            >
              <ChevronLeft size={13} className="stroke-[2.5]" />
            </button>
            
            <button 
              onClick={handleGoToday}
              className={`h-7 px-3.5 text-[11px] font-semibold rounded-full border flex items-center justify-center transition ${
                isDarkMode 
                  ? "border-white/10 bg-white/5 hover:bg-white/10 text-white" 
                  : "border-black/[0.08] bg-white hover:bg-gray-50 text-gray-700 shadow-2xs"
              }`}
            >
              Today
            </button>

            <button 
              onClick={() => handleNavigate(1)}
              className={`w-7 h-7 rounded-full flex items-center justify-center border transition ${
                isDarkMode 
                  ? "border-white/10 bg-white/5 hover:bg-white/10 text-white" 
                  : "border-black/[0.08] bg-white hover:bg-gray-50 text-gray-700 shadow-2xs"
              }`}
              title="Next"
            >
              <ChevronRight size={13} className="stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Dynamic Display Grid */}
        <div className="flex-1 overflow-hidden relative">

          {/* ── 1. DAY VIEW ── */}
          {viewMode === "day" && (
            <div className="h-full overflow-y-auto px-6 pb-6 select-none relative">
              <div className="grid grid-cols-[60px_1fr] relative">
                {/* Hourly rows */}
                {Array.from({ length: 24 }).map((_, idx) => {
                  const hour = idx === 0 ? "12 AM" : idx === 12 ? "Noon" : idx > 12 ? `${idx - 12} PM` : `${idx} AM`;
                  return (
                    <React.Fragment key={idx}>
                      <div className="h-16 text-right pr-3 text-[11px] text-gray-400 font-semibold select-none pt-1">
                        {hour}
                      </div>
                      <div className={`h-16 border-t relative ${isDarkMode ? "border-white/5" : "border-black/[0.03]"}`} />
                    </React.Fragment>
                  );
                })}

                {/* Absolutely positioned events */}
                <div className="absolute left-[60px] right-0 top-0 bottom-0 pointer-events-none">
                  {filteredEvents
                    .filter(evt => evt.date === formatDateString(activeDate) && !evt.isAllDay)
                    .map(evt => {
                      const [sh, sm] = evt.startTime.split(":").map(Number);
                      const [eh, em] = evt.endTime.split(":").map(Number);
                      const top = (sh + sm / 60) * 64; // 64px per hour
                      const height = ((eh + em / 60) - (sh + sm / 60)) * 64;
                      
                      return (
                        <div
                          key={evt.id}
                          onClick={() => handleOpenEditModal(evt)}
                          className={`absolute left-2 right-2 rounded-lg p-2 flex flex-col pointer-events-auto cursor-pointer shadow-2xs select-none ${evt.color}`}
                          style={{ top: `${top}px`, height: `${height}px` }}
                        >
                          <span className="font-semibold text-[11.5px] truncate">{evt.title}</span>
                          <span className="text-[9.5px] font-medium opacity-80 mt-0.5">{evt.startTime} - {evt.endTime}</span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* ── 2. WEEK VIEW ── */}
          {viewMode === "week" && (
            <div className="h-full flex flex-col select-none relative">
              {/* Day column headers */}
              <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b shrink-0 select-none pl-6 pr-6 pb-2">
                <div className="w-[60px]" />
                {weekDates.map((date, idx) => {
                  const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
                  const dayNum = date.getDate();
                  const isCurrentDay = date.toDateString() === new Date().toDateString(); // Real today
                  const dayOfWeek = date.getDay();
                  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                  
                  return (
                    <div key={idx} className="flex flex-col items-center">
                      <span className={`text-[11px] font-semibold uppercase tracking-wide ${
                        isWeekend ? "text-gray-400" : "text-black dark:text-white"
                      }`}>{dayName}</span>
                      <span className={`w-7 h-7 flex items-center justify-center rounded-full text-[14px] font-semibold mt-1 ${
                        isCurrentDay 
                          ? "bg-red-500 text-white shadow-xs" 
                          : isWeekend
                            ? isDarkMode ? "text-white/40" : "text-gray-400"
                            : isDarkMode ? "text-white" : "text-black"
                      }`}>
                        {dayNum}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Scrollable grid area */}
              <div className="flex-1 overflow-y-auto px-6 pb-6 relative notes-no-scrollbar" style={{ scrollbarWidth: "none" }}>
                
                {/* 1. All-Day events area at top */}
                <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b pb-2 pt-2 relative select-none">
                  <div className="text-[10px] text-gray-400 font-semibold uppercase pr-3 pt-1 text-right select-none">all-day</div>
                  
                  {weekDates.map((date, dIdx) => {
                    const dateStr = formatDateString(date);
                    const dayAllDayEvents = filteredEvents.filter(evt => evt.isAllDay && evt.date === dateStr);
                    
                    return (
                      <div key={dIdx} className="flex flex-col gap-1 px-1 min-h-[30px] border-r dark:border-white/5 border-black/[0.03] last:border-r-0">
                        {dayAllDayEvents.map(evt => (
                          <div
                            key={evt.id}
                            onClick={() => handleOpenEditModal(evt)}
                            className={`rounded-md px-2 py-0.5 text-[10.5px] font-semibold truncate cursor-pointer transition select-none flex items-center gap-1.5 shadow-2xs hover:brightness-105 ${evt.color}`}
                          >
                            {evt.isBullet && <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />}
                            <span>{evt.title}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>

                {/* 2. Hourly Grid slots */}
                <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] relative pt-2">
                  
                  {/* Hours labels on the left */}
                  <div className="flex flex-col">
                    {Array.from({ length: 24 }).map((_, idx) => {
                      const hourStr = idx === 0 ? "12 AM" : idx === 12 ? "Noon" : idx > 12 ? `${idx - 12} PM` : `${idx} AM`;
                      return (
                        <div key={idx} className="h-16 text-right pr-3 text-[10.5px] text-gray-400 font-semibold select-none pt-1">
                          {hourStr}
                        </div>
                      );
                    })}
                  </div>

                  {/* 7 Columns for weekly slots grid */}
                  {weekDates.map((date, dIdx) => {
                    const dateStr = formatDateString(date);
                    const dayEvents = filteredEvents.filter(evt => !evt.isAllDay && evt.date === dateStr);
                    
                    return (
                      <div key={dIdx} className="h-full border-r last:border-r-0 dark:border-white/5 border-black/[0.03] relative">
                        
                        {/* Hour slot background lines */}
                        {Array.from({ length: 24 }).map((_, hIdx) => (
                          <div 
                            key={hIdx} 
                            onClick={() => handleOpenCreateModal(dateStr, `${String(hIdx).padStart(2, "0")}:00`)}
                            className={`h-16 border-t cursor-pointer ${isDarkMode ? "border-white/5" : "border-black/[0.03]"}`} 
                          />
                        ))}

                        {/* Events absolute overlay inside column */}
                        {dayEvents.map(evt => {
                          const [sh, sm] = evt.startTime.split(":").map(Number);
                          const [eh, em] = evt.endTime.split(":").map(Number);
                          const top = (sh + sm / 60) * 64; // 64px per hour
                          const height = ((eh + em / 60) - (sh + sm / 60)) * 64;
                          
                          return (
                            <div
                              key={evt.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenEditModal(evt);
                              }}
                              className={`absolute left-1 right-1 rounded-lg p-2 flex flex-col cursor-pointer transition select-none shadow-2xs hover:brightness-105 ${evt.color}`}
                              style={{ top: `${top}px`, height: `${height}px`, zIndex: 10 }}
                            >
                              <span className="font-semibold text-[11px] truncate leading-normal">{evt.title}</span>
                              <span className="text-[9px] font-medium opacity-80 leading-none mt-0.5 truncate">{evt.startTime} - {evt.endTime}</span>
                            </div>
                          );
                        })}

                        {/* Real-time red time indicator line */}
                        {date.toDateString() === new Date().toDateString() && (
                          <div className="absolute left-0 right-0 z-20 pointer-events-none" style={{ top: `${(new Date().getHours() + new Date().getMinutes() / 60) * 64}px` }}>
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500 -ml-1.5 -mt-1 shadow-sm" />
                            <div className="h-[1.5px] bg-red-500 w-full" />
                            <span className="absolute -left-[54px] -top-2 text-[10px] font-semibold text-red-500 bg-white dark:bg-[#1E1E1E] px-1 rounded">
                              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}

                </div>

              </div>
            </div>
          )}

          {/* ── 3. MONTH VIEW ── */}
          {viewMode === "month" && (
            <div className="h-full flex flex-col select-none pr-6 pl-6 pb-6">
              {/* Day headers */}
              <div className="grid grid-cols-7 text-center font-bold text-[11px] mb-2">
                <span className="text-gray-400">Sun</span>
                <span className="text-black dark:text-white">Mon</span>
                <span className="text-black dark:text-white">Tue</span>
                <span className="text-black dark:text-white">Wed</span>
                <span className="text-black dark:text-white">Thu</span>
                <span className="text-black dark:text-white">Fri</span>
                <span className="text-gray-400">Sat</span>
              </div>

              {/* Month calendar grid */}
              <div className="flex-1 grid grid-cols-7 grid-rows-6 border-t border-l dark:border-white/5 border-black/[0.04] select-none rounded-lg overflow-hidden">
                {getDaysInMonth(activeDate.getFullYear(), activeDate.getMonth()).map((cell, idx) => {
                  const dateStr = formatDateString(cell.date);
                  const dayEvents = filteredEvents.filter(evt => evt.date === dateStr);
                  const isCurrentDay = cell.date.toDateString() === new Date().toDateString();
                  const dayOfWeek = cell.date.getDay();
                  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                  
                  return (
                    <div 
                      key={idx}
                      onClick={() => handleOpenCreateModal(dateStr)}
                      className={`border-r border-b dark:border-white/5 border-black/[0.04] p-1.5 flex flex-col justify-start min-w-0 min-h-0 relative ${
                        cell.isCurrentMonth 
                          ? isDarkMode ? "bg-transparent hover:bg-white/[0.02]" : "bg-transparent hover:bg-black/[0.01]" 
                          : isDarkMode ? "bg-white/[0.02]" : "bg-black/[0.02]"
                      }`}
                    >
                      {/* Day number cell top */}
                      <div className="flex justify-between items-center select-none">
                        <span className={`text-[10px] font-semibold w-5 h-5 flex items-center justify-center rounded-full ${
                          isCurrentDay
                            ? "bg-red-500 text-white"
                            : cell.isCurrentMonth
                              ? isWeekend
                                ? isDarkMode ? "text-white/40" : "text-gray-400"
                                : isDarkMode ? "text-white" : "text-black"
                              : isDarkMode ? "text-white/20" : "text-gray-400"
                        }`}>
                          {cell.day}
                        </span>
                      </div>

                      {/* Events listed inside cell */}
                      <div className="flex-1 overflow-y-auto mt-1 flex flex-col gap-1.5 notes-no-scrollbar" style={{ scrollbarWidth: "none" }}>
                        {dayEvents.map(evt => (
                          <div
                            key={evt.id}
                            onClick={(e) => {
                               e.stopPropagation();
                              handleOpenEditModal(evt);
                            }}
                            className={`rounded px-1.5 py-0.5 text-[9.5px] font-semibold truncate cursor-pointer hover:brightness-105 shadow-3xs flex items-center gap-1 ${
                              evt.isAllDay 
                                ? evt.color 
                                : `bg-black/5 dark:bg-white/5 border-l-2 border-${evt.calendar === "work" ? "red" : evt.calendar === "family" ? "green" : evt.calendar === "school" ? "amber" : "sky"}-500 text-inherit`
                            }`}
                          >
                            {!evt.isAllDay && <span className="text-[8px] font-semibold text-gray-500">{evt.startTime}</span>}
                            <span className="truncate">{evt.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── 4. YEAR VIEW ── */}
          {viewMode === "year" && (
            <div className="h-full overflow-y-auto px-6 pb-6 select-none notes-no-scrollbar" style={{ scrollbarWidth: "none" }}>
              <div className="grid grid-cols-4 gap-6 gap-y-8 select-none">
                {Array.from({ length: 12 }).map((_, mIdx) => {
                  const mName = new Date(activeDate.getFullYear(), mIdx).toLocaleDateString("en-US", { month: "long" });
                  const cells = getDaysInMonth(activeDate.getFullYear(), mIdx);
                  
                  return (
                    <div 
                      key={mIdx} 
                      onClick={() => {
                        setActiveDate(new Date(activeDate.getFullYear(), mIdx, 1));
                        setViewMode("month");
                      }}
                      className="flex flex-col cursor-pointer hover:scale-[1.02] transition duration-200"
                    >
                      <h4 className={`font-semibold text-[12.5px] pl-1 mb-2 ${
                        mIdx === new Date().getMonth() && activeDate.getFullYear() === new Date().getFullYear() ? "text-red-500" : isDarkMode ? "text-white" : "text-gray-900"
                      }`}>
                        {mName}
                      </h4>
                      
                      <div className="grid grid-cols-7 text-center text-[7.5px] font-semibold mb-1">
                        <span className="text-gray-400">S</span>
                        <span className="text-black dark:text-white">M</span>
                        <span className="text-black dark:text-white">T</span>
                        <span className="text-black dark:text-white">W</span>
                        <span className="text-black dark:text-white">T</span>
                        <span className="text-black dark:text-white">F</span>
                        <span className="text-gray-400">S</span>
                      </div>
                      
                      <div className="grid grid-cols-7 text-center text-[8.5px]">
                        {cells.map((cell, cIdx) => {
                          const isToday = cell.date.toDateString() === new Date().toDateString();
                          const dayOfWeek = cell.date.getDay();
                          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                          
                          return (
                            <span 
                              key={cIdx} 
                              className={`aspect-square flex items-center justify-center rounded-full font-bold ${
                                isToday
                                  ? "bg-red-500 text-white font-extrabold"
                                  : cell.isCurrentMonth
                                    ? isWeekend
                                      ? isDarkMode ? "text-white/40" : "text-gray-400"
                                      : isDarkMode ? "text-white" : "text-black"
                                    : "text-transparent"
                              }`}
                            >
                              {cell.isCurrentMonth ? cell.day : ""}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ── 5. EVENT CRUD MODAL DIALOG ── */}
      {showEventModal && (
        <div className="absolute inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center z-[99999] select-none animate-fade">
          <form 
            onSubmit={handleSaveEvent}
            className={`w-[360px] rounded-2xl p-5 border shadow-2xl flex flex-col gap-4 animate-scale ${
              isDarkMode ? "bg-[#2A2A2A] border-white/10 text-white" : "bg-white border-black/10 text-gray-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-[15px]">{modalMode === "create" ? "New Event" : "Edit Event"}</span>
              <button 
                type="button"
                onClick={() => setShowEventModal(false)}
                className={`p-1.5 rounded-full transition ${isDarkMode ? "hover:bg-white/10 text-gray-400" : "hover:bg-black/5 text-gray-500"}`}
              >
                <X size={15} />
              </button>
            </div>

            {/* Input title */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-extrabold uppercase text-gray-400">Title</label>
              <input 
                type="text" 
                required
                placeholder="Event Title"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                className={`w-full px-3 py-2 text-[12.5px] rounded-lg border outline-none ${
                  isDarkMode 
                    ? "bg-[#1E1E1E] border-white/10 text-white focus:border-blue-500" 
                    : "bg-gray-50 border-black/10 text-gray-800 focus:border-blue-500"
                }`}
              />
            </div>

            {/* Date input */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-extrabold uppercase text-gray-400">Date</label>
              <input 
                type="date" 
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className={`w-full px-3 py-2 text-[12.5px] rounded-lg border outline-none ${
                  isDarkMode 
                    ? "bg-[#1E1E1E] border-white/10 text-white focus:border-blue-500" 
                    : "bg-gray-50 border-black/10 text-gray-800 focus:border-blue-500"
                }`}
              />
            </div>

            {/* All day toggle checkbox */}
            <div className="flex items-center gap-2 py-1 select-none">
              <input 
                type="checkbox" 
                id="allday"
                checked={eventIsAllDay}
                onChange={(e) => setEventIsAllDay(e.target.checked)}
                className="w-4 h-4 cursor-pointer"
              />
              <label htmlFor="allday" className="text-[12px] font-semibold cursor-pointer select-none">All-Day Event</label>
            </div>

            {/* Times if not all-day */}
            {!eventIsAllDay && (
              <div className="grid grid-cols-2 gap-3 animate-fade">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-extrabold uppercase text-gray-400">Start Time</label>
                  <input 
                    type="time" 
                    required
                    value={eventStartTime}
                    onChange={(e) => setEventStartTime(e.target.value)}
                    className={`w-full px-3 py-2 text-[12.5px] rounded-lg border outline-none ${
                      isDarkMode 
                        ? "bg-[#1E1E1E] border-white/10 text-white focus:border-blue-500" 
                        : "bg-gray-50 border-black/10 text-gray-800 focus:border-blue-500"
                    }`}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-extrabold uppercase text-gray-400">End Time</label>
                  <input 
                    type="time" 
                    required
                    value={eventEndTime}
                    onChange={(e) => setEventEndTime(e.target.value)}
                    className={`w-full px-3 py-2 text-[12.5px] rounded-lg border outline-none ${
                      isDarkMode 
                        ? "bg-[#1E1E1E] border-white/10 text-white focus:border-blue-500" 
                        : "bg-gray-50 border-black/10 text-gray-800 focus:border-blue-500"
                    }`}
                  />
                </div>
              </div>
            )}

            {/* Calendar list dropdown */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-extrabold uppercase text-gray-400">Calendar Folder</label>
              <select 
                value={eventCalendar}
                onChange={(e) => setEventCalendar(e.target.value)}
                className={`w-full px-3 py-2 text-[12.5px] rounded-lg border outline-none ${
                  isDarkMode 
                    ? "bg-[#1E1E1E] border-white/10 text-white focus:border-blue-500" 
                    : "bg-gray-50 border-black/10 text-gray-800 focus:border-blue-500"
                }`}
              >
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="family">Family</option>
                <option value="school">School</option>
              </select>
            </div>

            {/* Actions: Save / Delete */}
            <div className="flex items-center justify-between gap-3 pt-3 mt-1 border-t border-black/5 dark:border-white/5">
              {modalMode === "edit" ? (
                <button
                  type="button"
                  onClick={handleDeleteEvent}
                  className="flex items-center gap-1.5 text-red-500 hover:text-red-600 hover:bg-red-500/10 px-3 py-2 rounded-lg text-[12px] font-bold transition mr-auto"
                >
                  <Trash2 size={13} />
                  <span>Delete</span>
                </button>
              ) : (
                <div />
              )}
              
              <div className="flex items-center gap-3">
                <button 
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className={`px-4 py-2 text-[12px] font-bold rounded-lg transition ${
                    isDarkMode ? "hover:bg-white/5 text-gray-300" : "hover:bg-black/5 text-gray-600"
                  }`}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-[12px] font-extrabold rounded-lg shadow-sm"
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
