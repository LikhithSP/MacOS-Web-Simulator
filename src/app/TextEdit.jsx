import React, { useState, useEffect } from "react";
import { useAppStore } from "../store/Appstore";

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

// Traffic lights inside the TextEdit header
const TrafficLights = ({ windowId, onClose }) => {
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
        onClick={() => {
          if (onClose) {
            onClose();
          } else if (windowId) {
            close(windowId);
          }
        }}
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

export default function TextEdit({ file, windowId }) {
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  const closeApp = useAppStore((s) => s.closeApp);

  const [editorText, setEditorText] = useState("");
  const [editorTitle, setEditorTitle] = useState("");
  const [isUnsaved, setIsUnsaved] = useState(false);

  useEffect(() => {
    if (file) {
      setEditorTitle(file.name);
      const initialText = file.content || (file.url && file.url.startsWith("data:") ? decodeBase64Text(file.url) : "");
      setEditorText(initialText);
      setIsUnsaved(false);
    }
  }, [file]);

  const [saveStatus, setSaveStatus] = useState("Save");

  const handleSave = () => {
    // Dispatch custom event to notify Finder of the file save event
    const event = new CustomEvent("os_file_saved", {
      detail: {
        id: file.id,
        name: editorTitle,
        content: editorText
      }
    });
    window.dispatchEvent(event);
    setIsUnsaved(false);
    setSaveStatus("Saved!");
    setTimeout(() => {
      setSaveStatus("Save");
    }, 1500);
  };

  const handleClose = () => {
    if (isUnsaved && !confirm("You have unsaved changes. Close anyway?")) {
      return;
    }
    closeApp(windowId);
  };

  return (
    <div className={`flex flex-col h-full w-full select-none transition-colors duration-150 ${
      isDarkMode ? "bg-[#1E1E1E] text-white" : "bg-white text-gray-800"
    }`}>
      {/* Title Bar / TextEdit Toolbar */}
      <div className={`window-drag-handle flex items-center justify-between border-b px-4 py-2.5 select-none cursor-grab active:cursor-grabbing ${
        isDarkMode ? "bg-[#2D2D2D] border-white/10" : "bg-[#F6F6F6] border-gray-200"
      }`}>
        {/* Traffic Lights */}
        <div className="flex items-center gap-1.5 group/editor-traffic w-16">
          <TrafficLights windowId={windowId} onClose={handleClose} />
        </div>

        {/* Title / Filename Input */}
        <div className="flex items-center gap-1 flex-1 justify-center">
          <input 
            type="text" 
            value={editorTitle}
            onChange={(e) => {
              setEditorTitle(e.target.value);
              setIsUnsaved(true);
            }}
            className={`text-xs font-semibold bg-transparent outline-none border-b border-transparent focus:border-blue-500 pb-0.5 text-center max-w-xs transition ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
            placeholder="untitled.txt"
          />
          {isUnsaved && (
            <div className="w-1.5 h-1.5 rounded-full bg-[#007AFF] animate-pulse" title="Edited" />
          )}
        </div>
        
        {/* Save Button */}
        <div className="w-16 flex justify-end">
          <button
            onClick={handleSave}
            className={`px-3 py-1 text-[11px] font-semibold rounded-lg shadow-sm transition ${
              isUnsaved 
                ? "bg-[#007AFF] text-white hover:bg-[#0062CC] active:bg-[#004BB3]" 
                : isDarkMode ? "bg-white/10 text-gray-300 hover:bg-white/15 border border-white/5" : "bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {saveStatus}
          </button>
        </div>
      </div>
      
      {/* Text Editor Canvas */}
      <textarea 
        value={editorText}
        onChange={(e) => {
          setEditorText(e.target.value);
          setIsUnsaved(true);
        }}
        className={`flex-1 p-6 font-mono text-sm leading-relaxed outline-none resize-none transition-colors duration-150 ${
          isDarkMode ? "bg-[#1E1E1E] text-gray-200" : "bg-white text-gray-800"
        }`}
        placeholder="Start typing..."
      />
    </div>
  );
}
