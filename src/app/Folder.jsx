import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Folder() {
  const [isOpen, setIsOpen] = useState(false);

  const folderContents = [
    { name: "ReadMe.txt", type: "file" },
    { name: "Assets", type: "folder" },
    { name: "Documents", type: "folder" },
  ];

  if (!isOpen) return null;

  return (
    <div className="w-full h-full bg-neutral-800/95 backdrop-blur-xl flex flex-col rounded-b-xl overflow-hidden">
      {/* Title Bar */}
      <div className="bg-neutral-700/50 border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="https://s3.macosicons.com/macosicons/icons/GecwaBmkFQ/lowResPngFile_c3ef21fe8fabfd9d23fcc3ab3134dcf9_GecwaBmkFQ.png"
            alt="Folder"
            className="w-5 h-5"
          />
          <h1 className="text-white font-semibold text-sm">Portfolio</h1>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white/60 hover:text-white/90 transition"
        >
          ✕
        </button>
      </div>

      {/* Folder Contents */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-2">
          {folderContents.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-3 hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
            >
              <div className="w-8 h-8 flex items-center justify-center">
                {item.type === "folder" ? (
                  <img
                    src="https://s3.macosicons.com/macosicons/icons/GecwaBmkFQ/lowResPngFile_c3ef21fe8fabfd9d23fcc3ab3134dcf9_GecwaBmkFQ.png"
                    alt={item.name}
                    className="w-6 h-6"
                  />
                ) : (
                  <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
              </div>
              <span className="text-white/80 text-sm font-medium">{item.name}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-neutral-700/50 border-t border-white/10 px-4 py-2">
        <p className="text-white/50 text-xs">{folderContents.length} items</p>
      </div>
    </div>
  );
}
