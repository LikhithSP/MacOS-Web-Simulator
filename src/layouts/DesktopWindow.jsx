import React, { useEffect, useState } from "react";
import Dock from "../components/Dock";
import AppWindow from "../components/AppWindow";
import { useAppStore } from "../store/Appstore";
import TopBar from "../components/TopBar";
import ContextMenu from "../components/ContextMenu";
import { AnimatePresence, motion } from "framer-motion";
import { FiFolder, FiFile } from "react-icons/fi";
import Finder from "../app/Finder";
import TextEdit from "../app/TextEdit";
import PDFViewer from "../app/PDFViewer";
import CalendarWidget from "../components/widgets/CalendarWidget";
import WeatherWidget from "../components/widgets/WeatherWidget";
import PhotoWidget from "../components/widgets/PhotoWidget";
import ClockWidget from "../components/widgets/ClockWidget";
import GlassClockWidget from "../components/widgets/GlassClockWidget";
import GlassCalendarWidget from "../components/widgets/GlassCalendarWidget";
import GlassWeatherWidget from "../components/widgets/GlassWeatherWidget";
import GlassWorldClockWidget from "../components/widgets/GlassWorldClockWidget";
import GlassRemindersWidget from "../components/widgets/GlassRemindersWidget";
import GlassMiniCalendarWidget from "../components/widgets/GlassMiniCalendarWidget";
import GlassSFWeatherWidget from "../components/widgets/GlassSFWeatherWidget";
import GlassDayWidget from "../components/widgets/GlassDayWidget";
import GlassSmallWorldClockWidget from "../components/widgets/GlassSmallWorldClockWidget";
import GlassWideRemindersWidget from "../components/widgets/GlassWideRemindersWidget";
import { FiX } from "react-icons/fi";

export default function Desktop({ setStage, isLocked = false }) {
  const windows = useAppStore((s) => s.windows);
  const openApp = useAppStore((s) => s.openApp);
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  const [wallpaper, setWallpaper] = useState(() => {
    return localStorage.getItem("desktop_wallpaper") || "/Wallpaper/GoldenGate_6k.png";
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

  const [clipboard, setClipboard] = useState(() => {
    return JSON.parse(localStorage.getItem("os_clipboard") || "null");
  });
  const [isCutMode, setIsCutMode] = useState(() => {
    return localStorage.getItem("os_is_cut_mode") === "true";
  });
  const [toast, setToast] = useState(null);

  const [widgets, setWidgets] = useState(() => {
    return JSON.parse(localStorage.getItem("os_desktop_widgets") || "[]");
  });
  const [showWidgetGallery, setShowWidgetGallery] = useState(false);

  // Define allDesktopItems before useEffect
  const allDesktopItems = [
    ...desktopFolders.filter(f => !f.parentFolderId).map(f => ({ ...f, type: "folder" })),
    ...desktopFiles.filter((f) => !f.parentFolderId).map(f => ({ ...f, type: "file" })),
  ];

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

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

    // Listen for file/folder restoration
    const handleFileRestored = (e) => {
      const { file, path } = e.detail;
      if (path === "/desktop") {
        if (file.type === "folder") {
          setDesktopFolders(prev => [file, ...prev.filter(f => f.id !== file.id)]);
        } else {
          setDesktopFiles(prev => [file, ...prev.filter(f => f.id !== file.id)]);
        }
      }
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

    const handleDesktopSync = () => {
      const folders = JSON.parse(localStorage.getItem("os_desktop_folders") || "[]");
      const files = JSON.parse(localStorage.getItem("os_desktop_files") || "[]");
      setDesktopFolders(prev => {
        if (JSON.stringify(prev) === JSON.stringify(folders)) return prev;
        return folders;
      });
      setDesktopFiles(prev => {
        if (JSON.stringify(prev) === JSON.stringify(files)) return prev;
        return files;
      });
    };

    const handleClipboardSync = () => {
      setClipboard(JSON.parse(localStorage.getItem("os_clipboard") || "null"));
      setIsCutMode(localStorage.getItem("os_is_cut_mode") === "true");
    };

    window.addEventListener('wallpaperChanged', handleWallpaperChange);
    window.addEventListener('os_folder_created', handleFolderCreated);
    window.addEventListener('os_file_created', handleFileCreated);
    window.addEventListener('desktopIconsChanged', handleIconsChanged);
    window.addEventListener('os_edit_widgets', handleEditWidgets);
    window.addEventListener('os_widget_added', handleWidgetAdded);
    window.addEventListener('os_file_restored', handleFileRestored);
    window.addEventListener('os_desktop_sync', handleDesktopSync);
    window.addEventListener('os_clipboard_sync', handleClipboardSync);
    
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
      window.removeEventListener('os_file_restored', handleFileRestored);
      window.removeEventListener('os_desktop_sync', handleDesktopSync);
      window.removeEventListener('os_clipboard_sync', handleClipboardSync);
    };
  }, [selectedItem, allDesktopItems]);

  const handleCopy = (item) => {
    if (!item) return;
    const clipboardItem = { ...item, type: item.type || (desktopFolders.some(f => f.id === item.id) ? "folder" : "file") };
    const clipboardVal = [clipboardItem];
    localStorage.setItem("os_clipboard", JSON.stringify(clipboardVal));
    localStorage.setItem("os_is_cut_mode", "false");
    window.dispatchEvent(new CustomEvent("os_clipboard_sync"));
  };

  const handleCut = (item) => {
    if (!item) return;
    const clipboardItem = { ...item, type: item.type || (desktopFolders.some(f => f.id === item.id) ? "folder" : "file") };
    const clipboardVal = [clipboardItem];
    localStorage.setItem("os_clipboard", JSON.stringify(clipboardVal));
    localStorage.setItem("os_is_cut_mode", "true");
    window.dispatchEvent(new CustomEvent("os_clipboard_sync"));
  };

  const handlePaste = () => {
    const currentClipboard = JSON.parse(localStorage.getItem("os_clipboard") || "null");
    const currentIsCutMode = localStorage.getItem("os_is_cut_mode") === "true";
    if (!currentClipboard || !currentClipboard.length) return;

    const clipboardList = Array.isArray(currentClipboard) ? currentClipboard : [currentClipboard];

    if (currentIsCutMode) {
      clipboardList.forEach((clipboardItem) => {
        const fileWithNewParent = {
          ...clipboardItem,
          date: new Date().toISOString(),
          parentFolderId: undefined,
          x: 50 + Math.random() * 100,
          y: 50 + Math.random() * 100
        };

        const removeFromFileList = (list) => list.filter(f => f.id !== clipboardItem.id);

        const icloud = removeFromFileList(JSON.parse(localStorage.getItem("os_icloud_files") || "[]"));
        const dl = removeFromFileList(JSON.parse(localStorage.getItem("os_downloads") || "[]"));
        const docs = removeFromFileList(JSON.parse(localStorage.getItem("os_documents_files") || "[]"));
        const likhith = removeFromFileList(JSON.parse(localStorage.getItem("os_likhith_files") || "[]"));
        const destFolders = removeFromFileList(JSON.parse(localStorage.getItem("os_desktop_folders") || "[]"));
        const destFiles = removeFromFileList(JSON.parse(localStorage.getItem("os_desktop_files") || "[]"));

        localStorage.setItem("os_icloud_files", JSON.stringify(icloud));
        localStorage.setItem("os_downloads", JSON.stringify(dl));
        localStorage.setItem("os_documents_files", JSON.stringify(docs));
        localStorage.setItem("os_likhith_files", JSON.stringify(likhith));

        if (clipboardItem.type === "folder") {
          const updatedFolders = [...destFolders, fileWithNewParent];
          setDesktopFolders(updatedFolders);
          localStorage.setItem("os_desktop_folders", JSON.stringify(updatedFolders));
        } else {
          const updatedFiles = [...destFiles, fileWithNewParent];
          setDesktopFiles(updatedFiles);
          localStorage.setItem("os_desktop_files", JSON.stringify(updatedFiles));
        }
      });

      localStorage.setItem("os_clipboard", "null");
      localStorage.setItem("os_is_cut_mode", "false");
      
      window.dispatchEvent(new CustomEvent("os_clipboard_sync"));
      window.dispatchEvent(new CustomEvent("os_files_sync"));
      window.dispatchEvent(new CustomEvent("os_desktop_sync"));
      
      setToast({ message: "Items moved successfully", type: "success" });
    } else {
      clipboardList.forEach((clipboardItem, index) => {
        const pastedFile = {
          ...clipboardItem,
          id: `${clipboardItem.id}_copy_${Date.now()}_${index}`,
          name: clipboardItem.name.includes(".") 
            ? clipboardItem.name.replace(/(\.[^.]+)$/, " copy$1") 
            : `${clipboardItem.name} copy`,
          date: new Date().toISOString(),
          parentFolderId: undefined,
          x: 50 + Math.random() * 100,
          y: 50 + Math.random() * 100
        };

        if (clipboardItem.type === "folder") {
          const destFolders = JSON.parse(localStorage.getItem("os_desktop_folders") || "[]");
          const updatedFolders = [...destFolders, pastedFile];
          setDesktopFolders(updatedFolders);
          localStorage.setItem("os_desktop_folders", JSON.stringify(updatedFolders));
        } else {
          const destFiles = JSON.parse(localStorage.getItem("os_desktop_files") || "[]");
          const updatedFiles = [...destFiles, pastedFile];
          setDesktopFiles(updatedFiles);
          localStorage.setItem("os_desktop_files", JSON.stringify(updatedFiles));
        }
      });
      
      window.dispatchEvent(new CustomEvent("os_desktop_sync"));
      setToast({ message: "Items copied successfully", type: "success" });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")) {
        return;
      }

      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      const key = e.key.toLowerCase();

      if (isCmdOrCtrl) {
        if (key === "c") {
          if (selectedItem) {
            const item = allDesktopItems.find(i => i.id === selectedItem);
            if (item) {
              e.preventDefault();
              handleCopy(item);
            }
          }
        } else if (key === "x") {
          if (selectedItem) {
            const item = allDesktopItems.find(i => i.id === selectedItem);
            if (item) {
              e.preventDefault();
              handleCut(item);
            }
          }
        } else if (key === "v") {
          e.preventDefault();
          handlePaste();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedItem, clipboard, isCutMode, allDesktopItems]);

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (e.target === e.currentTarget || e.target.classList.contains('desktop-area')) {
      setContextMenu({ x: e.clientX, y: e.clientY });
    }
  };

  const handleOpenFinder = (path) => {
    openApp("Finder", <Finder initialPath={path} />);
  };

  const handleItemDoubleClick = (item) => {
    if (item.type === "folder") {
      openApp("Finder", <Finder initialPath={`/desktop/${item.id}`} />);
    } else if (item.type === "document" || item.name?.toLowerCase().endsWith(".txt")) {
      openApp("TextEdit", <TextEdit file={item} />);
    } else if (item.type === "pdf" || item.name?.toLowerCase().endsWith(".pdf")) {
      openApp("PDFViewer", <PDFViewer file={item} />);
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
        window.dispatchEvent(new CustomEvent("os_desktop_sync"));
      } else {
        const updated = desktopFiles.map(f => 
          f.id === item.id ? { ...f, name: editName.trim() } : f
        );
        setDesktopFiles(updated);
        localStorage.setItem("os_desktop_files", JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent("os_desktop_sync"));
      }
    }
    setEditingItem(null);
    setEditName("");
  };

  const handleDeleteItem = (item) => {
    const trashedItem = {
      ...item,
      originalPath: "/desktop",
      trashedAt: new Date().toISOString()
    };
    
    // Save directly to localStorage
    const currentTrash = JSON.parse(localStorage.getItem("os_trash") || "[]");
    const updatedTrash = [trashedItem, ...currentTrash.filter(f => f.id !== item.id)];
    localStorage.setItem("os_trash", JSON.stringify(updatedTrash));
    
    // Dispatch events to notify listeners (like open Trash windows or the Dock)
    window.dispatchEvent(new CustomEvent("os_file_trash", { detail: trashedItem }));
    window.dispatchEvent(new CustomEvent("os_trash_updated", { detail: { hasFiles: true } }));

    if (item.type === "folder") {
      const updated = desktopFolders.filter(f => f.id !== item.id);
      setDesktopFolders(updated);
      localStorage.setItem("os_desktop_folders", JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("os_desktop_sync"));
    } else {
      const updated = desktopFiles.filter(f => f.id !== item.id);
      setDesktopFiles(updated);
      localStorage.setItem("os_desktop_files", JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("os_desktop_sync"));
    }
  };

  const handleRemoveWidget = (id) => {
    const updated = widgets.filter(w => w.id !== id);
    setWidgets(updated);
    localStorage.setItem("os_desktop_widgets", JSON.stringify(updated));
  };

  const handleDesktopFileDrop = (e) => {
    const files = Array.from(e.dataTransfer.files);
    if (!files.length) return;

    files.forEach((file, index) => {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      const isPdf = file.type === "application/pdf" || file.name.endsWith(".pdf");
      const isTxt = file.type === "text/plain" || file.name.endsWith(".txt");

      if (!isImage && !isVideo && !isPdf && !isTxt) {
        alert("Only images, PDFs, videos, and text files can be uploaded.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        
        const newFile = {
          id: `drop_sys_${Date.now()}_${index}`,
          name: file.name,
          type: isImage ? "image" : isVideo ? "video" : isPdf ? "pdf" : "document",
          size: file.size,
          date: new Date().toISOString(),
          url: dataUrl,
          x: e.clientX ? e.clientX - 40 : 100 + index * 100,
          y: e.clientY ? e.clientY - 40 : 100 + index * 100
        };

        setDesktopFiles(prev => {
          const updated = [newFile, ...prev];
          localStorage.setItem("os_desktop_files", JSON.stringify(updated));
          return updated;
        });
        
        window.dispatchEvent(new CustomEvent("os_file_created", { detail: newFile }));
        window.dispatchEvent(new CustomEvent("os_desktop_sync"));
      };
      reader.readAsDataURL(file);
    });
  };

  const getDesktopItemIcon = (item) => {
    if (item.type === "folder") {
      return (
        <img
          src="https://s3.macosicons.com/macosicons/icons/GecwaBmkFQ/lowResPngFile_c3ef21fe8fabfd9d23fcc3ab3134dcf9_GecwaBmkFQ.png"
          alt="folder"
          className="w-14 h-14 drop-shadow-lg object-contain"
          onError={(e) => {
            e.target.src = 'https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/50cce92fe1e8a5b82de86e1c98146ba1_low_res_Folder_Common.png';
          }}
        />
      );
    }
    
    const isPdf = item.type === "pdf" || item.name?.toLowerCase().endsWith(".pdf");
    if (isPdf) {
      return (
        <img
          src="https://s3.macosicons.com/macosicons/icons/ayIhAsqzsY/lowResPngFile_55b757e27580fefb9bd856a23abf6d0f_low_res_Pdf_Document.png"
          alt="pdf"
          className="w-14 h-14 drop-shadow-lg object-contain"
        />
      );
    }

    const isTxt = item.type === "document" || item.name?.toLowerCase().endsWith(".txt");
    if (isTxt) {
      return (
        <img
          src="https://s3.macosicons.com/macosicons/icons/aExwB3ULuk/lowResPngFile_a819aac512e7261fee3310f1bbdaada7_aExwB3ULuk.png"
          alt="txt"
          className="w-14 h-14 drop-shadow-lg object-contain"
        />
      );
    }

    if (item.type === "image" && item.url) {
      return (
        <div className="w-14 h-14 rounded-lg overflow-hidden border border-white/20 shadow-lg shrink-0 mb-1">
          <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
        </div>
      );
    }

    return <FiFile className="w-14 h-14 text-white/80 drop-shadow-lg" />;
  };

  return (
    <div
      className="relative w-screen h-screen max-w-screen max-h-screen overflow-hidden bg-cover bg-center desktop-area"
      style={{
        backgroundImage: `url(${wallpaper})`,
      }}
      onContextMenu={handleContextMenu}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleDesktopFileDrop(e);
      }}
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
                {widget.type === 'clock' && <ClockWidget />}
                {widget.type === 'glass_clock' && <GlassClockWidget />}
                {widget.type === 'glass_calendar' && <GlassCalendarWidget />}
                {widget.type === 'glass_weather' && <GlassWeatherWidget />}
                {widget.type === 'glass_world_clock' && <GlassWorldClockWidget />}
                {widget.type === 'glass_small_world_clock' && <GlassSmallWorldClockWidget />}
                {widget.type === 'glass_reminders' && <GlassRemindersWidget />}
                {widget.type === 'glass_wide_reminders' && <GlassWideRemindersWidget />}
                {widget.type === 'glass_mini_calendar' && <GlassMiniCalendarWidget />}
                {widget.type === 'glass_sf_weather' && <GlassSFWeatherWidget />}
                {widget.type === 'glass_day' && <GlassDayWidget />}
                
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
                const isCut = isCutMode && clipboard && clipboard.some(c => c.id === item.id);
                return (
                <motion.div
                  key={item.id}
                  drag
                  dragMomentum={false}
                  dragElastic={0}
                  dragTransition={{ power: 0, modifyTargetVelocity: () => 0 }}
                  initial={{ opacity: 0, scale: 0.8, x: itemX, y: itemY }}
                  animate={{ opacity: isCut ? 0.45 : 1, scale: 1, x: itemX, y: itemY }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    absolute top-0 left-0 pointer-events-auto flex flex-col items-center justify-center w-20 p-2 rounded-lg cursor-grab active:cursor-grabbing
                    ${selectedItem === item.id ? "bg-blue-500/40" : "hover:bg-white/10"}
                    ${isCut ? "opacity-45" : ""}
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
                      window.dispatchEvent(new CustomEvent("os_desktop_sync"));
                    } else {
                      const updated = desktopFiles.map(f => 
                        f.id === item.id ? { ...f, x: newX, y: newY } : f
                      );
                      setDesktopFiles(updated);
                      localStorage.setItem('os_desktop_files', JSON.stringify(updated));
                      window.dispatchEvent(new CustomEvent("os_desktop_sync"));
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
                  {getDesktopItemIcon(item)}
                  
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
            className={`absolute top-10 right-4 bottom-24 w-[360px] backdrop-blur-2xl rounded-3xl z-40 overflow-hidden flex flex-col border
              ${isDarkMode 
                ? 'bg-gradient-to-b from-black/45 to-black/20 border-white/10 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.15),0_12px_40px_rgba(0,0,0,0.45)]' 
                : 'bg-gradient-to-b from-white/14 to-white/4 border-white/20 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.35),0_12px_40px_rgba(0,0,0,0.18)]'
              }`}
            onClick={(e) => e.stopPropagation()}
            onContextMenu={(e) => e.stopPropagation()}
          >
            {/* Liquid Glass Overlay Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 pointer-events-none z-0" />

            <div className="relative z-10 p-5 flex justify-between items-center bg-black/10">
              <h2 className="text-xl font-semibold text-white cursor-default">Widgets</h2>
              <button 
                onClick={() => setShowWidgetGallery(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <FiX />
              </button>
            </div>
            
            <div 
              className="relative z-10 flex-1 overflow-y-auto p-5 pb-10 space-y-6 hide-scrollbar"
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
                  <span className="text-white/90 font-medium">Clock</span>
                  <button 
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent("os_widget_added", { detail: { type: 'clock' } }));
                    }}
                    className="px-3 py-1 bg-white/20 rounded-full text-xs text-white hover:bg-white/30"
                  >
                    Add
                  </button>
                </div>
                <div className="pointer-events-none scale-100 transform origin-top w-full flex justify-center">
                  <ClockWidget />
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

              <div className="flex flex-col items-center">
                <div className="w-full mb-3 flex items-center justify-between">
                  <span className="text-white/90 font-medium">Glass World Clock</span>
                  <button 
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent("os_widget_added", { detail: { type: 'glass_world_clock' } }));
                    }}
                    className="px-3 py-1 bg-white/20 rounded-full text-xs text-white hover:bg-white/30"
                  >
                    Add
                  </button>
                </div>
                <div className="pointer-events-none scale-100 transform origin-top w-full flex justify-center">
                  <GlassWorldClockWidget />
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-full mb-3 flex items-center justify-between">
                  <span className="text-white/90 font-medium">Glass Reminders</span>
                  <button 
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent("os_widget_added", { detail: { type: 'glass_reminders' } }));
                    }}
                    className="px-3 py-1 bg-white/20 rounded-full text-xs text-white hover:bg-white/30"
                  >
                    Add
                  </button>
                </div>
                <div className="pointer-events-none scale-100 transform origin-top w-full flex justify-center">
                  <GlassRemindersWidget />
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-full mb-3 flex items-center justify-between">
                  <span className="text-white/90 font-medium">Glass Wide Reminders</span>
                  <button 
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent("os_widget_added", { detail: { type: 'glass_wide_reminders' } }));
                    }}
                    className="px-3 py-1 bg-white/20 rounded-full text-xs text-white hover:bg-white/30"
                  >
                    Add
                  </button>
                </div>
                <div className="pointer-events-none scale-100 transform origin-top w-full flex justify-center">
                  <GlassWideRemindersWidget />
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-full mb-3 flex items-center justify-between">
                  <span className="text-white/90 font-medium">Glass Small World Clock</span>
                  <button 
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent("os_widget_added", { detail: { type: 'glass_small_world_clock' } }));
                    }}
                    className="px-3 py-1 bg-white/20 rounded-full text-xs text-white hover:bg-white/30"
                  >
                    Add
                  </button>
                </div>
                <div className="pointer-events-none scale-100 transform origin-top w-full flex justify-center">
                  <GlassSmallWorldClockWidget />
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-full mb-3 flex items-center justify-between">
                  <span className="text-white/90 font-medium">Glass Mini Calendar</span>
                  <button 
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent("os_widget_added", { detail: { type: 'glass_mini_calendar' } }));
                    }}
                    className="px-3 py-1 bg-white/20 rounded-full text-xs text-white hover:bg-white/30"
                  >
                    Add
                  </button>
                </div>
                <div className="pointer-events-none scale-100 transform origin-top w-full flex justify-center">
                  <GlassMiniCalendarWidget />
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-full mb-3 flex items-center justify-between">
                  <span className="text-white/90 font-medium">Glass SF Weather</span>
                  <button 
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent("os_widget_added", { detail: { type: 'glass_sf_weather' } }));
                    }}
                    className="px-3 py-1 bg-white/20 rounded-full text-xs text-white hover:bg-white/30"
                  >
                    Add
                  </button>
                </div>
                <div className="pointer-events-none scale-100 transform origin-top w-full flex justify-center">
                  <GlassSFWeatherWidget />
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-full mb-3 flex items-center justify-between">
                  <span className="text-white/90 font-medium">Glass Day</span>
                  <button 
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent("os_widget_added", { detail: { type: 'glass_day' } }));
                    }}
                    className="px-3 py-1 bg-white/20 rounded-full text-xs text-white hover:bg-white/30"
                  >
                    Add
                  </button>
                </div>
                <div className="pointer-events-none scale-100 transform origin-top w-full flex justify-center">
                  <GlassDayWidget />
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
                hasClipboard={!!(clipboard && clipboard.length)}
                onPaste={handlePaste}
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
                className={`fixed z-50 py-1.5 px-1.5 rounded-xl shadow-2xl border backdrop-blur-xl transition-all duration-300 min-w-[170px] ${
                  isDarkMode 
                    ? 'border-white/10 bg-[#1C1C1E]/95 text-gray-200' 
                    : 'border-gray-200/80 bg-white/95 text-gray-800 shadow-gray-300/45'
                }`}
                style={{
                  left: `${itemContextMenu.x}px`,
                  top: `${itemContextMenu.y}px`,
                  boxShadow: isDarkMode 
                    ? "0 10px 40px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.08)" 
                    : "0 10px 30px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(255,255,255,0.6)"
                }}
                onMouseLeave={() => setItemContextMenu(null)}
              >
                <div className="px-1 space-y-0.5">
                  <button
                    onClick={() => {
                      const item = allDesktopItems.find(i => i.id === itemContextMenu.itemId);
                      if (item) {
                        handleCopy(item);
                        setItemContextMenu(null);
                      }
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all text-left hover:bg-[#007AFF] hover:text-white group bg-transparent border-0 cursor-pointer text-sm font-medium"
                  >
                    <div className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      <span>Copy</span>
                    </div>
                    <span className="text-[10px] text-gray-400/85 group-hover:text-white/80">⌘C</span>
                  </button>

                  <button
                    onClick={() => {
                      const item = allDesktopItems.find(i => i.id === itemContextMenu.itemId);
                      if (item) {
                        handleCut(item);
                        setItemContextMenu(null);
                      }
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all text-left hover:bg-[#007AFF] hover:text-white group bg-transparent border-0 cursor-pointer text-sm font-medium"
                  >
                    <div className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="6" cy="6" r="3" />
                        <circle cx="6" cy="18" r="3" />
                        <line x1="9.8" y1="8.2" x2="21" y2="19.4" />
                        <line x1="21" y1="4.6" x2="9.8" y2="15.8" />
                      </svg>
                      <span>Cut (Move)</span>
                    </div>
                    <span className="text-[10px] text-gray-400/85 group-hover:text-white/80">⌘X</span>
                  </button>

                  <div className={`border-t my-1.5 ${isDarkMode ? "border-white/5" : "border-gray-200/60"}`}></div>

                  <button
                    onClick={() => {
                      const item = allDesktopItems.find(i => i.id === itemContextMenu.itemId);
                      if (item) {
                        handleItemRename(item);
                        setItemContextMenu(null);
                      }
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all text-left hover:bg-[#007AFF] hover:text-white group bg-transparent border-0 cursor-pointer text-sm font-medium"
                  >
                    <div className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                      <span>Rename</span>
                    </div>
                    <span className="text-[10px] text-gray-400/85 group-hover:text-white/80">Enter</span>
                  </button>

                  <div className={`border-t my-1.5 ${isDarkMode ? "border-white/5" : "border-gray-200/60"}`}></div>

                  <button
                    onClick={() => {
                      const item = allDesktopItems.find(i => i.id === itemContextMenu.itemId);
                      if (item) {
                        handleDeleteItem(item);
                        setItemContextMenu(null);
                      }
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all text-left hover:bg-red-600 hover:text-white group bg-transparent border-0 cursor-pointer text-sm font-medium"
                  >
                    <div className="flex items-center gap-2.5 text-red-500 group-hover:text-white">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                      <span>Delete</span>
                    </div>
                    <span className="text-[10px] text-red-400 group-hover:text-white/80">⌘⌫</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Premium macOS Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[999999] flex items-center gap-3 px-4 py-2.5 rounded-xl shadow-2xl border backdrop-blur-md select-none ${
              isDarkMode 
                ? "bg-[#2D2D2D]/95 border-white/10 text-white" 
                : "bg-white/95 border-gray-200 text-gray-800"
            }`}
          >
            {toast.type === "success" && (
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
            )}
            {toast.type === "error" && (
              <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white shrink-0 font-bold text-xs">
                !
              </div>
            )}
            {toast.type === "info" && (
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0 font-bold text-xs">
                i
              </div>
            )}
            <span className="text-xs font-semibold">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
