"use client";

import { motion } from "framer-motion";

type EquityPoint = {
  equity: number;
  timestamp?: string;
};

type GoalHeatmapProps = {
  history: EquityPoint[];
};

export default function GoalHeatmap({ history }: GoalHeatmapProps) {
  // Last 60 days
  const slice = history.slice(-60);

  const days = slice.map((h, i) => {
    if (i === 0) return { pct: 0 };
    const prev = slice[i - 1].equity;
    const pct = prev ? ((h.equity - prev) / prev) * 100 : 0;
    return { pct };
  });

  const getColor = (pct: number) => {
    if (pct > 2) return "bg-green-500";
    if (pct > 0) return "bg-green-700";
    if (pct === 0) return "bg-slate-700";
    if (pct > -2) return "bg-red-700";
    return "bg-red-500";
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-[#0b0b12] p-4">
      <h2 className="text-sm font-medium text-slate-200 mb-3">
        Goal Heatmap (Last 60 Days)
      </h2>

      <div className="grid grid-cols-15 gap-1">
        {days.map((d, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.02 }}
            className={`w-3 h-3 rounded-sm ${getColor(d.pct)}`}
          />
        ))}
      </div>
    </div>
  );
}
