import { useState, useRef } from "react";
import { FiSearch, FiArrowLeft, FiArrowRight, FiRefreshCw, FiHome, FiLock, FiExternalLink, FiDownload, FiImage, FiX } from "react-icons/fi";
import { useAppStore } from "../store/Appstore";

// Traffic lights inside the Safari unified toolbar
const TrafficLights = ({ windowId }) => {
  const close = useAppStore((s) => s.closeApp);
  const minimize = useAppStore((s) => s.minimizeApp);
  const toggleMaximize = useAppStore((s) => s.toggleMaximize);
  const windows = useAppStore((s) => s.windows);
  const win = windows.find(w => w.id === windowId);
  const maximized = win ? win.maximized : false;

  return (
    <div className="flex items-center gap-2 group mr-4 shrink-0">
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

export function Safari({ initialUrl = "https://www.google.com/webhp?igu=1", windowId }) {
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  const [url, setUrl] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(initialUrl);
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState([initialUrl]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [downloadStatus, setDownloadStatus] = useState(null);
  const iframeRef = useRef(null);

  const processUrl = (input) => {
    let processedUrl = input.trim();

    // Check if it's a search query or URL
    if (!processedUrl.includes(".") || processedUrl.includes(" ")) {
      // Use Google search with igu parameter for iframe compatibility
      return `https://www.google.com/search?igu=1&q=${encodeURIComponent(processedUrl)}`;
    }

    // Add https if no protocol
    if (!processedUrl.startsWith("http://") && !processedUrl.startsWith("https://")) {
      processedUrl = "https://" + processedUrl;
    }

    return processedUrl;
  };

  const navigate = (inputUrl) => {
    const processedUrl = processUrl(inputUrl);
    setCurrentUrl(processedUrl);
    setIsLoading(true);

    // Update history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(processedUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    navigate(url);
    setUrl("");
    if (document.activeElement) {
      document.activeElement.blur();
    }
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentUrl(history[newIndex]);
      setIsLoading(true);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentUrl(history[newIndex]);
      setIsLoading(true);
    }
  };

  const refresh = () => {
    if (iframeRef.current) {
      setIsLoading(true);
      try {
        // Try accessing and reloading the content window directly (same-origin fallback)
        iframeRef.current.contentWindow.location.reload();
      } catch (e) {
        // Fallback for cross-origin frames: re-assigning the src to itself 
        // reloads the currently displayed page inside the iframe.
        iframeRef.current.src = iframeRef.current.src;
      }
    }
  };

  const goHome = () => {
    const homeUrl = "https://www.google.com/webhp?igu=1";
    if (currentUrl === homeUrl) {
      refresh();
    } else {
      setCurrentUrl(homeUrl);
      setIsLoading(true);
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(homeUrl);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  const openExternal = () => {
    window.open(currentUrl.replace("?igu=1", "").replace("&igu=1", ""), "_blank");
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const getDisplayUrl = () => {
    return currentUrl.replace("?igu=1", "").replace("&igu=1", "");
  };

  const downloadImageToOS = (imageUrl) => {
    if (!imageUrl.trim()) return;

    // Extract filename from URL
    let filename = imageUrl.split('/').pop().split('?')[0];
    if (!filename.includes('.')) {
      filename = `image_${Date.now()}.jpg`;
    }

    const newFile = {
      id: Date.now().toString(),
      name: filename,
      url: imageUrl,
      type: 'image',
      date: new Date().toISOString(),
      size: null,
      source: 'Safari'
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

    setDownloadStatus({ success: true, filename });
    setTimeout(() => {
      setDownloadStatus(null);
      setShowDownloadModal(false);
      setDownloadUrl("");
    }, 2000);
  };

  const handleDownloadSubmit = (e) => {
    e.preventDefault();
    downloadImageToOS(downloadUrl);
  };

  // Check if current URL is an image
  const isImageUrl = (url) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico'];
    const lowercaseUrl = url.toLowerCase();
    return imageExtensions.some(ext => lowercaseUrl.includes(ext));
  };

  const downloadCurrentPage = () => {
    if (isImageUrl(currentUrl)) {
      downloadImageToOS(currentUrl);
    } else {
      setShowDownloadModal(true);
    }
  };

  return (
    <div className={`w-full h-full flex flex-col overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#1c1c1e] text-white' : 'bg-white text-gray-800'}`}>
      {/* Safari Unified Toolbar */}
      <div className={`window-drag-handle flex items-center gap-2 px-4 py-2.5 border-b transition-colors duration-300 ${isDarkMode
          ? 'bg-[#2c2c2e] border-[#3d3d3f] text-white'
          : 'bg-[#f3f3f3] border-[#dcdcdc] text-gray-800'
        }`}>
        {/* macOS Traffic Light Buttons */}
        <TrafficLights windowId={windowId} />

        {/* Navigation Buttons */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={goBack}
            disabled={historyIndex <= 0}
            className={`p-1.5 rounded transition-colors ${historyIndex > 0
                ? (isDarkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-black/5 text-gray-800')
                : (isDarkMode ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 cursor-not-allowed')
              }`}
          >
            <FiArrowLeft size={16} />
          </button>
          <button
            onClick={goForward}
            disabled={historyIndex >= history.length - 1}
            className={`p-1.5 rounded transition-colors ${historyIndex < history.length - 1
                ? (isDarkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-black/5 text-gray-800')
                : (isDarkMode ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 cursor-not-allowed')
              }`}
          >
            <FiArrowRight size={16} />
          </button>
          <button
            onClick={refresh}
            className={`p-1.5 rounded transition ${isDarkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-black/5 text-gray-800'
              } ${isLoading ? 'animate-spin' : ''}`}
          >
            <FiRefreshCw size={14} />
          </button>
        </div>

        {/* URL Bar */}
        <form onSubmit={handleSubmit} className="flex-1 mx-4">
          <div className={`flex items-center gap-2 rounded-lg px-3 py-1.5 border transition-all duration-300 ${isDarkMode
              ? 'bg-[#1c1c1e] border-[#3d3d3f] focus-within:border-[#007AFF]'
              : 'bg-white border-[#d0d0d0] focus-within:border-[#007AFF]'
            }`}>
            <FiLock size={12} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
            <input
              type="text"
              value={isFocused ? url : (getDisplayUrl() === "https://www.google.com/webhp" ? "" : getDisplayUrl())}
              onFocus={() => {
                setIsFocused(true);
                setUrl(getDisplayUrl() === "https://www.google.com/webhp" ? "" : getDisplayUrl());
              }}
              onBlur={() => {
                setIsFocused(false);
                setUrl("");
              }}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Search Google or type a URL"
              className={`w-full bg-transparent outline-none text-sm placeholder-gray-500 ${isDarkMode ? 'text-white' : 'text-gray-800'
                }`}
            />
          </div>
        </form>

        {/* Home & External buttons */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={goHome}
            className={`p-1.5 rounded transition-colors ${isDarkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-black/5 text-gray-800'}`}
            title="Home"
          >
            <FiHome size={16} />
          </button>
          <button
            onClick={downloadCurrentPage}
            className={`p-1.5 rounded transition-colors ${isDarkMode
                ? 'hover:bg-white/10 text-green-400 hover:text-green-300'
                : 'hover:bg-black/5 text-green-600 hover:text-green-500'
              }`}
            title="Download Image to OS"
          >
            <FiDownload size={16} />
          </button>
          <button
            onClick={openExternal}
            className={`p-1.5 rounded transition-colors ${isDarkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-black/5 text-gray-800'}`}
            title="Open in new tab"
          >
            <FiExternalLink size={16} />
          </button>
        </div>
      </div>

      {/* Browser Content */}
      <div className={`flex-1 relative ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'}`}>
        {isLoading && (
          <div className={`absolute inset-0 flex items-center justify-center z-10 transition-colors ${isDarkMode ? 'bg-[#1c1c1e]' : 'bg-white'}`}>
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-3 border-[#007AFF] border-t-transparent rounded-full animate-spin"></div>
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading...</span>
            </div>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={currentUrl}
          onLoad={handleIframeLoad}
          className="w-full h-full border-none hide-scrollbar"
          referrerPolicy="no-referrer"
          title="Safari Browser"
        />
      </div>

      {/* Download Image Modal */}
      {showDownloadModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className={`rounded-xl shadow-2xl border w-[400px] overflow-hidden transition-all duration-300 ${isDarkMode ? 'bg-[#2c2c2e] border-[#3d3d3f]' : 'bg-white border-black/10'
            }`}>
            {/* Modal Header */}
            <div className={`flex items-center justify-between px-4 py-3 border-b ${isDarkMode ? 'border-[#3d3d3f]' : 'border-black/5'
              }`}>
              <div className="flex items-center gap-2">
                <FiImage className="text-green-500" size={18} />
                <span className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Download Image to OS</span>
              </div>
              <button
                onClick={() => {
                  setShowDownloadModal(false);
                  setDownloadUrl("");
                  setDownloadStatus(null);
                }}
                className={`p-1 rounded transition-colors ${isDarkMode ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-black/5 text-gray-500 hover:text-gray-800'
                  }`}
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4">
              {downloadStatus ? (
                <div className="flex flex-col items-center py-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-3">
                    <FiDownload className="text-green-500" size={24} />
                  </div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Downloaded Successfully!</p>
                  <p className="text-gray-400 text-xs mt-1">{downloadStatus.filename}</p>
                  <p className="text-gray-500 text-xs mt-2">Open Finder to view your downloads</p>
                </div>
              ) : (
                <form onSubmit={handleDownloadSubmit}>
                  <p className={`text-xs mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Paste the image URL you want to download to your OS
                  </p>
                  <input
                    type="url"
                    value={downloadUrl}
                    onChange={(e) => setDownloadUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-[#007AFF] transition ${isDarkMode
                        ? 'bg-[#1c1c1e] border-[#3d3d3f] text-white'
                        : 'bg-[#f6f6f6] border-black/10 text-gray-800'
                      }`}
                    autoFocus
                  />
                  <div className="flex items-center gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowDownloadModal(false);
                        setDownloadUrl("");
                      }}
                      className={`flex-1 py-2 rounded-lg text-sm transition ${isDarkMode ? 'bg-[#3a3a3c] text-white hover:bg-[#48484a]' : 'bg-[#e5e5ea] text-gray-800 hover:bg-[#d1d1d6]'
                        }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!downloadUrl.trim()}
                      className="flex-1 py-2 rounded-lg bg-green-600 text-white text-sm hover:bg-green-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <FiDownload size={14} />
                      Download
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Tips */}
            {!downloadStatus && (
              <div className="px-4 pb-4">
                <div className={`rounded-lg p-3 border ${isDarkMode ? 'bg-[#1c1c1e] border-[#3d3d3f]' : 'bg-[#f6f6f6] border-black/5'}`}>
                  <p className={`text-[10px] uppercase tracking-wider mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>💡 Tip</p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Right-click on any image in the browser, select "Copy image address", and paste it here to download to your OS.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
