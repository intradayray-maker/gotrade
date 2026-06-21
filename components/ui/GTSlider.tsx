"use client";

import React from "react";

// ------------------------------------------------------------
// TYPES
// ------------------------------------------------------------
interface GTSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  color?: string;
  showTooltip?: boolean;
  showNotches?: boolean;
  waveform?: boolean;
}

// ------------------------------------------------------------
// COMPONENT
// ------------------------------------------------------------
export default function GTSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  color = "emerald",
  showTooltip = true,
  showNotches = true,
  waveform = true
}: GTSliderProps) {
  const percent = (value - min) / (max - min);

  return (
    <div className="w-full space-y-2 relative">

      {/* Label */}
      {label && (
        <p className="text-xs text-slate-400 tracking-wide">{label}</p>
      )}

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="absolute -top-5 ai-tooltip"
          style={{ left: `${percent * 100}%` }}
        >
          {Math.round(percent * 100)}%
        </div>
      )}

      {/* Slider Container */}
      <div className="relative w-full ai-slider-container">

        {/* Notches */}
        {showNotches && (
          <div className="ai-slider-notches">
            {Array.from({ length: 11 }).map((_, i) => (
              <span key={i} />
            ))}
          </div>
        )}

        {/* Slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ "--value": percent } as React.CSSProperties}
          className={`ai-gt-slider ${waveform ? "waveform" : ""}`}
        />
      </div>

      {/* Min/Max */}
      <div className="flex justify-between text-[10px] text-slate-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
