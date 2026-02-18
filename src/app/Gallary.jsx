import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiGrid, FiHeart, FiShare, FiTrash2, FiChevronLeft, FiChevronRight, FiX, FiImage, FiMonitor, FiDownload } from "react-icons/fi";
import { BsGrid3X3, BsHeart, BsHeartFill, BsImage, BsDisplay, BsLock, BsDownload } from "react-icons/bs";

// Dynamically import all images from the Wallpaper folder
const wallpaperModules = import.meta.glob('/public/Wallpaper/*.{jpg,jpeg,png,gif,webp}', { eager: true, query: '?url', import: 'default' });

const getWallpaperImages = () => {
  return Object.keys(wallpaperModules).map(path => path.replace('/public', ''));
};

const IMAGES = getWallpaperImages();

const sidebarItems = [
  { id: "library", label: "Library", icon: BsImage },
  { id: "downloads", label: "Downloads", icon: BsDownload },
  { id: "favorites", label: "Favorites", icon: BsHeart },
  { id: "recents", label: "Recents", icon: BsGrid3X3 },
];

export default function MacGallery() {
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
  const [zoomLevel, setZoomLevel] = useState(1);
  const [downloadNotification, setDownloadNotification] = useState(null);

  useEffect(() => {
    localStorage.setItem("photo_favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Listen for new downloads and sync with localStorage
  useEffect(() => {
    const handleDownload = (e) => {
      const newFile = e.detail;
      if (newFile.type === 'image') {
        setDownloads(prev => [newFile, ...prev.filter(f => f.id !== newFile.id)]);
      }
    };

    // Also sync on focus/visibility change
    const syncDownloads = () => {
      const saved = localStorage.getItem("os_downloads");
      if (saved) {
        const parsed = JSON.parse(saved);
        setDownloads(parsed.filter(f => f.type === 'image'));
      }
    };

    window.addEventListener("os_file_download", handleDownload);
    window.addEventListener("focus", syncDownloads);
    
    // Initial sync
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
    
    // Get the image name from the path
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
    
    // Save directly to localStorage (so Finder can read it even if not open)
    const existingDownloads = JSON.parse(localStorage.getItem("os_downloads") || "[]");
    const updatedDownloads = [newFile, ...existingDownloads.filter(f => f.id !== newFile.id)];
    localStorage.setItem("os_downloads", JSON.stringify(updatedDownloads));
    
    // Also dispatch event for any open Finder windows
    const downloadEvent = new CustomEvent('os_file_download', {
      detail: newFile
    });
    window.dispatchEvent(downloadEvent);
    
    // Show a nice toast notification
    setDownloadNotification(imageName);
    setTimeout(() => setDownloadNotification(null), 3000);
  };

  const openImage = (img, index) => {
    setSelected(img);
    setSelectedIndex(index);
    setZoomLevel(1);
  };

  // Helper to get images based on active tab
  const getDisplayImages = () => {
    if (activeTab === "favorites") return favorites;
    if (activeTab === "downloads") return downloads.map(d => d.url);
    return IMAGES;
  };

  const navigateImage = (direction) => {
    const images = getDisplayImages();
    let newIndex = selectedIndex + direction;
    if (newIndex < 0) newIndex = images.length - 1;
    if (newIndex >= images.length) newIndex = 0;
    setSelectedIndex(newIndex);
    setSelected(images[newIndex]);
    setZoomLevel(1);
  };

  const displayImages = getDisplayImages();

  const getImageName = (path) => {
    if (!path) return "Unknown";
    const name = path.split('/').pop().split('?')[0].split('.')[0];
    return name.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="relative flex h-full overflow-hidden" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>
      
      {/* Sidebar */}
      <aside className="w-44 flex flex-col border-r" style={{ background: "rgba(246, 246, 246, 0.9)", borderColor: "rgba(224, 224, 224, 0.5)" }}>
        <div className="p-3 border-b" style={{ borderColor: "rgba(224, 224, 224, 0.5)" }}>
          <h2 className="text-[13px] font-semibold text-gray-700">Photos</h2>
        </div>

        <nav className="flex-1 p-2">
          <div className="mb-3">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2">Library</span>
          </div>
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[12px] transition-all ${
                activeTab === item.id 
                  ? "bg-[#007AFF] text-white" 
                  : "text-gray-600 hover:bg-black/5"
              }`}
            >
              <item.icon size={14} />
              <span>{item.label}</span>
              {item.id === "library" && (
                <span className={`ml-auto text-[10px] ${activeTab === item.id ? "text-white/70" : "text-gray-400"}`}>
                  {IMAGES.length}
                </span>
              )}
              {item.id === "downloads" && (
                <span className={`ml-auto text-[10px] ${activeTab === item.id ? "text-white/70" : "text-gray-400"}`}>
                  {downloads.length}
                </span>
              )}
              {item.id === "favorites" && (
                <span className={`ml-auto text-[10px] ${activeTab === item.id ? "text-white/70" : "text-gray-400"}`}>
                  {favorites.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Info */}
        <div className="p-3 border-t text-center" style={{ borderColor: "rgba(224, 224, 224, 0.5)" }}>
          <p className="text-[10px] text-gray-400">{displayImages.length} Photos</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden" style={{ background: "rgba(255, 255, 255, 0.95)" }}>
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: "rgba(224, 224, 224, 0.5)" }}>
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-semibold text-gray-800">
              {activeTab === "library" ? "All Photos" : activeTab === "downloads" ? "Downloads" : activeTab === "favorites" ? "Favorites" : "Recents"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded hover:bg-gray-100 text-gray-500">
              <BsGrid3X3 size={14} />
            </button>
          </div>
        </div>

        {/* Photos Grid */}
        <div className="flex-1 overflow-y-auto p-4 notes-no-scrollbar" style={{ scrollbarWidth: "none" }}>
          {displayImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              {activeTab === "downloads" ? (
                <>
                  <BsDownload size={48} className="mb-3" />
                  <p className="text-[14px]">No downloads yet</p>
                  <p className="text-[11px]">Download images from Safari to see them here</p>
                </>
              ) : (
                <>
                  <BsHeart size={48} className="mb-3" />
                  <p className="text-[14px]">No favorites yet</p>
                  <p className="text-[11px]">Click the heart on photos to add them here</p>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1">
              {displayImages.map((img, i) => (
                <motion.div
                  key={img}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="relative aspect-square group cursor-pointer overflow-hidden"
                  onClick={() => openImage(img, i)}
                >
                  <img
                    src={img}
                    alt={`Photo ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
                  
                  {/* Favorite indicator */}
                  {favorites.includes(img) && (
                    <div className="absolute top-1 right-1">
                      <BsHeartFill size={12} className="text-white drop-shadow-lg" />
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(img);
                      }}
                      className="text-white"
                    >
                      {favorites.includes(img) ? <BsHeartFill size={14} /> : <BsHeart size={14} />}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Lightbox / Photo Viewer */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="absolute inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* Close button */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 left-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            >
              <FiX size={20} />
            </button>

            {/* Navigation arrows */}
            <button
              onClick={() => navigateImage(-1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            >
              <FiChevronLeft size={24} />
            </button>
            <button
              onClick={() => navigateImage(1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            >
              <FiChevronRight size={24} />
            </button>

            {/* Image */}
            <div className="flex-1 flex items-center justify-center px-12 pt-12 pb-2 relative z-10 overflow-hidden" onClick={() => setSelected(null)}>
              <motion.img
                key={selected}
                src={selected}
                alt="Selected Photo"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: zoomLevel }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Bottom toolbar */}
            <div className="p-3 flex items-center justify-center gap-3 z-20">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-xl border border-white/20">
                {/* Favorite */}
                <button
                  onClick={() => toggleFavorite(selected)}
                  className={`p-2 rounded-full hover:bg-white/10 transition ${favorites.includes(selected) ? "text-red-400" : "text-white"}`}
                  title="Favorite"
                >
                  {favorites.includes(selected) ? <BsHeartFill size={18} /> : <BsHeart size={18} />}
                </button>

                <div className="w-px h-6 bg-white/20" />

                {/* Set as Desktop Wallpaper */}
                <button
                  onClick={setWallpaper}
                  className="p-2 rounded-full hover:bg-white/10 text-white transition flex items-center gap-2"
                  title="Set as Desktop Wallpaper"
                >
                  <BsDisplay size={18} />
                  <span className="text-[12px]">Desktop</span>
                </button>

                {/* Set as Lock Screen */}
                <button
                  onClick={setLockscreen}
                  className="p-2 rounded-full hover:bg-white/10 text-white transition flex items-center gap-2"
                  title="Set as Lock Screen"
                >
                  <BsLock size={18} />
                  <span className="text-[12px]">Lock Screen</span>
                </button>

                <div className="w-px h-6 bg-white/20" />

                {/* Download to OS */}
                <button
                  onClick={downloadImage}
                  className="p-2 rounded-full text-white transition flex items-center gap-2 bg-green-500/30 hover:bg-green-500/50"
                  title="Download to OS"
                >
                  <BsDownload size={18} />
                  <span className="text-[12px]">Download</span>
                </button>

                <div className="w-px h-6 bg-white/20" />

                {/* Zoom controls */}
                <button
                  onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}
                  className="p-2 rounded-full hover:bg-white/10 text-white transition text-[14px] font-bold"
                >
                  −
                </button>
                <span className="text-white text-[12px] min-w-10 text-center">{Math.round(zoomLevel * 100)}%</span>
                <button
                  onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.25))}
                  className="p-2 rounded-full hover:bg-white/10 text-white transition text-[14px] font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Image info */}
            <div className="absolute top-4 right-4 text-right">
              <p className="text-white text-[13px] font-medium">{getImageName(selected)}</p>
              <p className="text-white/60 text-[11px]">{selectedIndex + 1} of {displayImages.length}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Download Toast Notification */}
      <AnimatePresence>
        {downloadNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className="absolute bottom-20 left-1/2 z-100 flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-800/95 backdrop-blur-xl border border-white/10 shadow-2xl"
          >
            <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
              <FiDownload className="text-white" size={16} />
            </div>
            <div>
              <p className="text-white text-[12px] font-medium">Downloaded to Finder</p>
              <p className="text-white/60 text-[10px]">{downloadNotification}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}