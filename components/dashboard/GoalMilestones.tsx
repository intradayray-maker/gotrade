"use client";

import GTCard from "@/components/ui/GTCard";
import { motion } from "framer-motion";

type GoalMilestonesProps = {
  currentBalance: number;
  targetBalance: number;
};

export default function GoalMilestones({
  currentBalance,
  targetBalance,
}: GoalMilestonesProps) {
  const milestones = [
    { label: "10% of Goal", value: targetBalance * 0.1 },
    { label: "25% of Goal", value: targetBalance * 0.25 },
    { label: "50% of Goal", value: targetBalance * 0.5 },
    { label: "75% of Goal", value: targetBalance * 0.75 },
    { label: "Goal Achieved", value: targetBalance },
  ];

  return (
    <GTCard className="!p-4">
      <h2 className="text-sm font-medium text-slate-200 mb-3">
        Goal Milestones
      </h2>

      <div className="flex flex-col gap-3">
        {milestones.map((m, i) => {
          const reached = currentBalance >= m.value;

          return (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center justify-between"
            >
              <span className="text-xs text-slate-400">{m.label}</span>
              <span
                className={`text-xs ${
                  reached ? "text-green-400" : "text-slate-500"
                }`}
              >
                {reached ? "✓" : "—"}
              </span>
            </motion.div>
          );
        })}
      </div>
    </GTCard>
  );
}
