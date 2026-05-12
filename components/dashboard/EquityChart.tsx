"use client";

import { Line } from "react-chartjs-2";
import "chart.js/auto";

export default function EquityChart({
  data,
}: {
  data: { timestamp: string; equity: number }[];
}) {
  const chartData = {
    labels: data.map((d) =>
      new Date(d.timestamp).toLocaleDateString()
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
    <div className="rounded-xl p-6 bg-white/5 backdrop-blur-xl border border-white/10">
      <h2 className="text-lg font-semibold mb-4">Equity Curve</h2>
      <Line data={chartData} />
    </div>
  );
}
