"use client";

import { goColors, goFont } from "@/lib/goTheme";

interface GTSliderProps {
  label?: string;
  value: number;
  onChange: (v: number) => void;
  color?: "blue" | "gold";
}

export default function GTSlider({
  label,
  value,
  onChange,
  color = "blue",
}: GTSliderProps) {
  const active =
    color === "blue" ? goColors.blue : color === "gold" ? goColors.gold : goColors.blue;

  return (
    <div className="flex flex-col gap-2" style={{ fontFamily: goFont }}>
      {label && (
        <label className="text-[13px]" style={{ color: goColors.lightGray }}>
          {label} - {value}%
        </label>
      )}

      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-3 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${active} ${value}%, ${goColors.gray} ${value}%)`,
        }}
      />
    </div>
  );
}
