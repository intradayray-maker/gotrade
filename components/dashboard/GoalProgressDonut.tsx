"use client";

import GTCard from "@/components/ui/GTCard";
import { Doughnut } from "react-chartjs-2";
import { useGoals } from "@/hooks/useGoals";

type GoalProgressDonutProps = {
  monthlyIncome: number;
};

export default function GoalProgressDonut({
  monthlyIncome,
}: GoalProgressDonutProps) {
  const { goals } = useGoals();

  if (!goals) return null;

  const pct = Math.min((monthlyIncome / goals.monthlyIncomeGoal) * 100, 100);

  const data = {
    labels: ["Progress", "Remaining"],
    datasets: [
      {
        data: [pct, 100 - pct],
        backgroundColor: ["#22c55e", "rgba(255,255,255,0.1)"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <GTCard className="!p-4">
      <h2 className="text-sm font-medium text-slate-200 mb-2">
        Goal Progress
      </h2>
      <Doughnut data={data} />
      <p className="text-center text-xs text-slate-400 mt-2">
        {pct.toFixed(1)}% of monthly goal
      </p>
    </GTCard>
  );
}
