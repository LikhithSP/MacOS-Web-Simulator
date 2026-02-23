import { Rnd } from "react-rnd";
import { useAppStore } from "../store/Appstore.js";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

export default function AppWindow({ window: win }) {
  const close = useAppStore((s) => s.closeApp);
  const focus = useAppStore((s) => s.focusApp);
  const minimize = useAppStore((s) => s.minimizeApp);
  const toggleMaximize = useAppStore((s) => s.toggleMaximize);
  const [isVisible, setIsVisible] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const rndRef = useRef(null);

  // Calculate initial size and position
  const screenWidth = globalThis.innerWidth || 1200;
  const screenHeight = globalThis.innerHeight || 800;
  const initialWidth = screenWidth * 0.7;
  const initialHeight = screenHeight * 0.76;
  const initialX = Math.max(50, (screenWidth - initialWidth) / 2);
  const initialY = Math.max(40, (screenHeight - initialHeight) / 2 - 20);

  // Track current size and position
  const [windowState, setWindowState] = useState({
    x: initialX,
    y: initialY,
    width: initialWidth,
    height: initialHeight,
  });
  
  // Store pre-maximize state
  const [preMaxState, setPreMaxState] = useState(null);

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
    if (!win.maximized) {
      // Save current state before maximizing
      setPreMaxState({ ...windowState });
    }
    toggleMaximize(win.id);
  };

  // Handle maximize/restore
  useEffect(() => {
    if (win.maximized) {
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
        style={{ 
          zIndex: win.maximized ? 9999 : win.z,
        }}
        resizeHandleStyles={resizeHandleStyles}
        enableResizing={!win.maximized ? {
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
          if (!win.maximized) {
            setWindowState(prev => ({ ...prev, x: d.x, y: d.y }));
          }
        }}
        onResizeStart={() => {
          setIsResizing(true);
          focus(win.id);
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          setIsResizing(false);
          if (!win.maximized) {
            setWindowState({
              width: ref.offsetWidth,
              height: ref.offsetHeight,
              x: position.x,
              y: position.y,
            });
          }
        }}
        disableDragging={win.maximized}
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
                boxShadow: isDragging 
                  ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)' 
                  : '0 10px 40px -10px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)'
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: 30,
                transition: { duration: 0.2, ease: "easeInOut" },
              }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className={`backdrop-blur-xl bg-black/40 flex flex-col border border-white/15 overflow-hidden ${
                win.maximized ? "rounded-none" : "rounded-xl"
              } ${isDragging ? "cursor-grabbing" : ""} ${isResizing ? "select-none" : ""}`}
              style={{
                width: '100%',
                height: '100%',
                willChange: isDragging || isResizing ? 'transform' : 'auto',
              }}
            >
              {/* Title Bar - This is the drag handle */}
              <div 
                className={`window-drag-handle relative h-11 bg-linear-to-b from-white/10 to-transparent flex items-center cursor-grab active:cursor-grabbing select-none ${
                  win.maximized ? "" : "rounded-t-xl"
                }`}
                onDoubleClick={handleMaximize}
              >
                {/* Traffic Light Buttons */}
                <div className="absolute left-4 flex items-center gap-2 group z-10">
                  {/* Close Button */}
                  <div
                    className="w-3 h-3 bg-[#ff5f57] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#ff4136] transition-all duration-150 shadow-sm"
                    onClick={(e) => { e.stopPropagation(); handleClose(); }}
                    title="Close"
                  >
                    <svg className="w-1.5 h-1.5 text-[#820005] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
                      <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  {/* Minimize Button */}
                  <div
                    className="w-3 h-3 bg-[#febc2e] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#ff9500] transition-all duration-150 shadow-sm"
                    onClick={(e) => { e.stopPropagation(); handleMinimize(); }}
                    title="Minimize"
                  >
                    <svg className="w-1.5 h-1.5 text-[#9a6400] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
                      <path d="M1 5H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  {/* Maximize Button */}
                  <div
                    className="w-3 h-3 bg-[#28c840] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#1aab29] transition-all duration-150 shadow-sm"
                    onClick={(e) => { e.stopPropagation(); handleMaximize(); }}
                    title={win.maximized ? "Restore" : "Maximize"}
                  >
                    <svg className="w-1.5 h-1.5 text-[#006500] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
                      {win.maximized ? (
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

                {/* Center Title */}
                <div className="absolute left-1/2 -translate-x-1/2 text-white/80 font-medium text-sm tracking-wide pointer-events-none">
                  {win.appId}
                </div>
              </div>

              {/* App Content */}
              <div className="flex-1 overflow-auto text-white bg-black/20">
                {win.component}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Rnd>
    </div>
  );
}
