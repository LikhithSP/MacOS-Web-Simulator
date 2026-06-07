import React from 'react';
import { FiSun, FiCloudDrizzle } from 'react-icons/fi';

export default function WeatherWidget() {
  return (
    <div className="w-40 h-40 p-4 flex flex-col justify-between bg-gradient-to-br from-[#4b88d3] to-[#4374b6] rounded-3xl text-white shadow-sm select-none shrink-0 pointer-events-auto">
      <div>
        <div className="text-sm font-semibold mb-1">San Francisco</div>
        <div className="text-5xl font-light">53°</div>
      </div>
      <div>
        <div className="flex items-center text-yellow-300 drop-shadow-sm mb-1">
          <FiSun size={20} className="mr-1" />
        </div>
        <div className="text-xs font-semibold">Partly Cloudy</div>
        <div className="text-xs text-white/80 font-medium tracking-tight mt-0.5">H:56° L:50°</div>
      </div>
    </div>
  );
}
