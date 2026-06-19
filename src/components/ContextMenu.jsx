import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiFolder,
  FiRefreshCw,
  FiImage,
  FiInfo,
  FiSettings,
  FiMonitor,
  FiGrid,
  FiPlus,
  FiFile,
  FiCopy,
  FiClipboard,
  FiEye,
  FiEyeOff,
  FiLayout,
} from "react-icons/fi";
import { BsSortDown, BsSortUp, BsGrid3X3 } from "react-icons/bs";
import { useAppStore } from "../store/Appstore";

const wallpaperModules = import.meta.glob("/public/Wallpaper/*.{jpg,jpeg,png,gif,webp}", {
  eager: true,
  query: "?url",
  import: "default",
});

const getWallpaperName = (path) => {
  const fileName = path.split("/").pop().split("?")[0].split(".")[0];
  return fileName.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const galleryWallpapers = Object.keys(wallpaperModules)
  .map((path) => ({
    id: path,
    name: getWallpaperName(path),
    src: path.replace("/public", ""),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const wallpapers = [...galleryWallpapers];

export default function ContextMenu({ x, y, onClose, onOpenFinder, hasClipboard, onPaste }) {
  const menuRef = useRef(null);
  const preloadedWallpapers = useRef(new Set());
  const [submenu, setSubmenu] = useState(null);
  const [showWallpaperPicker, setShowWallpaperPicker] = useState(false);
  const [showIconsOnDesktop, setShowIconsOnDesktop] = useState(() => {
    return localStorage.getItem("desktop_show_icons") !== "false";
  });
  const [sortBy, setSortBy] = useState(() => {
    return localStorage.getItem("desktop_sort_by") || "name";
  });

  const isDarkMode = useAppStore((state) => state.isDarkMode);

  // Adjust position if menu would go off screen
  const [adjustedPosition, setAdjustedPosition] = useState({ x, y });

  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const newX = x + rect.width > window.innerWidth ? window.innerWidth - rect.width - 10 : x;
      const newY = y + rect.height > window.innerHeight ? window.innerHeight - rect.height - 10 : y;
      setAdjustedPosition({ x: newX, y: newY });
    }
  }, [x, y]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Don't close if wallpaper picker is open
      if (showWallpaperPicker) return;
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        if (showWallpaperPicker) {
          setShowWallpaperPicker(false);
        } else {
          onClose();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, showWallpaperPicker]);

  const preloadWallpaper = (src) => {
    if (!src || preloadedWallpapers.current.has(src)) return;
    const img = new Image();
    img.decoding = "async";
    img.src = src;
    if (img.decode) {
      img.decode().catch(() => {});
    }
    preloadedWallpapers.current.add(src);
  };

  const preloadAllWallpapers = () => {
    wallpapers.forEach((wp) => preloadWallpaper(wp.src));
  };

  useEffect(() => {
    const runPreload = () => preloadAllWallpapers();
    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(runPreload, { timeout: 500 });
    } else {
      setTimeout(runPreload, 0);
    }
  }, []);

  useEffect(() => {
    if (!showWallpaperPicker) return;
    preloadAllWallpapers();
  }, [showWallpaperPicker]);

  const handleRefresh = () => {
    window.location.reload();
    onClose();
  };

  const handleCreateFolder = () => {
    // Count existing folders to create unique name
    const existingFolders = JSON.parse(localStorage.getItem("os_desktop_folders") || "[]");
    const folderCount = existingFolders.length;
    const folderName = folderCount === 0 ? "untitled folder" : `untitled folder ${folderCount + 1}`;
    
    const newFolder = {
      id: `folder_${Date.now()}`,
      name: folderName,
      type: "folder",
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage
    localStorage.setItem("os_desktop_folders", JSON.stringify([...existingFolders, newFolder]));

    // Dispatch event to notify desktop
    window.dispatchEvent(new CustomEvent("os_folder_created", { detail: newFolder }));

    onClose();
  };

  const handleCreateFile = () => {
    const fileName = `Untitled ${Date.now()}.txt`;
    const newFile = {
      id: `file_${Date.now()}`,
      name: fileName,
      type: "file",
      content: "",
      createdAt: new Date().toISOString(),
    };

    const existingFiles = JSON.parse(localStorage.getItem("os_desktop_files") || "[]");
    localStorage.setItem("os_desktop_files", JSON.stringify([...existingFiles, newFile]));

    window.dispatchEvent(new CustomEvent("os_file_created", { detail: newFile }));
    onClose();
  };

  const handleChangeWallpaper = (wallpaper) => {
    preloadWallpaper(wallpaper.src);
    localStorage.setItem("desktop_wallpaper", wallpaper.src);
    window.dispatchEvent(new CustomEvent("wallpaperChanged", { detail: wallpaper.src }));
    setShowWallpaperPicker(false);
    onClose();
  };

  const handleCustomWallpaper = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target.result;
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            // Downscale image if it exceeds typical HD resolution to keep it under localStorage limits
            const MAX_WIDTH = 1920;
            const MAX_HEIGHT = 1080;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height = Math.round((height * MAX_WIDTH) / width);
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width = Math.round((width * MAX_HEIGHT) / height);
                height = MAX_HEIGHT;
              }
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            // Compress to JPEG format with 0.8 quality (very high quality, but small payload size)
            const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.8);

            try {
              localStorage.setItem("desktop_wallpaper", compressedDataUrl);
              window.dispatchEvent(new CustomEvent("wallpaperChanged", { detail: compressedDataUrl }));
            } catch (err) {
              console.error("Error saving compressed wallpaper to localStorage:", err);
              // Fallback to lower quality if 0.8 still fails
              try {
                const lowResDataUrl = canvas.toDataURL("image/jpeg", 0.5);
                localStorage.setItem("desktop_wallpaper", lowResDataUrl);
                window.dispatchEvent(new CustomEvent("wallpaperChanged", { detail: lowResDataUrl }));
              } catch (fallbackErr) {
                alert("The image is too large to set as a wallpaper. Please try a smaller file.");
              }
            }
          };
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
    onClose();
  };

  const handleToggleIcons = () => {
    const newValue = !showIconsOnDesktop;
    setShowIconsOnDesktop(newValue);
    localStorage.setItem("desktop_show_icons", newValue.toString());
    window.dispatchEvent(new Event("desktopIconsChanged"));
    onClose();
  };

  const handleSortBy = (sortType) => {
    setSortBy(sortType);
    localStorage.setItem("desktop_sort_by", sortType);
    window.dispatchEvent(new CustomEvent("desktopSortChanged", { detail: sortType }));
    setSubmenu(null);
    onClose();
  };


  const handleGetInfo = () => {
    alert(`Desktop Information\n\nScreen: ${window.innerWidth}x${window.innerHeight}\nUser Agent: ${navigator.userAgent.substring(0, 50)}...`);
    onClose();
  };

  const menuItems = [
    {
      label: "New Folder",
      icon: FiFolder,
      onClick: handleCreateFolder,
      shortcut: "⇧⌘N",
    },
    {
      label: "New File",
      icon: FiFile,
      onClick: handleCreateFile,
    },
    hasClipboard ? {
      label: "Paste",
      icon: FiClipboard,
      onClick: onPaste,
      shortcut: "⌘V",
    } : null,
    { divider: true },
    {
      label: "Get Info",
      icon: FiInfo,
      onClick: handleGetInfo,
      shortcut: "⌘I",
    },
    { divider: true },
    {
      label: "Change Wallpaper...",
      icon: FiImage,
      onClick: () => setShowWallpaperPicker(true),
    },
    {
      label: "Edit Widgets...",
      icon: FiLayout,
      onClick: () => {
        window.dispatchEvent(new Event("os_edit_widgets"));
        onClose();
      },
    },
    {
      label: showIconsOnDesktop ? "Hide Desktop Icons" : "Show Desktop Icons",
      icon: showIconsOnDesktop ? FiEyeOff : FiEye,
      onClick: handleToggleIcons,
    },
    {
      label: "Sort By",
      icon: BsSortDown,
      submenu: [
        { label: "Name", onClick: () => handleSortBy("name"), checked: sortBy === "name" },
        { label: "Date Created", onClick: () => handleSortBy("date"), checked: sortBy === "date" },
        { label: "Size", onClick: () => handleSortBy("size"), checked: sortBy === "size" },
        { label: "Kind", onClick: () => handleSortBy("kind"), checked: sortBy === "kind" },
      ],
    },
    {
      label: "Clean Up",
      icon: BsGrid3X3,
      onClick: () => {
        window.dispatchEvent(new Event("desktopCleanup"));
        onClose();
      },
    },

    {
      label: "Open in Finder",
      icon: FiFolder,
      onClick: () => {
        if (onOpenFinder) onOpenFinder("/desktop");
        onClose();
      },
    },
    { divider: true },
    {
      label: "Refresh",
      icon: FiRefreshCw,
      onClick: handleRefresh,
      shortcut: "⌘R",
    },
  ].filter(Boolean);

  return (
    <>
      {/* Only show context menu when wallpaper picker is not open */}
      {!showWallpaperPicker && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.1 }}
          onMouseDown={(e) => e.stopPropagation()}
          className={`fixed z-9999 min-w-[220px] py-1.5 px-1 rounded-xl shadow-2xl border backdrop-blur-xl transition-all duration-300 ${isDarkMode ? 'border-white/10' : 'border-black/[0.08] border-white/60'}`}
          style={{
            left: adjustedPosition.x,
            top: adjustedPosition.y,
            background: isDarkMode ? "rgba(18, 18, 18, 0.75)" : "rgba(245, 245, 247, 0.72)",
            boxShadow: isDarkMode 
              ? "0 10px 40px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.08)" 
              : "0 10px 30px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(255,255,255,0.6)"
          }}
        >
        {menuItems.map((item, index) => {
          if (item.divider) {
            return (
              <div
                key={index}
                className={`h-px my-1 mx-2 ${isDarkMode ? 'bg-white/10' : 'bg-black/5'}`}
              />
            );
          }

          return (
            <div
              key={index}
              className="relative"
              onMouseEnter={() => item.submenu && setSubmenu(index)}
              onMouseLeave={() => !item.submenu && setSubmenu(null)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  item.onClick();
                }}
                className={`w-full px-3 py-1.5 flex items-center gap-3 hover:bg-[#007aff] hover:text-white transition-colors text-sm rounded-lg group ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}
              >
                <item.icon className={`w-4 h-4 transition-colors ${isDarkMode ? 'text-white/60 group-hover:text-white' : 'text-gray-500 group-hover:text-white'}`} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.shortcut && (
                  <span className={`text-xs transition-colors ${isDarkMode ? 'text-white/45 group-hover:text-white/80' : 'text-gray-500 group-hover:text-white/80'}`}>{item.shortcut}</span>
                )}
                {item.submenu && (
                  <span className={`transition-colors ${isDarkMode ? 'text-white/45 group-hover:text-white/80' : 'text-gray-400 group-hover:text-white/80'}`}>▶</span>
                )}
              </button>

              {/* Submenu */}
              {item.submenu && submenu === index && (
                <motion.div
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`absolute left-full top-0 ml-1 min-w-[150px] py-1 px-1 rounded-xl shadow-2xl border backdrop-blur-xl ${isDarkMode ? 'border-white/10' : 'border-black/[0.08] border-white/60'}`}
                  style={{
                    background: isDarkMode ? "rgba(18, 18, 18, 0.75)" : "rgba(245, 245, 247, 0.72)",
                    boxShadow: isDarkMode 
                      ? "0 10px 40px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.08)" 
                      : "0 10px 30px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(255,255,255,0.6)"
                  }}
                >
                  {item.submenu.map((subItem, subIndex) => (
                    <button
                      key={subIndex}
                      onClick={subItem.onClick}
                      className={`w-full px-3 py-1.5 flex items-center gap-2 hover:bg-[#007aff] hover:text-white transition-colors text-sm rounded-lg ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}
                    >
                      {subItem.checked && <span className={isDarkMode ? "text-blue-400" : "text-blue-600"}>✓</span>}
                      <span className={subItem.checked ? "" : "pl-5"}>{subItem.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          );
        })}
        </motion.div>
      )}

      {/* Wallpaper Picker Modal */}
      <AnimatePresence>
        {showWallpaperPicker && (
          <motion.div
            initial={false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.08, ease: "linear" }}
            className="fixed inset-0 z-10000 flex items-center justify-center bg-black/40"
            onClick={() => {
              setShowWallpaperPicker(false);
              onClose();
            }}
          >
            <motion.div
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className={`rounded-2xl p-6 w-[600px] max-h-[80vh] overflow-y-auto border shadow-2xl scroll-smooth scrollbar-light backdrop-blur-xl ${isDarkMode ? 'border-white/10' : 'border-white/25'}`}
              style={{
                background: isDarkMode ? "rgba(20, 20, 20, 0.8)" : "rgba(255, 255, 255, 0.65)",
                boxShadow: isDarkMode 
                  ? "0 10px 40px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.08)" 
                  : "0 10px 40px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(255,255,255,0.35)"
              }}
            >
              <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Choose Wallpaper</h2>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                {wallpapers.map((wp) => (
                  <button
                    key={wp.id}
                    onClick={() => handleChangeWallpaper(wp)}
                    className="group relative aspect-video rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 hover:scale-[1.02] active:scale-95 transition-all duration-200 ease-out cursor-pointer transform-gpu will-change-transform shadow-sm hover:shadow-md"
                  >
                    <img
                      src={wp.src}
                      alt={wp.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transform-gpu"
                      onError={(e) => {
                        e.target.src = "./bg.png";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCustomWallpaper}
                  className="flex-1 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <FiPlus className="w-4 h-4" />
                  Choose from Files...
                </button>
                <button
                  onClick={() => {
                    setShowWallpaperPicker(false);
                    onClose();
                  }}
                  className={`py-2 px-6 rounded-lg text-sm font-medium transition-colors ${isDarkMode ? 'bg-white/10 hover:bg-white/15 text-white' : 'bg-black/10 hover:bg-black/15 text-gray-800'}`}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

