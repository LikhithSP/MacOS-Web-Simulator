import React, { useState } from "react";
import { useAppStore } from "../store/Appstore.js";
import { Safari } from "../app/Safari";
import Spotify from "../app/Spotify";
import Settings from "../app/Settings";
import MacGallery from "../app/Gallary";
import Blogs from "../app/Blogs/BlogsSection.jsx";
import Finder from "../app/Finder";
import Trash from "../app/Trash";

export default function Dock() {
  const openApp = useAppStore((s) => s.openApp);
  const windows = useAppStore((s) => s.windows);
  const restoreApp = useAppStore((s) => s.restoreApp);
  const focusApp = useAppStore((s) => s.focusApp);
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  const [hoveredApp, setHoveredApp] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [bouncingAppId, setBouncingAppId] = useState(null);

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
      action: () => {}, // Placeholder
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
      action: () => {},
    },
    {
      id: "Mail",
      label: "Mail",
      icon: "https://s3.macosicons.com/macosicons/icons/OABVbEbk1D/lowResPngFile_1b3cda920534d66fcf25849afdeee35b_low_res_Mail__MacOS_Tahoe_.png",
      action: () => {},
    },
    {
      id: "Maps",
      label: "Maps",
      icon: "https://s3.macosicons.com/macosicons/icons/5aA6m3BXxr/lowResPngFile_a3b2511cb67879107a0b6da86c3d1dc5_low_res_Maps__MacOS_Tahoe_.png",
      url: "https://maps.apple.com",
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
      action: () => {},
    },
    {
      id: "Phone",
      label: "Phone",
      icon: "https://s3.macosicons.com/macosicons/icons/Ji1iUu6nEa/lowResPngFile_e783299046843b81979c158cefcacf46_Ji1iUu6nEa.png",
      action: () => {},
    },
    {
      id: "Calendar",
      label: "Calendar",
      icon: "https://s3.macosicons.com/macosicons/icons/4GkFHZIM7u/lowResPngFile_d5fa0dee2f905f35c1467503869f42d8_4GkFHZIM7u.png",
      action: () => {},
    },
    {
      id: "Contacts",
      label: "Contacts",
      icon: "https://s3.macosicons.com/macosicons/icons/qxxJOsedmH/lowResPngFile_e03dd92dadf694dbe1b0ca0ad69d53d8_qxxJOsedmH.png",
      action: () => {},
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
      action: () => {},
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
      icon: "https://s3.macosicons.com/macosicons/icons/lVRgezRq9O/lowResPngFile_0c8fd7da19979a71c397f82b7764f8df_lVRgezRq9O.png",
      comp: <Trash />,
    },
  ];

  // Check if an app is currently open
  const isAppOpen = (appId) => windows.some((w) => w.appId === appId);
  
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
      className={`
        absolute bottom-1 left-1/2 -translate-x-1/2
        flex items-end
        px-1 py-1 rounded-2xl
        backdrop-blur-sm
        h-[56px] overflow-visible
        border transition-all duration-300
        ${isDarkMode ? 'border-white/10' : 'border-white/20'}
      `}
      style={{ 
        background: isDarkMode ? "rgba(0, 0, 0, 0.45)" : "rgba(0, 0, 0, 0.02)",
        boxShadow: isDarkMode 
          ? "0 10px 40px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.05)" 
          : "0 10px 40px rgba(0,0,0,0.2), inset 0 0 0 1px rgba(255,255,255,0.1)"
      }}
      onMouseLeave={() => {
        setHoveredApp(null);
        setHoveredIndex(null);
      }}
    >
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

        return (
          <div
            key={app.id}
            onMouseEnter={() => {
              setHoveredApp(app);
              setHoveredIndex(index);
            }}
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
            {/* Tooltip - positioned above each icon */}
            {hoveredApp?.id === app.id && (
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
