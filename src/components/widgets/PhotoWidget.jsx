import React, { useState, useEffect } from 'react';

const aestheticImages = [
  "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&h=300&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
  "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=500&h=300&fit=crop",
  "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=500&h=300&fit=crop",
  "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=500&h=300&fit=crop",
  "https://images.unsplash.com/photo-1511316695145-4992006ffddb?w=500&h=300&fit=crop"
];

export default function PhotoWidget({ imageSrc }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % aestheticImages.length);
      setImageLoaded(true);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-[340px] h-40 rounded-3xl overflow-hidden shadow-sm relative group bg-gradient-to-br from-slate-400 to-slate-600 select-none shrink-0 pointer-events-auto">
      <img 
        src={aestheticImages[currentImageIndex]} 
        alt="Photo" 
        className="w-full h-full object-cover pointer-events-none transition-opacity duration-1000"
        draggable={false}
        onLoad={() => setImageLoaded(true)}
        onError={() => {
          setImageLoaded(false);
          setCurrentImageIndex((prev) => (prev + 1) % aestheticImages.length);
        }}
      />
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-500/50">
          <span className="text-white/60 text-sm">Loading...</span>
        </div>
      )}
    </div>
  );
}