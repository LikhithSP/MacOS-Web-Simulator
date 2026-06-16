import { useState, useEffect, useRef, useCallback } from "react";
import PowerScreen from "./layouts/PowerScreen";
import LockScreen from "./layouts/LockScreen";
import SetupScreen from "./layouts/SetupScreen";
import RegionScreen from "./layouts/RegionScreen";
import WrittenScreen from "./layouts/WrittenScreen";
import TimezoneScreen from "./layouts/TimezoneScreen";
import DataPrivacyScreen from "./layouts/DataPrivacyScreen";
import CreateAccountScreen from "./layouts/CreateAccountScreen";
import Desktop from "./layouts/DesktopWindow";
import { useAppStore } from "./store/Appstore";

const INACTIVITY_TIMEOUT = 60 * 1000; // 1 minute in milliseconds

export default function App() {
  const [stage, setStage] = useState(null);
  const [skippedSetup, setSkippedSetup] = useState(false);
  const inactivityTimerRef = useRef(null);
  const isDarkMode = useAppStore((s) => s.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);
  
  // Reset inactivity timer on any user activity
  const resetInactivityTimer = useCallback(() => {
    // Clear existing timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    
    // Only start timer when on desktop (not on power or lock screen)
    if (stage === "desktop") {
      inactivityTimerRef.current = setTimeout(() => {
        setStage("lock");
      }, INACTIVITY_TIMEOUT);
    }
  }, [stage]);
  
  // Set up activity listeners
  useEffect(() => {
    if (stage !== "desktop") {
      // Clear timer when not on desktop
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
      return;
    }
    
    // Activity events to track
    const activityEvents = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click',
      'wheel'
    ];
    
    // Add listeners for all activity events
    activityEvents.forEach(event => {
      window.addEventListener(event, resetInactivityTimer, { passive: true });
    });
    
    // Start the initial timer
    resetInactivityTimer();
    
    return () => {
      // Clean up listeners
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetInactivityTimer);
      });
      
      // Clear timer on unmount
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [stage, resetInactivityTimer]);
 
  useEffect(() => {
    const savedState = localStorage.getItem("os_state");
    const savedTime = localStorage.getItem("os_state_time");
    const setupCompleted = localStorage.getItem("setup_completed") === "true";

    if (setupCompleted) {
      if (savedState === "desktop") {
        setStage("desktop");
      } else {
        setStage("lock");
      }
      return;
    }

    if (!savedState || !savedTime) {
      setStage("power");
      return;
    }

    const lastVisit = Number(savedTime);
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    if (now - lastVisit < oneDay) {
      if (savedState === "power") {
        setStage("power");
      } else if (
        ["setup", "region", "written", "timezone", "dataprivacy", "createaccount"].includes(savedState)
      ) {
        setStage(savedState);
      } else {
        setStage("power");
      }
      return;
    }
    setStage("power");
  }, []);
  useEffect(() => {
    const disableRightClick = (e) => e.preventDefault();
    document.addEventListener("contextmenu", disableRightClick);

    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
    };
  }, []);
  useEffect(() => {
    const handleLockShortcut = (e) => {
      if (stage === "desktop" && e.ctrlKey && e.key.toLowerCase() === "l") {
        e.preventDefault();
        setStage("lock");
      }
    };
    window.addEventListener("keydown", handleLockShortcut);
    return () => {
      window.removeEventListener("keydown", handleLockShortcut);
    };
  }, [stage]);
  useEffect(() => {
    if (!stage) return;
    localStorage.setItem("os_state", stage);
    localStorage.setItem("os_state_time", String(Date.now()));
  }, [stage]);

  if (!stage) return null;

  return (
      <div className="relative w-screen h-screen overflow-hidden bg-black">
        {stage === "power" && <PowerScreen goNext={() => {
          const setupCompleted = localStorage.getItem("setup_completed") === "true";
          if (setupCompleted) {
            setStage("lock");
          } else {
            setStage("setup");
          }
        }} />}
        {stage === "restart" && <PowerScreen autoBoot={true} goNext={() => {
          setStage("lock");
        }} />}
        {stage === "setup" && <SetupScreen 
          goNext={(lang) => {
            localStorage.setItem('setup_lang', lang || "English (UK)");
            setStage("region");
          }} 
          onSkip={() => {
            setSkippedSetup(true);
            setStage("createaccount");
          }}
        />}
        {stage === "region" && <RegionScreen goNext={(country) => {
          localStorage.setItem('setup_country', country || "United Kingdom");
          setStage("written");
        }} goBack={() => setStage("setup")} />}
        {stage === "written" && <WrittenScreen 
          selectedLanguage={localStorage.getItem('setup_lang') || "English (UK)"} 
          selectedCountry={localStorage.getItem('setup_country') || "United Kingdom"} 
          goNext={() => setStage("timezone")} 
          goBack={() => setStage("region")} 
        />}
        {stage === "timezone" && <TimezoneScreen 
          selectedCountry={localStorage.getItem('setup_country') || "United Kingdom"} 
            goNext={() => setStage("dataprivacy")}
            goBack={() => setStage("written")}
          />}
        {stage === "dataprivacy" && <DataPrivacyScreen
          goNext={() => setStage("createaccount")}
          goBack={() => setStage("timezone")}
        />}
        {stage === "createaccount" && <CreateAccountScreen
          goNext={() => setStage("lock")}
          goBack={() => {
            if (skippedSetup) {
              setSkippedSetup(false);
              setStage("setup");
            } else {
              setStage("dataprivacy");
            }
          }}
        />}
        
        {/* Desktop renders behind lock screen so it's visible during slide-up */}
      {(stage === "lock" || stage === "desktop") && (
        <div className="absolute inset-0">
          <Desktop setStage={setStage} isLocked={stage === "lock"} />
        </div>
      )}
      
      {/* Lock screen slides up to reveal desktop */}
      {(stage === "lock" || stage === "desktop") && (
        <div 
          className="absolute inset-0 z-50"
          style={{
            visibility: stage === "lock" ? "visible" : "hidden",
            pointerEvents: stage === "lock" ? "auto" : "none"
          }}
        >
          <LockScreen goNext={() => setStage("desktop")} isLocked={stage === "lock"} />
        </div>
      )}
    </div>
  );
}
