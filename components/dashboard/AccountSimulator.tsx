"use client";

import GTCard from "@/components/ui/GTCard";

type CalculatorCard = {
  currentBalance: number;
  expectedMonthlyReturnPct: number;
  targetBalance: number;
};

export default function CalculatorCard({
  currentBalance,
  expectedMonthlyReturnPct,
  targetBalance,
}: CalculatorCard) {
  const scenarios = [1.2, 1.5, 2, 3, 5].map((mult) => {
    const newBalance = currentBalance * mult;

    const months =
      Math.log(targetBalance / newBalance) /
      Math.log(1 + expectedMonthlyReturnPct / 100);

    return {
      balance: newBalance,
      months: Math.max(months, 0),
      multiplier: mult,
    };
  });

  return (
    <GTCard className="!p-4">
      <h2 className="text-sm font-medium text-slate-200 mb-2">
        Bigger Account Simulator
      </h2>

      <div className="text-xs text-slate-400 mb-2">
        How faster you'd reach your goal if your account was larger:
      </div>

      {scenarios.map((s) => (
        <div
          key={s.multiplier}
          className="flex justify-between text-slate-300 text-xs"
        >
          <span>${s.balance.toLocaleString()}</span>
          <span>{s.months.toFixed(1)} months</span>
        </div>
      ))}
    </GTCard>
  );
}
