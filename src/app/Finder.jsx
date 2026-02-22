import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiFolder, FiFile, FiImage, FiDownload, FiTrash2, FiGrid, FiList,
  FiChevronRight, FiSearch, FiX, FiChevronLeft, FiChevronDown
} from "react-icons/fi";
import { BsFolder, BsFolderFill, BsImage, BsFileEarmark, BsGrid, BsListUl } from "react-icons/bs";

// Simulated file system
const defaultFolders = [
  { id: "downloads", name: "Downloads", type: "folder", icon: "downloads" },
  { id: "documents", name: "Documents", type: "folder", icon: "folder" },
  { id: "pictures", name: "Pictures", type: "folder", icon: "pictures" },
  { id: "desktop", name: "Desktop", type: "folder", icon: "folder" },
];

const sidebarItems = [
  { id: "favorites", label: "Favorites", type: "header" },
  { id: "downloads", label: "Downloads", icon: FiDownload, path: "/downloads" },
  { id: "desktop", label: "Desktop", icon: BsFolder, path: "/desktop" },
  { id: "documents", label: "Documents", icon: BsFolder, path: "/documents" },
  { id: "pictures", label: "Pictures", icon: BsImage, path: "/pictures" },
];

export default function Finder() {
  const [currentPath, setCurrentPath] = useState("/downloads");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCopyPicker, setShowCopyPicker] = useState(false);
  const [fileToCopy, setFileToCopy] = useState(null);
  const [downloads, setDownloads] = useState(() => {
    const saved = localStorage.getItem("os_downloads");
    return saved ? JSON.parse(saved) : [];
  });
  const [desktopFolders, setDesktopFolders] = useState(() => {
    return JSON.parse(localStorage.getItem("os_desktop_folders") || "[]");
  });
  const [desktopFiles, setDesktopFiles] = useState(() => {
    return JSON.parse(localStorage.getItem("os_desktop_files") || "[]");
  });

  // Listen for new downloads
  useEffect(() => {
    const handleDownload = (e) => {
      const newFile = e.detail;
      setDownloads(prev => {
        const updated = [newFile, ...prev.filter(f => f.id !== newFile.id)];
        localStorage.setItem("os_downloads", JSON.stringify(updated));
        return updated;
      });
    };

    window.addEventListener("os_file_download", handleDownload);
    return () => window.removeEventListener("os_file_download", handleDownload);
  }, []);

  useEffect(() => {
    const handleFolderCreated = (e) => {
      setDesktopFolders((prev) => [...prev, e.detail]);
    };
    const handleFileCreated = (e) => {
      setDesktopFiles((prev) => {
        if (prev.some((f) => f.id === e.detail.id)) return prev;
        return [e.detail, ...prev];
      });
    };

    window.addEventListener("os_folder_created", handleFolderCreated);
    window.addEventListener("os_file_created", handleFileCreated);
    return () => {
      window.removeEventListener("os_folder_created", handleFolderCreated);
      window.removeEventListener("os_file_created", handleFileCreated);
    };
  }, []);

  // Save downloads to localStorage
  useEffect(() => {
    localStorage.setItem("os_downloads", JSON.stringify(downloads));
  }, [downloads]);

  const getCurrentFolderName = () => {
    const pathParts = currentPath.split("/").filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1] || "Finder";
    if (currentPath.startsWith("/desktop/") && lastPart) {
      const match = desktopFolders.find((folder) => folder.id === lastPart);
      return match ? match.name : "Folder";
    }
    return lastPart;
  };

  const getFilesForCurrentPath = () => {
    if (currentPath === "/downloads") {
      return downloads;
    }
    if (currentPath === "/desktop") {
      const rootFiles = desktopFiles.filter((file) => !file.parentFolderId);
      return [...desktopFolders, ...rootFiles];
    }
    if (currentPath.startsWith("/desktop/")) {
      const folderId = currentPath.split("/")[2];
      return desktopFiles.filter((file) => file.parentFolderId === folderId);
    }
    // For other folders, return empty for now
    return [];
  };

  const filteredFiles = getFilesForCurrentPath().filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteFile = (fileId) => {
    // Find the file to delete
    const fileToDelete = downloads.find(f => f.id === fileId);
    if (!fileToDelete) return;

    // Add to trash with timestamp
    const trashedFile = {
      ...fileToDelete,
      trashedAt: new Date().toISOString()
    };
    
    // Save to trash in localStorage
    const existingTrash = JSON.parse(localStorage.getItem("os_trash") || "[]");
    const updatedTrash = [trashedFile, ...existingTrash];
    localStorage.setItem("os_trash", JSON.stringify(updatedTrash));
    
    // Dispatch event for Trash app
    window.dispatchEvent(new CustomEvent('os_file_trash', { detail: trashedFile }));
    
    // Remove from downloads
    setDownloads(prev => prev.filter(f => f.id !== fileId));
    setSelectedFile(null);
  };

  const downloadToDevice = (file) => {
    // Create a temporary link to download the file to the actual device
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getFileIcon = (file) => {
    if (file.type === "folder") {
      return (
        <img
          src="https://s3.macosicons.com/macosicons/icons/GecwaBmkFQ/lowResPngFile_c3ef21fe8fabfd9d23fcc3ab3134dcf9_GecwaBmkFQ.png"
          alt="Folder"
          className="w-12 h-12 object-contain"
        />
      );
    }
    if (file.type === "image") {
      return (
        <div className="w-full h-full rounded-lg overflow-hidden">
          <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
        </div>
      );
    }
    return <BsFileEarmark size={32} className="text-gray-400" />;
  };

  const handleOpenFolder = (folder) => {
    setCurrentPath(`/desktop/${folder.id}`);
    setSelectedFile(null);
  };

  const handleCopyToDesktopFolder = (file, folder) => {
    const newFile = {
      ...file,
      id: `desktop_${Date.now()}`,
      parentFolderId: folder.id,
      date: new Date().toISOString(),
    };
    const updated = [newFile, ...desktopFiles];
    setDesktopFiles(updated);
    localStorage.setItem("os_desktop_files", JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("os_file_created", { detail: newFile }));
    setShowCopyPicker(false);
    setFileToCopy(null);
  };

  return (
    <div className="flex h-full overflow-hidden bg-white/95" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>
      
      {/* Sidebar */}
      <aside className="w-48 flex flex-col border-r" style={{ background: "rgba(246, 246, 246, 0.95)", borderColor: "rgba(224, 224, 224, 0.5)" }}>
        <div className="p-3 border-b" style={{ borderColor: "rgba(224, 224, 224, 0.5)" }}>
          <div className="relative">
            <FiSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-7 pr-2 py-1.5 text-[11px] rounded-md bg-white/80 border border-gray-200 focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>

        <nav className="flex-1 p-2 overflow-y-auto">
          {sidebarItems.map((item) => {
            if (item.type === "header") {
              return (
                <div key={item.id} className="mb-2 mt-2">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2">
                    {item.label}
                  </span>
                </div>
              );
            }

            const isActive = currentPath === item.path;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPath(item.path);
                  setSelectedFile(null);
                }}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[12px] transition-all ${
                  isActive
                    ? "bg-[#007AFF] text-white"
                    : "text-gray-600 hover:bg-black/5"
                }`}
              >
                <item.icon size={14} />
                <span>{item.label}</span>
                {item.id === "downloads" && downloads.length > 0 && (
                  <span className={`ml-auto text-[10px] ${isActive ? "text-white/70" : "text-gray-400"}`}>
                    {downloads.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Storage info */}
        <div className="p-3 border-t" style={{ borderColor: "rgba(224, 224, 224, 0.5)" }}>
          <p className="text-[10px] text-gray-400 text-center">
            {downloads.length} items in Downloads
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50/80" style={{ borderColor: "rgba(224, 224, 224, 0.5)" }}>
          <div className="flex items-center gap-2">
            <button className="p-1 rounded hover:bg-gray-200 text-gray-400">
              <FiChevronLeft size={16} />
            </button>
            <button className="p-1 rounded hover:bg-gray-200 text-gray-400">
              <FiChevronRight size={16} />
            </button>
            <span className="text-[14px] font-semibold text-gray-800 ml-2 capitalize">
              {getCurrentFolderName()}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-gray-200/50 rounded-md p-0.5">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded ${viewMode === "grid" ? "bg-white shadow-sm" : ""}`}
            >
              <BsGrid size={12} className={viewMode === "grid" ? "text-gray-700" : "text-gray-400"} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}
            >
              <BsListUl size={12} className={viewMode === "list" ? "text-gray-700" : "text-gray-400"} />
            </button>
          </div>
        </div>

        {/* Files Area */}
        <div className="flex-1 overflow-y-auto p-4" style={{ scrollbarWidth: "none" }}>
          {filteredFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <FiFolder size={48} className="mb-3 opacity-50" />
              <p className="text-[14px]">
                {currentPath === "/downloads" ? "No downloads yet" : "This folder is empty"}
              </p>
              <p className="text-[11px] mt-1">
                {currentPath === "/downloads" && "Download images from Photos to see them here"}
              </p>
            </div>
          ) : viewMode === "grid" ? (
            // Grid View
            <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {filteredFiles.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`flex flex-col items-center p-2 rounded-lg cursor-pointer transition-all ${
                    selectedFile?.id === file.id
                      ? "bg-blue-100 ring-2 ring-blue-400"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedFile(file)}
                  onDoubleClick={() => {
                    if (file.type === "folder") {
                      handleOpenFolder(file);
                    } else if (file.type === "image") {
                      setPreviewImage(file);
                    }
                  }}
                >
                  <div className="w-16 h-16 mb-2 flex items-center justify-center">
                    {getFileIcon(file)}
                  </div>
                  <p className="text-[11px] text-gray-700 text-center truncate w-full">
                    {file.name}
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            // List View
            <div className="space-y-1">
              {/* Header */}
              <div className="flex items-center gap-4 px-3 py-2 text-[10px] text-gray-400 uppercase tracking-wider border-b">
                <span className="flex-1">Name</span>
                <span className="w-24">Date Modified</span>
                <span className="w-20">Size</span>
                <span className="w-16">Kind</span>
              </div>
              {filteredFiles.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`flex items-center gap-4 px-3 py-2 rounded-md cursor-pointer transition-all ${
                    selectedFile?.id === file.id
                      ? "bg-blue-100"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedFile(file)}
                  onDoubleClick={() => {
                    if (file.type === "folder") {
                      handleOpenFolder(file);
                    } else if (file.type === "image") {
                      setPreviewImage(file);
                    }
                  }}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {file.type === "folder" ? (
                      <img
                        src="https://s3.macosicons.com/macosicons/icons/GecwaBmkFQ/lowResPngFile_c3ef21fe8fabfd9d23fcc3ab3134dcf9_GecwaBmkFQ.png"
                        alt="Folder"
                        className="w-8 h-8 object-contain shrink-0"
                      />
                    ) : file.type === "image" ? (
                      <div className="w-8 h-8 rounded overflow-hidden shrink-0">
                        <img src={file.url} alt="" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <BsFileEarmark size={20} className="text-gray-400 shrink-0" />
                    )}
                    <span className="text-[12px] text-gray-700 truncate">{file.name}</span>
                  </div>
                  <span className="text-[11px] text-gray-500 w-24">{formatDate(file.date)}</span>
                  <span className="text-[11px] text-gray-500 w-20">{formatFileSize(file.size)}</span>
                  <span className="text-[11px] text-gray-500 w-16 capitalize">{file.type}</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Bar - File Actions */}
        {selectedFile && (
          <div className="flex items-center justify-between px-4 py-2 border-t bg-gray-50/80" style={{ borderColor: "rgba(224, 224, 224, 0.5)" }}>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-gray-600">{selectedFile.name}</span>
            </div>
            <div className="flex items-center gap-2">
              {currentPath === "/downloads" && desktopFolders.length > 0 && (
                <button
                  onClick={() => {
                    setFileToCopy(selectedFile);
                    setShowCopyPicker(true);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-gray-700 text-white text-[11px] hover:bg-gray-800 transition"
                >
                  Copy to Desktop Folder
                </button>
              )}
              <button
                onClick={() => downloadToDevice(selectedFile)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-500 text-white text-[11px] hover:bg-blue-600 transition"
              >
                <FiDownload size={12} />
                Save to Device
              </button>
              <button
                onClick={() => deleteFile(selectedFile.id)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-red-500 text-white text-[11px] hover:bg-red-600 transition"
              >
                <FiTrash2 size={12} />
                Delete
              </button>
            </div>
          </div>
        )}
      </main>

      <AnimatePresence>
        {showCopyPicker && fileToCopy && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowCopyPicker(false);
              setFileToCopy(null);
            }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl w-[360px] max-h-[60vh] overflow-hidden"
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.12, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 py-3 border-b">
                <h3 className="text-sm font-semibold text-gray-800">Copy to Desktop Folder</h3>
                <p className="text-[11px] text-gray-500">{fileToCopy.name}</p>
              </div>
              <div className="max-h-[45vh] overflow-y-auto">
                {desktopFolders.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-gray-500">No desktop folders yet</div>
                ) : (
                  desktopFolders.map((folder) => (
                    <button
                      key={folder.id}
                      onClick={() => handleCopyToDesktopFolder(fileToCopy, folder)}
                      className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <img
                        src="https://s3.macosicons.com/macosicons/icons/GecwaBmkFQ/lowResPngFile_c3ef21fe8fabfd9d23fcc3ab3134dcf9_GecwaBmkFQ.png"
                        alt="Folder"
                        className="w-5 h-5"
                      />
                      {folder.name}
                    </button>
                  ))
                )}
              </div>
              <div className="px-4 py-3 border-t flex justify-end">
                <button
                  onClick={() => {
                    setShowCopyPicker(false);
                    setFileToCopy(null);
                  }}
                  className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewImage(null)}
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            >
              <FiX size={20} />
            </button>
            <motion.img
              src={previewImage.url}
              alt={previewImage.name}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-[90%] max-h-[90%] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 rounded-full bg-white/15 backdrop-blur-xl">
              <span className="text-white text-[12px]">{previewImage.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  downloadToDevice(previewImage);
                }}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 text-white text-[11px] hover:bg-white/30 transition"
              >
                <FiDownload size={12} />
                Save to Device
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
