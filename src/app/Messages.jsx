import React, { useState, useRef, useEffect } from "react";
import { useAppStore } from "../store/Appstore";
import { Search, Video, SquarePen, Smile, Volume2, Send, Plus, ChevronRight } from "lucide-react";

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

export default function Messages({ windowId }) {
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  const [activeChatId, setActiveChatId] = useState("orkun");
  const [searchQuery, setSearchQuery] = useState("");
  const [inputVal, setInputVal] = useState("");
  const messagesEndRef = useRef(null);

  // Mock Pinned Contacts
  const pinnedContacts = [
    { id: "ashley", name: "Ashley", avatar: "/icons/PngItem_4082636.png", bg: "bg-red-100", tip: "Did the kids finish their homework?", hasUnread: true, isImage: true },
    { id: "dawn", name: "Dawn", avatar: "/icons/PngItem_4409921.png", bg: "bg-amber-100", isImage: true },
    { id: "rico", name: "Rico Family", avatar: "/icons/PngItem_4608119.png", bg: "bg-sky-100", hasUnread: true, isImage: true },
    { id: "olivia", name: "Olivia", avatar: "/icons/PngItem_5031003.png", bg: "bg-purple-100", badge: "🌈", hasUnread: true, isImage: true },
    { id: "will", name: "Will", avatar: "/icons/PngItem_6304991.png", bg: "bg-green-100", badge: "❤️", isImage: true },
    { id: "animation", name: "Animation Team", avatar: "/icons/PngItem_6452863.png", bg: "bg-orange-200", isImage: true },
    { id: "foodie", name: "Foodie Friends", avatar: "/icons/PngItem_4082636.png", bg: "bg-teal-200", isImage: true },
    { id: "hiker", name: "Hiker Neighbors", avatar: "/icons/PngItem_4409921.png", bg: "bg-blue-200", isImage: true },
    { id: "aileen", name: "Aileen & Rich", avatar: "/icons/PngItem_4608119.png", bg: "bg-rose-200", isImage: true }
  ];

  // Conversations and Chat History
  const [conversations, setConversations] = useState([
    {
      id: "orkun",
      name: "Orkun Kucuksevim",
      avatar: "/icons/PngItem_4608119.png",
      avatarBg: "bg-orange-50",
      isImage: true,
      date: "Sunday",
      isGroup: false,
      colorTheme: "blue", // SMS Style
      messages: [
        { id: 1, sender: "Orkun", text: "For family game night Friday, could we borrow some puzzles, please?", time: "Sunday 10:20 AM" },
        { id: 2, sender: "me", text: "Like a jigsaw puzzle or the wood and metal brain teasers?", time: "Sunday 10:22 AM" },
        { id: 3, sender: "Orkun", text: "Oh! 🧠 I forgot that you collect all kinds of puzzles", time: "Sunday 10:23 AM" },
        { id: 4, sender: "Orkun", text: "Let's stick with the jigsaws for now", time: "Sunday 10:24 AM" },
        { id: 5, sender: "me", text: "Anytime, neighbor", time: "Sunday 10:25 AM" },
        { id: 6, sender: "me", text: "I have the perfect puzzle for you to challenge the kids", time: "Sunday 10:26 AM" },
        { id: 7, sender: "me", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800", time: "Sunday 10:27 AM" },
        { id: 8, sender: "me", text: "But only if you carefully count all 1000 pieces before returning it 😜", time: "Sunday 10:28 AM" },
        { id: 9, sender: "Orkun", text: "Hmm. Maybe just a 500 piece one? 😂", time: "Sunday 10:30 AM" },
        { id: 10, sender: "Orkun", text: "Or I can just put the kids on one?", time: "Sunday 10:31 AM" },
        { id: 11, sender: "me", text: "Come by if you want them", time: "Sunday 10:32 AM", isRead: true },
        { id: 12, sender: "Orkun", text: "Thanks for the puzzles!", time: "Sunday 10:35 AM" }
      ]
    },
    {
      id: "hiker",
      name: "Hiker Neighbors",
      avatar: "/icons/PngItem_4409921.png",
      avatarBg: "bg-blue-100",
      isImage: true,
      date: "Sunday",
      isGroup: true,
      colorTheme: "blue", // iMessage Style
      messages: [
        { id: 1, sender: "Xiaomeng Zhong", text: "Oh, wow! Where 🌍 ⁉️", time: "Sunday 9:30 AM" },
        { id: 2, sender: "me", text: "They're on a secret mission...", time: "Sunday 9:32 AM", isRead: true },
        { id: 3, sender: "Orkun", text: "Give us a clue!", time: "Sunday 9:35 AM", reaction: "😂 HAHA" },
        { id: 4, sender: "Hiker Neighbors", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600", time: "Sunday 9:40 AM" }
      ]
    },
    {
      id: "trev",
      name: "Trev Smith",
      avatar: "/icons/PngItem_6452863.png",
      avatarBg: "bg-yellow-50",
      isImage: true,
      date: "Yesterday",
      isGroup: false,
      colorTheme: "blue",
      messages: [
        { id: 1, sender: "Trev", text: "Gotcha covered!", time: "Yesterday 4:15 PM" }
      ]
    },
    {
      id: "antonio",
      name: "Antonio Manriquez",
      avatar: "/icons/PngItem_6452863.png",
      avatarBg: "bg-green-50",
      isImage: true,
      date: "Sunday",
      isGroup: false,
      colorTheme: "blue",
      messages: [
        { id: 1, sender: "Antonio", text: "Is your mind blown? 🤯", time: "Sunday 2:10 PM" }
      ]
    },
    {
      id: "xiaomeng",
      name: "Xiaomeng Zhong",
      avatar: "/icons/PngItem_5031003.png",
      avatarBg: "bg-purple-50",
      isImage: true,
      date: "Sunday",
      isGroup: false,
      colorTheme: "blue",
      messages: [
        { id: 1, sender: "Xiaomeng", text: "Now you've got me thinking about my next vacation", time: "Sunday 1:05 PM" }
      ]
    },
    {
      id: "jasmine",
      name: "Jasmine Garcia",
      avatar: "/icons/PngItem_4082636.png",
      avatarBg: "bg-rose-50",
      isImage: true,
      date: "Saturday",
      isGroup: false,
      colorTheme: "blue",
      messages: [
        { id: 1, sender: "Jasmine", text: "See you tomorrow!", time: "Saturday 5:30 PM" }
      ]
    },
    {
      id: "nisha",
      name: "Nisha Kumar",
      avatar: "/icons/PngItem_5031003.png",
      avatarBg: "bg-teal-50",
      isImage: true,
      date: "Friday",
      isGroup: false,
      colorTheme: "blue",
      messages: [
        { id: 1, sender: "Nisha", text: "Cool... I'll be by just before 7 to drop off the birthday cake 🎂", time: "Friday 6:00 PM" }
      ]
    }
  ]);

  const activeChat = conversations.find(c => c.id === activeChatId) || conversations[0];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: "me",
      text: inputVal,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true
    };

    setConversations(prev => prev.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          messages: [...chat.messages, newMsg],
          date: "Just Now"
        };
      }
      return chat;
      }));

    setInputVal("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat.messages]);

  const filteredConversations = conversations.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div 
      className={`messages-container flex h-full w-full select-none text-[13px] rounded-xl overflow-hidden ${
        isDarkMode ? "bg-[#1E1E1E] text-white" : "bg-white text-gray-800"
      }`}
    >
      
      {/* Sidebar */}
      <aside className={`w-[290px] flex flex-col shrink-0 border-r rounded-xl overflow-hidden ${
        isDarkMode ? "border-white/10 bg-[#1E1E1E]" : "border-[#E5E5E5] bg-[#F6F6F6]"
      }`}>
        {/* Title bar controls spacer */}
        <div className="window-drag-handle h-11 flex items-center px-4 shrink-0 justify-between">
          <TrafficLights windowId={windowId} />
          {/* Circular compose button on the right of the sidebar header in macOS */}
          <button className={`w-7 h-7 flex items-center justify-center rounded-full transition ${
            isDarkMode ? "hover:bg-white/5 text-gray-300" : "hover:bg-black/5 text-gray-700"
          }`} title="New Message">
            <SquarePen size={15} />
          </button>
        </div>

        {/* Search bar */}
        <div className="px-3.5 pb-3 shrink-0">
          <div className={`relative flex items-center rounded-full px-3 py-1.5 border ${
            isDarkMode 
              ? "bg-[#2A2A2A] border-white/5 text-gray-300 focus-within:border-blue-500/50" 
              : "bg-[#E3E3E5] border-transparent text-gray-600 focus-within:bg-white focus-within:border-blue-500/30"
          } transition-all duration-200`}>
            <Search size={14} className="text-gray-400 mr-2 shrink-0" />
            <input 
              type="text" 
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-[13px] outline-none placeholder-gray-500 text-inherit"
            />
          </div>
        </div>

        {/* Pinned Grid Section */}
        <div className="px-4 pb-4 grid grid-cols-3 gap-y-4 gap-x-3 shrink-0 border-b border-black/[0.04] dark:border-white/[0.04]">
          {pinnedContacts.slice(0, 9).map(contact => {
            const isSelected = activeChatId === contact.id;
            return (
              <div 
                key={contact.id} 
                onClick={() => {
                  if (conversations.some(c => c.id === contact.id)) {
                    setActiveChatId(contact.id);
                  } else {
                    // Create new conversation on demand
                    const newChat = {
                      id: contact.id,
                      name: contact.name,
                      avatar: contact.avatar,
                      avatarBg: contact.bg,
                      isImage: contact.isImage,
                      date: "Just Now",
                      isGroup: false,
                      colorTheme: "blue",
                      messages: [
                        { id: 1, sender: contact.name, text: contact.tip || "Hey there!", time: "Just Now" }
                      ]
                    };
                    setConversations(prev => [newChat, ...prev]);
                    setActiveChatId(contact.id);
                  }
                }}
                className="flex flex-col items-center cursor-pointer relative group text-center"
              >
                <div className="relative w-[72px] h-[72px]">
                  <div className={`w-full h-full rounded-full flex items-center justify-center overflow-hidden transition-all duration-200 ${contact.bg} ${
                    isSelected ? "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-[#1E1E1E]" : "group-hover:scale-105"
                  } shadow-md p-1`}>
                    {contact.isImage ? (
                      <img src={contact.avatar} alt={contact.name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-[30px]">{contact.avatar}</span>
                    )}
                  </div>
                  {contact.badge && (
                    <span className="absolute -bottom-1.5 -right-1.5 text-[11px] bg-white dark:bg-gray-800 rounded-full w-5 h-5 flex items-center justify-center border border-black/10 z-10 shadow-md">
                      {contact.badge}
                    </span>
                  )}
                  {contact.hasUnread && (
                    <span className="absolute -top-0.5 -left-0.5 w-3.5 h-3.5 bg-[#007AFF] rounded-full border-2 border-[#F6F6F6] dark:border-[#1E1E1E] z-10 shadow-md" />
                  )}
                </div>
                <span className={`text-[11px] font-medium truncate w-full mt-1.5 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}>
                  {contact.name.split(" ")[0]}
                </span>
                {/* Tip box mockup on hover for fun */}
                {contact.tip && (
                  <div className="absolute z-50 bottom-20 left-1/2 -translate-x-1/2 w-32 bg-black/95 text-white text-[10px] p-2 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition duration-200 shadow-xl border border-white/10">
                    {contact.tip}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto notes-no-scrollbar" style={{ scrollbarWidth: "none" }}>
          {filteredConversations.map(chat => {
            const isSelected = activeChatId === chat.id;
            const lastMsg = chat.messages[chat.messages.length - 1];
            
            return (
              <div 
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer border-b ${
                  isDarkMode ? "border-white/5" : "border-black/[0.03]"
                } ${
                  isSelected 
                    ? "bg-[#007AFF] text-white" 
                    : isDarkMode ? "hover:bg-white/5" : "hover:bg-black/[0.02]"
                }`}
              >
                <div className={`w-11 h-11 rounded-full flex items-center justify-center overflow-hidden shrink-0 ${chat.avatarBg} shadow-sm p-0.5`}>
                  {chat.isImage ? (
                    <img src={chat.avatar} alt={chat.name} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-[20px]">{chat.avatar}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[13px] truncate">{chat.name}</span>
                    <span className={`text-[10px] shrink-0 ${isSelected ? "text-white/80" : "text-gray-400"}`}>{chat.date}</span>
                  </div>
                  <p className={`text-[11px] truncate mt-0.5 ${
                    isSelected ? "text-white/90" : isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}>
                    {lastMsg?.image ? "📷 Photo" : lastMsg?.text || ""}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Chat Area */}
      <main className="flex-1 flex flex-col min-w-0 relative h-full rounded-r-xl overflow-hidden">
        {/* Top Header */}
        <header className={`window-drag-handle h-[68px] flex items-center justify-between px-6 shrink-0 border-b select-none ${
          isDarkMode ? "border-white/10 bg-[#1E1E1E]" : "border-[#E5E5E5] bg-[#FFFFFF]"
        }`}>
          {/* Left Compose Button - Circular iMessage Style */}
          <button className={`w-9 h-9 flex items-center justify-center rounded-full border transition ${
            isDarkMode 
              ? "bg-white/[0.04] border-white/10 hover:bg-white/[0.08] text-gray-300" 
              : "bg-black/[0.04] border-black/5 hover:bg-black/[0.08] text-gray-700"
          }`} title="New Message">
            <SquarePen size={16} />
          </button>

          {/* Active Chat info - Stacked layout matching native iMessage */}
          <div className="flex flex-col items-center cursor-pointer py-1 group">
            <div className={`w-[34px] h-[34px] rounded-full flex items-center justify-center overflow-hidden text-[12px] bg-gray-200 dark:bg-gray-700 p-0.5 shadow-sm border border-black/5 dark:border-white/10`}>
              {activeChat.isImage ? (
                <img src={activeChat.avatar} alt={activeChat.name} className="w-full h-full object-contain" />
              ) : (
                <span className="text-[14px]">{activeChat.avatar}</span>
              )}
            </div>
            {/* Pill Name Card */}
            <div className={`mt-1 flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-medium transition ${
              isDarkMode 
                ? "bg-white/[0.05] hover:bg-white/[0.1] text-gray-300" 
                : "bg-black/[0.05] hover:bg-black/[0.08] text-gray-700"
            }`}>
              <span>{activeChat.name}</span>
              <ChevronRight size={10} className="text-gray-400 dark:text-gray-500" />
            </div>
          </div>

          {/* Right FaceTime Video Call Icon - Circular iMessage Style */}
          <button className={`w-9 h-9 flex items-center justify-center rounded-full border transition ${
            isDarkMode 
              ? "bg-white/[0.04] border-white/10 hover:bg-white/[0.08] text-gray-300" 
              : "bg-black/[0.04] border-black/5 hover:bg-black/[0.08] text-gray-700"
          }`} title="FaceTime video call">
            <Video size={16} />
          </button>
        </header>

        {/* Message bubble stream */}
        <div 
          className="flex-1 overflow-y-auto px-6 py-4 space-y-4 notes-no-scrollbar"
          style={{ scrollbarWidth: "none" }}
        >
          {activeChat.messages.map((msg, index) => {
            const isMe = msg.sender === "me";
            const prevMsg = index > 0 ? activeChat.messages[index - 1] : null;
            const showSenderName = activeChat.isGroup && !isMe && prevMsg?.sender !== msg.sender;
            
            return (
              <div 
                key={msg.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                {showSenderName && (
                  <span className="text-[10px] text-gray-400 ml-3 mb-1">{msg.sender}</span>
                )}

                <div className="flex items-end gap-1.5 relative group max-w-[70%]">
                  
                  {/* Avatar for Incoming Group Messages */}
                  {activeChat.isGroup && !isMe && (
                    <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center shrink-0 mb-0.5 bg-gray-200 p-0.5">
                      <img 
                        src={msg.sender === "Xiaomeng Zhong" ? "/icons/PngItem_5031003.png" : "/icons/PngItem_4608119.png"} 
                        alt={msg.sender} 
                        className="w-full h-full object-contain" 
                        />
                    </div>
                  )}

                  {/* Bubble Container */}
                  <div className="relative">
                    {msg.image ? (
                      <div className="rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 shadow-sm">
                        <img src={msg.image} alt="attachment" className="max-w-[280px] max-h-[220px] object-cover" />
                      </div>
                    ) : (
                      <div className={`px-3.5 py-2 rounded-2xl text-[12.3px] leading-relaxed relative ${
                        isMe 
                          ? activeChat.colorTheme === "green" 
                            ? "bg-[#34C759] text-white rounded-br-xs" 
                            : "bg-[#007AFF] text-white rounded-br-xs"
                          : isDarkMode 
                            ? "bg-[#3A3A3C] text-white rounded-bl-xs" 
                            : "bg-[#E9E9EB] text-black rounded-bl-xs"
                      }`}>
                        {msg.text}
                      </div>
                    )}

                    {/* Reaction badges */}
                    {msg.reaction && (
                      <div className="absolute -top-2.5 -right-2 bg-white dark:bg-[#2C2C2E] border border-black/10 dark:border-white/10 shadow-md rounded-full px-1.5 py-0.5 text-[9px] font-bold flex items-center gap-0.5">
                        {msg.reaction}
                      </div>
                    )}
                  </div>

                  {/* Reaction trigger overlays (simulate tapback on hover) */}
                  <div className="absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition flex items-center gap-1 z-50 bg-white/90 dark:bg-black/90 px-2 py-1 rounded-full border border-black/10 shadow-md shrink-0 pointer-events-auto cursor-pointer text-[10px]"
                    style={{ left: isMe ? "-85px" : "105%", transform: "translateY(-50%)" }}
                    onClick={() => {
                      setConversations(prev => prev.map(chat => {
                        if (chat.id === activeChatId) {
                          return {
                            ...chat,
                            messages: chat.messages.map(m => m.id === msg.id ? { ...m, reaction: "❤️" } : m)
                          };
                        }
                        return chat;
                      }));
                    }}
                  >
                    ❤️ 😂 🧠 🥫
                  </div>

                </div>

                {/* Read status label */}
                {isMe && msg.isRead && index === activeChat.messages.length - 1 && (
                  <span className="text-[9px] text-gray-400 mt-1 mr-1">Read</span>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar Footer */}
        <form 
          onSubmit={handleSendMessage}
          className={`px-4 py-3 border-t flex items-center gap-2.5 shrink-0 ${
            isDarkMode ? "border-white/10 bg-[#1E1E1E]" : "border-[#E5E5E5] bg-[#FFFFFF]"
          }`}
        >
          {/* Plus Icon button */}
          <button 
            type="button"
            className={`p-1.5 rounded-full transition ${
              isDarkMode ? "hover:bg-white/5 text-gray-300" : "hover:bg-black/5 text-gray-600"
            }`}
          >
            <Plus size={16} />
          </button>

          {/* Text Input */}
          <div className={`flex-1 flex items-center rounded-full border px-3.5 py-1.5 ${
            isDarkMode 
              ? "bg-[#1E1E1E] border-white/15 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500" 
              : "bg-[#FCFCFC] border-[#DCDCDC] focus-within:border-blue-400 focus-within:bg-white focus-within:ring-1 focus-within:ring-blue-400"
          }`}>
            <input 
              type="text" 
              placeholder="iMessage"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-full bg-transparent text-[12.3px] outline-none placeholder-gray-400 text-inherit"
            />
            {/* Waveform audio button */}
            <button 
              type="button" 
              className="p-1 hover:text-blue-500 text-gray-400 transition"
              title="Dictation"
            >
              <Volume2 size={15} />
            </button>
          </div>

          {/* Emoji button */}
          <button 
            type="button"
            className={`p-1.5 rounded-full transition ${
              isDarkMode ? "hover:bg-white/5 text-gray-300" : "hover:bg-black/5 text-gray-600"
            }`}
          >
            <Smile size={16} />
          </button>

          {/* Send button */}
          <button 
            type="submit"
            className="p-1.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition shadow-sm"
          >
            <Send size={14} />
          </button>
        </form>

      </main>

    </div>
  );
}

