"use client";

import GTCard from "@/components/ui/GTCard";
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
    <GTCard className="!p-6">
      <h2 className="text-lg font-semibold mb-4">Equity Curve</h2>
      <Line data={chartData} />
    </GTCard>
  );
}
