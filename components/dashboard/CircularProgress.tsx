"use client";

import { useEffect, useState } from "react";

interface CircularProgressProps {
  value: number; // 0–100
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export function CircularProgress({
  value,
  size = 140,
  strokeWidth = 10,
  label,
}: CircularProgressProps) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const clamped = Math.max(0, Math.min(100, value || 0));
    const id = requestAnimationFrame(() => setAnimatedValue(clamped));
    return () => cancelAnimationFrame(id);
  }, [value]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedValue / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* outer glow */}
      <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-xl" />
      <svg
        width={size}
        height={size}
        className="relative rotate-[-90deg]"
        aria-hidden="true"
      >
        {/* background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(148, 163, 184, 0.35)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
        {/* progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
        <defs>
          <linearGradient
            id="progressGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="50%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#a7f3d0" />
          </linearGradient>
        </defs>
      </svg>

      {/* center content */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
          {label || "Progress"}
        </div>
        <div className="mt-1 text-2xl font-semibold text-emerald-400">
          {animatedValue.toFixed(1)}%
        </div>
      </div>
    </div>
  );
}
