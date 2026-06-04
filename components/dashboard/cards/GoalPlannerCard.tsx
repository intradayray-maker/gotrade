"use client";

import { useState } from "react";
import { CircularProgress } from "@/components/dashboard/CircularProgress";
import { calculateGoalData, GoalDataResult } from "@/utils/calculateGoalData";

export function GoalPlanner({
  currentBalance,
  monthlyIncomeGoal,
  annualIncomeGoal,
  expectedMonthlyReturnPct,
}: {
  currentBalance: number;
  monthlyIncomeGoal: number;
  annualIncomeGoal: number;
  expectedMonthlyReturnPct: number;
}) {
  const [monthlyGoal, setMonthlyGoal] = useState(monthlyIncomeGoal);

  const annualGoal = monthlyGoal * 12;

  const goalData: GoalDataResult = calculateGoalData({
    currentBalance,
    expectedMonthlyReturnPct,
    monthlyIncomeGoal: monthlyGoal,
    annualIncomeGoal: annualGoal,
  });

  const { requiredBalance, progressPct, monthsToGoal, scenarios } = goalData;

  return (
    <div className="rounded-xl border border-slate-800 bg-[#0b0b12] p-4">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
        Income Goal Planner
      </p>

      <div className="mt-4 flex items-center gap-8">
        {/* Progress Ring */}
        <CircularProgress value={progressPct} label="Progress" size={130} />

        {/* Monthly Goal Slider */}
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
            Monthly Goal
          </p>
          <p className="mt-1 text-xl font-semibold text-slate-50">
            ${monthlyGoal.toLocaleString()}
          </p>

          <input
            type="range"
            min={500}
            max={50000}
            step={100}
            value={monthlyGoal}
            onChange={(e) => setMonthlyGoal(Number(e.target.value))}
            className="w-full mt-3"
          />

          <p className="mt-4 text-xs uppercase tracking-[0.18em] text-slate-400">
            Annual Goal
          </p>
          <p className="mt-1 text-lg font-semibold text-slate-50">
            ${annualGoal.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Required Account Size + Time to Goal */}
      <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-slate-200">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
            Required Account Size
          </p>
          <p className="mt-1 text-lg font-semibold text-emerald-400">
            {requiredBalance > 0
              ? `$${requiredBalance.toLocaleString()}`
              : "—"}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
            Time to Goal
          </p>
          <p className="mt-1 text-lg font-semibold text-slate-50">
            {monthsToGoal > 0 ? `${monthsToGoal.toFixed(1)} months` : "—"}
          </p>
        </div>
      </div>

      {/* Scenarios */}
      <div className="mt-6">
        <p className="mb-2 text-xs uppercase tracking-[0.18em] text-slate-400">
          Scenarios
        </p>

        <div className="grid gap-2 sm:grid-cols-3">
          {scenarios.map((s) => (
            <div
              key={s.balance}
              className="rounded-xl border border-slate-800 bg-[#0f0f17] px-3 py-2 text-xs"
            >
              <p className="text-[11px] text-slate-400">
                ${s.balance.toLocaleString()}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-50">
                {s.months > 0 ? `${s.months.toFixed(1)} mo` : "—"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
