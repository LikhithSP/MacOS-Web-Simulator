import React, { useState } from "react";
import { motion } from "framer-motion";

// Overview Tab Content
const OverviewTab = () => (
  <div className="flex items-start gap-8 py-8 px-8 justify-center max-w-2xl mx-auto">
    {/* macOS Logo */}
    <div className="shrink-0">
      <img 
        src="https://www.iclarified.com/images/news/97556/465566/465566.jpg" 
        alt="macOS Sequoia" 
        className="w-32 h-32 rounded-full object-cover"
      />
    </div>

    {/* System Information */}
    <div className="flex-1 text-sm">
      <h1 className="text-2xl font-normal text-white mb-0.5">macOS Tahoe</h1>
      <p className="text-white/50 text-xs mb-6">Version 15.2.0 (24C101)</p>

      <div className="space-y-1.5">
        <div className="flex">
          <span className="text-white/50 w-28">iMac</span>
          <span className="text-white/90">(Retina 5K, 2019) - iMac19,1</span>
        </div>
        <div className="flex">
          <span className="text-white/50 w-28">Processor</span>
          <span className="text-white/90">Intel(R) Core(TM) i7-9700 CPU @ 3.00GHz</span>
        </div>
        <div className="flex">
          <span className="text-white/50 w-28">Memory</span>
          <span className="text-white/90">16 GB DDR4</span>
        </div>
        <div className="flex">
          <span className="text-white/50 w-28">Startup Disk</span>
          <span className="text-white/90">Sequoia</span>
        </div>
        <div className="flex">
          <span className="text-white/50 w-28">Display</span>
          <span className="text-white/90">ARIRANG (3840 x 2160)</span>
        </div>
        <div className="flex">
          <span className="text-white/50 w-28">Graphics</span>
          <span className="text-white/90">UHD Graphics 630 1536 MB (Metal 3)</span>
        </div>
        <div className="flex">
          <span className="text-white/50 w-28">Serial Number</span>
          <span className="text-white/90"></span>
        </div>
        <div className="flex">
          <span className="text-white/50 w-28">Bootloader</span>
          <span className="text-white/90">OpenCore 1.0.3 (Release)</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-6">
        <button className="px-4 py-1.5 bg-white/10 hover:bg-white/15 rounded-md text-white/90 text-sm transition-colors border border-white/10">
          System Report...
        </button>
        <button className="px-4 py-1.5 bg-white/10 hover:bg-white/15 rounded-md text-white/90 text-sm transition-colors border border-white/10">
          Software Update...
        </button>
      </div>
    </div>
  </div>
);

// Displays Tab Content
const DisplaysTab = () => (
  <div className="py-8 px-4">
    <div className="flex flex-col items-center gap-6">
      {/* Display Preview */}
      <div className="w-64 h-40 bg-linear-to-br from-blue-600/30 to-purple-600/30 rounded-lg border border-white/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-48 h-28 bg-neutral-800 rounded-md border border-white/10 flex items-center justify-center mb-2">
            <span className="text-white/40 text-xs">Built-in Display</span>
          </div>
        </div>
      </div>

      {/* Display Info */}
      <div className="text-center space-y-2">
        <h3 className="text-white font-medium">ARIRANG</h3>
        <p className="text-white/50 text-sm">3840 x 2160</p>
      </div>

      <div className="w-full max-w-md space-y-3 mt-4">
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
          <span className="text-white/70 text-sm">Resolution</span>
          <span className="text-white/90 text-sm">3840 x 2160 (4K UHD)</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
          <span className="text-white/70 text-sm">Refresh Rate</span>
          <span className="text-white/90 text-sm">60 Hz</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
          <span className="text-white/70 text-sm">Connection</span>
          <span className="text-white/90 text-sm">HDMI</span>
        </div>
      </div>
    </div>
  </div>
);

// Storage Tab Content
const StorageTab = () => (
  <div className="py-8 px-4">
    <div className="flex flex-col items-center gap-6">
      {/* Storage Bar */}
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-4 mb-4">
          <img
            src="https://s3.macosicons.com/macosicons/icons/noQGdBTTUN/lowResPngFile_ee0d968263286ed114178981b4bd5163_low_res_MacMiniM4-Disk-02.png"
            alt="Macintosh HD"
            className="w-16 h-16 rounded-lg object-contain bg-neutral-700"
          />
          <div>
            <h3 className="text-white font-medium">Macintosh HD</h3>
            <p className="text-white/50 text-sm">500 GB SATA SSD</p>
          </div>
        </div>

        {/* Storage Usage Bar */}
        <div className="w-full h-8 bg-neutral-700 rounded-lg overflow-hidden flex mb-3">
          <div className="h-full bg-blue-500 w-[35%]" title="Apps"></div>
          <div className="h-full bg-yellow-500 w-[15%]" title="Documents"></div>
          <div className="h-full bg-purple-500 w-[10%]" title="Photos"></div>
          <div className="h-full bg-cyan-500 w-[8%]" title="System"></div>
          <div className="h-full bg-red-500 w-[5%]" title="Other"></div>
          <div className="h-full bg-neutral-600 flex-1" title="Available"></div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-blue-500"></div>
            <span className="text-white/70">Apps (175 GB)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-yellow-500"></div>
            <span className="text-white/70">Documents (75 GB)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-purple-500"></div>
            <span className="text-white/70">Photos (50 GB)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-cyan-500"></div>
            <span className="text-white/70">System (40 GB)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-red-500"></div>
            <span className="text-white/70">Other (25 GB)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-neutral-600"></div>
            <span className="text-white/70">Available (135 GB)</span>
          </div>
        </div>
      </div>

      {/* Manage Button */}
      <button className="px-4 py-1.5 bg-white/10 hover:bg-white/15 rounded-md text-white/90 text-sm transition-colors border border-white/10 mt-4">
        Manage...
      </button>
    </div>
  </div>
);

// Support Tab Content
const SupportTab = () => (
  <div className="py-8 px-4">
    <div className="max-w-md mx-auto space-y-4">
      <a
        href="https://support.apple.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
      >
        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-white font-medium">macOS Help</h3>
          <p className="text-white/50 text-sm">Get help with macOS</p>
        </div>
      </a>

      <a
        href="https://www.apple.com/macos"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
      >
        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div>
          <h3 className="text-white font-medium">macOS Resources</h3>
          <p className="text-white/50 text-sm">Learn about macOS features</p>
        </div>
      </a>

      <a
        href="https://support.apple.com/kb/index"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
      >
        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-white font-medium">Specifications</h3>
          <p className="text-white/50 text-sm">View technical specifications</p>
        </div>
      </a>

      <a
        href="https://checkcoverage.apple.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
      >
        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <h3 className="text-white font-medium">Service and Support</h3>
          <p className="text-white/50 text-sm">Check your coverage status</p>
        </div>
      </a>
    </div>
  </div>
);

export default function Settings() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "displays", label: "Displays" },
    { id: "storage", label: "Storage" },
    { id: "support", label: "Support" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;
      case "displays":
        return <DisplaysTab />;
      case "storage":
        return <StorageTab />;
      case "support":
        return <SupportTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="h-full w-full bg-neutral-800/95 backdrop-blur-xl flex flex-col rounded-b-xl overflow-hidden">
      {/* Tab Bar */}
      <div className="flex justify-center gap-1 pt-3 pb-2 bg-neutral-800/50 border-b border-white/5">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-white/15 text-white"
                : "text-white/60 hover:text-white/80 hover:bg-white/5"
            }`}
            whileTap={{ scale: 0.98 }}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>

      {/* Footer */}
      <div className="text-center py-3 border-t border-white/5">
        <p className="text-white/30 text-xs">
          © 2026 Apple Inc. All rights reserved.
        </p>
      </div>
    </div>
  );
}
