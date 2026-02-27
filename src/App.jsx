import { useState, useEffect, useRef, useCallback } from "react";
import PowerScreen from "./layouts/PowerScreen";
import LockScreen from "./layouts/LockScreen";
import Desktop from "./layouts/DesktopWindow";

const INACTIVITY_TIMEOUT = 60 * 1000; // 1 minute in milliseconds

export default function App() {
  const [stage, setStage] = useState(null);
  const inactivityTimerRef = useRef(null);
  
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
      } else if (savedState === "desktop") {
        setStage("desktop");
      } else {
        setStage("lock");
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
    if (!stage) return;
    localStorage.setItem("os_state", stage);
    localStorage.setItem("os_state_time", String(Date.now()));
  }, [stage]);

  if (!stage) return null;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {stage === "power" && <PowerScreen goNext={() => setStage("lock")} />}
      
      {/* Desktop renders behind lock screen so it's visible during slide-up */}
      {(stage === "lock" || stage === "desktop") && (
        <div className="absolute inset-0">
          <Desktop setStage={setStage} isLocked={stage === "lock"} />
        </div>
      )}
      
      {/* Lock screen slides up to reveal desktop */}
      {stage === "lock" && (
        <div className="absolute inset-0 z-50">
          <LockScreen goNext={() => setStage("desktop")} />
        </div>
      )}
    </div>
  );
}
