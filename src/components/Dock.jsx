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
  return dockApp?.icon || "https://s3-new.macosicons.com/macosicons/parse/MacOS_Default_Folder_icon_GecwaBmkFQ_lowResPng-6d37abc4ac.png";
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

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      icon: "https://s3-new.macosicons.com/macosicons/parse/Launchpad__MacOS_Tahoe__ncy8MiCAOA_lowResPng-ffd58d03cd.png",
      comp: <Launchpad />,
    },
    {
      id: "Safari",
      label: "Safari",
      icon: "https://s3-new.macosicons.com/macosicons/parse/Safari__MacOS_Tahoe__utug9Rt8g6_lowResPng-e86f84b6e9.png",
      comp: <Safari />,
    },
    {
      id: "Messages",
      label: "Messages",
      icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Messages_macOS_Golden_Gate_ow94O6GAvP-2934473a5d.png",
      comp: <Messages />,
    },
    {
      id: "Mail",
      label: "Mail",
      icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Mail_macOS_Golden_Gate_3BIjmD3GZM-ae5977fd03.png",
      comp: <Mail />,
    },
    {
       id: "Maps",
       label: "Maps",
       icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Maps_macOS_Golden_Gate_jOxvDFgSHw-b6ceac8cd4.png",
       comp: <Maps />,
    },
    {
      id: "Photos",
      label: "Photos",
      icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Photos_macOS_Golden_Gate_mxVHKSuSHM-06d7e83102.png",
      comp: <MacGallery />,
    },
    {
      id: "FaceTime",
      label: "FaceTime",
      icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Facetime_macOS_Golden_Gate_Qxnt8DtlwP-e0839d42d8.png",
      comp: <FaceTime />,
    },
    {
      id: "Phone",
      label: "Phone",
      icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Phone_macOS_Golden_Gate_NWKA493TFf-bffc4d8efc.png",
      comp: <PhoneApp />,
    },
    {
      id: "Calendar",
      label: "Calendar",
      icon: "https://s3-new.macosicons.com/macosicons/parse/Calender_25y2FI4DUz_lowResPng-d649f6c721.png",
      comp: <CalendarApp />,
    },
    {
      id: "Contacts",
      label: "Contacts",
      icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Contacts_macOS_Golden_Gate_oKWnz3UDu6-20ba74faaf.png",
      comp: <ContactsApp />,
    },
    {
      id: "Notes",
      label: "Notes",
      icon: "https://s3-new.macosicons.com/macosicons/parse/Notes__MacOS_Tahoe__Tn8SuaHtAM_lowResPng-632fb908b1.png",
      comp: <Blogs />,
    },
    {
      id: "Reminders",
      label: "Reminders",
      icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Reminders_macOS_Golden_Gate_EVBkfKEpyn-b296bae148.png",
      comp: <RemindersApp />,
    },
    {
      id: "Music",
      label: "Music",
      icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Music_macOS_Golden_Gate_LJox0IObSI-d626e3640a.png",
      comp: <Spotify />,
    },
    {
      id: "Podcasts",
      label: "Podcasts",
      icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Podcasts_macOS_Golden_Gate_PLHwgdc3Fl-4abdcae811.png",
      action: () => {},
    },
    {
      id: "TV",
      label: "TV",
      icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_TV_macOS_Golden_Gate_j8weRAj4mw-f0424494f0.png",
      action: () => {},
    },
    {
      id: "AppStore",
      label: "App Store",
      icon: "https://s3-new.macosicons.com/macosicons/parse/App_Store__MacOS_Tahoe__ZTpqalXxE3_lowResPng-b755fc1237.png",
      action: () => {},
    },
    {
      id: "Pages",
      label: "Pages",
      icon: "https://s3-new.macosicons.com/macosicons/parse/Pages__Apple_Creative_Studio__hHeqYyTXZ3_lowResPng-7a5fbcd210.png",
      action: () => {},
    },
    {
      id: "Numbers",
      label: "Numbers",
      icon: "https://s3-new.macosicons.com/macosicons/parse/Numbers__Apple_Creative_Studio__pfooNXbNnX_lowResPng-665922f586.png",
      action: () => {},
    },
    {
      id: "Keynote",
      label: "Keynote",
      icon: "https://s3-new.macosicons.com/macosicons/parse/Keynote__Apple_Creative_Studio__SlTcHVkQP5_lowResPng-aac0878b95.png",
      action: () => {},
    },
    {
      id: "Settings",
      label: "Settings",
      icon: "https://s3-new.macosicons.com/macosicons/parse/low_res_Settings_macOS_Golden_Gate_iR77bVvZBc-502ef0dc70.png",
      comp: <Settings />,
    },
    { divider: true },
    {
      id: "Github",
      label: "GitHub",
      icon: "https://s3-new.macosicons.com/macosicons/parse/GitHub_mm0mJOQEAS_lowResPng-6e5b90d2c7.png",
      url: "https://github.com/LikhithSP",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      icon: "https://s3-new.macosicons.com/macosicons/parse/LinkedIn_ZcwY6Altec_lowResPng-59b3305d8f.png",
      url: "https://www.linkedin.com/in/likhithsp/",
    },
    { divider: true },
    {
      id: "Folder",
      label: "Folder",
      icon: "https://s3-new.macosicons.com/macosicons/parse/MacOS_Default_Folder_icon_GecwaBmkFQ_lowResPng-6d37abc4ac.png",
      action: () => {},
    },
    {
      id: "Trash",
      label: "Trash",
      icon: hasTrashedItems
        ? "https://s3.macosicons.com/macosicons/icons/yrypldfXBR/lowResPngFile_c3be764d323d03b2ce9921be92216fca_yrypldfXBR.png"
        : "https://s3-new.macosicons.com/macosicons/parse/Bin_Empty_Tahoe_x2cZW1cg7Y_lowResPng-cc516d2e3c.png",
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

  // On mobile, keep magnification subtle or off to prevent touch jank
  const getIconScale = (index) => {
    if (hoveredIndex === null || isMobile) return 1;
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
    }, 120);
  };

  return (
    <div
      className="motion-smooth absolute bottom-1 left-1/2 -translate-x-1/2 flex items-end px-1 sm:px-1.5 py-1 rounded-2xl h-[48px] sm:h-[56px] max-w-[calc(100vw-12px)] overflow-x-auto overflow-y-visible dock-scrollbar transition-all duration-200 z-[99999]"
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
      <div className="flex items-end gap-0.5 sm:gap-1 px-1 min-w-max h-full">
        {apps.map((app, index) => {
          if (app.divider)
            return (
              <div
                key={index}
                className="w-px bg-white/20 rounded-full mx-0.5 self-stretch my-1 shrink-0"
              />
            );

          const scale = getIconScale(index);
          const baseSize = isMobile ? 36 : 48; // Compact 36px on mobile, 48px on desktop
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
                cursor-pointer shrink-0
                ${bouncingAppId === app.id ? "animate-bounceOnce" : ""}
              `}
              style={{
                transformOrigin: "bottom center",
                marginBottom: !isMobile && hoveredIndex !== null ? `${(scale - 1) * 20}px` : "0px",
                transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)"
              }}
            >
              {/* Tooltip / Window Previews - positioned above each icon (hidden on small mobile screens to prevent clutter) */}
              {!isMobile && hoveredApp?.id === app.id && (
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
    </div>
  );
}
