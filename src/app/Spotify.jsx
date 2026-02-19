import { useState } from "react";

export default function Spotify() {
  // Your Spotify playlist ID
  const playlistId = "37i9dQZF1DXcBWIGoYBM5M"; // Example: Today's Top Hits

  return (
    <div className="h-full w-full bg-linear-to-b from-[#1a1a1a] to-[#121212] text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-black/30">
        <div className="flex items-center gap-3">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg"
            alt="Spotify"
            className="w-8 h-8"
          />
          <h1 className="text-xl font-bold">Spotify</h1>
        </div>
        <button
          onClick={() => window.open(`https://open.spotify.com/playlist/${playlistId}`, "_blank")}
          className="px-4 py-1.5 bg-[#1DB954] hover:bg-[#1ed760] text-black text-sm font-semibold rounded-full transition-colors"
        >
          Open in Spotify
        </button>
      </div>

      {/* Main Content - Spotify Embed */}
      <div className="flex-1 p-4 overflow-hidden">
        <iframe
          src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="rounded-xl"
          style={{ minHeight: "400px" }}
        />
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-black/30 border-t border-white/10">
        <p className="text-xs text-white/50 text-center">
          🎵 Full playback controls available • Play, Pause, Skip, Volume & more
        </p>
      </div>
    </div>
  );
}
