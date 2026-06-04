"use client";

import { Line } from "react-chartjs-2";
import "chart.js/auto";
import GoalPlanner from "@/components/dashboard/GoalPlanner";

export default function EquityChart({
  data,
}: {
  data: { timestamp: string; equity: number }[];
}) {
  // 🔥 Compute current balance from the last equity point
  const currentBalance =
    data && data.length > 0 ? data[data.length - 1].equity : 0;

  // 🔥 Placeholder expected monthly return (you can replace with real stats)
  // Example: average of last 20 days of returns
  let expectedMonthlyReturnPct = 0;

  if (data.length > 5) {
    const returns: number[] = [];

    for (let i = 1; i < data.length; i++) {
      const prev = data[i - 1].equity;
      const curr = data[i].equity;
      const pct = ((curr - prev) / prev) * 100;
      returns.push(pct);
    }

    // Simple average daily return → approximate monthly return
    const avgDaily = returns.reduce((a, b) => a + b, 0) / returns.length;
    expectedMonthlyReturnPct = avgDaily * 20; // 20 trading days
  }

  const chartData = {
    labels: data.map((d) =>
      new Date(d.timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    ),
    datasets: [
      {
        label: "Equity",
        data: data.map((d) => d.equity),
        borderColor: "#4ade80",
        backgroundColor: "rgba(74, 222, 128, 0.15)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  return (
    <div className="rounded-xl p-6 bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col gap-6">
      <h2 className="text-lg font-semibold">Equity Curve</h2>

      <Line data={chartData} />

      {/* ⭐ Goal Planner integrated cleanly */}
      <GoalPlanner
        currentBalance={currentBalance}
        expectedMonthlyReturnPct={expectedMonthlyReturnPct}
      />
    </div>
  );
}
