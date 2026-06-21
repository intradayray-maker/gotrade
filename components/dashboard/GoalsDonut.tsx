"use client";

import GTCard from "@/components/ui/GTCard";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
  labels: ["Weekly", "Monthly", "Yearly"],
  datasets: [
    {
      label: "Goal Progress",
      data: [72, 45, 18],
      backgroundColor: ["#22c55e", "#eab308", "#38bdf8"],
      borderColor: "#020617",
      borderWidth: 2,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false as const,
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: {
        color: "#9ca3af",
      },
    },
    tooltip: {
      callbacks: {
        label: (ctx: any) => `${ctx.label}: ${ctx.parsed}%`,
      },
    },
  },
  cutout: "65%",
};

export default function GoalsDonut() {
  return (
    <GTCard className="relative h-52 !p-4">
      <Doughnut data={data} options={options} />
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-xs uppercase tracking-wide text-slate-500">
          Overall Progress
        </span>
        <span className="text-xl font-semibold text-slate-100">45%</span>
      </div>
    </GTCard>
  );
}
