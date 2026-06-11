import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../store/Appstore";
import {
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiDownload,
  FiSearch,
  FiMoreHorizontal,
  FiInfo,
  FiShare,
  FiRotateCw,
  FiPlay,
  FiMapPin,
  FiVideo,
  FiCamera,
  FiUser,
  FiTrash2,
  FiLock,
  FiPlus,
  FiMinus,
  FiSliders,
  FiList
} from "react-icons/fi";
import {
  BsImage,
  BsHeart,
  BsHeartFill,
  BsDownload,
  BsGrid3X3,
  BsLock,
  BsDisplay,
  BsGrid,
  BsFolder2Open
} from "react-icons/bs";

// Dynamically import all images from the Wallpaper folder
const wallpaperModules = import.meta.glob('/public/Wallpaper/*.{jpg,jpeg,png,gif,webp}', { eager: true, query: '?url', import: 'default' });

const getWallpaperImages = () => {
  return Object.keys(wallpaperModules).map(path => path.replace('/public', ''));
};

const IMAGES = getWallpaperImages();

// macOS Sidebar Toggle Icon
const SidebarToggleIcon = () => (
  <svg width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500 dark:text-gray-400">
    <rect x="0.5" y="0.5" width="17" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.2" />
    <line x1="5.5" y1="0.5" x2="5.5" y2="14.5" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

// macOS Slideshow Icon
const SlideshowIcon = () => (
  <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-600 dark:text-gray-400">
    <rect x="1" y="1" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.2" />
    <path d="M7.5 4.5L11 6.5L7.5 8.5V4.5Z" fill="currentColor" />
    <line x1="4" y1="15" x2="14" y2="15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="9" y1="12" x2="9" y2="15" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

// macOS Rotate Left/Right Icon
const RotateIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 dark:text-gray-400">
    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
  </svg>
);

// Traffic lights inside the Photos sidebar
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

export default function MacGallery({ windowId }) {
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  const [selected, setSelected] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("library");
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("photo_favorites");
    return saved ? JSON.parse(saved) : [];
  });
  const [downloads, setDownloads] = useState(() => {
    const saved = localStorage.getItem("os_downloads");
    return saved ? JSON.parse(saved) : [];
  });
  const [zoomLevel, setZoomLevel] = useState(3); // 1 to 5
  const [lightboxZoom, setLightboxZoom] = useState(1);
  const [downloadNotification, setDownloadNotification] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem("photo_favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Sync downloads
  useEffect(() => {
    const handleDownload = (e) => {
      const newFile = e.detail;
      if (newFile.type === 'image') {
        setDownloads(prev => [newFile, ...prev.filter(f => f.id !== newFile.id)]);
      }
    };

    const syncDownloads = () => {
      const saved = localStorage.getItem("os_downloads");
      if (saved) {
        const parsed = JSON.parse(saved);
        setDownloads(parsed.filter(f => f.type === 'image'));
      }
    };

    window.addEventListener("os_file_download", handleDownload);
    window.addEventListener("focus", syncDownloads);
    syncDownloads();

    return () => {
      window.removeEventListener("os_file_download", handleDownload);
      window.removeEventListener("focus", syncDownloads);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selected) return;
      if (e.key === "ArrowLeft") {
        navigateImage(-1);
      } else if (e.key === "ArrowRight") {
        navigateImage(1);
      } else if (e.key === "Escape") {
        setSelected(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selected, selectedIndex, activeTab]);

  const toggleFavorite = (img) => {
    setFavorites(prev =>
      prev.includes(img) ? prev.filter(f => f !== img) : [...prev, img]
    );
  };

  const setWallpaper = () => {
    localStorage.setItem("desktop_wallpaper", selected);
    setTimeout(() => {
      window.dispatchEvent(new Event('wallpaperChanged'));
    }, 50);
  };

  const setLockscreen = () => {
    localStorage.setItem("lockscreen_wallpaper", selected);
  };

  const downloadImage = () => {
    if (!selected) return;
    const imageName = selected.split('/').pop();
    const newFile = {
      id: Date.now().toString(),
      name: imageName,
      url: selected,
      type: 'image',
      date: new Date().toISOString(),
      size: null,
      source: 'Photos'
    };

    const existingDownloads = JSON.parse(localStorage.getItem("os_downloads") || "[]");
    const updatedDownloads = [newFile, ...existingDownloads.filter(f => f.id !== newFile.id)];
    localStorage.setItem("os_downloads", JSON.stringify(updatedDownloads));

    window.dispatchEvent(new CustomEvent('os_file_download', { detail: newFile }));
    setDownloadNotification(imageName);
    setTimeout(() => setDownloadNotification(null), 3000);
  };

  const openImage = (img, index) => {
    setSelected(img);
    setSelectedIndex(index);
    setLightboxZoom(1);
  };

  const getDisplayImages = () => {
    if (activeTab === "favorites") return favorites;
    if (activeTab === "downloads" || activeTab === "recentsaved") return downloads.map(d => d.url);
    if (activeTab === "library" || activeTab === "collections") return IMAGES;
    // Return empty list for others to show clean empty states
    return [];
  };

  const navigateImage = (direction) => {
    const images = getDisplayImages();
    if (images.length === 0) return;
    let newIndex = selectedIndex + direction;
    if (newIndex < 0) newIndex = images.length - 1;
    if (newIndex >= images.length) newIndex = 0;
    setSelectedIndex(newIndex);
    setSelected(images[newIndex]);
    setLightboxZoom(1);
  };

  const displayImages = getDisplayImages();

  const getImageName = (path) => {
    if (!path) return "Unknown";
    const name = path.split('/').pop().split('?')[0].split('.')[0];
    return name.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Grid columns class based on zoom level
  const getGridColsClass = () => {
    switch (zoomLevel) {
      case 1: return "grid-cols-8 gap-[2px]";
      case 2: return "grid-cols-6 gap-[2px]";
      case 3: return "grid-cols-5 gap-[3px]";
      case 4: return "grid-cols-4 gap-[3px]";
      case 5: return "grid-cols-3 gap-[4px]";
      default: return "grid-cols-5 gap-[3px]";
    }
  };

  return (
    <div
      className="relative flex h-full w-full overflow-hidden select-none"
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
        background: isDarkMode ? "#1e1e1e" : "#ffffff"
      }}
    >

      {/* Sidebar */}
      {isSidebarOpen && (
        <aside
          className="w-52 h-full flex flex-col flex-shrink-0 border-r select-none window-drag-handle"
          style={{
            background: isDarkMode ? "rgba(37, 37, 37, 0.9)" : "rgba(250, 250, 248, 0.9)",
            borderColor: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"
          }}
        >
          {/* Sidebar Title / Control area */}
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
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto px-2 py-1 space-y-4">
            <div className="space-y-0.5">
              <button
                onClick={() => setActiveTab("library")}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${activeTab === "library"
                    ? "bg-black/[0.05] dark:bg-white/[0.08] text-[#007AFF]"
                    : "text-gray-700 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/5"
                  }`}
              >
                <BsImage size={15} className={activeTab === "library" ? "text-[#007AFF]" : "text-gray-500 dark:text-gray-400"} />
                <span>Library</span>
              </button>
              <button
                onClick={() => setActiveTab("collections")}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${activeTab === "collections"
                    ? "bg-black/[0.05] dark:bg-white/[0.08] text-[#007AFF]"
                    : "text-gray-700 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/5"
                  }`}
              >
                <BsGrid size={14} className={activeTab === "collections" ? "text-[#007AFF]" : "text-gray-500 dark:text-gray-400"} />
                <span>Collections</span>
              </button>
            </div>

            {/* Pinned Section */}
            <div>
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 select-none">Pinned</span>
              <div className="mt-1 space-y-0.5">
                <button
                  onClick={() => setActiveTab("favorites")}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${activeTab === "favorites"
                      ? "bg-black/[0.05] dark:bg-white/[0.08] text-[#007AFF]"
                      : "text-gray-700 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/5"
                    }`}
                >
                  <BsHeart size={14} className={activeTab === "favorites" ? "text-[#007AFF]" : "text-gray-500 dark:text-gray-400"} />
                  <span>Favorites</span>
                </button>
                <button
                  onClick={() => setActiveTab("recentsaved")}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${activeTab === "recentsaved"
                      ? "bg-black/[0.05] dark:bg-white/[0.08] text-[#007AFF]"
                      : "text-gray-700 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/5"
                    }`}
                >
                  <BsDownload size={14} className={activeTab === "recentsaved" ? "text-[#007AFF]" : "text-gray-500 dark:text-gray-400"} />
                  <span>Recently Saved</span>
                </button>
                <button
                  onClick={() => setActiveTab("map")}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${activeTab === "map"
                      ? "bg-black/[0.05] dark:bg-white/[0.08] text-[#007AFF]"
                      : "text-gray-700 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/5"
                    }`}
                >
                  <FiMapPin size={14} className={activeTab === "map" ? "text-[#007AFF]" : "text-gray-500 dark:text-gray-400"} />
                  <span>Map</span>
                </button>
                <button
                  onClick={() => setActiveTab("videos")}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${activeTab === "videos"
                      ? "bg-black/[0.05] dark:bg-white/[0.08] text-[#007AFF]"
                      : "text-gray-700 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/5"
                    }`}
                >
                  <FiVideo size={14} className={activeTab === "videos" ? "text-[#007AFF]" : "text-gray-500 dark:text-gray-400"} />
                  <span>Videos</span>
                </button>
                <button
                  onClick={() => setActiveTab("screenshots")}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${activeTab === "screenshots"
                      ? "bg-black/[0.05] dark:bg-white/[0.08] text-[#007AFF]"
                      : "text-gray-700 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/5"
                    }`}
                >
                  <FiCamera size={14} className={activeTab === "screenshots" ? "text-[#007AFF]" : "text-gray-500 dark:text-gray-400"} />
                  <span>Screenshots</span>
                </button>
                <button
                  onClick={() => setActiveTab("people")}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${activeTab === "people"
                      ? "bg-black/[0.05] dark:bg-white/[0.08] text-[#007AFF]"
                      : "text-gray-700 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/5"
                    }`}
                >
                  <FiUser size={14} className={activeTab === "people" ? "text-[#007AFF]" : "text-gray-500 dark:text-gray-400"} />
                  <span>People & Pets</span>
                </button>
                <button
                  onClick={() => setActiveTab("deleted")}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${activeTab === "deleted"
                      ? "bg-black/[0.05] dark:bg-white/[0.08] text-[#007AFF]"
                      : "text-gray-700 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/5"
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FiTrash2 size={14} className={activeTab === "deleted" ? "text-[#007AFF]" : "text-gray-500 dark:text-gray-400"} />
                    <span>Recently Deleted</span>
                  </div>
                  <FiLock size={10} className="text-gray-400 dark:text-gray-500" />
                </button>
              </div>
            </div>

            {/* Static macOS Category Headers */}
            <div className="space-y-3 pt-2 border-t border-black/[0.05] dark:border-white/5">
              <div className="flex items-center justify-between px-3">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider select-none">Albums</span>
              </div>
              <div className="flex items-center justify-between px-3">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider select-none">Sharing</span>
              </div>
              <div className="flex items-center justify-between px-3">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider select-none">Media Types</span>
              </div>
              <div className="flex items-center justify-between px-3">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider select-none">Utilities</span>
              </div>
              <div className="flex items-center justify-between px-3">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider select-none">Projects</span>
              </div>
            </div>
          </nav>
        </aside>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Toolbar Header */}
        <header
          className="h-[52px] flex items-center justify-between px-5 select-none border-b border-black/[0.08] dark:border-white/10 window-drag-handle"
          style={{ background: isDarkMode ? "#1e1e1e" : "#ffffff" }}
        >
          {/* Toolbar Left: Title & Subtitle */}
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors mr-1"
                title="Show Sidebar"
              >
                <SidebarToggleIcon />
              </button>
            )}
            <div className="flex flex-col items-start justify-center gap-0.5 leading-tight">
              <span className={`text-[18px] font-bold capitalize ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                {activeTab === "recentsaved" ? "Recently Saved" : activeTab === "deleted" ? "Recently Deleted" : activeTab === "people" ? "People & Pets" : activeTab}
              </span>
              {activeTab === "library" && (
                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium select-none">Jul 15 – 16, 2024</span>
              )}
              {activeTab !== "library" && (
                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium select-none">{displayImages.length} items</span>
              )}
            </div>
          </div>

          {/* Toolbar Center: Zoom Controls & Filter Tab */}
          <div className="flex items-center gap-4">
            {/* Zoom Slider */}
            <div className="flex items-center gap-1.5 bg-black/[0.04] dark:bg-white/[0.06] rounded-lg px-2 py-1">
              <button
                onClick={() => setZoomLevel(prev => Math.max(1, prev - 1))}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
              >
                <FiMinus size={11} />
              </button>
              <input
                type="range"
                min="1"
                max="5"
                value={zoomLevel}
                onChange={(e) => setZoomLevel(Number(e.target.value))}
                className="w-16 h-1 rounded-full accent-[#007AFF] bg-gray-200 dark:bg-gray-700 outline-none cursor-pointer"
              />
              <button
                onClick={() => setZoomLevel(prev => Math.min(5, prev + 1))}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
              >
                <FiPlus size={11} />
              </button>
            </div>

            {/* Photos Mode Dropdown */}
            <button className="flex items-center gap-1.5 bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] text-gray-700 dark:text-gray-300 rounded-lg px-3 py-1 text-[12px] font-medium transition-colors border border-black/[0.05] dark:border-white/[0.05]">
              <span>All Photos</span>
              <svg width="8" height="10" viewBox="0 0 8 10" fill="none" className="text-gray-400">
                <path d="M4 1L7 4H1L4 1ZM4 9L1 6H7L4 9Z" fill="currentColor" />
              </svg>
            </button>
          </div>

          {/* Toolbar Right: Action Buttons */}
          <div className="flex items-center gap-0.5">
            <button className="p-1.5 hover:bg-black/[0.05] dark:hover:bg-white/5 rounded-md text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors" title="Slideshow">
              <SlideshowIcon />
            </button>
            <button className="p-1.5 hover:bg-black/[0.05] dark:hover:bg-white/5 rounded-md text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors" title="Details View">
              <FiList size={15} />
            </button>
            <button className="p-1.5 hover:bg-black/[0.05] dark:hover:bg-white/5 rounded-md text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors" title="More">
              <FiMoreHorizontal size={15} />
            </button>
            <div className="w-px h-4 bg-gray-200 dark:bg-gray-800 mx-1.5" />
            <button className="p-1.5 hover:bg-black/[0.05] dark:hover:bg-white/5 rounded-md text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors" title="Get Info">
              <FiInfo size={15} />
            </button>
            <button className="p-1.5 hover:bg-black/[0.05] dark:hover:bg-white/5 rounded-md text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors" title="Share">
              <FiShare size={14} />
            </button>
            <button className="p-1.5 hover:bg-black/[0.05] dark:hover:bg-white/5 rounded-md text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors" title="Favorite">
              <BsHeart size={14} />
            </button>
            <button className="p-1.5 hover:bg-black/[0.05] dark:hover:bg-white/5 rounded-md text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors" title="Rotate">
              <RotateIcon />
            </button>
            <button className="p-1.5 hover:bg-black/[0.05] dark:hover:bg-white/5 rounded-md text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors" title="Search">
              <FiSearch size={14} />
            </button>
          </div>
        </header>

        {/* Photos Grid Container */}
        <div className="flex-1 overflow-y-auto p-2 notes-no-scrollbar" style={{ scrollbarWidth: "none" }}>
          {displayImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-400 dark:text-gray-500">
              {activeTab === "recentsaved" || activeTab === "downloads" ? (
                <>
                  <BsDownload size={48} className="mb-3 text-gray-300 dark:text-gray-600" />
                  <p className="text-[14px] font-medium">No saved downloads yet</p>
                  <p className="text-[11px] text-gray-400 mt-1 max-w-xs">Download pictures from Safari to see them directly inside this section.</p>
                </>
              ) : activeTab === "favorites" ? (
                <>
                  <BsHeart size={48} className="mb-3 text-gray-300 dark:text-gray-600" />
                  <p className="text-[14px] font-medium">No favorites yet</p>
                  <p className="text-[11px] text-gray-400 mt-1 max-w-xs">Hover over images and click the heart icon to save your favorite images here.</p>
                </>
              ) : activeTab === "deleted" ? (
                <>
                  <FiTrash2 size={48} className="mb-3 text-gray-300 dark:text-gray-600" />
                  <p className="text-[14px] font-medium">No recently deleted photos</p>
                  <p className="text-[11px] text-gray-400 mt-1">Photos will appear here for 30 days before permanent deletion.</p>
                </>
              ) : (
                <>
                  <BsFolder2Open size={48} className="mb-3 text-gray-300 dark:text-gray-600" />
                  <p className="text-[14px] font-medium capitalize">No Photos in {activeTab}</p>
                  <p className="text-[11px] text-gray-400 mt-1">This album currently has no contents.</p>
                </>
              )}
            </div>
          ) : (
            <div className={`grid ${getGridColsClass()} transition-all duration-300`}>
              {displayImages.map((img, i) => (
                <div
                  key={img}
                  className="relative aspect-square group cursor-pointer overflow-hidden bg-gray-100 dark:bg-gray-900 border border-black/5 dark:border-white/5"
                  onClick={() => openImage(img, i)}
                >
                  <img
                    src={img}
                    alt={`Photo ${i + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transform-gpu group-hover:brightness-95 transition-all"
                  />

                  {/* Favorite indicator (top-right like mockup) */}
                  {favorites.includes(img) && (
                    <div className="absolute top-2 right-2 drop-shadow-md">
                      <BsHeartFill size={13} className="text-white" />
                    </div>
                  )}

                  {/* Hover overlay: Heart icon in bottom-left like mockup */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all flex items-end p-2.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(img);
                      }}
                      className="text-white drop-shadow-md hover:scale-110 active:scale-95 transition-transform"
                    >
                      {favorites.includes(img) ? <BsHeartFill size={15} /> : <BsHeart size={15} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Lightbox / Full Screen Photo Viewer */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className={`absolute inset-0 z-50 flex flex-col backdrop-blur-sm ${
              isDarkMode ? "bg-black/95 text-white" : "bg-white/95 text-gray-800"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
          >
            {/* Close button */}
            <button
              onClick={() => setSelected(null)}
              className={`absolute top-4 left-4 z-50 p-2 rounded-full transition-all ${
                isDarkMode 
                  ? "bg-white/10 hover:bg-white/20 text-white" 
                  : "bg-black/5 hover:bg-black/10 text-gray-800"
              }`}
            >
              <FiX size={18} />
            </button>

            {/* Navigation arrows */}
            <button
              onClick={() => navigateImage(-1)}
              className={`absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full transition-all ${
                isDarkMode 
                  ? "bg-white/10 hover:bg-white/20 text-white" 
                  : "bg-black/5 hover:bg-black/10 text-gray-800"
              }`}
            >
              <FiChevronLeft size={22} />
            </button>
            <button
              onClick={() => navigateImage(1)}
              className={`absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full transition-all ${
                isDarkMode 
                  ? "bg-white/10 hover:bg-white/20 text-white" 
                  : "bg-black/5 hover:bg-black/10 text-gray-800"
              }`}
            >
              <FiChevronRight size={22} />
            </button>

            {/* Image display */}
            <div className="flex-1 flex items-center justify-center px-12 pt-12 pb-2 relative z-10 overflow-hidden" onClick={() => setSelected(null)}>
              <motion.img
                key={selected}
                src={selected}
                alt="Selected Photo"
                initial={{ opacity: 0, scale: 0.93 }}
                animate={{ opacity: 1, scale: lightboxZoom }}
                exit={{ opacity: 0, scale: 0.93 }}
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Bottom Actions Toolbar */}
            <div className="p-3 flex items-center justify-center gap-3 z-20 pb-5">
              <div className={`flex items-center gap-2.5 px-4 py-2 rounded-full backdrop-blur-xl border ${
                isDarkMode 
                  ? "bg-white/15 border-white/20 text-white" 
                  : "bg-black/5 border-black/10 text-gray-800"
              }`}>
                {/* Favorite */}
                <button
                  onClick={() => toggleFavorite(selected)}
                  className={`p-2 rounded-full transition-colors ${
                    favorites.includes(selected) 
                      ? "text-red-500" 
                      : isDarkMode 
                        ? "text-white hover:bg-white/10" 
                        : "text-gray-800 hover:bg-black/5"
                  }`}
                  title="Favorite"
                >
                  {favorites.includes(selected) ? <BsHeartFill size={16} /> : <BsHeart size={16} />}
                </button>

                <div className={`w-px h-5 ${isDarkMode ? "bg-white/20" : "bg-black/15"}`} />

                {/* Set as Desktop Wallpaper */}
                <button
                  onClick={setWallpaper}
                  className={`p-2 rounded-full transition-all flex items-center gap-1.5 ${
                    isDarkMode ? "hover:bg-white/10 text-white" : "hover:bg-black/5 text-gray-800"
                  }`}
                  title="Set as Desktop Wallpaper"
                >
                  <BsDisplay size={16} />
                  <span className="text-[11px] font-medium">Desktop</span>
                </button>

                {/* Set as Lock Screen */}
                <button
                  onClick={setLockscreen}
                  className={`p-2 rounded-full transition-all flex items-center gap-1.5 ${
                    isDarkMode ? "hover:bg-white/10 text-white" : "hover:bg-black/5 text-gray-800"
                  }`}
                  title="Set as Lock Screen"
                >
                  <BsLock size={15} />
                  <span className="text-[11px] font-medium">Lock Screen</span>
                </button>

                <div className={`w-px h-5 ${isDarkMode ? "bg-white/20" : "bg-black/15"}`} />

                {/* Download to OS */}
                <button
                  onClick={downloadImage}
                  className={`p-2 rounded-full transition-all flex items-center gap-1.5 ${
                    isDarkMode 
                      ? "bg-green-500/35 hover:bg-green-500/50 text-white" 
                      : "bg-green-500/20 hover:bg-green-500/30 text-green-700"
                  }`}
                  title="Download to OS"
                >
                  <BsDownload size={15} />
                  <span className="text-[11px] font-medium">Download</span>
                </button>

                <div className={`w-px h-5 ${isDarkMode ? "bg-white/20" : "bg-black/15"}`} />

                {/* Zoom controls */}
                <button
                  onClick={() => setLightboxZoom(Math.max(0.5, lightboxZoom - 0.25))}
                  className={`p-1.5 rounded-full transition text-[13px] font-bold ${
                    isDarkMode ? "hover:bg-white/10 text-white" : "hover:bg-black/5 text-gray-800"
                  }`}
                >
                  −
                </button>
                <span className={`text-[11px] min-w-10 text-center font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>{Math.round(lightboxZoom * 100)}%</span>
                <button
                  onClick={() => setLightboxZoom(Math.min(3, lightboxZoom + 0.25))}
                  className={`p-1.5 rounded-full transition text-[13px] font-bold ${
                    isDarkMode ? "hover:bg-white/10 text-white" : "hover:bg-black/5 text-gray-800"
                  }`}
                >
                  +
                </button>
              </div>
            </div>

            {/* Top Right Information Overlay */}
            <div className="absolute top-4 right-4 text-right">
              <p className={`text-[12px] font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>{getImageName(selected)}</p>
              <p className={`text-[10px] mt-0.5 ${isDarkMode ? "text-white/60" : "text-gray-500"}`}>{selectedIndex + 1} of {displayImages.length}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast notifications */}
      <AnimatePresence>
        {downloadNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className="absolute bottom-20 left-1/2 z-100 flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-800/95 backdrop-blur-xl border border-white/10 shadow-2xl"
          >
            <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
              <FiDownload className="text-white" size={16} />
            </div>
            <div>
              <p className="text-white text-[12px] font-semibold">Downloaded to Finder</p>
              <p className="text-white/60 text-[10px] mt-0.5 truncate max-w-xs">{downloadNotification}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}