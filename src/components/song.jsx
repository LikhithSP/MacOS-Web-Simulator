import { useState, useRef } from "react";
import { FaPlay, FaPause } from "react-icons/fa";

export default function LastPlayedCard() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full max-w-lg     mt-6">
      <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-4 py-2 rounded-xl hover:bg-white/10 transition">
        {/* Thumbnail */}
        <img
          src="/icons/SpotifyThree.jpg"
          alt="cover"
          className="w-16 h-16 object-cover rounded-md"
        />

        {/* Text Section */}
        <div className="flex-1">
          <p className="text-green-400 text-sm flex items-center gap-1">
            <img src="/icons/spotify.jpg" className="w-6 h-6 rounded-full" /> Last played
          </p>
          <p className="text-white font-semibold">DIE WITH SMILE </p>
          <p className="text-white/60 text-sm">
            by D'Mile, Andrew Watt, and James Fauntleroy
          </p>
        </div>

        {/* Play Button */}
        <button
          onClick={togglePlay}
          className="w-10 h-10 flex items-center justify-center rounded-md border border-transparent bg-white/5 hover:bg-white/20 transition"
        >
          {isPlaying ? (
            <FaPause className="text-white" />
          ) : (
            <FaPlay className="text-white" />
          )}
        </button>
      </div>

      {/* Audio Element */}
      <audio ref={audioRef} src="/music/DIE.mp3" />
    </div>
  );
}
