"use client";

import React from "react";

interface GTSliderProps {
  title?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;

  // NEW OPTIONAL PROPS
  dollars?: boolean;
  percent?: boolean;

  // 🔥 NEW OVERRIDES
  titleClassName?: string;
  trackClassName?: string;
}

export default function GTSlider({
  title = "",
  value,
  min,
  max,
  step = 1,
  onChange,
  dollars = false,
  percent = false,

  // 🔥 NEW OVERRIDES
  titleClassName = "",
  trackClassName = "",
}: GTSliderProps) {

  // ==========================
  // AUTO-DETECT FORMATTING
  // ==========================
  const isDollar = dollars || title.includes("$");
  const isPercent = percent || title.includes("%");

  // ==========================
  // UNIVERSAL SMART FORMATTER
  // ==========================
  const formatSmart = (num: number) => {
    const abs = Math.abs(num);

    // Percent formatting
    if (isPercent) {
      if (abs < 1)
        return (num).toFixed(2).replace(/0+$/, "").replace(/\.$/, "") + "%";

      if (abs >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M%";
      if (abs >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "k%";

      return num.toFixed(1).replace(/\.0$/, "") + "%";
    }

    // Dollar formatting
    if (isDollar) {
      if (abs >= 1_000_000) return "$" + (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
      if (abs >= 1_000) return "$" + (num / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
      return "$" + num.toLocaleString();
    }

    // Normal number formatting
    if (abs >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    if (abs >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "k";

    return num.toLocaleString();
  };

  // ==========================
  // SLIDER POSITION
  // ==========================
  const percentPos = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full flex flex-col items-center mt-2 mb-2 p-0">

      <div className={`relative w-full ${trackClassName}`}>

        {/* Floating label */}
        <div
          className="absolute -top-6 transform -translate-x-1/2 transition-all duration-300 ease-out"
          style={{ left: `calc(${percentPos}% + 1px)` }}
        >
          <div className="px-3 py-0.5 rounded-md bg-slate-800/20 border border-slate-700/40 text-slate-400 text-[14px] font-semibold backdrop-blur-sm">
            {formatSmart(value)}
          </div>

          <div className="mx-auto w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-400/40"></div>
        </div>

        {/* Slider */}
        <div className="pt-5 pb-1 relative w-full">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full"
            style={{ "--value": `${percentPos}%` } as React.CSSProperties}
          />
        </div>

      </div>

      {/* Title */}
      {title && (
        <h3
          className={`
            mt-1 mb-1 text-[14px] font-semibold tracking-wide text-center
            text-slate-500
            ${titleClassName}
          `}
        >
          {title}
        </h3>
      )}

    </div>
  );
}

