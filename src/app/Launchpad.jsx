import React, { useState } from "react";
import { useAppStore } from "../store/Appstore";
import { LayoutGrid, ChevronDown, Plus } from "lucide-react";
import { Safari } from "./Safari";
import Spotify from "./Spotify";
import Settings from "./Settings";
import MacGallery from "./Gallary";
import Blogs from "./Blogs/BlogsSection.jsx";
import Finder from "./Finder";
import Trash from "./Trash";
import FaceTime from "./FaceTime";
import PhoneApp from "./Phone";
import CalendarApp from "./Calendar";
import ContactsApp from "./Contacts";

// Traffic lights component
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
          <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <div
        className="w-3 h-3 bg-[#febc2e] rounded-full cursor-pointer flex items-center justify-center hover:bg-[#ff9500] transition-all duration-150 shadow-sm"
        onClick={() => minimize(windowId)}
        title="Minimize"
      >
        <svg className="w-1.5 h-1.5 text-[#9a6400] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 10 10">
          <path d="M1 5H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
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
              <rect x="1.5" y="3.5" width="5" height="5" fill="none" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M3.5 3.5V1.5H8.5V6.5H6.5" fill="none" stroke="currentColor" strokeWidth="1.2"/>
            </>
          ) : (
            <>
              <path d="M1 1L4 4M1 1V3.5M1 1H3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M9 9L6 6M9 9V6.5M9 9H6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </>
          )}
        </svg>
      </div>
    </div>
  );
};

export default function Launchpad({ windowId }) {
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  const openApp = useAppStore((s) => s.openApp);
  const windows = useAppStore((s) => s.windows);
  const restoreApp = useAppStore((s) => s.restoreApp);
  const focusApp = useAppStore((s) => s.focusApp);

  const [expandedSections, setExpandedSections] = useState({
    suggestions: false,
    productivity: false,
    creativity: false,
    info: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleLaunch = (app) => {
    if (app.url) {
      window.open(app.url, "_blank");
    } else {
      const existingWindow = windows.find((w) => w.appId === app.appId);
      if (existingWindow) {
        if (existingWindow.minimized) {
          restoreApp(existingWindow.id);
        } else {
          focusApp(existingWindow.id);
        }
      } else {
        openApp(app.appId, app.comp);
      }
    }
  };

  const allApps = [
    {
      appId: "Finder",
      label: "Finder",
      icon: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Finder_Icon_macOS_Big_Sur.png",
      comp: <Finder />,
    },
    {
      appId: "Safari",
      label: "Safari",
      icon: "https://s3.macosicons.com/macosicons/icons/utug9Rt8g6/lowResPngFile_a0b8d534889b5695781a9a03f388e2d4_low_res_Safari__MacOS_Tahoe_.png",
      comp: <Safari />,
    },
    {
      appId: "Messages",
      label: "Messages",
      icon: "https://s3.macosicons.com/macosicons/icons/DCoou8JdsT/lowResPngFile_82dcd5dc896ad17021f25d236b575d68_DCoou8JdsT.png",
    },
    {
      appId: "Mail",
      label: "Mail",
      icon: "https://s3.macosicons.com/macosicons/icons/OABVbEbk1D/lowResPngFile_1b3cda920534d66fcf25849afdeee35b_low_res_Mail__MacOS_Tahoe_.png",
    },
    {
      appId: "Maps",
      label: "Maps",
      icon: "https://s3.macosicons.com/macosicons/icons/5aA6m3BXxr/lowResPngFile_a3b2511cb67879107a0b6da86c3d1dc5_low_res_Maps__MacOS_Tahoe_.png",
      url: "https://maps.apple.com",
    },
    {
      appId: "Photos",
      label: "Photos",
      icon: "https://s3.macosicons.com/macosicons/icons/GnoLTHQNAZ/lowResPngFile_f4e3bd7d0753d890bb3b53e3ea193cfe_low_res_Photos__MacOS_Tahoe_.png",
      comp: <MacGallery />,
    },
    {
      appId: "FaceTime",
      label: "FaceTime",
      icon: "https://s3.macosicons.com/macosicons/icons/E0Ws4w1yiC/lowResPngFile_b04a7c53fd9f231f804bd3261bcb6430_low_res_Facetime.png",
      comp: <FaceTime />,
    },
    {
      appId: "Phone",
      label: "Phone",
      icon: "https://s3.macosicons.com/macosicons/icons/Ji1iUu6nEa/lowResPngFile_e783299046843b81979c158cefcacf46_Ji1iUu6nEa.png",
      comp: <PhoneApp />,
    },
    {
      appId: "Calendar",
      label: "Calendar",
      icon: "https://s3.macosicons.com/macosicons/icons/4GkFHZIM7u/lowResPngFile_d5fa0dee2f905f35c1467503869f42d8_4GkFHZIM7u.png",
      comp: <CalendarApp />,
    },
    {
      appId: "Contacts",
      label: "Contacts",
      icon: "https://s3.macosicons.com/macosicons/icons/qxxJOsedmH/lowResPngFile_e03dd92dadf694dbe1b0ca0ad69d53d8_qxxJOsedmH.png",
      comp: <ContactsApp />,
    },
    {
      appId: "Notes",
      label: "Notes",
      icon: "https://s3.macosicons.com/macosicons/icons/Tn8SuaHtAM/lowResPngFile_2a846d9fb757a742e6ab7ec9b243027e_low_res_Notes__MacOS_Tahoe_.png",
      comp: <Blogs />,
    },
    {
      appId: "Reminders",
      label: "Reminders",
      icon: "https://s3.macosicons.com/macosicons/icons/uFtsFtU4uA/lowResPngFile_68881de178401c6820d597d688105fea_low_res_Reminders__MacOS_Tahoe_.png",
    },
    {
      appId: "Music",
      label: "Music",
      icon: "https://s3.macosicons.com/macosicons/icons/60EVxS5XYc/lowResPngFile_43fc64dd49d0125e9b34d1d49204cafb_low_res_Music__MacOS_Tahoe_.png",
      comp: <Spotify />,
    },
    {
      appId: "Podcasts",
      label: "Podcasts",
      icon: "https://s3.macosicons.com/macosicons/icons/ke09iVGIts/lowResPngFile_9c4c56c407f28786a1e3b520d15581bd_low_res_Podcasts.png",
    },
    {
      appId: "TV",
      label: "TV",
      icon: "https://s3.macosicons.com/macosicons/icons/AMBfkU1HCk/lowResPngFile_859f7d5d82c4ab0ab61c4f5c54a4e128_low_res_TV.png",
    },
    {
      appId: "AppStore",
      label: "App Store",
      icon: "https://s3.macosicons.com/macosicons/icons/ZTpqalXxE3/lowResPngFile_8f0aba462304996c37f9f506b368c53b_low_res_App_Store__MacOS_Tahoe_.png",
    },
    {
      appId: "Pages",
      label: "Pages",
      icon: "https://s3.macosicons.com/macosicons/icons/yS4ZGNMHPE/lowResPngFile_a972c71f10ce8c450b90fceeac2cff24_low_res_Pages__Default___macOS_26.2__.png",
    },
    {
      appId: "Numbers",
      label: "Numbers",
      icon: "https://s3.macosicons.com/macosicons/icons/orUYyfFrkH/lowResPngFile_9a2fdc6e0cdc4be97c385da2f582d669_low_res_Numbers__Default___macOS_26.2__.png",
    },
    {
      appId: "Keynote",
      label: "Keynote",
      icon: "https://s3.macosicons.com/macosicons/icons/SlTcHVkQP5/lowResPngFile_a298aca968f43febc06df474aefb8eb5_low_res_Keynote__Apple_Creative_Studio_.png",
    },
    {
      appId: "Settings",
      label: "Settings",
      icon: "https://s3.macosicons.com/macosicons/icons/mTHdx8YStT/lowResPngFile_4fc1a86ec5cb831e11c424f412b8da37_low_res_Settings.png",
      comp: <Settings />,
    },
    {
      appId: "Github",
      label: "GitHub",
      icon: "https://s3.macosicons.com/macosicons/icons/AhTpsJCAbn/lowResPngFile_f024fedc7c28b04afb3e45d69ad10be2_low_res_GitHub_Desktop__clear__dark_.png",
      url: "https://github.com/LikhithSP",
    },
    {
      appId: "linkedin",
      label: "LinkedIn",
      icon: "https://s3.macosicons.com/macosicons/icons/ZcwY6Altec/lowResPngFile_51f93886aae8020c24a499a78bc19be3_low_res_LinkedIn.png",
      url: "https://www.linkedin.com/in/likhithsp/",
    },
    {
      appId: "Trash",
      label: "Trash",
      icon: "https://s3.macosicons.com/macosicons/icons/lVRgezRq9O/lowResPngFile_0c8fd7da19979a71c397f82b7764f8df_lVRgezRq9O.png",
      comp: <Trash />,
    }
  ];

  const getAppsByList = (names) => {
    return allApps.filter((app) => names.includes(app.appId));
  };

  const categories = [
    {
      id: "suggestions",
      title: "Suggestions",
      actionLabel: "Show More",
      actionLabelActive: "Show Less",
      apps: getAppsByList(["Safari", "Music", "Notes", "Photos", "Calendar"]),
    },
    {
      id: "productivity",
      title: "Productivity",
      actionLabel: "Show All",
      actionLabelActive: "Collapse",
      apps: getAppsByList(["Notes", "Reminders", "Calendar", "Mail", "Pages", "Numbers", "Keynote"]),
    },
    {
      id: "creativity",
      title: "Creativity",
      actionLabel: "Show All",
      actionLabelActive: "Collapse",
      apps: getAppsByList(["Photos", "Music", "Podcasts", "TV", "Messages", "FaceTime"]),
    },
    {
      id: "info",
      title: "Information & Reading",
      actionLabel: "Show All",
      actionLabelActive: "Collapse",
      apps: getAppsByList(["Maps", "Contacts", "Phone", "Settings", "Github", "linkedin", "Finder", "Trash"]),
    },
  ];

  return (
    <div 
      className="flex flex-col h-full w-full select-none text-[13px]"
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif"
      }}
    >
      {/* Top Header */}
      <header className="window-drag-handle flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0 select-none">
        <div className="flex items-center gap-3">
          <TrafficLights windowId={windowId} />
          <div className="flex items-center gap-2">
            <img 
              src="https://s3.macosicons.com/macosicons/icons/ZTpqalXxE3/lowResPngFile_8f0aba462304996c37f9f506b368c53b_low_res_App_Store__MacOS_Tahoe_.png"
              alt="App Store icon" 
              className="w-5 h-5 object-contain"
            />
            <span className={`font-semibold text-[15px] ${isDarkMode ? "text-white/90" : "text-gray-900/90"}`}>Apps</span>
          </div>
        </div>
        
        <button className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border transition ${
          isDarkMode 
            ? "border-white/10 bg-white/5 hover:bg-white/10 text-white/80" 
            : "border-black/10 bg-black/5 hover:bg-black/10 text-gray-800"
        }`}>
          <LayoutGrid size={14} />
          <ChevronDown size={12} />
        </button>
      </header>

      {/* Main categories scrollable list */}
      <div 
        className="flex-1 overflow-y-auto px-6 py-4 space-y-6 notes-no-scrollbar"
        style={{ scrollbarWidth: "none" }}
      >
        {categories.map((cat) => {
          const isExpanded = expandedSections[cat.id];
          const displayApps = isExpanded ? cat.apps : cat.apps.slice(0, 5);
          
          return (
            <div key={cat.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`font-semibold text-[14px] ${isDarkMode ? "text-white/60" : "text-black/60"}`}>
                  {cat.title}
                </span>
                {cat.apps.length > 5 && (
                  <button 
                    onClick={() => toggleSection(cat.id)}
                    className="text-blue-500 hover:text-blue-600 text-[12px] font-medium transition"
                  >
                    {isExpanded ? cat.actionLabelActive : cat.actionLabel}
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-5 gap-y-5 justify-items-center">
                {displayApps.map((app) => (
                  <div 
                    key={app.appId} 
                    onClick={() => handleLaunch(app)}
                    className="flex flex-col items-center gap-1.5 cursor-pointer group text-center"
                  >
                    <div className="relative w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)]">
                      <img 
                        src={app.icon} 
                        alt={app.label} 
                        className="w-full h-full object-cover rounded-xl"
                        draggable={false}
                      />
                    </div>
                    <span className={`text-[11px] font-medium truncate max-w-full leading-tight transition ${
                      isDarkMode ? "text-white/80 group-hover:text-white" : "text-gray-800 group-hover:text-black"
                    }`}>
                      {app.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
