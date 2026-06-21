"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartOptions,
  TooltipItem,
  Tick
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function BiWeeklyGrowthChart() {
  // Labels for each bi‑weekly period
  const labels: string[] = ["P1","P2","P3","P4","P5","P6","P7","P8","P9"];

  // Account balances after each period
  const balances: number[] = [
    21100,
    21700,
    22600,
    23600,
    23200,
    23450,
    23350,
    23250,
    23700
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Account Balance",
        data: balances,
        backgroundColor: "rgba(16,185,129,0.45)",
        borderColor: "rgba(16,185,129,1)",
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: "rgba(16,185,129,0.75)",
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: TooltipItem<"bar">) =>
            "$" + (ctx.raw as number).toLocaleString(),
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value: string | number) =>
            "$" + Number(value).toLocaleString(),
          color: "rgba(255,255,255,0.6)",
        },
        grid: {
          color: "rgba(255,255,255,0.05)",
        },
      },
      x: {
        ticks: { color: "rgba(255,255,255,0.6)" },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="rounded-xl border border-emerald-500/30 p-4 bg-[#0b0b12] shadow-[0_0_25px_rgba(16,185,129,0.25)]">
      <p className="text-xs uppercase tracking-[0.18em] text-emerald-400 mb-3">
        Bi‑Weekly Growth
      </p>
      <Bar data={data} options={options} />
    </div>
  );
}
