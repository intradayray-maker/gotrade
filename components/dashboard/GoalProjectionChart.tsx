"use client";

import GTCard from "@/components/ui/GTCard";
import { Line } from "react-chartjs-2";

type GoalProjectionChartProps = {
  currentBalance: number;
  expectedMonthlyReturnPct: number;
  targetBalance: number;
};

export default function GoalProjectionChart({
  currentBalance,
  expectedMonthlyReturnPct,
  targetBalance,
}: GoalProjectionChartProps) {
  const months = Array.from({ length: 24 }, (_, i) => i + 1);

  const projected = months.map((m) => {
    return currentBalance * Math.pow(1 + expectedMonthlyReturnPct / 100, m);
  });

  const data = {
    labels: months.map((m) => `${m}m`),
    datasets: [
      {
        label: "Projected Balance",
        data: projected,
        borderColor: "#4ade80",
        backgroundColor: "rgba(74,222,128,0.15)",
        fill: true,
        tension: 0.3,
      },
      {
        label: "Goal",
        data: months.map(() => targetBalance),
        borderColor: "#60a5fa",
        borderDash: [4, 4],
        tension: 0.3,
      },
    ],
  };

  return (
    <GTCard className="!p-4">
      <h2 className="text-sm font-medium text-slate-200 mb-2">
        Time-to-Goal Projection
      </h2>
      <Line data={data} />
    </GTCard>
  );
}
