// src/components/TopBar.jsx
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Calendar } from "./ui/calendar";
import { FiSearch, FiMic } from "react-icons/fi";
import ControlCenter from "./ControlCenter";

// macOS Style Apple Logo
const AppleLogo = () => (
  <svg width="14" height="17" viewBox="0 0 170 170" fill="currentColor">
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.197-2.12-9.973-3.17-14.34-3.17-4.58 0-9.492 1.05-14.746 3.17-5.262 2.13-9.501 3.24-12.742 3.35-4.929 0.21-9.842-1.96-14.746-6.52-3.13-2.73-7.045-7.41-11.735-14.04-5.032-7.08-9.169-15.29-12.41-24.65-3.471-10.11-5.211-19.9-5.211-29.378 0-10.857 2.346-20.221 7.045-28.068 3.693-6.303 8.606-11.275 14.755-14.925s12.793-5.51 19.948-5.629c3.915 0 9.049 1.211 15.429 3.591 6.362 2.388 10.447 3.599 12.238 3.599 1.339 0 5.877-1.416 13.57-4.239 7.275-2.618 13.415-3.702 18.445-3.275 13.63 1.1 23.87 6.473 30.68 16.153-12.19 7.386-18.22 17.731-18.1 31.002 0.11 10.337 3.86 18.939 11.23 25.769 3.34 3.17 7.07 5.62 11.22 7.36-0.9 2.61-1.85 5.11-2.86 7.51zM119.11 7.24c0 8.102-2.96 15.667-8.86 22.669-7.12 8.324-15.732 13.134-25.071 12.375-0.119-0.972-0.188-1.995-0.188-3.07 0-7.778 3.386-16.102 9.399-22.908 3.002-3.446 6.82-6.311 11.45-8.597 4.62-2.252 8.99-3.497 13.1-3.71 0.12 1.083 0.17 2.166 0.17 3.241z"/>
  </svg>
);

// macOS Style WiFi Icon
const MacWifiIcon = () => (
  <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
    <path d="M8 9.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"/>
    <path d="M8 6.5c1.66 0 3.14.69 4.22 1.78a.75.75 0 1 1-1.06 1.06A4.5 4.5 0 0 0 8 8a4.5 4.5 0 0 0-3.16 1.34.75.75 0 1 1-1.06-1.06A5.98 5.98 0 0 1 8 6.5z"/>
    <path d="M8 3c2.76 0 5.26 1.12 7.07 2.93a.75.75 0 1 1-1.06 1.06A8.48 8.48 0 0 0 8 4.5a8.48 8.48 0 0 0-6.01 2.49.75.75 0 1 1-1.06-1.06A9.98 9.98 0 0 1 8 3z"/>
  </svg>
);

// macOS Style Battery Icon
const MacBatteryIcon = () => (
  <svg width="22" height="12" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.5" y="1" width="16.5" height="10" rx="3" fill="currentColor" />
    <rect x="17.5" y="4" width="2" height="4" rx="1" fill="currentColor" />
  </svg>
);

// macOS Style Control Center Icon
const ControlCenterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor">
    {/* Top Toggle (Off) */}
    <path fillRule="evenodd" clipRule="evenodd" d="M3.25 2C1.73122 2 0.5 3.23122 0.5 4.75C0.5 6.26878 1.73122 7.5 3.25 7.5H11.75C13.2688 7.5 14.5 6.26878 14.5 4.75C14.5 3.23122 13.2688 2 11.75 2H3.25ZM11.75 3.5H3.25C2.55964 3.5 2 4.05964 2 4.75C2 5.44036 2.55964 6 3.25 6H11.75C12.4404 6 13 5.44036 13 4.75C13 4.05964 12.4404 3.5 11.75 3.5Z" />
    <path d="M4.25 3.5C3.55964 3.5 3 4.05964 3 4.75C3 5.44036 3.55964 6 4.25 6H5.25C5.94036 6 6.5 5.44036 6.5 4.75C6.5 4.05964 5.94036 3.5 5.25 3.5H4.25Z" />
    
    {/* Bottom Toggle (On) */}
    <path fillRule="evenodd" clipRule="evenodd" d="M3.25 8.5C1.73122 8.5 0.5 9.73122 0.5 11.25C0.5 12.7688 1.73122 14 3.25 14H11.75C13.2688 14 14.5 12.7688 14.5 11.25C14.5 9.73122 13.2688 8.5 11.75 8.5H3.25ZM12.75 11.25C12.75 11.9404 12.1904 12.5 11.5 12.5C10.8096 12.5 10.25 11.9404 10.25 11.25C10.25 10.5596 10.8096 10 11.5 10C12.1904 10 12.75 10.5596 12.75 11.25Z" />
  </svg>
);

export default function TopBar({ appTitle = "Finder", setStage }) {

  const [ccOpen, setCcOpen] = useState(false);

  function handleAction(action) {
    if (action === "lock") setStage("lock");
    if (action === "logout") setStage("lock");
    if (action === "sleep") setStage("lock");
    if (action === "shutdown") {
      // Try to close the tab/window
      window.close();
      // Fallback: if window.close() doesn't work (browser security), go to power screen
      setStage("power");
    }
  }

  const [time, setTime] = useState(getTime());

  useEffect(() => {
    const id = setInterval(() => setTime(getTime()), 1000);
    return () => clearInterval(id);
  }, []);

  function getTime() {
    const now = new Date();
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    try {
      const weekday = now.toLocaleString("en-US", { weekday: "short", timeZone: tz });
      const month = now.toLocaleString("en-US", { month: "short", timeZone: tz });
      const day = now.toLocaleString("en-US", { day: "numeric", timeZone: tz });
      const t = now.toLocaleString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: tz
      });
      return `${weekday}, ${month} ${day}  ${t}`;
    } catch (e) {
      // Fallback if invalid timezone
      const weekday = now.toLocaleString("en-US", { weekday: "short" });
      const month = now.toLocaleString("en-US", { month: "short" });
      const day = now.getDate();
      const t = now.toLocaleString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      return `${weekday}, ${month} ${day}  ${t}`;
    }
  }

  const hoverStyle =
    " hover:bg-white/10 hover:backdrop-blur-xl rounded px-1.5 py-0.5 transition-all duration-150";

  return (
<div
  className="w-full h-7 flex items-center justify-between px-2 select-none fixed top-0 left-0 z-50 text-white"
  style={{
    background: "linear-gradient(to bottom, rgba(0,0,0,0.08), rgba(0,0,0,0))"
  }}
>
      {/* LEFT */}
      <div className="flex items-center gap-0 text-[14px] font-semibold text-white">
        {/* Apple Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className={`cursor-pointer flex items-center justify-center w-8 h-7 ${hoverStyle}`}
          >
            <AppleLogo />
          </DropdownMenuTrigger>

          <DropdownMenuContent className="bg-black/40 text-white shadow-2xl border-white/10 backdrop-blur-2xl rounded-lg min-w-[200px] mt-1">
            <DropdownMenuLabel className="font-semibold text-white">About This Mac</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/20" />
            <DropdownMenuItem className="text-[13px] focus:bg-white/10 focus:text-white" onClick={() => handleAction("lock")}>
              Lock Screen
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[13px] focus:bg-white/10 focus:text-white" onClick={() => handleAction("logout")}>
              Log Out Likhith SP...
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/20" />
            <DropdownMenuItem className="text-[13px] focus:bg-white/10 focus:text-white" onClick={() => handleAction("sleep")}>
              Sleep
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[13px] focus:bg-white/10 focus:text-white" onClick={() => handleAction("shutdown")}>
              Shut Down...
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* App Name - Bold like Finder */}
        <span className={`font-semibold text-[14px] cursor-default ${hoverStyle}`}>
          {appTitle || "Finder"}
        </span>

        {/* Menu Items */}
        <div className="hidden sm:flex items-center gap-2.5 text-[14px] font-semibold text-white/90">
          {/* FILE */}
          <DropdownMenu>
            <DropdownMenuTrigger className={`cursor-pointer ${hoverStyle}`}>
              File
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black/40 text-white backdrop-blur-2xl border-white/10 shadow-2xl rounded-lg min-w-[180px] mt-1">
              <DropdownMenuItem className="text-[13px] focus:bg-white/10 focus:text-white">New Folder</DropdownMenuItem>
              <DropdownMenuItem className="text-[13px] focus:bg-white/10 focus:text-white">New Finder Window</DropdownMenuItem>
              <DropdownMenuItem className="text-[13px] focus:bg-white/10 focus:text-white">New Tab</DropdownMenuItem>
              <DropdownMenuItem className="text-[13px] focus:bg-white/10 focus:text-white">Open</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/20" />
              <DropdownMenuItem className="text-[13px] focus:bg-white/10 focus:text-white">Get Info</DropdownMenuItem>
              <DropdownMenuItem className="text-[13px] focus:bg-white/10 focus:text-white">Rename</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/20" />
              <DropdownMenuItem className="text-[13px] focus:bg-white/10 focus:text-white">Duplicate</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* EDIT */}
          <DropdownMenu>
            <DropdownMenuTrigger className={`cursor-pointer ${hoverStyle}`}>
              Edit
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black/40 text-white backdrop-blur-2xl border-white/10 shadow-2xl rounded-lg min-w-[180px] mt-1">
              <DropdownMenuItem className="text-[13px] focus:bg-white/10 focus:text-white">Undo</DropdownMenuItem>
              <DropdownMenuItem className="text-[13px] focus:bg-white/10 focus:text-white">Redo</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/20" />
              <DropdownMenuItem className="text-[13px] focus:bg-white/10 focus:text-white">Cut</DropdownMenuItem>
              <DropdownMenuItem className="text-[13px] focus:bg-white/10 focus:text-white">Copy</DropdownMenuItem>
              <DropdownMenuItem className="text-[13px] focus:bg-white/10 focus:text-white">Paste</DropdownMenuItem>
              <DropdownMenuItem className="text-[13px] focus:bg-white/10 focus:text-white">Select All</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/20" />
              <DropdownMenuItem className="text-[13px] focus:bg-white/10 focus:text-white">Find</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* VIEW */}
          <DropdownMenu>
            <DropdownMenuTrigger className={`cursor-pointer ${hoverStyle}`}>
              View
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black/40 text-white backdrop-blur-2xl border-white/10 shadow-2xl rounded-lg min-w-[200px] mt-1">
              <DropdownMenuItem className="text-[13px] focus:bg-white/10 focus:text-white">as Icons</DropdownMenuItem>
              <DropdownMenuItem className="text-[13px] focus:bg-white/10 focus:text-white">as List</DropdownMenuItem>
              <DropdownMenuItem className="text-[13px] focus:bg-white/10 focus:text-white">as Columns</DropdownMenuItem>
              <DropdownMenuItem className="text-[13px] focus:bg-white/10 focus:text-white">as Gallery</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/20" />
              <DropdownMenuItem className="text-[13px] focus:bg-white/10 focus:text-white">Show Sidebar</DropdownMenuItem>
              <DropdownMenuItem className="text-[13px] focus:bg-white/10 focus:text-white">Hide Toolbar</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/20" />
              <DropdownMenuItem className="text-[13px] focus:bg-white/10 focus:text-white">Enter Full Screen</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* GO */}
          <DropdownMenu>
            <DropdownMenuTrigger className={`cursor-pointer ${hoverStyle}`}>
              Go
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black/40 text-white backdrop-blur-2xl border-white/10 shadow-2xl rounded-lg min-w-[180px] mt-1">
              <DropdownMenuItem className="text-[13px] focus:bg-white/10 focus:text-white">Back</DropdownMenuItem>
              <DropdownMenuItem className="text-[13px] focus:bg-white/10 focus:text-white">Forward</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/20" />
              <DropdownMenuItem className="text-[13px] focus:bg-white/10 focus:text-white">Desktop</DropdownMenuItem>
              <DropdownMenuItem className="text-[13px] focus:bg-white/10 focus:text-white">Home</DropdownMenuItem>
              <DropdownMenuItem className="text-[13px] focus:bg-white/10 focus:text-white">Documents</DropdownMenuItem>
              <DropdownMenuItem className="text-[13px] focus:bg-white/10 focus:text-white">Downloads</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* WINDOW */}
          <DropdownMenu>
            <DropdownMenuTrigger className={`cursor-pointer ${hoverStyle}`}>
              Window
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black/40 text-white backdrop-blur-2xl border-white/10 shadow-2xl rounded-lg min-w-[180px] mt-1">
              <DropdownMenuItem className="text-[13px] focus:bg-white/10 focus:text-white">Minimize</DropdownMenuItem>
              <DropdownMenuItem className="text-[13px] focus:bg-white/10 focus:text-white">Zoom</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/20" />
              <DropdownMenuItem className="text-[13px] focus:bg-white/10 focus:text-white">Enter Full Screen</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/20" />
              <DropdownMenuItem className="text-[13px] focus:bg-white/10 focus:text-white">Bring All to Front</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* HELP */}
          <DropdownMenu>
            <DropdownMenuTrigger className={`cursor-pointer ${hoverStyle}`}>
              Help
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black/40 text-white backdrop-blur-2xl border-white/10 shadow-2xl rounded-lg min-w-[180px] mt-1">
              <DropdownMenuItem className="text-[13px] focus:bg-white/10 focus:text-white">macOS Help</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/20" />
              <DropdownMenuItem className="text-[13px] focus:bg-white/10 focus:text-white">See What's New</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* CENTER — empty like macOS */}
      <div className="flex-1"></div>

      {/* RIGHT */}
      <div className="flex items-center gap-1 text-[13px] font-medium text-white pr-2">
        <div className="cursor-pointer hover:bg-white/10 rounded-full p-1 transition-colors">
          <MacBatteryIcon />
        </div>

        <div className="cursor-pointer hover:bg-white/10 rounded-full p-1 transition-colors">
          <MacWifiIcon />
        </div>

        {/* Control Center */}
        <DropdownMenu onOpenChange={(open) => setCcOpen(open)}>
          <DropdownMenuTrigger className={`cursor-pointer px-2 py-0.5 rounded-[6px] transition-colors flex items-center justify-center outline-none ${ccOpen ? 'bg-white/20' : 'hover:bg-white/10'}`}>
            <ControlCenterIcon />
          </DropdownMenuTrigger>

          <DropdownMenuContent 
            align="end" 
            sideOffset={8}
            className="!bg-transparent !border-none !shadow-none !p-0 !overflow-visible scale-100 min-w-0"
          >
            <ControlCenter />
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Siri icon - white swirl (refined) */}
        <div className="w-5 h-5 cursor-pointer hover:bg-white/10 rounded-full flex items-center justify-center transition-colors p-0.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" fill="none" />
            <path d="M 4.5 12 C 8 6, 11 6, 12 12 C 13 18, 16 18, 19.5 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          </svg>
        </div>

        {/* TIME */}
        <DropdownMenu>
          <DropdownMenuTrigger className={`cursor-pointer ${hoverStyle} font-medium`}>
            <span className="text-[14px] font-semibold">{time}</span>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="bg-black/40 backdrop-blur-2xl border-white/10 text-white shadow-2xl rounded-lg px-2 py-2 mt-1">
            <DropdownMenuLabel className="font-semibold text-white">Calendar</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/20" />
            <DropdownMenuItem className="focus:bg-white/10">
              <Calendar mode="single" selected={new Date()} className="bg-black/30 backdrop-blur-md border border-white/10 rounded-xl p-4 text-white" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
