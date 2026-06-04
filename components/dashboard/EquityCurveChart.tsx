"use client";

import { useMemo, useState } from "react";

export type EquityPoint = {
  created_at: string;
  equity: number;
};

interface Props {
  equityHistory: EquityPoint[];
}

const TIMEFRAMES = [
  { id: "1D", label: "Day" },
  { id: "1W", label: "Week" },
  { id: "1M", label: "Month" },
  { id: "3M", label: "Quarter" },
  { id: "1Y", label: "Year" },
  { id: "ALL", label: "All Time" },
] as const;

type TimeframeId = (typeof TIMEFRAMES)[number]["id"];

export default function EquityAreaChart({ equityHistory }: Props) {
  const [timeframe, setTimeframe] = useState<TimeframeId>("ALL");

  const points = useMemo(() => {
    if (!equityHistory.length) return [];

    const sorted = [...equityHistory].sort(
      (a, b) =>
        new Date(a.created_at).getTime() -
        new Date(b.created_at).getTime()
    );

    // timeframe filtering
    if (timeframe !== "ALL") {
      const latest = new Date(sorted[sorted.length - 1].created_at);
      const from = new Date(latest);

      switch (timeframe) {
        case "1D": from.setDate(from.getDate() - 1); break;
        case "1W": from.setDate(from.getDate() - 7); break;
        case "1M": from.setMonth(from.getMonth() - 1); break;
        case "3M": from.setMonth(from.getMonth() - 3); break;
        case "1Y": from.setFullYear(from.getFullYear() - 1); break;
      }

      const filtered = sorted.filter(
        (p) => new Date(p.created_at).getTime() >= from.getTime()
      );

      if (filtered.length > 0) {
        sorted.splice(0, sorted.length, ...filtered);
      }
    }

    return sorted;
  }, [equityHistory, timeframe]);

  const latestEquity = points.length ? points[points.length - 1].equity : 0;

  // Build SVG path
  const { path, fillPath } = useMemo(() => {
    if (points.length < 2) return { path: "", fillPath: "" };

    const width = 600;
    const height = 200;

    const min = Math.min(...points.map((p) => p.equity));
    const max = Math.max(...points.map((p) => p.equity));
    const range = max - min || 1;

    const step = width / (points.length - 1);

    const coords = points.map((p, i) => {
      const x = i * step;
      const y = height - ((p.equity - min) / range) * height;
      return [x, y];
    });

    const path = coords
      .map(([x, y], i) => (i === 0 ? `M ${x},${y}` : `L ${x},${y}`))
      .join(" ");

    const fillPath =
      path +
      ` L ${coords[coords.length - 1][0]},${height} L 0,${height} Z`;

    return { path, fillPath };
  }, [points]);

  return (
    <div className="rounded-xl border border-slate-800 bg-[#05060B] p-4 flex flex-col gap-4 min-w-0">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
            EQUITY GROWTH
          </p>
          <p className="mt-1 text-lg font-semibold text-slate-50">
            ${latestEquity.toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-1 bg-black/40 px-1 py-1 rounded-full">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.id}
              onClick={() => setTimeframe(tf.id)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition ${
                timeframe === tf.id
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* AREA CHART */}
      <div className="relative w-full h-56 overflow-hidden min-w-0">
        {points.length < 2 ? (
          <div className="text-xs text-slate-500 italic mx-auto mt-20">
            Not enough data to display chart.
          </div>
        ) : (
          <svg
            viewBox="0 0 600 200"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <defs>
              <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            <path
              d={fillPath}
              fill="url(#areaFill)"
              className="transition-all duration-500"
            />

            <path
              d={path}
              fill="none"
              stroke="#34d399"
              strokeWidth="2.5"
              className="transition-all duration-500 drop-shadow-[0_0_6px_rgba(52,211,153,0.45)]"
            />
          </svg>
        )}

{/* TIMELINE (Fancy Glow) */}
{points.length > 1 && (
  <div className="absolute bottom-1 left-0 right-0 flex justify-between px-3 pointer-events-none select-none">
    {Array.from(
      new Set([
        0,
        Math.floor(points.length / 2),
        points.length - 1,
      ])
    ).map((i) => {
      const date = new Date(points[i].created_at).toLocaleDateString(
        undefined,
        { month: "short", day: "numeric" }
      );

      return (
        <div key={`tl-${i}`} className="flex flex-col items-center animate-fadeIn">
          <div className="w-[1px] h-3 bg-emerald-500/20 mb-1" />
          <span className="text-[10px] text-emerald-300/70 drop-shadow-[0_0_4px_rgba(16,185,129,0.6)]">
            {date}
          </span>
        </div>
      );
    })}
  </div>
)}

      </div>

      <div className="text-[10px] text-slate-500 flex justify-between">
        <span className="italic">Smoothed equity curve over time.</span>
        <span>Auto‑scaled to timeframe.</span>
      </div>
    </div>
  );
}
