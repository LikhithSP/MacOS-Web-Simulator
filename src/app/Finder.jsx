import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../store/Appstore.js";
import TextEdit from "./TextEdit";
import PDFViewer from "./PDFViewer";
import { Safari } from "./Safari";
import Spotify from "./Spotify";
import Settings from "./Settings";
import MacGallery from "./Gallary";
import Blogs from "./Blogs/BlogsSection.jsx";
import {
  Clock,
  Users,
  Download,
  Monitor,
  FileText,
  Cloud,
  Home,
  HardDrive,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Columns3,
  Image as ImageIcon,
  Ellipsis,
  Tag,
  Share,
  Search,
  RotateCw,
  PenTool,
  ChevronDown,
  Folder,
  Trash2,
  X,
  Info
} from "lucide-react";

// Mock folder icons
const BLUE_FOLDER_URL = "https://s3.macosicons.com/macosicons/icons/GecwaBmkFQ/lowResPngFile_c3ef21fe8fabfd9d23fcc3ab3134dcf9_GecwaBmkFQ.png";

// Seeding iCloud Drive files matching the screenshots
const initialICloudFiles = [
  { id: "icloud_desktop", name: "Desktop", type: "folder", size: 0, date: "2026-06-15T10:00:00Z" },
  { id: "icloud_documents", name: "Documents", type: "folder", size: 0, date: "2026-06-15T11:00:00Z" },
  { id: "icloud_receipts", name: "Receipts", type: "folder", size: 0, date: "2026-06-15T12:00:00Z", tag: "blue" },
  { id: "img_beverly", name: "BeverlyHills.jpeg", type: "image", size: 2411724, date: "2026-02-15T11:30:00Z", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=60", width: 4032, height: 3024, resolution: "72x72" },
  { id: "img_brunch", name: "Brunch.jpeg", type: "image", size: 1845493, date: "2026-03-10T09:15:00Z", url: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=60", width: 3840, height: 2560, resolution: "72x72" },
  { id: "img_isolate", name: "Isolate.jpeg", type: "image", size: 1548291, date: "2026-04-02T14:20:00Z", url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=60", width: 3000, height: 4000, resolution: "72x72" },
  { id: "img_june", name: "JuneLake.jpeg", type: "image", size: 2841002, date: "2026-05-18T16:45:00Z", url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=60", width: 4500, height: 3000, resolution: "72x72" },
  { id: "img_kids", name: "KidsLondon.jpeg", type: "image", size: 3102482, date: "2026-06-01T10:10:00Z", url: "https://images.unsplash.com/photo-1484820540004-14229fe36ca4?w=800&auto=format&fit=crop&q=60", width: 4032, height: 3024, resolution: "72x72" },
  { id: "img_la", name: "LosAngeles.jpeg", type: "image", size: 2984122, date: "2026-06-10T22:30:00Z", url: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&auto=format&fit=crop&q=60", width: 3840, height: 2560, resolution: "72x72" },
  { id: "img_malibu", name: "Malibu.jpeg", type: "image", size: 2048591, date: "2026-06-12T08:00:00Z", url: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&auto=format&fit=crop&q=60", width: 4032, height: 3024, resolution: "72x72" },
  { id: "img_mammoth", name: "Mammoth.jpeg", type: "image", size: 3450192, date: "2026-06-13T13:40:00Z", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=60", width: 4896, height: 3264, resolution: "72x72" },
  { id: "img_pipeline", name: "Pipeline-Mammoth.jpeg", type: "image", size: 4192083, date: "2026-06-14T15:20:00Z", url: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&auto=format&fit=crop&q=60", width: 5120, height: 2880, resolution: "72x72" },
  { id: "img_purple", name: "Purple.jpeg", type: "image", size: 1984210, date: "2026-06-15T09:00:00Z", url: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&auto=format&fit=crop&q=60", width: 3024, height: 4032, resolution: "72x72" }
];

// Helper to decode Base64 UTF-8 text safely
const decodeBase64Text = (dataUrl) => {
  try {
    if (!dataUrl) return "";
    const base64Part = dataUrl.split(",")[1];
    if (!base64Part) return "";
    const binString = atob(base64Part);
    const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0));
    return new TextDecoder().decode(bytes);
  } catch (e) {
    console.error(e);
    return "Error decoding text file.";
  }
};

// Traffic lights inside the Finder sidebar
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

export default function Finder({ initialPath = "/icloud", windowId, maximized, isDragging, isResizing }) {
  const closeApp = useAppStore((s) => s.closeApp);
  const minimizeApp = useAppStore((s) => s.minimizeApp);
  const toggleMaximize = useAppStore((s) => s.toggleMaximize);
  const openApp = useAppStore((s) => s.openApp);
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  const windows = useAppStore((s) => s.windows);
  const restoreApp = useAppStore((s) => s.restoreApp);
  const focusApp = useAppStore((s) => s.focusApp);

  const applicationsList = [
    {
      id: "app_finder",
      appId: "Finder",
      name: "Finder.app",
      type: "app",
      icon: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Finder_Icon_macOS_Big_Sur.png",
      comp: <Finder />,
      date: "2026-06-15T10:00:00Z",
      size: 14500000
    },
    {
      id: "app_safari",
      appId: "Safari",
      name: "Safari.app",
      type: "app",
      icon: "https://s3.macosicons.com/macosicons/icons/utug9Rt8g6/lowResPngFile_a0b8d534889b5695781a9a03f388e2d4_low_res_Safari__MacOS_Tahoe_.png",
      comp: <Safari />,
      date: "2026-06-15T10:00:00Z",
      size: 28400000
    },
    {
      id: "app_spotify",
      appId: "Music",
      name: "Music.app",
      type: "app",
      icon: "https://s3.macosicons.com/macosicons/icons/60EVxS5XYc/lowResPngFile_43fc64dd49d0125e9b34d1d49204cafb_low_res_Music__MacOS_Tahoe_.png",
      comp: <Spotify />,
      date: "2026-06-15T10:00:00Z",
      size: 42100000
    },
    {
      id: "app_settings",
      appId: "Settings",
      name: "Settings.app",
      type: "app",
      icon: "https://s3.macosicons.com/macosicons/icons/mTHdx8YStT/lowResPngFile_4fc1a86ec5cb831e11c424f412b8da37_low_res_Settings.png",
      comp: <Settings />,
      date: "2026-06-15T10:00:00Z",
      size: 18900000
    },
    {
      id: "app_photos",
      appId: "Photos",
      name: "Photos.app",
      type: "app",
      icon: "https://s3.macosicons.com/macosicons/icons/GnoLTHQNAZ/lowResPngFile_f4e3bd7d0753d890bb3b53e3ea193cfe_low_res_Photos__MacOS_Tahoe_.png",
      comp: <MacGallery />,
      date: "2026-06-15T10:00:00Z",
      size: 34500000
    },
    {
      id: "app_notes",
      appId: "Notes",
      name: "Notes.app",
      type: "app",
      icon: "https://s3.macosicons.com/macosicons/icons/Tn8SuaHtAM/lowResPngFile_2a846d9fb757a742e6ab7ec9b243027e_low_res_Notes__MacOS_Tahoe_.png",
      comp: <Blogs />,
      date: "2026-06-15T10:00:00Z",
      size: 12400000
    },
    {
      id: "app_store",
      appId: "AppStore",
      name: "App Store.app",
      type: "app",
      icon: "https://s3.macosicons.com/macosicons/icons/ZTpqalXxE3/lowResPngFile_8f0aba462304996c37f9f506b368c53b_low_res_App_Store__MacOS_Tahoe_.png",
      date: "2026-06-15T10:00:00Z",
      size: 51200000
    }
  ];

  const [currentPath, setCurrentPath] = useState(initialPath);
  const [history, setHistory] = useState([initialPath]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  const [viewMode, setViewMode] = useState("grid"); // "grid", "list", "column", "gallery"
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isCutMode, setIsCutMode] = useState(() => {
    return localStorage.getItem("os_is_cut_mode") === "true";
  });

  const handleFileClick = (e, file) => {
    e.stopPropagation();
    if (e.shiftKey) {
      const allFiles = filteredFiles;
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


  const [previewImage, setPreviewImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPreviewPane, setShowPreviewPane] = useState(true);
  const [infoExpanded, setInfoExpanded] = useState(true);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Custom Apple-style UI Prompts & Alert Dialogs
  const [modalPrompt, setModalPrompt] = useState(null);
  const [promptValue, setPromptValue] = useState("");
  const [modalConfirm, setModalConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  const showCustomPrompt = (type, title, defaultValue, onConfirm) => {
    setPromptValue(defaultValue);
    setModalPrompt({ type, title, defaultValue, onConfirm });
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const saveTextFile = (fileId, newTitle, newText) => {
    const size = new TextEncoder().encode(newText).length;
    const base64Content = btoa(unescape(encodeURIComponent(newText)));
    const newUrl = `data:text/plain;base64,${base64Content}`;

    const updateFilesList = (list) =>
      list.map((f) =>
        f.id === fileId
          ? {
              ...f,
              name: newTitle,
              url: newUrl,
              size: size,
              date: new Date().toISOString(),
            }
          : f
      );

    setIcloudFiles((prev) => (prev.some((f) => f.id === fileId) ? updateFilesList(prev) : prev));
    setDownloads((prev) => (prev.some((f) => f.id === fileId) ? updateFilesList(prev) : prev));
    setDesktopFiles((prev) => (prev.some((f) => f.id === fileId) ? updateFilesList(prev) : prev));
    setDocumentsFiles((prev) => (prev.some((f) => f.id === fileId) ? updateFilesList(prev) : prev));
    setLikhithFiles((prev) => (prev.some((f) => f.id === fileId) ? updateFilesList(prev) : prev));

    setSelectedFile((prev) => {
      if (prev?.id === fileId) {
        return {
          ...prev,
          name: newTitle,
          url: newUrl,
          size: size,
          date: new Date().toISOString(),
        };
      }
      return prev;
    });

    showToast("File saved successfully!", "success");
  };

  useEffect(() => {
    const handleFileSaved = (e) => {
      const { id, name, content } = e.detail;
      saveTextFile(id, name, content);
    };
    window.addEventListener("os_file_saved", handleFileSaved);
    return () => window.removeEventListener("os_file_saved", handleFileSaved);
  }, []);

  // Simulated dynamic states
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
  const [icloudFiles, setIcloudFiles] = useState(() => {
    const saved = localStorage.getItem("os_icloud_files");
    return saved ? JSON.parse(saved) : initialICloudFiles;
  });
  const [documentsFiles, setDocumentsFiles] = useState(() => {
    const saved = localStorage.getItem("os_documents_files");
    const parsed = saved ? JSON.parse(saved) : [];
    return parsed.filter(f => f.id !== "doc_project" && f.id !== "doc_resume");
  });
  const [likhithFiles, setLikhithFiles] = useState(() => {
    const saved = localStorage.getItem("os_likhith_files");
    const parsed = saved ? JSON.parse(saved) : [];
    return parsed.filter(f => f.id !== "likhith_welcome");
  });

  const [clipboard, setClipboard] = useState(() => {
    return JSON.parse(localStorage.getItem("os_clipboard") || "null");
  });
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);

  const scrubberRef = useRef(null);
  const finderRef = useRef(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("os_icloud_files", JSON.stringify(icloudFiles));
  }, [icloudFiles]);

  useEffect(() => {
    localStorage.setItem("os_downloads", JSON.stringify(downloads));
  }, [downloads]);

  useEffect(() => {
    localStorage.setItem("os_documents_files", JSON.stringify(documentsFiles));
  }, [documentsFiles]);

  useEffect(() => {
    localStorage.setItem("os_likhith_files", JSON.stringify(likhithFiles));
  }, [likhithFiles]);

  useEffect(() => {
    localStorage.setItem("os_desktop_files", JSON.stringify(desktopFiles));
    window.dispatchEvent(new CustomEvent("os_desktop_sync"));
  }, [desktopFiles]);

  useEffect(() => {
    localStorage.setItem("os_desktop_folders", JSON.stringify(desktopFolders));
    window.dispatchEvent(new CustomEvent("os_desktop_sync"));
  }, [desktopFolders]);

  useEffect(() => {
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

    const handleFilesSync = () => {
      const icloud = JSON.parse(localStorage.getItem("os_icloud_files") || "[]");
      const dl = JSON.parse(localStorage.getItem("os_downloads") || "[]");
      const doc = JSON.parse(localStorage.getItem("os_documents_files") || "[]");
      const likhith = JSON.parse(localStorage.getItem("os_likhith_files") || "[]");
      
      setIcloudFiles(prev => JSON.stringify(prev) === JSON.stringify(icloud) ? prev : icloud);
      setDownloads(prev => JSON.stringify(prev) === JSON.stringify(dl) ? prev : dl);
      setDocumentsFiles(prev => JSON.stringify(prev) === JSON.stringify(doc) ? prev : doc);
      setLikhithFiles(prev => JSON.stringify(prev) === JSON.stringify(likhith) ? prev : likhith);
    };

    window.addEventListener("os_desktop_sync", handleDesktopSync);
    window.addEventListener("os_clipboard_sync", handleClipboardSync);
    window.addEventListener("os_files_sync", handleFilesSync);
    return () => {
      window.removeEventListener("os_desktop_sync", handleDesktopSync);
      window.removeEventListener("os_clipboard_sync", handleClipboardSync);
      window.removeEventListener("os_files_sync", handleFilesSync);
    };
  }, []);

  useEffect(() => {
    const closeAllDropdowns = () => {
      setShowActionsDropdown(false);
      setContextMenu(null);
    };
    window.addEventListener("click", closeAllDropdowns);
    return () => window.removeEventListener("click", closeAllDropdowns);
  }, []);

  // Support navigation history
  const navigateTo = (path) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(path);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentPath(path);
    setSelectedFile(null);
  };

  const navigateBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentPath(history[historyIndex - 1]);
      setSelectedFile(null);
    }
  };

  const navigateForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentPath(history[historyIndex + 1]);
      setSelectedFile(null);
    }
  };

  // Listen for OS events
  useEffect(() => {
    const handleDownload = (e) => {
      const newFile = e.detail;
      setDownloads(prev => {
        const updated = [newFile, ...prev.filter(f => f.id !== newFile.id)];
        return updated;
      });
    };

    const handleFileRestored = (e) => {
      const { file, path } = e.detail;
      const updateList = (prev) => [file, ...prev.filter(f => f.id !== file.id)];
      
      if (path === "/icloud") {
        setIcloudFiles(updateList);
      } else if (path === "/downloads") {
        setDownloads(updateList);
      } else if (path === "/desktop") {
        if (file.type === "folder") {
          setDesktopFolders(updateList);
        } else {
          setDesktopFiles(updateList);
        }
      } else if (path === "/documents") {
        setDocumentsFiles(updateList);
      } else if (path === "/likhith-sp") {
        setLikhithFiles(updateList);
      }
    };

    window.addEventListener("os_file_download", handleDownload);
    window.addEventListener("os_file_restored", handleFileRestored);
    return () => {
      window.removeEventListener("os_file_download", handleDownload);
      window.removeEventListener("os_file_restored", handleFileRestored);
    };
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

  const getPathDisplayName = (path) => {
    if (path === "/icloud") return "iCloud Drive";
    if (path === "/downloads") return "Downloads";
    if (path === "/desktop") return "Desktop";
    if (path === "/documents") return "Documents";
    if (path === "/recents") return "Recents";
    if (path === "/shared") return "Shared";
    if (path === "/applications") return "Applications";
    if (path === "/likhith-sp") return "Likhith SP";
    if (path === "/mac-hd") return "macOS 27";

    // Handle deep paths
    const parts = path.split("/").filter(Boolean);
    const lastPart = parts[parts.length - 1];

    const desktopFolder = desktopFolders.find(f => f.id === lastPart);
    if (desktopFolder) return desktopFolder.name;

    const icloudFolder = icloudFiles.find(f => f.id === lastPart && f.type === "folder");
    if (icloudFolder) return icloudFolder.name;

    return lastPart ? lastPart.charAt(0).toUpperCase() + lastPart.slice(1) : "Folder";
  };

  const getFilesForCurrentPath = () => {
    if (currentPath === "/icloud") {
      return icloudFiles.filter(file => !file.parentFolderId);
    }
    if (currentPath.startsWith("/icloud/")) {
      const folderId = currentPath.split("/")[2];
      return icloudFiles.filter(file => file.parentFolderId === folderId);
    }
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
    if (currentPath === "/applications") {
      return applicationsList;
    }
    if (currentPath === "/mac-hd") {
      return [
        { id: "mac_hd_applications", name: "Applications", type: "folder", date: "2026-06-15T10:00:00Z" },
        { id: "mac_hd_library", name: "Library", type: "folder", date: "2026-06-15T10:00:00Z" },
        { id: "mac_hd_system", name: "System", type: "folder", date: "2026-06-15T10:00:00Z" },
        { id: "mac_hd_users", name: "Users", type: "folder", date: "2026-06-15T10:00:00Z" }
      ];
    }
    // Seed default blank or minimal folders for other structures
    if (currentPath === "/documents") {
      return documentsFiles;
    }
    if (currentPath === "/likhith-sp") {
      return likhithFiles;
    }
    if (currentPath === "/recents") {
      // Return combination of recent files
      return [...icloudFiles, ...downloads, ...documentsFiles].slice(0, 7);
    }
    if (currentPath === "/shared") {
      return icloudFiles.filter(f => f.tag === "blue");
    }
    return [];
  };

  const filteredFiles = getFilesForCurrentPath().filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")) {
        return;
      }

      const isModifier = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      if (isModifier) {
        if (key === "a") {
          e.preventDefault();
          const allFiles = filteredFiles;
          setSelectedFiles(allFiles);
          if (allFiles.length > 0) {
            setSelectedFile(allFiles[allFiles.length - 1]);
          }
        } else if (key === "c") {
          e.preventDefault();
          if (selectedFiles.length > 0 || selectedFile) {
            handleCopy(selectedFile);
          }
        } else if (key === "x") {
          e.preventDefault();
          if (selectedFiles.length > 0 || selectedFile) {
            handleCut(selectedFile);
          }
        } else if (key === "v") {
          e.preventDefault();
          handlePaste();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filteredFiles, selectedFiles, selectedFile, clipboard, isCutMode]);

  useEffect(() => {
    const handleGlobalPaste = (e) => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")) {
        return;
      }
      
      const files = e.clipboardData?.files;
      if (files && files.length > 0) {
        e.preventDefault();
        Array.from(files).forEach((file, index) => {
          const isImage = file.type.startsWith("image/");
          const isVideo = file.type.startsWith("video/");
          const isPdf = file.type === "application/pdf" || file.name.endsWith(".pdf");
          const isTxt = file.type === "text/plain" || file.name.endsWith(".txt");

          if (!isImage && !isVideo && !isPdf && !isTxt) {
            showToast("Only images, PDFs, videos, and text files can be pasted.", "error");
            return;
          }

          const reader = new FileReader();
          reader.onload = (event) => {
            const dataUrl = event.target.result;
            const newFile = {
              id: `paste_sys_${Date.now()}_${index}`,
              name: file.name,
              type: isImage ? "image" : isVideo ? "video" : isPdf ? "pdf" : "document",
              size: file.size,
              date: new Date().toISOString(),
              url: dataUrl
            };
            addFileToCurrentDirectory(newFile);
          };
          reader.readAsDataURL(file);
        });
        showToast("Files pasted from computer", "success");
      }
    };

    window.addEventListener("paste", handleGlobalPaste);
    return () => window.removeEventListener("paste", handleGlobalPaste);
  }, [currentPath]);

  // Delete action
  const deleteFile = (fileId) => {
    const targets = selectedFiles.some(f => f.id === fileId) ? selectedFiles : [getFilesForCurrentPath().find(f => f.id === fileId)].filter(Boolean);

    targets.forEach(fileToTrash => {
      const trashedItem = {
        ...fileToTrash,
        originalPath: currentPath,
        trashedAt: new Date().toISOString()
      };
      
      // Save directly to localStorage
      const currentTrash = JSON.parse(localStorage.getItem("os_trash") || "[]");
      const updatedTrash = [trashedItem, ...currentTrash.filter(f => f.id !== fileToTrash.id)];
      localStorage.setItem("os_trash", JSON.stringify(updatedTrash));
      
      window.dispatchEvent(new CustomEvent("os_file_trash", { detail: trashedItem }));
      window.dispatchEvent(new CustomEvent("os_trash_updated", { detail: { hasFiles: true } }));

      if (currentPath === "/icloud") {
        setIcloudFiles(prev => prev.filter(f => f.id !== fileToTrash.id));
      } else if (currentPath === "/downloads") {
        setDownloads(prev => prev.filter(f => f.id !== fileToTrash.id));
      } else if (currentPath === "/desktop") {
        setDesktopFiles(prev => prev.filter(f => f.id !== fileToTrash.id));
        setDesktopFolders(prev => prev.filter(f => f.id !== fileToTrash.id));
      } else if (currentPath === "/documents") {
        setDocumentsFiles(prev => prev.filter(f => f.id !== fileToTrash.id));
      } else if (currentPath === "/likhith-sp") {
        setLikhithFiles(prev => prev.filter(f => f.id !== fileToTrash.id));
      }
    });

    if (currentPath === "/desktop") {
      const targetIds = targets.map(t => t.id);
      localStorage.setItem("os_desktop_files", JSON.stringify(desktopFiles.filter(f => !targetIds.includes(f.id))));
      localStorage.setItem("os_desktop_folders", JSON.stringify(desktopFolders.filter(f => !targetIds.includes(f.id))));
    }

    setSelectedFiles([]);
    setSelectedFile(null);
  };

  const addFileToCurrentDirectory = (newFile) => {
    if (currentPath === "/icloud") {
      setIcloudFiles(prev => [...prev, newFile]);
    } else if (currentPath.startsWith("/icloud/")) {
      const folderId = currentPath.split("/")[2];
      const fileWithParent = { ...newFile, parentFolderId: folderId };
      setIcloudFiles(prev => [...prev, fileWithParent]);
    } else if (currentPath === "/downloads") {
      setDownloads(prev => [...prev, newFile]);
    } else if (currentPath === "/desktop") {
      if (newFile.type === "folder") {
        setDesktopFolders(prev => [...prev, newFile]);
      } else {
        setDesktopFiles(prev => [...prev, newFile]);
      }
    } else if (currentPath.startsWith("/desktop/")) {
      const folderId = currentPath.split("/")[2];
      const fileWithParent = { ...newFile, parentFolderId: folderId };
      if (newFile.type === "folder") {
        setDesktopFolders(prev => [...prev, fileWithParent]);
      } else {
        setDesktopFiles(prev => [...prev, fileWithParent]);
      }
    } else if (currentPath === "/documents") {
      setDocumentsFiles(prev => [...prev, newFile]);
    } else if (currentPath === "/likhith-sp") {
      setLikhithFiles(prev => [...prev, newFile]);
    }
  };

  const handleCut = (file) => {
    const list = selectedFiles.length > 0 ? selectedFiles : file ? [file] : [];
    if (!list.length) return;
    localStorage.setItem("os_clipboard", JSON.stringify(list));
    localStorage.setItem("os_is_cut_mode", "true");
    window.dispatchEvent(new CustomEvent("os_clipboard_sync"));
  };

  const handleCopy = (file) => {
    const list = selectedFiles.length > 0 ? selectedFiles : file ? [file] : [];
    if (!list.length) return;
    localStorage.setItem("os_clipboard", JSON.stringify(list));
    localStorage.setItem("os_is_cut_mode", "false");
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
          parentFolderId: currentPath.startsWith("/icloud/") 
            ? currentPath.split("/")[2] 
            : currentPath.startsWith("/desktop/") 
              ? currentPath.split("/")[2] 
              : undefined
        };
        
        const removeFromFileList = (list) => list.filter(f => f.id !== clipboardItem.id);
        setIcloudFiles(prev => removeFromFileList(prev));
        setDownloads(prev => removeFromFileList(prev));
        setDesktopFiles(prev => removeFromFileList(prev));
        setDesktopFolders(prev => removeFromFileList(prev));
        setDocumentsFiles(prev => removeFromFileList(prev));
        setLikhithFiles(prev => removeFromFileList(prev));

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
        localStorage.setItem("os_desktop_folders", JSON.stringify(destFolders));
        localStorage.setItem("os_desktop_files", JSON.stringify(destFiles));

        addFileToCurrentDirectory(fileWithNewParent);
      });
      
      localStorage.setItem("os_clipboard", "null");
      localStorage.setItem("os_is_cut_mode", "false");
      
      window.dispatchEvent(new CustomEvent("os_clipboard_sync"));
      window.dispatchEvent(new CustomEvent("os_files_sync"));
      window.dispatchEvent(new CustomEvent("os_desktop_sync"));
      showToast("Items moved successfully", "success");
    } else {
      clipboardList.forEach((clipboardItem, index) => {
        const pastedFile = {
          ...clipboardItem,
          id: `${clipboardItem.id}_copy_${Date.now()}_${index}`,
          name: clipboardItem.name.includes(".") 
            ? clipboardItem.name.replace(/(\.[^.]+)$/, " copy$1") 
            : `${clipboardItem.name} copy`,
          date: new Date().toISOString(),
          parentFolderId: currentPath.startsWith("/icloud/") 
            ? currentPath.split("/")[2] 
            : currentPath.startsWith("/desktop/") 
              ? currentPath.split("/")[2] 
              : undefined
        };
        addFileToCurrentDirectory(pastedFile);
      });
      showToast("Items copied successfully", "success");
    }
  };

  const handleCreateFolder = () => {
    showCustomPrompt("folder", "New Folder", "Untitled Folder", (folderName) => {
      if (!folderName) return;
      const newFolder = {
        id: `folder_${Date.now()}`,
        name: folderName,
        type: "folder",
        size: 0,
        date: new Date().toISOString()
      };
      addFileToCurrentDirectory(newFolder);
    });
  };

  const handleCreateFile = () => {
    showCustomPrompt("file", "New File", "untitled.txt", (fileName) => {
      if (!fileName) return;
      const isImage = fileName.endsWith(".jpeg") || fileName.endsWith(".jpg") || fileName.endsWith(".png");
      const newFile = {
        id: `file_${Date.now()}`,
        name: fileName,
        type: isImage ? "image" : "document",
        size: isImage ? 1548291 : 0,
        date: new Date().toISOString(),
        url: isImage ? "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800" : "",
        content: ""
      };
      addFileToCurrentDirectory(newFile);
    });
  };

  const handleRename = (file) => {
    if (!file) return;
    showCustomPrompt("rename", "Rename Item", file.name, (newName) => {
      if (!newName || newName === file.name) return;

      const updatedFile = {
        ...file,
        name: newName,
        date: new Date().toISOString()
      };

      if (currentPath === "/icloud") {
        setIcloudFiles(prev => prev.map(f => f.id === file.id ? updatedFile : f));
      } else if (currentPath === "/downloads") {
        setDownloads(prev => prev.map(f => f.id === file.id ? updatedFile : f));
      } else if (currentPath === "/desktop") {
        if (file.type === "folder") {
          setDesktopFolders(prev => prev.map(f => f.id === file.id ? updatedFile : f));
        } else {
          setDesktopFiles(prev => prev.map(f => f.id === file.id ? updatedFile : f));
        }
      } else if (currentPath === "/documents") {
        setDocumentsFiles(prev => prev.map(f => f.id === file.id ? updatedFile : f));
      } else if (currentPath === "/likhith-sp") {
        setLikhithFiles(prev => prev.map(f => f.id === file.id ? updatedFile : f));
      }

      setSelectedFile(updatedFile);
    });
  };

  const handleContainerContextMenu = (e) => {
    e.preventDefault();
    const finderRect = finderRef.current?.getBoundingClientRect();
    const containerX = finderRect ? finderRect.left : 0;
    const containerY = finderRect ? finderRect.top : 0;
    setSelectedFile(null);
    setContextMenu({
      x: e.clientX - containerX,
      y: e.clientY - containerY,
      file: null
    });
  };

  const handleFileContextMenu = (e, file) => {
    e.preventDefault();
    e.stopPropagation();
    
    const finderRect = finderRef.current?.getBoundingClientRect();
    const containerX = finderRect ? finderRect.left : 0;
    const containerY = finderRect ? finderRect.top : 0;
    const fileRect = e.currentTarget.getBoundingClientRect();
    
    setSelectedFiles(prev => {
      if (prev.some(f => f.id === file.id)) {
        return prev;
      } else {
        setSelectedFile(file);
        return [file];
      }
    });
    setContextMenu({
      x: fileRect.left - containerX,
      y: fileRect.bottom - containerY,
      file: file
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "--";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (!files.length) return;

    files.forEach((file, index) => {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      const isPdf = file.type === "application/pdf" || file.name.endsWith(".pdf");
      const isTxt = file.type === "text/plain" || file.name.endsWith(".txt");

      if (!isImage && !isVideo && !isPdf && !isTxt) {
        showToast("Only images, PDFs, videos, and text files can be uploaded.", "error");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        
        const newFile = {
          id: `drop_${Date.now()}_${index}`,
          name: file.name,
          type: isImage ? "image" : isVideo ? "video" : isPdf ? "pdf" : "document",
          size: file.size,
          date: new Date().toISOString(),
          url: dataUrl
        };

        addFileToCurrentDirectory(newFile);
      };
      reader.readAsDataURL(file);
    });
  };

  const getFileIcon = (file, sizeClass = "w-12 h-12") => {
    if (file.type === "folder") {
      if (file.name === "Applications") {
        return (
          <img
            src="https://s3.macosicons.com/macosicons/icons/ZTpqalXxE3/lowResPngFile_8f0aba462304996c37f9f506b368c53b_low_res_App_Store__MacOS_Tahoe_.png"
            alt="Applications"
            className={`${sizeClass} object-contain rounded-xl`}
          />
        );
      }
      return (
        <img
          src={BLUE_FOLDER_URL}
          alt="Folder"
          className={`${sizeClass} object-contain`}
        />
      );
    }
    if (file.type === "app") {
      return (
        <img
          src={file.icon}
          alt={file.name}
          className={`${sizeClass} object-contain rounded-xl`}
        />
      );
    }
    if (file.type === "image") {
      return (
        <div className={`${sizeClass} rounded-md overflow-hidden shadow-sm border border-black/5 shrink-0`}>
          <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
        </div>
      );
    }
    if (file.type === "video") {
      return (
        <div className={`${sizeClass} flex items-center justify-center bg-purple-50 rounded-md border border-purple-200 text-purple-600 shrink-0`}>
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path></svg>
        </div>
      );
    }
    if (file.type === "pdf") {
      return (
        <img
          src="https://s3.macosicons.com/macosicons/icons/ayIhAsqzsY/lowResPngFile_55b757e27580fefb9bd856a23abf6d0f_low_res_Pdf_Document.png"
          alt="PDF"
          className={`${sizeClass} object-contain`}
        />
      );
    }
    if (file.type === "document") {
      return (
        <img
          src="https://s3.macosicons.com/macosicons/icons/aExwB3ULuk/lowResPngFile_a819aac512e7261fee3310f1bbdaada7_aExwB3ULuk.png"
          alt="Text Document"
          className={`${sizeClass} object-contain`}
        />
      );
    }
    return (
      <div className={`${sizeClass} flex items-center justify-center bg-gray-100 rounded-md border border-gray-200 shrink-0`}>
        <FileText size={24} className="text-gray-400" />
      </div>
    );
  };

  const handleOpenFolder = (folder) => {
    if (folder.name === "Applications") {
      navigateTo("/applications");
      return;
    }
    if (currentPath === "/icloud") {
      navigateTo(`/icloud/${folder.id}`);
    } else {
      navigateTo(`/desktop/${folder.id}`);
    }
  };

  const handleOpenFile = (file) => {
    if (file.type === "folder") {
      handleOpenFolder(file);
    } else if (file.type === "image" || file.type === "video") {
      setPreviewImage(file);
    } else if (file.type === "document") {
      openApp("TextEdit", <TextEdit file={file} />);
    } else if (file.type === "pdf") {
      openApp("PDFViewer", <PDFViewer file={file} />);
    } else if (file.type === "app") {
      if (file.url) {
        window.open(file.url, "_blank");
      } else if (file.comp) {
        const existingWindow = windows.find((w) => w.appId === file.appId);
        if (existingWindow) {
          if (existingWindow.minimized) {
            restoreApp(existingWindow.id);
          } else {
            focusApp(existingWindow.id);
          }
        } else {
          openApp(file.appId, file.comp);
        }
      } else {
        showToast(`${file.name} is currently not available.`, "info");
      }
    }
  };

  // Quick Action functions
  const rotateSelectedImage = () => {
    if (!selectedFile || selectedFile.type !== "image") return;
    // Rotate simulated: just display a success toast or update dimensions swap
    showToast(`Rotated ${selectedFile.name} 90 degrees`, "info");
  };

  return (
    <div ref={finderRef} className={`relative flex h-full select-none transition-colors duration-150 ${isDarkMode ? "bg-[#1E1E1E] text-gray-200" : "bg-white text-gray-800"}`} style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" }}>
      
      {/* Sidebar - frosted translucent styling */}
      <aside className={`w-52 flex flex-col shrink-0 border-r transition-colors duration-150 ${
        isDarkMode ? "border-white/10 bg-[#1E1E1E]/95" : "border-[#E5E5E5] bg-[#F3F3F3]/90"
      } backdrop-blur-md`}>
        {/* Window controls spacer */}
        <div className="window-drag-handle h-12 flex items-center px-4 shrink-0 cursor-grab active:cursor-grabbing">
          <TrafficLights windowId={windowId} />
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 overflow-y-auto px-2 pb-4 space-y-4" style={{ scrollbarWidth: "none" }}>
          {/* Top-level system items */}
          <div className="space-y-0.5">
            <button
              onClick={() => navigateTo("/recents")}
              className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                currentPath === "/recents" 
                  ? (isDarkMode ? "bg-white/10 text-white" : "bg-black/10 text-black") 
                  : (isDarkMode ? "text-[#D0D0D0] hover:bg-white/5" : "text-[#4A4A4A] hover:bg-black/5")
              }`}
            >
              <Clock size={16} className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
              <span>Recents</span>
            </button>
            <button
              onClick={() => navigateTo("/shared")}
              className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                currentPath === "/shared" 
                  ? (isDarkMode ? "bg-white/10 text-white" : "bg-black/10 text-black") 
                  : (isDarkMode ? "text-[#D0D0D0] hover:bg-white/5" : "text-[#4A4A4A] hover:bg-black/5")
              }`}
            >
              <Users size={16} className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
              <span>Shared</span>
            </button>
          </div>

          {/* Favorites */}
          <div>
            <div className="px-2.5 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wide">
              Favorites
            </div>
            <div className="mt-1 space-y-0.5">
              <button
                onClick={() => navigateTo("/applications")}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                  currentPath === "/applications" 
                    ? (isDarkMode ? "bg-white/10 text-white" : "bg-black/10 text-black") 
                    : (isDarkMode ? "text-[#D0D0D0] hover:bg-white/5" : "text-[#4A4A4A] hover:bg-black/5")
                }`}
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <img
                    src="https://s3.macosicons.com/macosicons/icons/ZTpqalXxE3/lowResPngFile_8f0aba462304996c37f9f506b368c53b_low_res_App_Store__MacOS_Tahoe_.png"
                    alt="Applications"
                    className="w-4 h-4 object-contain rounded"
                  />
                </div>
                <span>Applications</span>
              </button>
              <button
                onClick={() => navigateTo("/downloads")}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                  currentPath === "/downloads" 
                    ? (isDarkMode ? "bg-white/10 text-white" : "bg-black/10 text-black") 
                    : (isDarkMode ? "text-[#D0D0D0] hover:bg-white/5" : "text-[#4A4A4A] hover:bg-black/5")
                }`}
              >
                <Download size={16} className="text-blue-500" />
                <span>Downloads</span>
              </button>
              <button
                onClick={() => navigateTo("/desktop")}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                  currentPath === "/desktop" 
                    ? (isDarkMode ? "bg-white/10 text-white" : "bg-black/10 text-black") 
                    : (isDarkMode ? "text-[#D0D0D0] hover:bg-white/5" : "text-[#4A4A4A] hover:bg-black/5")
                }`}
              >
                <Monitor size={16} className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
                <span>Desktop</span>
              </button>
              <button
                onClick={() => navigateTo("/documents")}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                  currentPath === "/documents" 
                    ? (isDarkMode ? "bg-white/10 text-white" : "bg-black/10 text-black") 
                    : (isDarkMode ? "text-[#D0D0D0] hover:bg-white/5" : "text-[#4A4A4A] hover:bg-black/5")
                }`}
              >
                <FileText size={16} className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
                <span>Documents</span>
              </button>
            </div>
          </div>

          {/* Locations */}
          <div>
            <div className="px-2.5 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wide">
              Locations
            </div>
            <div className="mt-1 space-y-0.5">
              <button
                onClick={() => navigateTo("/icloud")}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                  currentPath === "/icloud" 
                    ? (isDarkMode ? "bg-white/10 text-white" : "bg-black/10 text-black") 
                    : (isDarkMode ? "text-[#D0D0D0] hover:bg-white/5" : "text-[#4A4A4A] hover:bg-black/5")
                }`}
              >
                <Cloud size={16} className="text-blue-500" />
                <span>iCloud Drive</span>
              </button>
              <button
                onClick={() => navigateTo("/likhith-sp")}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                  currentPath === "/likhith-sp" 
                    ? (isDarkMode ? "bg-white/10 text-white" : "bg-black/10 text-black") 
                    : (isDarkMode ? "text-[#D0D0D0] hover:bg-white/5" : "text-[#4A4A4A] hover:bg-black/5")
                }`}
              >
                <Home size={16} className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
                <span>Likhith SP</span>
              </button>
              <button
                onClick={() => navigateTo("/mac-hd")}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                  currentPath === "/mac-hd" 
                    ? (isDarkMode ? "bg-white/10 text-white" : "bg-black/10 text-black") 
                    : (isDarkMode ? "text-[#D0D0D0] hover:bg-white/5" : "text-[#4A4A4A] hover:bg-black/5")
                }`}
              >
                <HardDrive size={16} className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
                <span>macOS 27</span>
              </button>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Right Side Area */}
      <main className={`flex-1 flex flex-col min-w-0 overflow-hidden transition-colors duration-150 ${
        isDarkMode ? "bg-[#1E1E1E]" : "bg-white"
      }`}>
        {/* Toolbar */}
        <header className={`window-drag-handle h-12 border-b px-4 flex items-center justify-between shrink-0 select-none cursor-grab active:cursor-grabbing transition-colors duration-150 ${
          isDarkMode ? "bg-[#2D2D2D] border-white/10 text-white" : "bg-[#F6F6F6] border-[#E5E5E5] text-gray-800"
        }`}>
          {/* Navigation and Title */}
          <div className="flex items-center gap-4">
            {/* History back/forward buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={navigateBack}
                disabled={historyIndex <= 0}
                className={`p-1 rounded-lg transition text-[#5F5F5F] disabled:opacity-35 disabled:hover:bg-transparent ${
                  isDarkMode ? "hover:bg-white/5 text-gray-300" : "hover:bg-black/5"
                }`}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={navigateForward}
                disabled={historyIndex >= history.length - 1}
                className={`p-1 rounded-lg transition text-[#5F5F5F] disabled:opacity-35 disabled:hover:bg-transparent ${
                  isDarkMode ? "hover:bg-white/5 text-gray-300" : "hover:bg-black/5"
                }`}
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Title */}
            <span className={`text-[14px] font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              {getPathDisplayName(currentPath)}
            </span>
          </div>

          {/* View Toggles & Actions */}
          <div className="flex items-center gap-4">
            {/* View Mode controls */}
            <div className={`flex items-center border p-0.5 shrink-0 shadow-sm rounded-xl transition ${
              isDarkMode ? "border-white/10 bg-[#1E1E1E]" : "border-[#D5D5D5] bg-[#EBEBEB]"
            }`}>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1 rounded-lg transition ${
                  viewMode === "grid" 
                    ? (isDarkMode ? "bg-[#2D2D2D] text-white shadow-md" : "bg-white shadow-sm text-gray-800") 
                    : (isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-800")
                }`}
                title="Icon View"
              >
                <LayoutGrid size={13} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1 rounded-lg transition ${
                  viewMode === "list" 
                    ? (isDarkMode ? "bg-[#2D2D2D] text-white shadow-md" : "bg-white shadow-sm text-gray-800") 
                    : (isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-800")
                }`}
                title="List View"
              >
                <List size={13} />
              </button>
              <button
                onClick={() => setViewMode("column")}
                className={`p-1 rounded-lg transition ${
                  viewMode === "column" 
                    ? (isDarkMode ? "bg-[#2D2D2D] text-white shadow-md" : "bg-white shadow-sm text-gray-800") 
                    : (isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-800")
                }`}
                title="Column View"
              >
                <Columns3 size={13} />
              </button>
              <button
                onClick={() => setViewMode("gallery")}
                className={`p-1 rounded-lg transition ${
                  viewMode === "gallery" 
                    ? (isDarkMode ? "bg-[#2D2D2D] text-white shadow-md" : "bg-white shadow-sm text-gray-800") 
                    : (isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-800")
                }`}
                title="Gallery View"
              >
                <ImageIcon size={13} />
              </button>
            </div>

            {/* Layout menu dropdown */}
            <button className={`flex items-center gap-0.5 border rounded-lg px-1.5 py-1 text-[11px] transition ${
              isDarkMode ? "border-white/10 hover:bg-white/5 text-gray-300" : "border-[#D5D5D5] hover:bg-black/5 text-gray-700"
            }`}>
              <LayoutGrid size={13} />
              <ChevronDown size={10} />
            </button>

            {/* Actions group */}
            <div className="flex items-center gap-1.5">
              <button className={`p-1.5 border rounded-lg transition ${
                isDarkMode ? "border-white/10 hover:bg-white/5 text-gray-300" : "border-[#D5D5D5] hover:bg-black/5 text-gray-600"
              }`}>
                <Share size={14} />
              </button>
              <button className={`p-1.5 border rounded-lg transition ${
                isDarkMode ? "border-white/10 hover:bg-white/5 text-gray-300" : "border-[#D5D5D5] hover:bg-black/5 text-gray-600"
              }`}>
                <Tag size={14} />
              </button>
              <div className="relative shrink-0 flex items-center">
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowActionsDropdown(!showActionsDropdown); }} 
                  className={`p-1.5 border rounded-lg transition ${
                    isDarkMode ? "border-white/10 hover:bg-white/5 text-gray-300" : "border-[#D5D5D5] hover:bg-black/5 text-gray-600"
                  }`}
                >
                  <Ellipsis size={14} />
                </button>
                {showActionsDropdown && (
                  <div 
                    onClick={(e) => e.stopPropagation()} 
                    className={`absolute right-0 top-9 w-40 border rounded-lg shadow-lg py-1 z-50 text-[12px] ${
                      isDarkMode ? "bg-[#1E1E1E] border-white/10 text-gray-300" : "bg-white border-[#D5D5D5] text-gray-700"
                    }`}
                  >
                    <button onClick={() => { handleCreateFolder(); setShowActionsDropdown(false); }} className={`w-full text-left px-3 py-1.5 ${isDarkMode ? "hover:bg-blue-600 hover:text-white" : "hover:bg-[#007AFF] hover:text-white"}`}>New Folder</button>
                    <button onClick={() => { handleCreateFile(); setShowActionsDropdown(false); }} className={`w-full text-left px-3 py-1.5 ${isDarkMode ? "hover:bg-blue-600 hover:text-white" : "hover:bg-[#007AFF] hover:text-white"}`}>New File</button>
                    <div className={`border-t my-1 ${isDarkMode ? "border-white/10" : "border-[#E5E5E5]"}`}></div>
                    <button 
                      disabled={!selectedFile} 
                      onClick={() => { handleCopy(selectedFile); setShowActionsDropdown(false); }} 
                      className={`w-full text-left px-3 py-1.5 disabled:opacity-40 disabled:hover:bg-transparent ${
                        isDarkMode ? "hover:bg-blue-600 hover:text-white disabled:hover:text-gray-400" : "hover:bg-[#007AFF] hover:text-white disabled:hover:text-gray-700"
                      }`}
                    >
                      Copy
                    </button>
                    <button 
                      disabled={!selectedFile} 
                      onClick={() => { handleCut(selectedFile); setShowActionsDropdown(false); }} 
                      className={`w-full text-left px-3 py-1.5 disabled:opacity-40 disabled:hover:bg-transparent ${
                        isDarkMode ? "hover:bg-blue-600 hover:text-white disabled:hover:text-gray-400" : "hover:bg-[#007AFF] hover:text-white disabled:hover:text-gray-700"
                      }`}
                    >
                      Cut (Move)
                    </button>
                    <button 
                      disabled={!clipboard} 
                      onClick={() => { handlePaste(); setShowActionsDropdown(false); }} 
                      className={`w-full text-left px-3 py-1.5 disabled:opacity-40 disabled:hover:bg-transparent ${
                        isDarkMode ? "hover:bg-blue-600 hover:text-white disabled:hover:text-gray-400" : "hover:bg-[#007AFF] hover:text-white disabled:hover:text-gray-700"
                      }`}
                    >
                      Paste
                    </button>
                    {selectedFile && (
                      <>
                        <div className={`border-t my-1 ${isDarkMode ? "border-white/10" : "border-[#E5E5E5]"}`}></div>
                        <button onClick={() => { handleRename(selectedFile); setShowActionsDropdown(false); }} className={`w-full text-left px-3 py-1.5 ${isDarkMode ? "hover:bg-blue-600 hover:text-white" : "hover:bg-[#007AFF] hover:text-white"}`}>Rename</button>
                        <button onClick={() => { deleteFile(selectedFile.id); setShowActionsDropdown(false); }} className="w-full text-left px-3 py-1.5 text-red-500 hover:bg-red-50 hover:text-red-600">Delete</button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Search bar */}
            <div className="relative flex items-center shrink-0">
              <Search className="absolute left-2.5 text-gray-400 pointer-events-none" size={13} />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-40 pl-8 pr-2.5 py-1 text-[11px] rounded-full border transition ${
                  isDarkMode 
                    ? "bg-[#1E1E1E] border-white/10 text-white focus:bg-[#2D2D2D] focus:ring-blue-500" 
                    : "bg-[#EAEAEA] border-[#D0D0D0] text-gray-800 focus:bg-white focus:ring-blue-400"
                }`}
              />
            </div>
          </div>
        </header>

        {/* Content Pane split with Preview Pane */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          
          {/* Main Directory display */}
          <div 
            onClick={() => { setSelectedFile(null); setSelectedFiles([]); }} 
            onContextMenu={handleContainerContextMenu}
            onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
            onDragLeave={() => setIsDraggingOver(false)}
            onDrop={handleDrop}
            className={`flex-1 flex flex-col min-w-0 overflow-y-auto relative transition-colors duration-150 ${
              isDarkMode ? "bg-[#121212]" : "bg-white"
            } ${
              isDraggingOver ? "ring-4 ring-blue-400 ring-inset bg-blue-50/20 animate-pulse" : ""
            }`}
          >
            {isDraggingOver && (
              <div className="absolute inset-0 bg-blue-50/40 backdrop-blur-xs flex items-center justify-center pointer-events-none z-40">
                <div className={`p-6 rounded-2xl border-2 border-dashed shadow-xl flex flex-col items-center gap-2 ${
                  isDarkMode ? "bg-[#1E1E1E] border-blue-500 text-white" : "bg-white border-blue-400 text-gray-700"
                }`}>
                  <Download size={32} className="text-blue-500 animate-bounce" />
                  <span className="text-sm font-semibold">Drop files to copy to Finder</span>
                </div>
              </div>
            )}
            {filteredFiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
                <Folder size={48} className="mb-3 opacity-30" />
                <p className="text-[14px]">No items found</p>
              </div>
            ) : viewMode === "grid" ? (
              /* ICON / GRID VIEW */
              <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-6 p-6">
                {filteredFiles.map((file) => {
                  const isSelected = selectedFiles.some(f => f.id === file.id);
                  const isCut = isCutMode && clipboard && clipboard.some(c => c.id === file.id);
                  return (
                    <div
                      key={file.id}
                      onClick={(e) => handleFileClick(e, file)}
                      onContextMenu={(e) => handleFileContextMenu(e, file)}
                      onDoubleClick={() => handleOpenFile(file)}
                      className={`flex flex-col items-center group cursor-pointer text-center ${isCut ? "opacity-45" : ""}`}
                    >
                      <div className={`w-18 h-18 rounded-xl flex items-center justify-center p-2 mb-1.5 transition-all relative ${
                        isSelected 
                          ? (isDarkMode ? "bg-white/10 ring-2 ring-blue-500" : "bg-[#E0EEFF] ring-2 ring-[#007AFF]/30") 
                          : (isDarkMode ? "hover:bg-white/5" : "hover:bg-black/5")
                      }`}>
                        {getFileIcon(file, "w-14 h-14")}
                        {/* Custom Blue dot indicator for receipts */}
                        {file.tag === "blue" && (
                          <div className="absolute top-1 left-1 w-2.5 h-2.5 bg-blue-500 rounded-full border border-white shadow-sm" />
                        )}
                      </div>
                      <span className={`text-[11px] font-normal px-1.5 py-0.5 rounded truncate max-w-full leading-tight ${
                        isSelected 
                          ? "bg-[#007AFF] text-white" 
                          : (isDarkMode ? "text-gray-300" : "text-gray-800")
                      }`}>
                        {file.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : viewMode === "list" ? (
              /* LIST VIEW */
              <div className="flex flex-col min-w-full">
                {/* Header */}
                <div className={`flex items-center text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b px-4 py-2 sticky top-0 transition ${
                  isDarkMode ? "bg-[#121212] border-white/10" : "bg-white border-[#E5E5E5]"
                }`}>
                  <span className="flex-1 min-w-[200px]">Name</span>
                  <span className="w-40 shrink-0">Date Modified</span>
                  <span className="w-24 shrink-0 text-right pr-4">Size</span>
                  <span className="w-24 shrink-0">Kind</span>
                </div>
                {/* Rows */}
                <div className={`divide-y ${isDarkMode ? "divide-white/5" : "divide-[#F0F0F0]"}`}>
                  {filteredFiles.map((file) => {
                    const isSelected = selectedFiles.some(f => f.id === file.id);
                    const isCut = isCutMode && clipboard && clipboard.some(c => c.id === file.id);
                    return (
                      <div
                        key={file.id}
                        onClick={(e) => handleFileClick(e, file)}
                        onContextMenu={(e) => handleFileContextMenu(e, file)}
                        onDoubleClick={() => handleOpenFile(file)}
                        className={`flex items-center px-4 py-1.5 text-[12px] cursor-pointer transition ${
                          isSelected 
                            ? (isDarkMode ? "bg-white/10 text-white" : "bg-[#E0EEFF] text-[#004BB3]") 
                            : (isDarkMode ? "hover:bg-white/5 text-gray-300" : "hover:bg-[#F3F3F3]")
                        } ${isCut ? "opacity-45" : ""}`}
                      >
                        <div className="flex-1 min-w-[200px] flex items-center gap-2.5 truncate">
                          {getFileIcon(file, "w-6 h-6")}
                          {file.tag === "blue" && (
                            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                          )}
                          <span className="truncate">{file.name}</span>
                        </div>
                        <span className={`w-40 shrink-0 truncate ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{formatDate(file.date)}</span>
                        <span className={`w-24 shrink-0 text-right pr-4 truncate ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{formatFileSize(file.size)}</span>
                        <span className={`w-24 shrink-0 capitalize ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{file.type}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : viewMode === "column" ? (
              /* COLUMN VIEW */
              <div onClick={() => setSelectedFile(null)} onContextMenu={handleContainerContextMenu} className={`flex h-full divide-x min-w-max transition ${
                isDarkMode ? "divide-white/10 bg-[#121212]" : "divide-[#E5E5E5] bg-white"
              }`}>
                {/* Left column showing current files */}
                <div onClick={(e) => e.stopPropagation()} className={`w-64 overflow-y-auto p-1.5 space-y-0.5 select-none transition ${
                  isDarkMode ? "bg-[#121212]" : "bg-white"
                }`}>
                  {filteredFiles.map((file) => {
                    const isSelected = selectedFiles.some(f => f.id === file.id);
                    const isCut = isCutMode && clipboard && clipboard.some(c => c.id === file.id);
                    return (
                      <button
                        key={file.id}
                        onClick={(e) => handleFileClick(e, file)}
                        onContextMenu={(e) => handleFileContextMenu(e, file)}
                        onDoubleClick={() => handleOpenFile(file)}
                        className={`w-full flex items-center justify-between px-2.5 py-1 rounded-md text-[12px] transition-all text-left ${
                          isSelected 
                            ? "bg-[#007AFF] text-white" 
                            : (isDarkMode ? "text-gray-300 hover:bg-white/5" : "text-gray-800 hover:bg-black/5")
                        } ${isCut ? "opacity-45" : ""}`}
                      >
                        <div className="flex-center gap-2 min-w-0">
                          {getFileIcon(file, "w-5 h-5")}
                          <span className="truncate">{file.name}</span>
                        </div>
                        {file.type === "folder" && (
                          <ChevronRight size={13} className={isSelected ? "text-white" : "text-gray-400"} />
                        )}
                      </button>
                    );
                  })}
                </div>
                {/* Next preview pane if a folder is selected */}
                {selectedFile && selectedFile.type === "folder" && (
                  <div onClick={(e) => e.stopPropagation()} className={`w-64 overflow-y-auto p-4 flex flex-col items-center justify-center text-center text-gray-400 transition ${
                    isDarkMode ? "bg-[#1A1A1A]" : "bg-[#FAF9F9]"
                  }`}>
                    <Folder size={64} className="text-[#96C8FF] mb-2" />
                    <span className={`text-[13px] font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{selectedFile.name}</span>
                    <span className="text-[11px] text-gray-400 mt-1">Double click to open folder</span>
                  </div>
                )}
              </div>
            ) : (
              /* GALLERY VIEW WITH SCRUBBER */
              <div onClick={(e) => e.stopPropagation()} className={`flex-1 flex flex-col min-h-0 transition ${isDarkMode ? "bg-[#121212]" : "bg-white"}`}>
                {/* Large Preview in Center */}
                <div className="flex-1 flex items-center justify-center p-6 min-h-0">
                  {selectedFile ? (
                    <div className="max-w-full max-h-full flex flex-col items-center justify-center">
                      {selectedFile.type === "image" ? (
                        <img
                          src={selectedFile.url}
                          alt={selectedFile.name}
                          onDoubleClick={() => setPreviewImage(selectedFile)}
                          className="max-h-[300px] sm:max-h-[400px] object-contain rounded-xl shadow-lg border border-black/5 cursor-pointer"
                        />
                      ) : selectedFile.type === "video" ? (
                        <video
                          src={selectedFile.url}
                          controls
                          className="max-h-[300px] sm:max-h-[400px] rounded-xl shadow-lg border border-black/5"
                        />
                      ) : selectedFile.type === "pdf" ? (
                        <iframe
                          src={selectedFile.url}
                          title={selectedFile.name}
                          className={`w-[450px] h-[300px] sm:h-[400px] rounded-xl shadow-lg border border-black/5 ${isDragging || isResizing ? "pointer-events-none" : ""}`}
                        />
                      ) : selectedFile.type === "document" ? (
                        <div className={`w-[450px] h-[300px] sm:h-[400px] rounded-xl shadow-lg border p-6 overflow-y-auto text-left select-text ${
                          isDarkMode ? "bg-[#1A1A1A] border-white/10 text-gray-300" : "bg-white border-black/10 text-gray-800"
                        }`}>
                          <h4 className="font-bold border-b pb-2 mb-2 select-none text-[13px]">{selectedFile.name}</h4>
                          <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed">
                            {selectedFile.content || (selectedFile.url && selectedFile.url.startsWith("data:") ? decodeBase64Text(selectedFile.url) : "Welcome to macOS! This is a text file.")}
                          </pre>
                        </div>
                      ) : (
                        <div className={`w-48 h-48 rounded-2xl flex items-center justify-center shadow-inner border transition ${
                          isDarkMode ? "bg-[#1E1E1E] border-white/5" : "bg-gray-50 border-gray-200"
                        }`}>
                          {getFileIcon(selectedFile, "w-24 h-24")}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-gray-400">
                      <ImageIcon size={48} className="mx-auto mb-2 opacity-30" />
                      <p className="text-[13px]">Select a file to preview</p>
                    </div>
                  )}
                </div>

                {/* Bottom Scrubber Bar */}
                <div className={`h-20 border-t flex items-center px-4 shrink-0 overflow-x-auto relative transition ${
                  isDarkMode ? "border-white/10 bg-[#1E1E1E]" : "border-[#E5E5E5] bg-[#F9F9F9]"
                }`}>
                  <div ref={scrubberRef} className="flex gap-2 mx-auto py-1">
                    {filteredFiles.map((file) => {
                      const isSelected = selectedFiles.some(f => f.id === file.id);
                      const isCut = isCutMode && clipboard && clipboard.some(c => c.id === file.id);
                      return (
                        <div
                          key={file.id}
                          onClick={(e) => handleFileClick(e, file)}
                          onContextMenu={(e) => handleFileContextMenu(e, file)}
                          onDoubleClick={() => handleOpenFile(file)}
                          className={`w-14 h-14 rounded-lg flex items-center justify-center shrink-0 cursor-pointer border-2 transition-all p-1 ${
                            isDarkMode ? "bg-[#2A2A2A]" : "bg-white"
                          } ${
                            isSelected ? "border-[#007AFF] shadow-md scale-105" : "border-transparent opacity-70 hover:opacity-100"
                          } ${isCut ? "opacity-35" : ""}`}
                        >
                          {getFileIcon(file, "w-full h-full")}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Image/Video Lightbox (blocking center preview overlay) */}
      <AnimatePresence>
        {previewImage && (previewImage.type === "image" || previewImage.type === "video") && (
          <motion.div
            className="absolute inset-0 z-[999999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewImage(null)}
          >
            {/* Close button */}
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition animate-fade-in"
            >
              <X size={20} />
            </button>
            
            {previewImage.type === "video" ? (
              <video 
                src={previewImage.url} 
                controls 
                autoPlay
                className="max-w-[90%] max-h-[90%] object-contain rounded-lg shadow-2xl" 
                onClick={(e) => e.stopPropagation()} 
              />
            ) : (
              <motion.img
                src={previewImage.url}
                alt={previewImage.name}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="max-w-[90%] max-h-[90%] object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Custom Context Menu */}
      {contextMenu && (
        <div 
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className={`absolute border rounded-xl shadow-2xl py-1.5 z-[99999] text-[12.5px] w-56 animate-fade-in transition-all duration-150 backdrop-blur-md select-none ${
            isDarkMode 
              ? "bg-[#1C1C1E]/95 border-white/10 text-gray-200" 
              : "bg-white/95 border-gray-200/80 text-gray-800 shadow-gray-300/40"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.file ? (
            <div className="px-1 space-y-0.5">
              <button 
                onClick={() => { handleCopy(contextMenu.file); setContextMenu(null); }} 
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all text-left hover:bg-[#007AFF] hover:text-white group bg-transparent border-0 cursor-pointer"
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
                onClick={() => { handleCut(contextMenu.file); setContextMenu(null); }} 
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all text-left hover:bg-[#007AFF] hover:text-white group bg-transparent border-0 cursor-pointer"
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
                onClick={() => { handleRename(contextMenu.file); setContextMenu(null); }} 
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all text-left hover:bg-[#007AFF] hover:text-white group bg-transparent border-0 cursor-pointer"
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
                onClick={() => { deleteFile(contextMenu.file.id); setContextMenu(null); }} 
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all text-left hover:bg-red-600 hover:text-white group bg-transparent border-0 cursor-pointer"
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
          ) : (
            <div className="px-1 space-y-0.5">
              <button 
                onClick={() => { handleCreateFolder(); setContextMenu(null); }} 
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all text-left hover:bg-[#007AFF] hover:text-white group bg-transparent border-0 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    <line x1="12" y1="11" x2="12" y2="17" />
                    <line x1="9" y1="14" x2="15" y2="14" />
                  </svg>
                  <span>New Folder</span>
                </div>
                <span className="text-[10px] text-gray-400/85 group-hover:text-white/80">⇧⌘N</span>
              </button>
              <button 
                onClick={() => { handleCreateFile(); setContextMenu(null); }} 
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all text-left hover:bg-[#007AFF] hover:text-white group bg-transparent border-0 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="12" y1="18" x2="12" y2="12" />
                    <line x1="9" y1="15" x2="15" y2="15" />
                  </svg>
                  <span>New File</span>
                </div>
                <span className="text-[10px] text-gray-400/85 group-hover:text-white/80">⌘N</span>
              </button>
              {clipboard && (
                <>
                  <div className={`border-t my-1.5 ${isDarkMode ? "border-white/5" : "border-gray-200/60"}`}></div>
                  <button 
                    onClick={() => { handlePaste(); setContextMenu(null); }} 
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all text-left hover:bg-[#007AFF] hover:text-white group bg-transparent border-0 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                      </svg>
                      <span>Paste Item</span>
                    </div>
                    <span className="text-[10px] text-gray-400/85 group-hover:text-white/80">⌘V</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Custom macOS Modal Prompt Dialog */}
      <AnimatePresence>
        {modalPrompt && (
          <motion.div
            className="absolute inset-0 z-[999999] flex items-center justify-center bg-black/45 backdrop-blur-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className={`w-72 rounded-xl p-4 shadow-2xl border flex flex-col gap-3.5 select-none ${
                isDarkMode ? "bg-[#2D2D2D] border-white/10 text-white" : "bg-[#F6F6F6] border-gray-200 text-gray-800"
              }`}
            >
              <div className="text-center">
                <h3 className="text-sm font-bold">{modalPrompt.title}</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Please enter a name below:</p>
              </div>

              <input
                type="text"
                value={promptValue}
                onChange={(e) => setPromptValue(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    modalPrompt.onConfirm(promptValue);
                    setModalPrompt(null);
                  } else if (e.key === "Escape") {
                    setModalPrompt(null);
                  }
                }}
                className={`w-full px-2.5 py-1 text-xs rounded-md border outline-none focus:ring-1 focus:ring-blue-500 transition ${
                  isDarkMode 
                    ? "bg-[#1E1E1E] border-white/10 text-white" 
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />

              <div className="flex gap-2.5 text-xs font-semibold">
                <button
                  onClick={() => setModalPrompt(null)}
                  className={`flex-1 py-1.5 rounded-lg border transition ${
                    isDarkMode 
                      ? "border-white/10 hover:bg-white/5 text-gray-300" 
                      : "border-gray-200 hover:bg-gray-100 text-gray-700 bg-white"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    modalPrompt.onConfirm(promptValue);
                    setModalPrompt(null);
                  }}
                  className="flex-1 py-1.5 rounded-lg bg-[#007AFF] hover:bg-[#0062CC] active:bg-[#004BB3] text-white shadow-sm transition"
                >
                  OK
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom macOS Modal Confirm Alert Dialog */}
      <AnimatePresence>
        {modalConfirm && (
          <motion.div
            className="absolute inset-0 z-[999999] flex items-center justify-center bg-black/45 backdrop-blur-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className={`w-72 rounded-xl p-4 shadow-2xl border flex flex-col gap-3.5 select-none ${
                isDarkMode ? "bg-[#2D2D2D] border-white/10 text-white" : "bg-[#F6F6F6] border-gray-200 text-gray-800"
              }`}
            >
              <div className="text-center">
                <h3 className="text-sm font-bold">Unsaved Changes</h3>
                <p className="text-[11px] text-gray-400 mt-2 leading-relaxed px-1">{modalConfirm.message}</p>
              </div>

              <div className="flex gap-2.5 text-xs font-semibold mt-1">
                <button
                  onClick={() => setModalConfirm(null)}
                  className={`flex-1 py-1.5 rounded-lg border transition ${
                    isDarkMode 
                      ? "border-white/10 hover:bg-white/5 text-gray-300" 
                      : "border-gray-200 hover:bg-gray-100 text-gray-700 bg-white"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    modalConfirm.onConfirm();
                    setModalConfirm(null);
                  }}
                  className="flex-1 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white shadow-sm transition"
                >
                  Close anyway
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
