import React, { useState, useRef, useEffect } from "react";
import { Search, House, Sparkles, Radio, Clock, Mic2, Disc3, Music2, ListMusic, Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Mic, List, Airplay, Volume2 } from "lucide-react";

export default function Spotify() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const audioRef = useRef(null);

  const songs = [
    { title: "Die With A Smile", artist: "Bruno Mars, Lady Gaga", src: "/music/DIE.mp3", img: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&h=500&fit=crop" },
    { title: "Jupiter", artist: "Nao", year: "2025", subtitle: "Listen Again", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { title: "Erica's Station", artist: "Made for You", year: "", subtitle: "Made for You", img: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=500&h=500&fit=crop", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { title: "Under A Familiar Sun", artist: "The Vernon Spring", year: "2025", subtitle: "Listen Again", img: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=500&h=500&fit=crop", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
    { title: "Energy", artist: "Apple Music", year: "", subtitle: "Mood for You", img: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=500&h=500&fit=crop", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
  ];

  const topPicks = songs.slice(1);
  const recentlyPlayed = songs.slice(0, 3);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error(e));
    }
    setIsPlaying(!isPlaying);
  };

  const playSong = (index) => {
    if (currentSongIndex === index) {
      togglePlay();
      return;
    }
    setCurrentSongIndex(index);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
  }, [currentSongIndex]);

  const currentSong = songs[currentSongIndex];
  const profilePhoto = localStorage.getItem("lock_profile_photo") || "https://i.pinimg.com/originals/bf/57/02/bf57026ee75af2f414000cec322f7404.gif";

  return (
    <div className="flex h-full w-full bg-[#f3f3f3] text-black overflow-hidden select-none font-sans">
      <audio 
        ref={audioRef} 
        src={currentSong.src} 
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />
      
      {/* Sidebar */}
      <div className="w-[240px] bg-[#fdfdfd]/80 backdrop-blur-xl border-r border-black/5 flex flex-col pt-10 pb-4 h-full shrink-0">
        <div className="px-4 space-y-0.5">
          <SidebarItem icon={<Search size={16} />} label="Search" color="text-rose-500" />
          <SidebarItem icon={<House size={16} />} label="Home" color="text-rose-500" active />
          <SidebarItem icon={<Sparkles size={16} />} label="New" color="text-rose-500" />
          <SidebarItem icon={<Radio size={16} />} label="Radio" color="text-rose-500" />
        </div>

        <div className="px-5 mt-6 mb-2 text-[11px] font-semibold text-black/50">Library</div>
        <div className="px-4 space-y-0.5">
          <SidebarItem icon={<Clock size={16} />} label="Recently Added" color="text-rose-500" />
          <SidebarItem icon={<Mic2 size={16} />} label="Artists" color="text-rose-500" />
          <SidebarItem icon={<Disc3 size={16} />} label="Albums" color="text-rose-500" />
          <SidebarItem icon={<Music2 size={16} />} label="Songs" color="text-rose-500" />
        </div>

        <div className="px-5 mt-6 mb-2 text-[11px] font-semibold text-black/50">Playlists</div>
        <div className="px-4 space-y-0.5">
          <SidebarItem icon={<ListMusic size={16} />} label="All Playlists" color="text-gray-400" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative bg-white/50 h-full overflow-y-auto hide-scrollbar pb-24">
        <div className="px-10 pt-10 pb-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-black">Home</h1>
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 border border-black/10">
            <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Top Picks */}
        <div className="px-10">
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar hide-scrollbar">
            {topPicks.map((item, i) => (
              <div key={i} onClick={() => playSong(i + 1)} className="min-w-[280px] flex flex-col gap-1 cursor-pointer group">
                <span className="text-[11px] font-medium text-black/50 uppercase">{item.subtitle}</span>
                <div className="w-full aspect-square rounded-xl overflow-hidden shadow-sm relative mb-1">
                  <img src={item.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.title} draggable={false} />
                  
                  {/* Play overlay overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40">
                      {(currentSongIndex === i + 1 && isPlaying) ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                    </button>
                  </div>
                  
                  <div className="absolute top-3 right-3 text-[10px] font-bold text-white bg-black/20 backdrop-blur-md px-1.5 py-0.5 rounded flex items-center gap-1">
                    <svg viewBox="0 0 170 170" fill="currentColor" className="w-2.5 h-2.5"><path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.197-2.12-9.973-3.17-14.34-3.17-4.58 0-9.492 1.05-14.746 3.17-5.262 2.13-9.501 3.24-12.742 3.35-4.929 0.21-9.842-1.96-14.746-6.52-3.13-2.73-7.045-7.41-11.735-14.04-5.032-7.08-9.169-15.29-12.41-24.65-3.471-10.11-5.211-19.9-5.211-29.378 0-10.857 2.346-20.221 7.045-28.068 3.693-6.303 8.606-11.275 14.755-14.925s12.793-5.51 19.948-5.629c3.915 0 9.049 1.211 15.429 3.591 6.362 2.388 10.447 3.599 12.238 3.599 1.339 0 5.877-1.416 13.57-4.239 7.275-2.618 13.415-3.702 18.445-3.275 13.63 1.1 23.87 6.473 30.68 16.153-12.19 7.386-18.22 17.731-18.1 31.002 0.11 10.337 3.86 18.939 11.23 25.769 3.34 3.17 7.07 5.62 11.22 7.36-0.9 2.61-1.85 5.11-2.86 7.51zM119.11 7.24c0 8.102-2.96 15.667-8.86 22.669-7.12 8.324-15.732 13.134-25.071 12.375-0.119-0.972-0.188-1.995-0.188-3.07 0-7.778 3.386-16.102 9.399-22.908 3.002-3.446 6.82-6.311 11.45-8.597 4.62-2.252 8.99-3.497 13.1-3.71 0.12 1.083 0.17 2.166 0.17 3.241z"/></svg>
                    Music
                  </div>
                </div>
                <div className="text-[13px] font-semibold text-black leading-tight tracking-tight mt-1">{item.title}</div>
                <div className="text-[13px] text-black/50 leading-tight">{item.artist} {item.year && <><br/>{item.year}</>}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Played */}
        <div className="px-10 mt-8">
          <h2 className="text-xl font-bold tracking-tight mb-4 flex items-center gap-1">
            Recently Played <span className="text-gray-400 text-lg group-hover:text-black">&gt;</span>
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar hide-scrollbar">
            {recentlyPlayed.map((item, i) => (
              <div key={i} onClick={() => playSong(i)} className="min-w-[180px] flex flex-col gap-1 cursor-pointer group">
                <div className="w-full aspect-square rounded-xl overflow-hidden shadow-sm relative mb-1">
                  <img src={item.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.title} draggable={false} />
                  
                  {/* Play overlay overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40">
                      {(currentSongIndex === i && isPlaying) ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-1" />}
                    </button>
                  </div>
                  
                  <div className="absolute top-2 right-2 text-[9px] font-bold text-white bg-black/20 backdrop-blur-md px-1.5 py-0.5 rounded flex items-center gap-1">
                    <svg viewBox="0 0 170 170" fill="currentColor" className="w-2.5 h-2.5"><path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.197-2.12-9.973-3.17-14.34-3.17-4.58 0-9.492 1.05-14.746 3.17-5.262 2.13-9.501 3.24-12.742 3.35-4.929 0.21-9.842-1.96-14.746-6.52-3.13-2.73-7.045-7.41-11.735-14.04-5.032-7.08-9.169-15.29-12.41-24.65-3.471-10.11-5.211-19.9-5.211-29.378 0-10.857 2.346-20.221 7.045-28.068 3.693-6.303 8.606-11.275 14.755-14.925s12.793-5.51 19.948-5.629c3.915 0 9.049 1.211 15.429 3.591 6.362 2.388 10.447 3.599 12.238 3.599 1.339 0 5.877-1.416 13.57-4.239 7.275-2.618 13.415-3.702 18.445-3.275 13.63 1.1 23.87 6.473 30.68 16.153-12.19 7.386-18.22 17.731-18.1 31.002 0.11 10.337 3.86 18.939 11.23 25.769 3.34 3.17 7.07 5.62 11.22 7.36-0.9 2.61-1.85 5.11-2.86 7.51zM119.11 7.24c0 8.102-2.96 15.667-8.86 22.669-7.12 8.324-15.732 13.134-25.071 12.375-0.119-0.972-0.188-1.995-0.188-3.07 0-7.778 3.386-16.102 9.399-22.908 3.002-3.446 6.82-6.311 11.45-8.597 4.62-2.252 8.99-3.497 13.1-3.71 0.12 1.083 0.17 2.166 0.17 3.241z"/></svg>
                    Music
                  </div>
                </div>
                <div className="text-[13px] font-semibold text-black leading-tight tracking-tight mt-1">{item.title}</div>
                <div className="text-[13px] text-black/50 leading-tight">{item.artist}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Mini Player */}
      <div className="absolute bottom-6 left-[50%] -translate-x-[50%] w-[580px] h-16 bg-white/80 backdrop-blur-2xl border border-black/10 rounded-2xl shadow-xl flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 w-[160px]">
            <img src={currentSong.img} className="w-10 h-10 rounded shadow-sm object-cover" alt="Current" />
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-black leading-tight truncate w-[100px]">{currentSong.title}</span>
              <span className="text-[11px] text-black/60 leading-tight truncate w-[100px]">{currentSong.artist}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <button className="text-black/60 hover:text-black transition-colors"><Shuffle size={16} strokeWidth={2.5} /></button>
          <button 
            className="text-black hover:text-rose-500 transition-colors"
            onClick={() => playSong(currentSongIndex > 0 ? currentSongIndex - 1 : songs.length - 1)}
          >
            <SkipBack size={20} fill="currentColor" />
          </button>
          <button 
            className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:scale-105 transition-transform"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
          </button>
          <button 
            className="text-black hover:text-rose-500 transition-colors"
            onClick={() => playSong(currentSongIndex < songs.length - 1 ? currentSongIndex + 1 : 0)}
          >
            <SkipForward size={20} fill="currentColor" />
          </button>
          <button className="text-black/60 hover:text-black transition-colors"><Repeat size={16} strokeWidth={2.5} /></button>
        </div>

        <div className="flex items-center gap-3 w-[160px] justify-end">
          <button className="text-black/60 hover:text-black transition-colors"><Mic size={16} strokeWidth={2.5} /></button>
          <button className="text-black/60 hover:text-black transition-colors"><List size={16} strokeWidth={2.5} /></button>
          <button className="text-black/60 hover:text-black transition-colors"><Airplay size={16} strokeWidth={2.5} /></button>
          <button className="text-black/60 hover:text-black transition-colors"><Volume2 size={16} strokeWidth={2.5} /></button>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, color, active }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer text-[13px] font-medium transition-colors ${active ? "bg-black/5 text-black" : "text-black/80 hover:bg-black/5"}`}>
      <span className={color}>{icon}</span>
      {label}
    </div>
  );
}
