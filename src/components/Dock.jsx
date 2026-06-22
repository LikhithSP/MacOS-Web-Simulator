import React, { useState, useRef, useEffect } from "react";
import { useAppStore } from "../store/Appstore.js";
import { Safari } from "../app/Safari";
import Spotify from "../app/Spotify";
import Settings from "../app/Settings";
import MacGallery from "../app/Gallary";
import ContactsApp from "../app/Contacts";
import Blogs from "../app/Blogs/BlogsSection.jsx";
import Finder from "../app/Finder";
import Trash from "../app/Trash";
import Launchpad from "../app/Launchpad";
import Messages from "../app/Messages";
import Mail from "../app/Mail";
import Maps from "../app/Maps";
import FaceTime from "../app/FaceTime";
import PhoneApp from "../app/Phone";
import CalendarApp from "../app/Calendar";
import RemindersApp from "../app/Reminders";

import { GlassSurface } from "./ui/glass-surface";

const getWindowTitle = (win) => {
  if (win.appId === "TextEdit") {
    return win.component?.props?.file?.name || "untitled.txt";
  }
  if (win.appId === "PDFViewer") {
    return win.component?.props?.file?.name || "document.pdf";
  }
  if (win.appId === "Finder") {
    const path = win.component?.props?.initialPath || "/icloud";
    const segment = path.split("/").pop();
    return `Finder (${segment || "Home"})`;
  }
  return win.appId;
};

const getWindowIcon = (win, apps) => {
  if (win.appId === "Finder") {
    return "https://upload.wikimedia.org/wikipedia/commons/c/c9/Finder_Icon_macOS_Big_Sur.png";
  }
  if (win.appId === "TextEdit") {
    return "https://s3.macosicons.com/macosicons/icons/aExwB3ULuk/lowResPngFile_a819aac512e7261fee3310f1bbdaada7_aExwB3ULuk.png";
  }
  if (win.appId === "PDFViewer") {
    return "https://s3.macosicons.com/macosicons/icons/ayIhAsqzsY/lowResPngFile_55b757e27580fefb9bd856a23abf6d0f_low_res_Pdf_Document.png";
  }
  const dockApp = apps?.find((a) => a.id === win.appId);
  return dockApp?.icon || "https://s3.macosicons.com/macosicons/icons/B1JLHCpe08/lowResPngFile_11113cc80977b7c9417ce4fb349cbd35_low_res_Folder_Common.png";
};

export default function Dock() {
  const openApp = useAppStore((s) => s.openApp);
  const windows = useAppStore((s) => s.windows);
  const restoreApp = useAppStore((s) => s.restoreApp);
  const focusApp = useAppStore((s) => s.focusApp);
  const closeApp = useAppStore((s) => s.closeApp);
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  const [hoveredApp, setHoveredApp] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [bouncingAppId, setBouncingAppId] = useState(null);

  const leaveTimeoutRef = useRef(null);

  const [hasTrashedItems, setHasTrashedItems] = useState(() => {
    try {
      const saved = localStorage.getItem("os_trash");
      return saved ? JSON.parse(saved).length > 0 : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handleTrashUpdated = (e) => {
      setHasTrashedItems(e.detail.hasFiles);
    };
    
    // Also listen to Finder deleting file directly (as back up / instant refresh)
    const handleFileTrashed = () => {
      setHasTrashedItems(true);
    };

    window.addEventListener("os_trash_updated", handleTrashUpdated);
    window.addEventListener("os_file_trash", handleFileTrashed);
    return () => {
      window.removeEventListener("os_trash_updated", handleTrashUpdated);
      window.removeEventListener("os_file_trash", handleFileTrashed);
    };
  }, []);

  const handleMouseLeave = () => {
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    leaveTimeoutRef.current = setTimeout(() => {
      setHoveredApp(null);
      setHoveredIndex(null);
    }, 250);
  };

  const handleMouseEnterIcon = (app, index) => {
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    setHoveredApp(app);
    setHoveredIndex(index);
  };

  useEffect(() => {
    return () => {
      if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    };
  }, []);

  const apps = [
    {
      id: "Finder",
      label: "Finder",
      icon: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Finder_Icon_macOS_Big_Sur.png",
      comp: <Finder />,
    },
    {
      id: "Launchpad",
      label: "Launchpad",
      icon: "https://s3.macosicons.com/macosicons/icons/ncy8MiCAOA/lowResPngFile_0f531e205b4ebaf7ab0b01d1bd6040cb_low_res_Launchpad__MacOS_Tahoe_.png",
      comp: <Launchpad />,
    },
    {
      id: "Safari",
      label: "Safari",
      icon: "https://s3.macosicons.com/macosicons/icons/utug9Rt8g6/lowResPngFile_a0b8d534889b5695781a9a03f388e2d4_low_res_Safari__MacOS_Tahoe_.png",
      comp: <Safari />,
    },
    {
      id: "Messages",
      label: "Messages",
      icon: "https://s3.macosicons.com/macosicons/icons/DCoou8JdsT/lowResPngFile_82dcd5dc896ad17021f25d236b575d68_DCoou8JdsT.png",
      comp: <Messages />,
    },
    {
      id: "Mail",
      label: "Mail",
      icon: "https://s3.macosicons.com/macosicons/icons/OABVbEbk1D/lowResPngFile_1b3cda920534d66fcf25849afdeee35b_low_res_Mail__MacOS_Tahoe_.png",
      comp: <Mail />,
    },
    {
       id: "Maps",
       label: "Maps",
       icon: "https://s3.macosicons.com/macosicons/icons/5aA6m3BXxr/lowResPngFile_a3b2511cb67879107a0b6da86c3d1dc5_low_res_Maps__MacOS_Tahoe_.png",
       comp: <Maps />,
    },
    {
      id: "Photos",
      label: "Photos",
      icon: "https://s3.macosicons.com/macosicons/icons/GnoLTHQNAZ/lowResPngFile_f4e3bd7d0753d890bb3b53e3ea193cfe_low_res_Photos__MacOS_Tahoe_.png",
      comp: <MacGallery />,
    },
    {
      id: "FaceTime",
      label: "FaceTime",
      icon: "https://s3.macosicons.com/macosicons/icons/E0Ws4w1yiC/lowResPngFile_b04a7c53fd9f231f804bd3261bcb6430_low_res_Facetime.png",
      comp: <FaceTime />,
    },
    {
      id: "Phone",
      label: "Phone",
      icon: "https://s3.macosicons.com/macosicons/icons/Ji1iUu6nEa/lowResPngFile_e783299046843b81979c158cefcacf46_Ji1iUu6nEa.png",
      comp: <PhoneApp />,
    },
    {
      id: "Calendar",
      label: "Calendar",
      icon: "https://s3.macosicons.com/macosicons/icons/4GkFHZIM7u/lowResPngFile_d5fa0dee2f905f35c1467503869f42d8_4GkFHZIM7u.png",
      comp: <CalendarApp />,
    },
    {
      id: "Contacts",
      label: "Contacts",
      icon: "https://s3.macosicons.com/macosicons/icons/qxxJOsedmH/lowResPngFile_e03dd92dadf694dbe1b0ca0ad69d53d8_qxxJOsedmH.png",
      comp: <ContactsApp />,
    },
    {
      id: "Notes",
      label: "Notes",
      icon: "https://s3.macosicons.com/macosicons/icons/Tn8SuaHtAM/lowResPngFile_2a846d9fb757a742e6ab7ec9b243027e_low_res_Notes__MacOS_Tahoe_.png",
      comp: <Blogs />,
    },
    {
      id: "Reminders",
      label: "Reminders",
      icon: "https://s3.macosicons.com/macosicons/icons/uFtsFtU4uA/lowResPngFile_68881de178401c6820d597d688105fea_low_res_Reminders__MacOS_Tahoe_.png",
      comp: <RemindersApp />,
    },
    {
      id: "Music",
      label: "Music",
      icon: "https://s3.macosicons.com/macosicons/icons/60EVxS5XYc/lowResPngFile_43fc64dd49d0125e9b34d1d49204cafb_low_res_Music__MacOS_Tahoe_.png",
      comp: <Spotify />,
    },
    {
      id: "Podcasts",
      label: "Podcasts",
      icon: "https://s3.macosicons.com/macosicons/icons/ke09iVGIts/lowResPngFile_9c4c56c407f28786a1e3b520d15581bd_low_res_Podcasts.png",
      action: () => {},
    },
    {
      id: "TV",
      label: "TV",
      icon: "https://s3.macosicons.com/macosicons/icons/AMBfkU1HCk/lowResPngFile_859f7d5d82c4ab0ab61c4f5c54a4e128_low_res_TV.png",
      action: () => {},
    },
    {
      id: "AppStore",
      label: "App Store",
      icon: "https://s3.macosicons.com/macosicons/icons/ZTpqalXxE3/lowResPngFile_8f0aba462304996c37f9f506b368c53b_low_res_App_Store__MacOS_Tahoe_.png",
      action: () => {},
    },
    {
      id: "Pages",
      label: "Pages",
      icon: "https://s3.macosicons.com/macosicons/icons/yS4ZGNMHPE/lowResPngFile_a972c71f10ce8c450b90fceeac2cff24_low_res_Pages__Default___macOS_26.2__.png",
      action: () => {},
    },
    {
      id: "Numbers",
      label: "Numbers",
      icon: "https://s3.macosicons.com/macosicons/icons/orUYyfFrkH/lowResPngFile_9a2fdc6e0cdc4be97c385da2f582d669_low_res_Numbers__Default___macOS_26.2__.png",
      action: () => {},
    },
    {
      id: "Keynote",
      label: "Keynote",
      icon: "https://s3.macosicons.com/macosicons/icons/SlTcHVkQP5/lowResPngFile_a298aca968f43febc06df474aefb8eb5_low_res_Keynote__Apple_Creative_Studio_.png",
      action: () => {},
    },
    {
      id: "Settings",
      label: "Settings",
      icon: "https://s3.macosicons.com/macosicons/icons/mTHdx8YStT/lowResPngFile_4fc1a86ec5cb831e11c424f412b8da37_low_res_Settings.png",
      comp: <Settings />,
    },
    { divider: true },
    {
      id: "Github",
      label: "GitHub",
      icon: "https://s3.macosicons.com/macosicons/icons/AhTpsJCAbn/lowResPngFile_f024fedc7c28b04afb3e45d69ad10be2_low_res_GitHub_Desktop__clear__dark_.png",
      url: "https://github.com/LikhithSP",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      icon: "https://s3.macosicons.com/macosicons/icons/ZcwY6Altec/lowResPngFile_51f93886aae8020c24a499a78bc19be3_low_res_LinkedIn.png",
      url: "https://www.linkedin.com/in/likhithsp/",
    },
    { divider: true },
    {
      id: "Folder",
      label: "Folder",
      icon: "https://s3.macosicons.com/macosicons/icons/B1JLHCpe08/lowResPngFile_11113cc80977b7c9417ce4fb349cbd35_low_res_Folder_Common.png",
      action: () => {},
    },
    {
      id: "Trash",
      label: "Trash",
      icon: hasTrashedItems
        ? "https://s3.macosicons.com/macosicons/icons/yrypldfXBR/lowResPngFile_c3be764d323d03b2ce9921be92216fca_yrypldfXBR.png"
        : "https://s3.macosicons.com/macosicons/icons/lVRgezRq9O/lowResPngFile_0c8fd7da19979a71c397f82b7764f8df_lVRgezRq9O.png",
      comp: <Trash />,
    },
  ];

  // Check if an app is currently open
  const isAppOpen = (appId) => {
    if (appId === "Finder") {
      return windows.some((w) => w.appId === "Finder" || w.appId === "TextEdit" || w.appId === "PDFViewer");
    }
    return windows.some((w) => w.appId === appId);
  };
  
  // Check if an app is minimized
  const isAppMinimized = (appId) => windows.some((w) => w.appId === appId && w.minimized);

  // Calculate icon size based on distance from hovered icon (macOS magnification effect)
  const getIconScale = (index) => {
    if (hoveredIndex === null) return 1;
    const distance = Math.abs(index - hoveredIndex);
    if (distance === 0) return 1.15;
    if (distance === 1) return 1.08;
    if (distance === 2) return 1.03;
    return 1;
  };

  const handleAppClick = (app) => {
    setBouncingAppId(app.id);

    setTimeout(() => {
      if (app.url) {
        window.open(app.url, "_blank");
      } else if (app.action) {
        app.action();
      } else {
        // Check if app is already open
        const existingWindow = windows.find((w) => w.appId === app.id);
        if (existingWindow) {
          if (existingWindow.minimized) {
            // Restore minimized app
            restoreApp(existingWindow.id);
          } else {
            // Focus existing app
            focusApp(existingWindow.id);
          }
        } else {
          // Open new app
          openApp(app.id, app.comp);
        }
      }
      setBouncingAppId(null);
    }, 200);
  };

  return (
    <div
      className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-end px-1 py-1 rounded-2xl h-[56px] overflow-visible transition-all duration-300 z-[99999]"
      onMouseLeave={handleMouseLeave}
    >
      <GlassSurface
        tint={isDarkMode ? 0.05 : 0.02}
        radius={16}
        blur={20}
        chroma={0.1}
        specular={false}
        className="absolute inset-0 -z-10"
      />
      {apps.map((app, index) => {
        if (app.divider)
          return (
            <div
              key={index}
              className="w-px bg-white/20 rounded-full mx-0.5 self-stretch my-1"
            />
          );

        const scale = getIconScale(index);
        const baseSize = 48; // Base icon size in pixels
        const iconSize = baseSize * scale;
        const appWindows = windows.filter((w) => {
          if (app.id === "Finder") {
            return w.appId === "Finder" || w.appId === "TextEdit" || w.appId === "PDFViewer";
          }
          return w.appId === app.id;
        });
        const hasWindows = appWindows.length > 0;

        return (
          <div
            key={app.id}
            onMouseEnter={() => handleMouseEnterIcon(app, index)}
            onClick={() => handleAppClick(app)}
            className={`
              relative
              flex flex-col items-center justify-end
              cursor-pointer
              ${bouncingAppId === app.id ? "animate-bounceOnce" : ""}
            `}
            style={{
              transformOrigin: "bottom center",
              marginBottom: hoveredIndex !== null ? `${(scale - 1) * 20}px` : "0px",
              transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)"
            }}
          >
            {/* Tooltip / Window Previews - positioned above each icon */}
            {hoveredApp?.id === app.id && (
              (hasWindows && app.id === "Finder") ? (
                <div
                  className="
                    absolute -top-[140px] left-1/2 -translate-x-1/2
                    flex gap-3 p-3 rounded-xl
                    bg-gray-950/90 text-white shadow-2xl
                    backdrop-blur-xl pointer-events-auto
                    animate-fadeSlide z-50
                    border border-white/10 min-w-[150px]
                  "
                  onClick={(e) => e.stopPropagation()}
                  onMouseEnter={() => {
                    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
                  }}
                  onMouseLeave={handleMouseLeave}
                >
                  {appWindows.map((win) => {
                    const title = getWindowTitle(win);
                    const iconUrl = getWindowIcon(win, apps);
                    return (
                      <div
                        key={win.id}
                        onClick={() => {
                          restoreApp(win.id);
                          focusApp(win.id);
                        }}
                        className={`
                          relative group/preview flex flex-col items-center gap-1.5 p-2 rounded-lg 
                          transition duration-150 cursor-pointer min-w-[95px] max-w-[130px]
                          ${win.minimized ? "bg-white/5 opacity-75 hover:opacity-100 hover:bg-white/10" : "bg-white/10 hover:bg-white/15"}
                        `}
                      >
                        {/* Miniature window mockup */}
                        <div className="w-16 h-12 rounded bg-black/40 flex items-center justify-center relative shadow-inner border border-white/5">
                          <img src={iconUrl} alt="" className="w-8 h-8 object-contain" />
                          {win.minimized && (
                            <span className="absolute bottom-1 right-1 text-[8px] bg-yellow-500/80 text-black px-1 rounded font-semibold scale-90">min</span>
                          )}
                        </div>
                        
                        {/* Title */}
                        <span className="text-[10px] font-medium text-center truncate w-full text-gray-300 group-hover/preview:text-white px-0.5">
                          {title}
                        </span>

                        {/* Close button on hover */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            closeApp(win.id);
                          }}
                          className="
                            absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500/90 text-white 
                            flex items-center justify-center text-[10px] font-bold shadow-md opacity-0 
                            group-hover/preview:opacity-100 transition-opacity hover:bg-red-600
                          "
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                  <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-gray-955/90 rotate-45 border-r border-b border-white/10" />
                </div>
              ) : (
                <div
                  className="
                    absolute -top-9
                    px-3 py-1 rounded-md
                    bg-gray-900/95 text-white shadow-xl
                    text-xs font-medium backdrop-blur-xl
                    animate-fadeSlide pointer-events-none
                    whitespace-nowrap z-50
                    border border-white/10
                  "
                >
                  {app.label}
                  <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-gray-900/95 rotate-45 border-r border-b border-white/10" />
                </div>
              )
            )}
            
            <div
              className="
                rounded-xl
                flex items-center justify-center
                overflow-hidden
              "
              style={{
                width: `${iconSize}px`,
                height: `${iconSize}px`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)"
              }}
            >
              <img
                src={app.icon}
                alt={app.label}
                className="w-full h-full object-cover rounded-xl"
                draggable={false}
              />
            </div>
            
            {/* Dot indicator for open apps */}
            {isAppOpen(app.id) && (
              <div 
                className="absolute -bottom-0.5 w-1 h-1 bg-white/90 rounded-full"
                style={{
                  boxShadow: "0 0 4px rgba(255,255,255,0.6)"
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
