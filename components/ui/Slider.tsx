"use client";

import React from "react";

export type SliderProps = {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (v: number) => void;
};

export default function Slider({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
}: SliderProps) {
  const percent = (value - min) / (max - min);

  return (
    <div className="relative w-full pt-8">
      {/* Floating Bubble Label */}
      <div
        className="absolute -top-1 transform -translate-x-1/2 px-2 py-1 rounded-md text-xs font-medium bg-blue-600 text-white shadow-lg transition-all"
        style={{ left: `${percent * 100}%` }}
      >
        {value}%

        {/* Tiny Arrow */}
        <div className="absolute left-1/2 -bottom-1 w-0 h-0 -translate-x-1/2 
                        border-l-4 border-r-4 border-t-4 border-l-transparent 
                        border-r-transparent border-t-blue-600" />
      </div>

      {/* Recommended Range Highlight */}
      <div className="absolute left-[40%] right-[40%] top-[18px] h-2 rounded-full bg-blue-500/20 pointer-events-none" />

      {/* Slider Track */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer transition-all slider-thumb"
        style={{
          background: `linear-gradient(to right, #3b82f6 ${percent * 100}%, #1e293b ${percent * 100}%)`,
        }}
      />

      {/* Tick marks */}
      <div className="relative w-full flex justify-between px-[2px] mt-2">
        {[0, 25, 50, 75, 100].map((_, i) => (
          <div
            key={i}
            className="w-[2px] h-2 rounded-full bg-blue-400/40"
            style={{ filter: "blur(1px)" }}
          />
        ))}
      </div>
    </div>
  );
}
