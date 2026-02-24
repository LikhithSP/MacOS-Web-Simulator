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
  <svg width="22" height="10" viewBox="0 0 22 10" fill="currentColor">
    <rect x="0.5" y="0.5" width="18" height="9" rx="2" ry="2" stroke="currentColor" strokeWidth="1" fill="none"/>
    <rect x="2" y="2" width="14" height="6" rx="1" ry="1" fill="currentColor"/>
    <path d="M19.5 3v4a1.5 1.5 0 0 0 0-4z" fill="currentColor"/>
  </svg>
);

// macOS Style Control Center Icon
const ControlCenterIcon = () => (
  <svg width="14" height="12" viewBox="0 0 14 12" fill="currentColor">
    <rect x="0" y="0" width="6" height="5" rx="1.5"/>
    <rect x="8" y="0" width="6" height="5" rx="1.5"/>
    <rect x="0" y="7" width="6" height="5" rx="1.5"/>
    <rect x="8" y="7" width="6" height="5" rx="1.5"/>
  </svg>
);

export default function TopBar({ appTitle = "Finder", setStage }) {

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

  const hoverStyle =
    " hover:bg-white/10 hover:backdrop-blur-xl rounded px-1.5 py-0.5 transition-all duration-150";

  return (
    <div 
      className="w-full h-7 flex items-center justify-between px-2 select-none backdrop-blur-sm fixed top-0 left-0 z-50 text-white"
      style={{
        background: "rgba(0, 0, 0, 0.02)",
        borderBottom: "none"
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
      <div className="flex items-center gap-2 text-[14px] font-semibold text-white">
        <MacBatteryIcon />
        <MacWifiIcon />

        {/* TIME */}
        <DropdownMenu>
          <DropdownMenuTrigger className={`cursor-pointer ${hoverStyle}`}>
            <span className="text-[14px] font-semibold">{time}</span>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="bg-black/40 backdrop-blur-2xl border-white/10 text-white shadow-2xl rounded-lg px-2 py-2 mt-1">
            <DropdownMenuLabel className="font-semibold text-white">Calendar</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/20" />
            <DropdownMenuItem className="focus:bg-white/10">
              <Calendar className="bg-black/30 backdrop-blur-md border border-white/10 rounded-xl p-4 text-white" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
