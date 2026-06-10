import React, { useEffect, useState } from "react";
import Dock from "../components/Dock";
import AppWindow from "../components/AppWindow";
import { useAppStore } from "../store/Appstore";
import TopBar from "../components/TopBar";
import ContextMenu from "../components/ContextMenu";
import { AnimatePresence, motion } from "framer-motion";
import { FiFolder, FiFile } from "react-icons/fi";
import Finder from "../app/Finder";
import { Terminals } from "../app/Terminal";
import CalendarWidget from "../components/widgets/CalendarWidget";
import WeatherWidget from "../components/widgets/WeatherWidget";
import PhotoWidget from "../components/widgets/PhotoWidget";
import GlassClockWidget from "../components/widgets/GlassClockWidget";
import GlassCalendarWidget from "../components/widgets/GlassCalendarWidget";
import GlassWeatherWidget from "../components/widgets/GlassWeatherWidget";
import { FiX } from "react-icons/fi";

export default function Desktop({ setStage, isLocked = false }) {
  const windows = useAppStore((s) => s.windows);
  const openApp = useAppStore((s) => s.openApp);
  const [wallpaper, setWallpaper] = useState(() => {
    return localStorage.getItem("desktop_wallpaper") || "/Wallpaper/GtB-Ex7WYAA9yAD.jpeg";
  });
  const [contextMenu, setContextMenu] = useState(null);
  const [desktopFolders, setDesktopFolders] = useState(() => {
    return JSON.parse(localStorage.getItem("os_desktop_folders") || "[]");
  });
  const [desktopFiles, setDesktopFiles] = useState(() => {
    return JSON.parse(localStorage.getItem("os_desktop_files") || "[]");
  });
  const [showIcons, setShowIcons] = useState(() => {
    return localStorage.getItem("desktop_show_icons") !== "false";
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [editName, setEditName] = useState("");
  const [draggingItem, setDraggingItem] = useState(null);
  const [itemContextMenu, setItemContextMenu] = useState(null);

  const [widgets, setWidgets] = useState(() => {
    return JSON.parse(localStorage.getItem("os_desktop_widgets") || "[]");
  });
  const [showWidgetGallery, setShowWidgetGallery] = useState(false);

  // Define allDesktopItems before useEffect
  const allDesktopItems = [
    ...desktopFolders.map(f => ({ ...f, type: "folder" })),
    ...desktopFiles.filter((f) => !f.parentFolderId).map(f => ({ ...f, type: "file" })),
  ];

  useEffect(() => {
    // Listen for wallpaper changes from Gallery
    const handleWallpaperChange = (e) => {
      const newWallpaper = e?.detail || localStorage.getItem("desktop_wallpaper");
      if (newWallpaper) setWallpaper(newWallpaper);
    };

    // Listen for folder creation
    const handleFolderCreated = (e) => {
      setDesktopFolders((prev) => [...prev, e.detail]);
      setEditingItem(e.detail.id);
      setEditName(e.detail.name);
    };

    // Listen for file creation
    const handleFileCreated = (e) => {
      setDesktopFiles(prev => [...prev, e.detail]);
    };

    // Listen for icons toggle
    const handleIconsChanged = () => {
      setShowIcons(localStorage.getItem("desktop_show_icons") !== "false");
    };

    const handleEditWidgets = () => {
      setShowWidgetGallery(p => !p);
    };

    const handleWidgetAdded = (e) => {
      const type = e.detail?.type;
      if (!type) return;
      const newWidget = {
        id: `widget_${Date.now()}`,
        type,
        x: 100,
        y: 100
      };
      setWidgets(prev => {
        const next = [...prev, newWidget];
        localStorage.setItem("os_desktop_widgets", JSON.stringify(next));
        return next;
      });
    };

    window.addEventListener('wallpaperChanged', handleWallpaperChange);
    window.addEventListener('os_folder_created', handleFolderCreated);
    window.addEventListener('os_file_created', handleFileCreated);
    window.addEventListener('desktopIconsChanged', handleIconsChanged);
    window.addEventListener('os_edit_widgets', handleEditWidgets);
    window.addEventListener('os_widget_added', handleWidgetAdded);
    
    // Also listen for storage events (for cross-tab support)
    window.addEventListener('storage', (e) => {
      if (e.key === 'desktop_wallpaper' && e.newValue) {
        setWallpaper(e.newValue);
      }
    });
    
    return () => {
      window.removeEventListener('wallpaperChanged', handleWallpaperChange);
      window.removeEventListener('os_folder_created', handleFolderCreated);
      window.removeEventListener('os_file_created', handleFileCreated);
      window.removeEventListener('desktopIconsChanged', handleIconsChanged);
      window.removeEventListener('os_edit_widgets', handleEditWidgets);
      window.removeEventListener('os_widget_added', handleWidgetAdded);
    };
  }, [selectedItem, allDesktopItems]);

  const handleContextMenu = (e) => {
    e.preventDefault();
    // Only show context menu when clicking on the desktop background
    if (e.target === e.currentTarget || e.target.classList.contains('desktop-area')) {
      setContextMenu({ x: e.clientX, y: e.clientY });
    }
  };

  const handleOpenFinder = (path) => {
    openApp("Finder", <Finder initialPath={path} />);
  };

  const handleOpenTerminal = () => {
    openApp("terminal", <Terminals />);
  };

  const handleItemDoubleClick = (item) => {
    if (item.type === "folder") {
      openApp("Finder", <Finder initialPath="/desktop" />);
    }
  };

  const handleItemRename = (item) => {
    setEditingItem(item.id);
    setEditName(item.name);
  };

  const handleRenameSubmit = (item) => {
    if (editName.trim()) {
      if (item.type === "folder") {
        const updated = desktopFolders.map(f => 
          f.id === item.id ? { ...f, name: editName.trim() } : f
        );
        setDesktopFolders(updated);
        localStorage.setItem("os_desktop_folders", JSON.stringify(updated));
      } else {
        const updated = desktopFiles.map(f => 
          f.id === item.id ? { ...f, name: editName.trim() } : f
        );
        setDesktopFiles(updated);
        localStorage.setItem("os_desktop_files", JSON.stringify(updated));
      }
    }
    setEditingItem(null);
    setEditName("");
  };

  const handleDeleteItem = (item) => {
    if (item.type === "folder") {
      const updated = desktopFolders.filter(f => f.id !== item.id);
      setDesktopFolders(updated);
      localStorage.setItem("os_desktop_folders", JSON.stringify(updated));
    } else {
      const updated = desktopFiles.filter(f => f.id !== item.id);
      setDesktopFiles(updated);
      localStorage.setItem("os_desktop_files", JSON.stringify(updated));
    }
  };

  const handleRemoveWidget = (id) => {
    const updated = widgets.filter(w => w.id !== id);
    setWidgets(updated);
    localStorage.setItem("os_desktop_widgets", JSON.stringify(updated));
  };

  return (
    <div
      className="relative w-screen h-screen max-w-screen max-h-screen overflow-hidden bg-cover bg-center desktop-area"
      style={{
        backgroundImage: `url(${wallpaper})`,
      }}
      onContextMenu={handleContextMenu}
      onClick={() => {
        setContextMenu(null);
        setItemContextMenu(null);
        setSelectedItem(null);
        setShowWidgetGallery(false);
      }}
    >
      {/* Only show TopBar, Windows, and Dock when NOT locked */}
      {!isLocked && (
        <>
          <div className="absolute left-0 right-0 top-0 z-40">
            <TopBar
              appTitle={windows.length ? windows[windows.length - 1].appId : ""}
              setStage={setStage}
            />
          </div>

          {/* Desktop Widgets */}
          {widgets.map((widget) => {
            return (
              <motion.div
                key={widget.id}
                drag
                dragMomentum={false}
                initial={{ opacity: 0, scale: 0.8, x: widget.x, y: widget.y }}
                animate={{ opacity: 1, scale: 1, x: widget.x, y: widget.y }}
                className="absolute top-0 left-0 group z-0 cursor-grab active:cursor-grabbing pointer-events-auto"
                onDragEnd={(e, info) => {
                  const updated = widgets.map(w => 
                    w.id === widget.id ? { ...w, x: w.x + info.offset.x, y: w.y + info.offset.y } : w
                  );
                  setWidgets(updated);
                  localStorage.setItem("os_desktop_widgets", JSON.stringify(updated));
                }}
              >
                {widget.type === 'calendar' && <CalendarWidget />}
                {widget.type === 'weather' && <WeatherWidget />}
                {widget.type === 'photo' && <PhotoWidget />}
                {widget.type === 'glass_clock' && <GlassClockWidget />}
                {widget.type === 'glass_calendar' && <GlassCalendarWidget />}
                {widget.type === 'glass_weather' && <GlassWeatherWidget />}
                
                {/* Remove button (visible on hover) */}
                <button
                  onClick={() => handleRemoveWidget(widget.id)}
                  className="absolute -top-2 -left-2 bg-white/80 hover:bg-white text-gray-800 rounded-full w-6 h-6 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-50 text-xs backdrop-blur-md"
                >
                  <FiX />
                </button>
              </motion.div>
            );
          })}

          {/* Desktop Icons */}
          {showIcons && (
            <div className="absolute inset-0 pointer-events-none">
              {allDesktopItems.map((item, index) => {
                const itemX = item.x !== undefined ? item.x : 16 + index * 100;
                const itemY = item.y !== undefined ? item.y : 32 + index * 100;
                return (
                <motion.div
                  key={item.id}
                  drag
                  dragMomentum={false}
                  dragElastic={0}
                  dragTransition={{ power: 0, modifyTargetVelocity: () => 0 }}
                  initial={{ opacity: 0, scale: 0.8, x: itemX, y: itemY }}
                  animate={{ opacity: 1, scale: 1, x: itemX, y: itemY }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    absolute top-0 left-0 pointer-events-auto flex flex-col items-center justify-center w-20 p-2 rounded-lg cursor-grab active:cursor-grabbing
                    ${selectedItem === item.id ? "bg-blue-500/40" : "hover:bg-white/10"}
                    transition-colors
                  `}
                  onDragEnd={(e, info) => {
                    const newX = itemX + info.offset.x;
                    const newY = itemY + info.offset.y;
                    
                    if (item.type === 'folder') {
                      const updated = desktopFolders.map(f => 
                        f.id === item.id ? { ...f, x: newX, y: newY } : f
                      );
                      setDesktopFolders(updated);
                      localStorage.setItem('os_desktop_folders', JSON.stringify(updated));
                    } else {
                      const updated = desktopFiles.map(f => 
                        f.id === item.id ? { ...f, x: newX, y: newY } : f
                      );
                      setDesktopFiles(updated);
                      localStorage.setItem('os_desktop_files', JSON.stringify(updated));
                    }
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedItem(item.id);
                  }}
                  onDoubleClick={() => handleItemDoubleClick(item)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedItem(item.id);
                    setItemContextMenu({ itemId: item.id, x: e.clientX, y: e.clientY });
                  }}
                >
                  {item.type === "folder" ? (
                    <img
                      src="https://s3.macosicons.com/macosicons/icons/GecwaBmkFQ/lowResPngFile_c3ef21fe8fabfd9d23fcc3ab3134dcf9_GecwaBmkFQ.png"
                      alt="folder"
                      className="w-14 h-14 drop-shadow-lg object-contain"
                      onError={(e) => {
                        e.target.src = 'https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/50cce92fe1e8a5b82de86e1c98146ba1_low_res_Folder_Common.png';
                      }}
                    />
                  ) : (
                    <FiFile className="w-14 h-14 text-white/80 drop-shadow-lg" />
                  )}
                  
                  {editingItem === item.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onBlur={() => handleRenameSubmit(item)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRenameSubmit(item);
                        if (e.key === "Escape") {
                          setEditingItem(null);
                          setEditName("");
                        }
                      }}
                      className="w-full text-center text-xs text-white bg-blue-500/50 rounded px-1 py-0.5 outline-none"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="text-xs text-white text-center mt-1 drop-shadow-md line-clamp-2 break-all">
                      {item.name}
                    </span>
                  )}
                </motion.div>
                );
              })}
            </div>
          )}

          <Dock />
        </>
      )}

      {/* Widget Gallery */}
      <AnimatePresence>
        {showWidgetGallery && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-10 right-4 bottom-24 w-[360px] bg-white/20 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/20 z-40 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
            onContextMenu={(e) => e.stopPropagation()}
          >
            <div className="p-5 flex justify-between items-center bg-black/10">
              <h2 className="text-xl font-semibold text-white cursor-default">Widgets</h2>
              <button 
                onClick={() => setShowWidgetGallery(false)}
                className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center text-white hover:bg-black/30"
              >
                <FiX />
              </button>
            </div>
            
            <div 
              className="flex-1 overflow-y-auto p-5 pb-10 space-y-6 hide-scrollbar"
            >
              <div className="flex flex-col items-center">
                <div className="w-full mb-3 flex items-center justify-between">
                  <span className="text-white/90 font-medium">Calendar</span>
                  <button 
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent("os_widget_added", { detail: { type: 'calendar' } }));
                    }}
                    className="px-3 py-1 bg-white/20 rounded-full text-xs text-white hover:bg-white/30"
                  >
                    Add
                  </button>
                </div>
                <div className="pointer-events-none scale-100 transform origin-top w-full flex justify-center">
                  <CalendarWidget />
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-full mb-3 flex items-center justify-between">
                  <span className="text-white/90 font-medium">Weather</span>
                  <button 
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent("os_widget_added", { detail: { type: 'weather' } }));
                    }}
                    className="px-3 py-1 bg-white/20 rounded-full text-xs text-white hover:bg-white/30"
                  >
                    Add
                  </button>
                </div>
                <div className="pointer-events-none scale-100 transform origin-top w-full flex justify-center">
                  <WeatherWidget />
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-full mb-3 flex items-center justify-between">
                  <span className="text-white/90 font-medium">Photos</span>
                  <button 
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent("os_widget_added", { detail: { type: 'photo' } }));
                    }}
                    className="px-3 py-1 bg-white/20 rounded-full text-xs text-white hover:bg-white/30"
                  >
                    Add
                  </button>
                </div>
                <div className="pointer-events-none scale-100 transform origin-top w-full flex justify-center">
                  <PhotoWidget />
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-full mb-3 flex items-center justify-between">
                  <span className="text-white/90 font-medium">Glass Clock</span>
                  <button 
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent("os_widget_added", { detail: { type: 'glass_clock' } }));
                    }}
                    className="px-3 py-1 bg-white/20 rounded-full text-xs text-white hover:bg-white/30"
                  >
                    Add
                  </button>
                </div>
                <div className="pointer-events-none scale-100 transform origin-top w-full flex justify-center">
                  <GlassClockWidget />
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-full mb-3 flex items-center justify-between">
                  <span className="text-white/90 font-medium">Glass Calendar</span>
                  <button 
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent("os_widget_added", { detail: { type: 'glass_calendar' } }));
                    }}
                    className="px-3 py-1 bg-white/20 rounded-full text-xs text-white hover:bg-white/30"
                  >
                    Add
                  </button>
                </div>
                <div className="pointer-events-none scale-100 transform origin-top w-full flex justify-center">
                  <GlassCalendarWidget />
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-full mb-3 flex items-center justify-between">
                  <span className="text-white/90 font-medium">Glass Weather</span>
                  <button 
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent("os_widget_added", { detail: { type: 'glass_weather' } }));
                    }}
                    className="px-3 py-1 bg-white/20 rounded-full text-xs text-white hover:bg-white/30"
                  >
                    Add
                  </button>
                </div>
                <div className="pointer-events-none scale-100 transform origin-top w-full flex justify-center">
                  <GlassWeatherWidget />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Windows always render (even when locked) so audio/video keeps playing */}
      <div style={{ 
        opacity: isLocked ? 0 : 1, 
        pointerEvents: isLocked ? 'none' : 'auto',
        transition: 'opacity 0.3s ease'
      }}>
        {windows.map((w) => (
          <AppWindow window={w} key={w.id} />
        ))}
      </div>

      {!isLocked && (
        <>

          {/* Context Menu */}
          <AnimatePresence>
            {contextMenu && (
              <ContextMenu
                x={contextMenu.x}
                y={contextMenu.y}
                onClose={() => setContextMenu(null)}
                onOpenFinder={handleOpenFinder}
                onOpenTerminal={handleOpenTerminal}
              />
            )}
          </AnimatePresence>

          {/* Item Context Menu */}
          <AnimatePresence>
            {itemContextMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.1 }}
                className="fixed bg-white/95 backdrop-blur-md rounded-lg shadow-lg overflow-hidden z-50"
                style={{
                  left: `${itemContextMenu.x}px`,
                  top: `${itemContextMenu.y}px`,
                }}
                onMouseLeave={() => setItemContextMenu(null)}
              >
                <button
                  onClick={() => {
                    const item = allDesktopItems.find(i => i.id === itemContextMenu.itemId);
                    if (item) {
                      handleItemRename(item);
                      setItemContextMenu(null);
                    }
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-blue-500/20 transition-colors"
                >
                  Rename
                </button>
                <button
                  onClick={() => {
                    const item = allDesktopItems.find(i => i.id === itemContextMenu.itemId);
                    if (item) {
                      handleDeleteItem(item);
                      setItemContextMenu(null);
                    }
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-500/20 transition-colors border-t border-gray-200"
                >
                  Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
