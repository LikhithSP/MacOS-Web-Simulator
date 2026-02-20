import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiX, FiRefreshCw, FiAlertCircle } from "react-icons/fi";
import { BsTrash, BsImage, BsFileEarmark } from "react-icons/bs";

export default function Trash() {
  const [trashedFiles, setTrashedFiles] = useState(() => {
    const saved = localStorage.getItem("os_trash");
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedFile, setSelectedFile] = useState(null);
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

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("os_trash", JSON.stringify(trashedFiles));
  }, [trashedFiles]);

  const restoreFile = (file) => {
    // Restore to downloads
    const downloads = JSON.parse(localStorage.getItem("os_downloads") || "[]");
    const restoredFile = { ...file };
    delete restoredFile.trashedAt;
    downloads.unshift(restoredFile);
    localStorage.setItem("os_downloads", JSON.stringify(downloads));
    
    // Remove from trash
    setTrashedFiles(prev => prev.filter(f => f.id !== file.id));
    setSelectedFile(null);
    
    // Dispatch event for Finder
    window.dispatchEvent(new CustomEvent('os_file_download', { detail: restoredFile }));
  };

  const permanentlyDelete = (fileId) => {
    setTrashedFiles(prev => prev.filter(f => f.id !== fileId));
    setSelectedFile(null);
  };

  const emptyTrash = () => {
    setTrashedFiles([]);
    setSelectedFile(null);
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
    return <BsFileEarmark size={32} className="text-gray-400" />;
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white/95" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50/80" style={{ borderColor: "rgba(224, 224, 224, 0.5)" }}>
        <div className="flex items-center gap-2">
          <BsTrash size={18} className="text-gray-500" />
          <span className="text-[14px] font-semibold text-gray-800">
            Trash
          </span>
          <span className="text-[11px] text-gray-400">
            ({trashedFiles.length} items)
          </span>
        </div>

        {trashedFiles.length > 0 && (
          <button
            onClick={() => setShowEmptyConfirm(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-red-500 text-white text-[11px] hover:bg-red-600 transition"
          >
            <FiTrash2 size={12} />
            Empty Trash
          </button>
        )}
      </div>

      {/* Files Area */}
      <div className="flex-1 overflow-y-auto p-4" style={{ scrollbarWidth: "none" }}>
        {trashedFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <BsTrash size={64} className="mb-4 opacity-30" />
            <p className="text-[16px] font-medium">Trash is Empty</p>
            <p className="text-[12px] mt-1">Deleted files will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {trashedFiles.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`flex flex-col items-center p-2 rounded-lg cursor-pointer transition-all ${
                  selectedFile?.id === file.id
                    ? "bg-red-100 ring-2 ring-red-400"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedFile(file)}
              >
                <div className="w-16 h-16 mb-2 flex items-center justify-center relative">
                  {getFileIcon(file)}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <FiTrash2 size={10} className="text-white" />
                  </div>
                </div>
                <p className="text-[11px] text-gray-500 text-center truncate w-full line-through">
                  {file.name}
                </p>
                <p className="text-[9px] text-gray-400 mt-0.5">
                  {formatDate(file.trashedAt)}
                </p>
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
            <button
              onClick={() => restoreFile(selectedFile)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-green-500 text-white text-[11px] hover:bg-green-600 transition"
            >
              <FiRefreshCw size={12} />
              Restore
            </button>
            <button
              onClick={() => permanentlyDelete(selectedFile.id)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-red-500 text-white text-[11px] hover:bg-red-600 transition"
            >
              <FiTrash2 size={12} />
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
              className="bg-white rounded-xl shadow-2xl p-6 max-w-sm mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <FiAlertCircle size={24} className="text-red-500" />
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-gray-800">Empty Trash?</h3>
                  <p className="text-[12px] text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-[12px] text-gray-600 mb-4">
                Are you sure you want to permanently delete {trashedFiles.length} item(s)?
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowEmptyConfirm(false)}
                  className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-700 text-[12px] hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={emptyTrash}
                  className="flex-1 py-2 rounded-lg bg-red-500 text-white text-[12px] hover:bg-red-600 transition"
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
