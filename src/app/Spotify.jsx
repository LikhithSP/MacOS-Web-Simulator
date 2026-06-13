import React, { useState, useRef, useEffect } from "react";
import { useAppStore, audioInstance } from "../store/Appstore";
import { songs } from "../constants/songs";
import { 
  FiSearch, 
  FiHome, 
  FiRadio, 
  FiClock, 
  FiMic, 
  FiMusic, 
  FiTv, 
  FiUser, 
  FiVolume2, 
  FiPlay, 
  FiPause, 
  FiSkipBack, 
  FiSkipForward, 
  FiRepeat, 
  FiShuffle, 
  FiSliders, 
  FiMenu,
  FiChevronRight
} from "react-icons/fi";
import { 
  BsGrid, 
  BsMusicNoteList,
  BsPinAngle,
  BsFileMusic
} from "react-icons/bs";

// Apple Logo SVG for bottom player
const AppleLogoMini = () => (
  <svg width="14" height="17" viewBox="0 0 170 170" fill="currentColor" className="text-gray-400 dark:text-gray-500">
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.197-2.12-9.973-3.17-14.34-3.17-4.58 0-9.492 1.05-14.746 3.17-5.262 2.13-9.501 3.24-12.742 3.35-4.929 0.21-9.842-1.96-14.746-6.52-3.13-2.73-7.045-7.41-11.735-14.04-5.032-7.08-9.169-15.29-12.41-24.65-3.471-10.11-5.211-19.9-5.211-29.378 0-10.857 2.346-20.221 7.045-28.068 3.693-6.303 8.606-11.275 14.755-14.925s12.793-5.51 19.948-5.629c3.915 0 9.049 1.211 15.429 3.591 6.362 2.388 10.447 3.599 12.238 3.599 1.339 0 5.877-1.416 13.57-4.239 7.275-2.618 13.415-3.702 18.445-3.275 13.63 1.1 23.87 6.473 30.68 16.153-12.19 7.386-18.22 17.731-18.1 31.002 0.11 10.337 3.86 18.939 11.23 25.769 3.34 3.17 7.07 5.62 11.22 7.36-0.9 2.61-1.85 5.11-2.86 7.51zM119.11 7.24c0 8.102-2.96 15.667-8.86 22.669-7.12 8.324-15.732 13.134-25.071 12.375-0.119-0.972-0.188-1.995-0.188-3.07 0-7.778 3.386-16.102 9.399-22.908 3.002-3.446 6.82-6.311 11.45-8.597 4.62-2.252 8.99-3.497 13.1-3.71 0.12 1.083 0.17 2.166 0.17 3.241z"/>
  </svg>
);

// Traffic lights inside the Music sidebar
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

export default function MusicApp({ windowId }) {
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  const storeIsPlaying = useAppStore((s) => s.isAudioPlaying);
  const storeCurrentTrack = useAppStore((s) => s.currentTrack);
  const [searchQuery, setSearchQuery] = useState("");
  const audioRef = useRef(null);

  const currentSongIndex = Math.max(0, songs.findIndex(s => s.title === storeCurrentTrack?.title));
  const currentSong = songs[currentSongIndex];

  const togglePlay = () => {
    useAppStore.getState().toggleAudio();
  };

  const playSong = (index) => {
    if (currentSongIndex === index) {
      togglePlay();
      return;
    }
    useAppStore.setState({
      currentTrack: songs[index],
      isAudioPlaying: true
    });
  };

  // Sync changes from Appstore / Control Center / local actions to local HTML5 audio player
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;
    
    // Check if the current audio element source matches the expected song source
    const expectedSrc = currentSong.src;
    const currentSrc = audioRef.current.src;
    
    if (!currentSrc.endsWith(expectedSrc)) {
      audioRef.current.src = expectedSrc;
      audioRef.current.load();
    }
    
    if (storeIsPlaying) {
      audioInstance.pause(); // Stop background default player
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    } else {
      audioRef.current.pause();
    }
  }, [storeIsPlaying, currentSongIndex]);

  // Clean up audio and reset playing state when app is closed (unmounted)
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      useAppStore.setState({ isAudioPlaying: false });
    };
  }, []);

  const profilePhoto = localStorage.getItem("lock_profile_photo") || "https://i.pinimg.com/originals/bf/57/02/bf57026ee75af2f414000cec322f7404.gif";
  const profileName = "Likhith SP";

  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div 
      className="relative flex h-full w-full overflow-hidden select-none" 
      style={{ 
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
        background: isDarkMode ? "#1e1e1e" : "#ffffff"
      }}
    >
      <audio 
        ref={audioRef} 
        src={currentSong.src} 
        onEnded={() => {
          // Auto advance to next song using store's nextTrack()
          const nextIndex = (currentSongIndex + 1) % songs.length;
          useAppStore.setState({
            currentTrack: songs[nextIndex],
            isAudioPlaying: true
          });
        }}
      />

      {/* Sidebar */}
      <aside 
        className="w-56 h-full flex flex-col flex-shrink-0 border-r select-none window-drag-handle justify-between"
        style={{ 
          background: isDarkMode ? "rgba(37, 37, 37, 0.9)" : "rgba(250, 250, 248, 0.9)", 
          borderColor: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)" 
        }}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Top traffic lights section */}
          <div className="h-[52px] flex items-center px-4 mt-2">
            <TrafficLights windowId={windowId} />
          </div>

          {/* Navigation links */}
          <nav className="px-2 py-1 space-y-4">
            <div className="space-y-0.5">
              <button className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/5 transition-all">
                <FiSearch size={15} className="text-rose-500" />
                <span>Search</span>
              </button>
              <button className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/5 transition-all">
                <FiHome size={15} className="text-rose-500" />
                <span>Home</span>
              </button>
              <button className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/5 transition-all">
                <BsGrid size={14} className="text-rose-500" />
                <span>New</span>
              </button>
              <button className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/5 transition-all">
                <FiRadio size={15} className="text-rose-500" />
                <span>Radio</span>
              </button>
            </div>

            {/* Library Section */}
            <div>
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 select-none">Library</span>
              <div className="mt-1 space-y-0.5">
                <button className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/5 transition-all">
                  <FiChevronRight size={10} className="text-gray-400 -ml-1 mr-0.5" />
                  <BsPinAngle size={13} className="text-rose-500 mr-1.5" />
                  <span>Pins</span>
                </button>
                <button className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/5 transition-all">
                  <FiClock size={14} className="text-rose-500" />
                  <span>Recently Added</span>
                </button>
                <button className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/5 transition-all">
                  <FiMic size={14} className="text-rose-500" />
                  <span>Artists</span>
                </button>
                <button className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/5 transition-all">
                  <BsFileMusic size={14} className="text-rose-500" />
                  <span>Albums</span>
                </button>
                <button className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 transition-all">
                  <FiMusic size={14} className="text-rose-500" />
                  <span>Songs</span>
                </button>
                <button className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/5 transition-all">
                  <FiTv size={14} className="text-rose-500" />
                  <span>Music Videos</span>
                </button>
                <button className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/5 transition-all">
                  <FiUser size={14} className="text-rose-500" />
                  <span>Made for You</span>
                </button>
              </div>
            </div>

            {/* Playlists Section */}
            <div>
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 select-none">Playlists</span>
            </div>
          </nav>
        </div>

        {/* User Card at bottom of sidebar */}
        <div className="p-3 border-t border-black/[0.05] dark:border-white/5 flex items-center gap-2">
          <div className="w-7 h-7 rounded-full overflow-hidden border border-black/10 dark:border-white/10 flex-shrink-0">
            <img src={profilePhoto} alt="User profile" className="w-full h-full object-cover" />
          </div>
          <span className="text-[12px] font-medium text-gray-800 dark:text-gray-200 truncate">{profileName}</span>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Toolbar Header */}
        <header 
          className="h-[52px] flex items-center justify-between px-6 select-none border-b border-black/[0.08] dark:border-white/10 window-drag-handle"
          style={{ background: isDarkMode ? "#1e1e1e" : "#ffffff" }}
        >
          <span className="text-[13px] font-bold text-gray-900 dark:text-white select-none">Songs</span>
          
          {/* Search bar & Settings toggle */}
          <div className="flex items-center gap-2.5">
            <button className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 transition-colors">
              <FiSliders size={14} />
            </button>
            <div className="relative flex items-center bg-black/[0.04] dark:bg-white/[0.06] rounded-full px-2.5 py-1 w-44 border border-black/[0.05] dark:border-white/[0.05]">
              <FiSearch size={12} className="text-gray-400 mr-1.5" />
              <input 
                type="text" 
                placeholder="Find in Songs" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-[11px] outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400"
              />
            </div>
          </div>
        </header>

        {/* Albums Grid */}
        <div className="flex-1 overflow-y-auto px-6 py-6 pb-28 notes-no-scrollbar" style={{ scrollbarWidth: "none" }}>
          {filteredSongs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 dark:text-gray-500">
              <FiMusic size={40} className="mb-3 text-gray-300 dark:text-gray-700" />
              <p className="text-[13px] font-medium">No songs found matching "{searchQuery}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-6">
              {filteredSongs.map((song, i) => {
                // Find actual index in original songs array to play correctly
                const originalIndex = songs.findIndex(s => s.title === song.title);

                return (
                  <div 
                    key={song.title} 
                    onClick={() => playSong(originalIndex)} 
                    className="flex flex-col cursor-pointer group"
                  >
                    <div className="w-full aspect-square rounded-lg overflow-hidden border border-black/5 dark:border-white/5 relative mb-2 shadow-sm bg-gray-100 dark:bg-gray-800">
                      <img 
                        src={song.img} 
                        alt={song.title} 
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:brightness-95 transition-all"
                        draggable={false}
                      />
                      
                      {/* Play overlay hover indicator */}
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white/95 text-gray-900 shadow-md flex items-center justify-center hover:scale-105 transition-transform">
                          {(currentSongIndex === originalIndex && storeIsPlaying) ? <FiPause size={14} className="fill-current" /> : <FiPlay size={14} className="fill-current ml-0.5" />}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 min-w-0">
                      <span className="text-[12px] font-semibold text-gray-900 dark:text-white truncate leading-snug">
                        {song.title}
                      </span>
                      {song.isExplicit && (
                        <span className="text-[8px] font-bold bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-0.5 rounded flex-shrink-0">E</span>
                      )}
                      {song.isStarred && (
                        <span className="text-[10px] text-red-500 flex-shrink-0">★</span>
                      )}
                    </div>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5 leading-none">
                      {song.artist}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Apple Music Style Floating Media Control Player */}
        <div 
          className={`absolute bottom-6 left-1/2 -translate-x-1/2 w-[620px] h-[52px] rounded-full border shadow-2xl flex items-center justify-between px-5 z-40 transition-all ${
            isDarkMode ? "backdrop-blur-md" : "backdrop-blur-3xl"
          }`}
          style={{
            background: isDarkMode ? "rgba(20, 20, 20, 0.05)" : "rgba(255, 255, 255, 0.35)",
            borderColor: isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.5)",
            boxShadow: isDarkMode 
              ? "0 10px 30px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)" 
              : "0 10px 30px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.6)"
          }}
        >
          {/* Controls on Left */}
          <div className="flex items-center gap-3">
            <button className="p-1 text-gray-500 hover:text-rose-500 dark:text-gray-400 dark:hover:text-rose-400 transition-colors">
              <FiShuffle size={14} />
            </button>
            <button 
              onClick={() => playSong(currentSongIndex > 0 ? currentSongIndex - 1 : songs.length - 1)}
              className="p-1 text-gray-700 hover:text-rose-500 dark:text-gray-300 dark:hover:text-rose-400 transition-colors"
            >
              <FiSkipBack size={16} className="fill-current" />
            </button>
            <button 
              onClick={togglePlay}
              className="w-7 h-7 rounded-full bg-gray-900/10 hover:bg-gray-900/20 dark:bg-white/10 dark:hover:bg-white/20 flex items-center justify-center text-gray-800 dark:text-white transition-all"
            >
              {storeIsPlaying ? <FiPause size={12} className="fill-current" /> : <FiPlay size={12} className="fill-current ml-0.5" />}
            </button>
            <button 
              onClick={() => playSong((currentSongIndex + 1) % songs.length)}
              className="p-1 text-gray-700 hover:text-rose-500 dark:text-gray-300 dark:hover:text-rose-400 transition-colors"
            >
              <FiSkipForward size={16} className="fill-current" />
            </button>
            <button className="p-1 text-gray-500 hover:text-rose-500 dark:text-gray-400 dark:hover:text-rose-400 transition-colors">
              <FiRepeat size={14} />
            </button>
          </div>

          {/* Album Title/Art in Center (with Apple Logo) */}
          <div className="flex items-center gap-2 px-3 py-1 bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.03] dark:border-white/[0.03] rounded-full max-w-[240px] truncate">
            <img src={currentSong.img} className="w-6 h-6 rounded-md object-cover shadow-sm" alt="art" />
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-bold text-gray-800 dark:text-white truncate leading-tight">{currentSong.title}</span>
              <span className="text-[9px] text-gray-400 dark:text-gray-500 truncate leading-none mt-0.5">{currentSong.artist}</span>
            </div>
            <div className="ml-2 pl-2 border-l border-black/10 dark:border-white/10 shrink-0">
              <AppleLogoMini />
            </div>
          </div>

          {/* Right Accessories (Volume, Lyrics, etc.) */}
          <div className="flex items-center gap-2">
            <button className="p-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors" title="Lyrics">
              <BsMusicNoteList size={13} />
            </button>
            <button className="p-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors" title="Up Next">
              <FiMenu size={14} />
            </button>
            <button className="p-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors flex items-center justify-center" title="Volume">
              <FiVolume2 size={14} />
            </button>
            <div className="w-12 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative cursor-pointer" title="Adjust Volume">
              <div className="absolute top-0 left-0 h-full bg-gray-500 dark:bg-gray-400 w-2/3"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
