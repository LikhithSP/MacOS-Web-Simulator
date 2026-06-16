import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiRefreshCw, FiAlertCircle } from "react-icons/fi";
import { BsTrash, BsFileEarmark } from "react-icons/bs";
import { useAppStore } from "../store/Appstore";

// Traffic lights inside the Trash header
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
        onClick={() => windowId && close(windowId)}
        title="Close"
      >
        <svg className="w-1.5 h-1.5 text-[#820005] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
          <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div
        className="w-3 h-3 bg-[#febc2e] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#ff9500] transition-all duration-150 shadow-sm"
        onClick={() => windowId && minimize(windowId)}
        title="Minimize"
      >
        <svg className="w-1.5 h-1.5 text-[#9a6400] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
          <path d="M1 5H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div
        className="w-3 h-3 bg-[#28c840] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#1aab29] transition-all duration-150 shadow-sm"
        onClick={() => windowId && toggleMaximize(windowId)}
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

export default function Trash({ windowId }) {
  const isDarkMode = useAppStore((s) => s.isDarkMode);

  const [trashedFiles, setTrashedFiles] = useState(() => {
    const saved = localStorage.getItem("os_trash");
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showEmptyConfirm, setShowEmptyConfirm] = useState(false);

  // Listen for new trash items
  useEffect(() => {
    const handleTrash = (e) => {
      const newFile = e.detail;
      setTrashedFiles(prev => {
        const updated = [newFile, ...prev];
        localStorage.setItem("os_trash", JSON.stringify(updated));
        return updated;
      });
    };

    // Sync on focus
    const syncTrash = () => {
      const saved = localStorage.getItem("os_trash");
      if (saved) {
        setTrashedFiles(JSON.parse(saved));
      }
    };

    window.addEventListener("os_file_trash", handleTrash);
    window.addEventListener("focus", syncTrash);
    
    return () => {
      window.removeEventListener("os_file_trash", handleTrash);
      window.removeEventListener("focus", syncTrash);
    };
  }, []);

  // Save to localStorage and notify Dock
  useEffect(() => {
    localStorage.setItem("os_trash", JSON.stringify(trashedFiles));
    window.dispatchEvent(new CustomEvent("os_trash_updated", {
      detail: { hasFiles: trashedFiles.length > 0 }
    }));
  }, [trashedFiles]);

  const handleFileClick = (e, file) => {
    e.stopPropagation();
    if (e.shiftKey) {
      const allFiles = trashedFiles;
      const anchor = selectedFile;
      if (anchor && allFiles.some(f => f.id === anchor.id)) {
        const anchorIndex = allFiles.findIndex(f => f.id === anchor.id);
        const currentIndex = allFiles.findIndex(f => f.id === file.id);
        const start = Math.min(anchorIndex, currentIndex);
        const end = Math.max(anchorIndex, currentIndex);
        const rangeSelected = allFiles.slice(start, end + 1);
        setSelectedFiles(rangeSelected);
      } else {
        setSelectedFiles([file]);
        setSelectedFile(file);
      }
    } else if (e.ctrlKey || e.metaKey) {
      setSelectedFiles((prev) => {
        const isAlreadySelected = prev.some((f) => f.id === file.id);
        if (isAlreadySelected) {
          const next = prev.filter((f) => f.id !== file.id);
          setSelectedFile(next[next.length - 1] || null);
          return next;
        } else {
          const next = [...prev, file];
          setSelectedFile(file);
          return next;
        }
      });
    } else {
      setSelectedFiles([file]);
      setSelectedFile(file);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isA = e.key.toLowerCase() === "a";
      const isModifier = e.ctrlKey || e.metaKey || e.shiftKey;
      if (isA && isModifier) {
        const activeEl = document.activeElement;
        if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")) {
          return;
        }
        e.preventDefault();
        setSelectedFiles(trashedFiles);
        if (trashedFiles.length > 0) {
          setSelectedFile(trashedFiles[trashedFiles.length - 1]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [trashedFiles]);

  const restoreSelectedFiles = () => {
    const targets = selectedFiles.length > 0 ? selectedFiles : [selectedFile].filter(Boolean);
    targets.forEach(file => {
      const restoredFile = { ...file };
      const origPath = file.originalPath || "/downloads";
      delete restoredFile.trashedAt;
      delete restoredFile.originalPath;

      const addToStoreList = (key) => {
        const list = JSON.parse(localStorage.getItem(key) || "[]");
        const updated = [restoredFile, ...list.filter(f => f.id !== file.id)];
        localStorage.setItem(key, JSON.stringify(updated));
      };

      if (origPath === "/icloud") {
        addToStoreList("os_icloud_files");
      } else if (origPath === "/downloads") {
        addToStoreList("os_downloads");
      } else if (origPath === "/desktop") {
        if (restoredFile.type === "folder") {
          addToStoreList("os_desktop_folders");
        } else {
          addToStoreList("os_desktop_files");
        }
      } else if (origPath === "/documents") {
        addToStoreList("os_documents_files");
      } else if (origPath === "/likhith-sp") {
        addToStoreList("os_likhith_files");
      } else {
        addToStoreList("os_downloads");
      }

      window.dispatchEvent(new CustomEvent('os_file_restored', { detail: { file: restoredFile, path: origPath } }));
    });

    const targetIds = targets.map(t => t.id);
    setTrashedFiles(prev => prev.filter(f => !targetIds.includes(f.id)));
    setSelectedFile(null);
    setSelectedFiles([]);
  };

  const permanentlyDeleteSelectedFiles = () => {
    const targets = selectedFiles.length > 0 ? selectedFiles : [selectedFile].filter(Boolean);
    const targetIds = targets.map(t => t.id);
    setTrashedFiles(prev => prev.filter(f => !targetIds.includes(f.id)));
    setSelectedFile(null);
    setSelectedFiles([]);
  };

  const emptyTrash = () => {
    setTrashedFiles([]);
    setSelectedFile(null);
    setSelectedFiles([]);
    setShowEmptyConfirm(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getFileIcon = (file) => {
    if (file.type === "image") {
      return (
        <div className="w-full h-full rounded-lg overflow-hidden opacity-60">
          <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
        </div>
      );
    }
    if (file.type === "pdf") {
      return (
        <img
          src="https://s3.macosicons.com/macosicons/icons/ayIhAsqzsY/lowResPngFile_55b757e27580fefb9bd856a23abf6d0f_low_res_Pdf_Document.png"
          alt="PDF"
          className="w-12 h-12 object-contain opacity-60"
        />
      );
    }
    if (file.type === "document") {
      return (
        <img
          src="https://s3.macosicons.com/macosicons/icons/aExwB3ULuk/lowResPngFile_a819aac512e7261fee3310f1bbdaada7_aExwB3ULuk.png"
          alt="Text"
          className="w-12 h-12 object-contain opacity-60"
        />
      );
    }
    if (file.type === "folder") {
      return (
        <img
          src="https://s3.macosicons.com/macosicons/icons/GecwaBmkFQ/lowResPngFile_c3ef21fe8fabfd9d23fcc3ab3134dcf9_GecwaBmkFQ.png"
          alt="Folder"
          className="w-12 h-12 object-contain opacity-60"
        />
      );
    }
    return <BsFileEarmark size={32} className="text-gray-400 opacity-60" />;
  };

  return (
    <div className={`flex flex-col h-full overflow-hidden transition-colors duration-150 ${
      isDarkMode ? "bg-[#1E1E1E] text-white" : "bg-white/95 text-gray-800"
    }`} style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>
      
      {/* macOS-style Header / Toolbar */}
      <div className={`window-drag-handle flex items-center justify-between border-b px-4 py-2.5 select-none cursor-grab active:cursor-grabbing ${
        isDarkMode ? "bg-[#2D2D2D] border-white/10" : "bg-[#F6F6F6] border-gray-200"
      }`}>
        {/* Left: Traffic Lights */}
        <div className="flex items-center gap-1.5 group/trash-traffic w-16">
          <TrafficLights windowId={windowId} />
        </div>

        {/* Center: Styled Info (Item Count) */}
        <div className={`text-[11px] font-semibold select-none ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
          Trash — {trashedFiles.length} {trashedFiles.length === 1 ? "item" : "items"}
        </div>

        {/* Right: Empty button */}
        <div className="w-16 flex justify-end">
          {trashedFiles.length > 0 && (
            <button
              onClick={() => setShowEmptyConfirm(true)}
              className={`px-3 py-1 text-[11px] font-semibold rounded-lg shadow-sm transition ${
                isDarkMode 
                  ? "bg-red-650 text-white hover:bg-red-600 border border-red-500/20" 
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
            >
              Empty
            </button>
          )}
        </div>
      </div>

      {/* Files Area */}
      <div 
        onClick={() => { setSelectedFile(null); setSelectedFiles([]); }}
        className="flex-1 overflow-y-auto p-4" 
        style={{ scrollbarWidth: "none" }}
      >
        {trashedFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400" onClick={(e) => e.stopPropagation()}>
            <BsTrash size={64} className="mb-4 opacity-30" />
            <p className="text-[16px] font-medium">Trash is Empty</p>
            <p className="text-[12px] mt-1">Deleted files will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-4">
            {trashedFiles.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`flex flex-col items-center p-2 rounded-lg cursor-pointer transition-all ${
                  selectedFiles.some(f => f.id === file.id)
                    ? isDarkMode ? "bg-white/10 ring-2 ring-blue-500" : "bg-red-100 ring-2 ring-red-400"
                    : isDarkMode ? "hover:bg-white/5" : "hover:bg-gray-100"
                }`}
                onClick={(e) => handleFileClick(e, file)}
              >
                <div className="w-12 h-12 mb-1.5 flex items-center justify-center relative">
                  {getFileIcon(file)}
                </div>
                <p className={`text-[11px] text-center truncate w-full px-1 line-through ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  {file.name}
                </p>
                <p className="text-[9px] text-gray-400 mt-0.5 w-full text-center truncate whitespace-nowrap">
                  {formatDate(file.trashedAt)}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Bar - File Actions */}
      {(selectedFile || selectedFiles.length > 0) && (
        <div className={`flex items-center justify-between px-4 py-2.5 border-t transition-colors ${
          isDarkMode ? "bg-[#2D2D2D]/80 border-white/10" : "bg-gray-50/80 border-gray-200"
        }`}>
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              {selectedFiles.length > 1 ? `${selectedFiles.length} items selected` : (selectedFile?.name || "")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={restoreSelectedFiles}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-500 text-white text-[11px] font-semibold transition"
            >
              <FiRefreshCw size={11} />
              Restore
            </button>
            <button
              onClick={permanentlyDeleteSelectedFiles}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-650 hover:bg-red-500 text-white text-[11px] font-semibold transition"
            >
              <FiTrash2 size={11} />
              Delete Forever
            </button>
          </div>
        </div>
      )}

      {/* Empty Trash Confirmation Modal */}
      <AnimatePresence>
        {showEmptyConfirm && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEmptyConfirm(false)}
          >
            <motion.div
              className={`rounded-xl shadow-2xl p-6 max-w-sm mx-4 border ${
                isDarkMode ? "bg-[#2D2D2D] border-white/10 text-white" : "bg-white border-black/10 text-gray-800"
              }`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <FiAlertCircle size={24} className="text-red-500" />
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold">Empty Trash?</h3>
                  <p className="text-[11px] text-gray-400">This action cannot be undone</p>
                </div>
              </div>
              <p className={`text-[12px] mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                Are you sure you want to permanently delete {trashedFiles.length} item(s)?
              </p>
              <div className="flex items-center gap-2.5 text-xs font-semibold">
                <button
                  onClick={() => setShowEmptyConfirm(false)}
                  className={`flex-1 py-2 rounded-lg border transition ${
                    isDarkMode 
                      ? "border-white/10 hover:bg-white/5 text-gray-300 bg-transparent" 
                      : "border-gray-200 hover:bg-gray-100 text-gray-700 bg-gray-50"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={emptyTrash}
                  className="flex-1 py-2 rounded-lg bg-red-650 hover:bg-red-500 text-white shadow-sm transition"
                >
                  Empty Trash
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
