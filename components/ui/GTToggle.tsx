"use client";

import { goColors, goFont } from "@/lib/goTheme";

interface GTToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}

export default function GTToggle({ checked, onChange, label }: GTToggleProps) {
  return (
    <div
      className="flex items-center gap-3 cursor-pointer select-none"
      onClick={() => onChange(!checked)}
      style={{ fontFamily: goFont }}
    >
      <div
        className="relative w-14 h-8 rounded-full transition-all duration-300"
        style={{
          background: checked ? goColors.green : "#27272f",
          boxShadow: checked ? "0 0 16px rgba(3,82,65,0.7)" : "none",
        }}
      >
        <div
          className="absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow-md transition-all duration-300"
          style={{
            transform: checked ? "translateX(24px)" : "translateX(0)",
          }}
        />
      </div>
      {label && (
        <span
          className="text-sm"
          style={{ color: checked ? goColors.lightGray : goColors.gray }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
