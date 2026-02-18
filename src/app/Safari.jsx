import { useState, useRef } from "react";
import { FiSearch, FiArrowLeft, FiArrowRight, FiRefreshCw, FiHome, FiLock, FiExternalLink, FiDownload, FiImage, FiX } from "react-icons/fi";

export function Safari({ initialUrl = "https://www.google.com/webhp?igu=1" }) {
  const [url, setUrl] = useState("");
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
      iframeRef.current.src = currentUrl;
    }
  };

  const goHome = () => {
    const homeUrl = "https://www.google.com/webhp?igu=1";
    setCurrentUrl(homeUrl);
    setIsLoading(true);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(homeUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
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
    <div className="w-full h-full flex flex-col bg-[#1c1c1e] text-white overflow-hidden">
      {/* Safari Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#2c2c2e] border-b border-[#3d3d3f]">
        {/* Navigation Buttons */}
        <button 
          onClick={goBack}
          disabled={historyIndex <= 0}
          className={`p-1.5 rounded transition ${historyIndex > 0 ? 'hover:bg-white/10 text-white' : 'text-gray-500 cursor-not-allowed'}`}
        >
          <FiArrowLeft size={16} />
        </button>
        <button 
          onClick={goForward}
          disabled={historyIndex >= history.length - 1}
          className={`p-1.5 rounded transition ${historyIndex < history.length - 1 ? 'hover:bg-white/10 text-white' : 'text-gray-500 cursor-not-allowed'}`}
        >
          <FiArrowRight size={16} />
        </button>
        <button 
          onClick={refresh}
          className={`p-1.5 rounded hover:bg-white/10 transition ${isLoading ? 'animate-spin' : ''}`}
        >
          <FiRefreshCw size={14} />
        </button>

        {/* URL Bar */}
        <form onSubmit={handleSubmit} className="flex-1 mx-2">
          <div className="flex items-center gap-2 bg-[#1c1c1e] rounded-lg px-3 py-1.5 border border-[#3d3d3f]">
            <FiLock size={12} className="text-gray-400" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={getDisplayUrl()}
              className="w-full bg-transparent outline-none text-sm text-white placeholder-gray-500"
            />
          </div>
        </form>

        {/* Home & External buttons */}
        <button 
          onClick={goHome}
          className="p-1.5 rounded hover:bg-white/10 transition"
          title="Home"
        >
          <FiHome size={16} />
        </button>
        <button 
          onClick={downloadCurrentPage}
          className="p-1.5 rounded hover:bg-white/10 transition text-green-400 hover:text-green-300"
          title="Download Image to OS"
        >
          <FiDownload size={16} />
        </button>
        <button 
          onClick={openExternal}
          className="p-1.5 rounded hover:bg-white/10 transition"
          title="Open in new tab"
        >
          <FiExternalLink size={16} />
        </button>
      </div>

      {/* Browser Content */}
      <div className="flex-1 relative bg-white">
        {isLoading && (
          <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-3 border-[#007AFF] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-500 text-sm">Loading...</span>
            </div>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={currentUrl}
          onLoad={handleIframeLoad}
          className="w-full h-full border-none"
          referrerPolicy="no-referrer"
          title="Safari Browser"
        />
      </div>

      {/* Download Image Modal */}
      {showDownloadModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#2c2c2e] rounded-xl shadow-2xl border border-[#3d3d3f] w-[400px] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#3d3d3f]">
              <div className="flex items-center gap-2">
                <FiImage className="text-green-400" size={18} />
                <span className="text-white font-medium text-sm">Download Image to OS</span>
              </div>
              <button 
                onClick={() => {
                  setShowDownloadModal(false);
                  setDownloadUrl("");
                  setDownloadStatus(null);
                }}
                className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white transition"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4">
              {downloadStatus ? (
                <div className="flex flex-col items-center py-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-3">
                    <FiDownload className="text-green-400" size={24} />
                  </div>
                  <p className="text-white text-sm font-medium">Downloaded Successfully!</p>
                  <p className="text-gray-400 text-xs mt-1">{downloadStatus.filename}</p>
                  <p className="text-gray-500 text-xs mt-2">Open Finder to view your downloads</p>
                </div>
              ) : (
                <form onSubmit={handleDownloadSubmit}>
                  <p className="text-gray-400 text-xs mb-3">
                    Paste the image URL you want to download to your OS
                  </p>
                  <input
                    type="url"
                    value={downloadUrl}
                    onChange={(e) => setDownloadUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-[#1c1c1e] border border-[#3d3d3f] rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-[#007AFF] transition"
                    autoFocus
                  />
                  <div className="flex items-center gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowDownloadModal(false);
                        setDownloadUrl("");
                      }}
                      className="flex-1 py-2 rounded-lg bg-gray-600 text-white text-sm hover:bg-gray-500 transition"
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
                <div className="bg-[#1c1c1e] rounded-lg p-3 border border-[#3d3d3f]">
                  <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-2">💡 Tip</p>
                  <p className="text-gray-400 text-xs">
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
