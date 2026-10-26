import React, { useState, useRef, useEffect } from "react";
import { Rnd } from "react-rnd";
import { useAppStore } from "../store/Appstore.js";
import { AnimatePresence, motion } from "framer-motion";
import TrafficLights from "./TrafficLights";

export default function AppWindow({ window: win }) {
  const close = useAppStore((s) => s.closeApp);
  const focus = useAppStore((s) => s.focusApp);
  const minimize = useAppStore((s) => s.minimizeApp);
  const toggleMaximize = useAppStore((s) => s.toggleMaximize);
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  const [isVisible, setIsVisible] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const rndRef = useRef(null);

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  });

  // Calculate initial size and position
  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1200;
  const screenHeight = typeof window !== "undefined" ? window.innerHeight : 800;
  const isLaunchpad = win.appId === "Launchpad";
  const isMessages = win.appId === "Messages";
  const isFinder = win.appId === "Finder";
  const isMail = win.appId === "Mail";
  const isMaps = win.appId === "Maps";
  const isFaceTime = win.appId === "FaceTime";
  const isPhone = win.appId === "Phone";
  const isContacts = win.appId === "Contacts";
  const isReminders = win.appId === "Reminders";

  const initialWidth = isMobile
    ? screenWidth
    : (isMail || isMaps || isFaceTime) ? screenWidth * 0.65 : (isMessages || isFinder || isPhone || isContacts || isReminders) ? screenWidth * 0.55 : isLaunchpad ? screenWidth * 0.45 : screenWidth * 0.7;
  const initialHeight = isMobile
    ? Math.max(300, screenHeight - 28 - 56) // Account for TopBar (28px) and Dock (56px) on mobile
    : (isMessages || isFinder || isMail || isMaps || isFaceTime || isPhone || isContacts || isReminders) ? screenHeight * 0.72 : isLaunchpad ? screenHeight * 0.65 : screenHeight * 0.76;
  const initialX = isMobile ? 0 : Math.max(50, (screenWidth - initialWidth) / 2);
  const initialY = isMobile ? 28 : Math.max(40, (screenHeight - initialHeight) / 2 - 20);

  // Track current size and position
  const [windowState, setWindowState] = useState({
    x: initialX,
    y: initialY,
    width: initialWidth,
    height: initialHeight,
  });
  
  // Store pre-maximize state
  const [preMaxState, setPreMaxState] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      const isLandscape = window.innerWidth > window.innerHeight;
      const mobile = window.innerWidth < 768 || (isLandscape && window.innerHeight < 550 && window.innerWidth <= 1024);
      setIsMobile(mobile);
      if (mobile) {
        const topBarHeight = 28;
        const dockHeight = window.innerHeight < 500 ? 44 : 56;
        setWindowState({
          x: 0,
          y: topBarHeight,
          width: window.innerWidth,
          height: Math.max(220, window.innerHeight - topBarHeight - (isLandscape && window.innerHeight < 450 ? 0 : dockHeight)),
        });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", () => {
      setTimeout(handleResize, 150);
    });
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleExitComplete = () => {
    close(win.id);
  };

  const handleMinimize = () => {
    minimize(win.id);
  };

  const handleMaximize = () => {
    toggleMaximize(win.id);
  };

  // Handle maximize/restore
  useEffect(() => {
    if (win.maximized) {
      // Save current state before maximizing
      setPreMaxState({ ...windowState });
      // Maximize: fill screen below top bar
      setWindowState({
        x: 0,
        y: 28,
        width: globalThis.innerWidth || 1920,
        height: (globalThis.innerHeight || 1080) - 28,
      });
    } else if (preMaxState) {
      // Restore to previous size
      setWindowState(preMaxState);
    }
  }, [win.maximized]);

  // Hide if minimized (keep mounted so audio/video keeps playing)
  const minimizedStyle = win.minimized ? {
    opacity: 0,
    pointerEvents: 'none',
    visibility: 'hidden',
  } : {};

  // Resize handle styles for better visibility
  const resizeHandleStyles = {
    bottom: { cursor: 'ns-resize' },
    right: { cursor: 'ew-resize' },
    top: { cursor: 'ns-resize' },
    left: { cursor: 'ew-resize' },
    topRight: { cursor: 'nesw-resize' },
    bottomRight: { cursor: 'nwse-resize' },
    bottomLeft: { cursor: 'nesw-resize' },
    topLeft: { cursor: 'nwse-resize' },
  };

  return (
    <div style={minimizedStyle}>
      <Rnd
        ref={rndRef}
        size={{ width: windowState.width, height: windowState.height }}
        position={{ x: windowState.x, y: windowState.y }}
        minWidth={300}
        minHeight={200}
        dragHandleClassName="window-drag-handle"
        cancel=".traffic-light-btn, button, [role='button'], .no-drag, .cursor-pointer, svg, input, textarea"
        style={{ 
          zIndex: win.maximized ? 9999 : win.z,
        }}
        resizeHandleStyles={resizeHandleStyles}
        enableResizing={(!win.maximized && !isMobile) ? {
          top: true,
          right: true,
          bottom: true,
          left: true,
          topRight: true,
          bottomRight: true,
          bottomLeft: true,
          topLeft: true,
        } : false}
        onDragStart={() => {
          setIsDragging(true);
          focus(win.id);
        }}
        onDragStop={(e, d) => {
          setIsDragging(false);
          if (!win.maximized && !isMobile) {
            setWindowState(prev => ({ ...prev, x: d.x, y: d.y }));
          }
        }}
        onResizeStart={() => {
          setIsResizing(true);
          focus(win.id);
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          setIsResizing(false);
          if (!win.maximized && !isMobile) {
            setWindowState({
              width: ref.offsetWidth,
              height: ref.offsetHeight,
              x: position.x,
              y: position.y,
            });
          }
        }}
        disableDragging={win.maximized || isMobile}
      >
        <AnimatePresence onExitComplete={handleExitComplete}>
          {isVisible && (
            <motion.div
              key={win.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                boxShadow: isFaceTime
                  ? isDragging 
                    ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' 
                    : '0 10px 40px -10px rgba(0, 0, 0, 0.4)'
                  : isDragging 
                    ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)' 
                    : '0 10px 40px -10px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)'
              }}
              exit={{
                opacity: 0,
                scale: 0.96,
                y: 14,
                transition: { duration: 0.16, ease: [0.4, 0, 1, 1] },
              }}
              transition={{ type: "spring", stiffness: 520, damping: 34, mass: 0.7 }}
              className={`motion-smooth flex flex-col overflow-hidden ${
                win.maximized ? "rounded-none" : "rounded-xl"
              } ${
                win.appId === "Launchpad"
                  ? isDarkMode
                    ? "backdrop-blur-3xl bg-[#1e1e1e]/45 border border-white/10 text-white shadow-2xl"
                    : "backdrop-blur-3xl bg-white/65 border border-black/10 text-gray-900 shadow-2xl"
                  : win.appId === "Safari"
                    ? isDarkMode
                      ? "bg-[#1e1e1e] text-white"
                      : "bg-white text-gray-900 shadow-2xl"
                  : win.appId === "FaceTime" || win.appId === "Phone"
                    ? isDarkMode
                      ? "bg-[#1e1e1e] text-white"
                      : "bg-white text-gray-900 shadow-2xl"
                  : win.appId === "Photos" || win.appId === "Music" || win.appId === "Notes" || win.appId === "Finder" || win.appId === "TextEdit" || win.appId === "PDFViewer" || win.appId === "Trash" || win.appId === "Messages" || win.appId === "Mail" || win.appId === "Maps" || win.appId === "Phone" || win.appId === "Calendar" || win.appId === "Contacts" || win.appId === "Reminders"
                    ? isDarkMode
                      ? "bg-[#1e1e1e] text-white border border-white/10"
                      : "bg-white text-gray-900 border border-black/10 shadow-2xl"
                    : "backdrop-blur-xl bg-black/40 border border-white/15 text-white shadow-xl"
              } ${isDragging ? "cursor-grabbing" : ""} ${isResizing ? "select-none" : ""}`}
              style={{
                width: '100%',
                height: '100%',
                willChange: isDragging || isResizing ? 'transform' : 'auto',
              }}
            >
              {/* Title Bar - Skip for Photos, Music, Safari, Finder, Notes, TextEdit, PDFViewer, Trash, Launchpad, Messages, Mail, Maps, FaceTime, Phone, Calendar, Contacts, and Reminders since they integrate their own */}
              {win.appId !== "Photos" && win.appId !== "Music" && win.appId !== "Safari" && win.appId !== "Notes" && win.appId !== "Finder" && win.appId !== "TextEdit" && win.appId !== "PDFViewer" && win.appId !== "Trash" && win.appId !== "Launchpad" && win.appId !== "Messages" && win.appId !== "Mail" && win.appId !== "Maps" && win.appId !== "FaceTime" && win.appId !== "Phone" && win.appId !== "Calendar" && win.appId !== "Contacts" && win.appId !== "Reminders" && (
                <div 
                  className={`window-drag-handle relative h-11 bg-linear-to-b from-white/10 to-transparent flex items-center cursor-grab active:cursor-grabbing select-none ${
                    win.maximized ? "" : "rounded-t-xl"
                  }`}
                  onDoubleClick={handleMaximize}
                >
                  {/* Traffic Light Buttons */}
                  <div className="absolute left-4 flex items-center z-10">
                    <TrafficLights windowId={win.id} onClose={handleClose} />
                  </div>
 
                  {/* Center Title */}
                  <div className="absolute left-1/2 -translate-x-1/2 text-white/80 font-medium text-sm tracking-wide pointer-events-none">
                    {win.appId}
                  </div>
                </div>
              )}
 
              {/* App Content */}
              <div className={`flex-1 overflow-hidden flex flex-col ${win.appId === "Photos" || win.appId === "Music" || win.appId === "Safari" || win.appId === "Notes" || win.appId === "Finder" || win.appId === "TextEdit" || win.appId === "PDFViewer" || win.appId === "Trash" || win.appId === "Launchpad" || win.appId === "Messages" || win.appId === "Calendar" ? "" : "text-white bg-black/20"}`}>
                {React.cloneElement(win.component, { windowId: win.id, maximized: win.maximized, isDragging, isResizing })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Rnd>
    </div>
  );
}
