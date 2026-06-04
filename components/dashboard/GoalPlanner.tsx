"use client";

import GTCard from "@/components/ui/GTCard";
import { useMemo, useState } from "react";

interface GoalPlannerProps {
  currentBalance: number;
  monthlyIncomeGoal: number;
  annualIncomeGoal: number;
  expectedMonthlyReturnPct: number;
}

export function GoalPlanner({
  currentBalance,
  monthlyIncomeGoal,
  annualIncomeGoal,
  expectedMonthlyReturnPct,
}: GoalPlannerProps) {
  const currentEquity = currentBalance ?? 0;

  const [monthlyGoal, setMonthlyGoal] = useState(monthlyIncomeGoal || 4000);
  const [roiPct, setRoiPct] = useState(expectedMonthlyReturnPct || 8);
  const [monthlyDeposit, setMonthlyDeposit] = useState(1000);

  const annualGoal = monthlyGoal * 12;
  const requiredBalance = roiPct > 0 ? monthlyGoal / (roiPct / 100) : 0;
  const remaining =
    requiredBalance > currentEquity ? requiredBalance - currentEquity : 0;
  const monthsToGoal =
    remaining > 0 && monthlyDeposit > 0
      ? Math.ceil(remaining / monthlyDeposit)
      : 0;

  const weeklyDeposit = monthlyDeposit / 4;
  const biWeeklyDeposit = monthlyDeposit / 2;

  const progressToRequired =
    requiredBalance > 0 ? Math.min(currentEquity / requiredBalance, 1) : 0;

  const formatCompactCurrency = (value: number) => {
    if (value <= 0 || !isFinite(value)) return "—";
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `$${Math.round(value / 1_000)}k`;
    return `$${Math.round(value).toLocaleString()}`;
  };

  const sparklineBars = useMemo(() => {
    const baseHeights = [0.3, 0.5, 0.8, 0.6, 0.9];
    const intensity = 0.3 + progressToRequired * 0.7;
    return baseHeights.map((h) => h * intensity);
  }, [progressToRequired]);

  const updateSliderFill = (
    e: React.ChangeEvent<HTMLInputElement>,
    min: number,
    max: number
  ) => {
    const v = Number(e.target.value);
    const percent = ((v - min) / (max - min)) * 100;
    e.target.style.setProperty("--value", `${percent}%`);
  };

  return (
    <GTCard className="space-y-6">
      <div className="grid place-items-center space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400 text-center" />
      </div>

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
          SET YOUR MONTHLY GOAL
        </p>

        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-semibold text-slate-50">
            ${monthlyGoal.toLocaleString()}
          </p>
          <p className="text-[15px] italic text-slate-500">
            or ${annualGoal.toLocaleString()} annually
          </p>
        </div>

        <input
          type="range"
          min={2000}
          max={25000}
          step={250}
          value={monthlyGoal}
          onChange={(e) => {
            setMonthlyGoal(Number(e.target.value));
            updateSliderFill(e, 2000, 25000);
          }}
          className="ft-slider w-full mt-1 bg-[#0f0f17] rounded-full"
        />

        <div className="mt-2 flex justify-between text-[10px] text-slate-500">
          <span>$2K</span>
          <span>$5K</span>
          <span>$10K</span>
          <span>$15K</span>
          <span>$20K</span>
          <span>$25K</span>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
          SET YOUR MONTHLY ROI %
        </p>

        <p className="mt-1 text-lg font-semibold text-slate-50">
          {roiPct.toFixed(1)}%
        </p>

        <input
          type="range"
          min={3}
          max={20}
          step={0.5}
          value={roiPct}
          onChange={(e) => {
            setRoiPct(Number(e.target.value));
            updateSliderFill(e, 3, 20);
          }}
          className="ft-slider w-full mt-1 bg-[#0f0f17] rounded-full"
        />

        <div className="mt-2 flex justify-between text-[10px] text-slate-500">
          <span>3%</span>
          <span>5%</span>
          <span>10%</span>
          <span>15%</span>
          <span>20%</span>
        </div>
      </div>

      <div className="border-t border-slate-800" />

      <div className="space-y-4">
        <div>
          <p className="text-[14px] text-slate-500">
            If you deposit this much per month…
          </p>
          <p className="mt-1 text-lg font-semibold text-slate-50">
            ${monthlyDeposit.toLocaleString()}
          </p>

          <input
            type="range"
            min={250}
            max={10000}
            step={50}
            value={monthlyDeposit}
            onChange={(e) => {
              setMonthlyDeposit(Number(e.target.value));
              updateSliderFill(e, 250, 10000);
            }}
            className="ft-slider w-full mt-2 bg-[#0f0f17] rounded-full"
          />

          <div className="mt-2 flex justify-between text-[10px] text-slate-500">
            <span>$250</span>
            <span>$1K</span>
            <span>$2.5K</span>
            <span>$5K</span>
            <span>$10K</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs text-center">
          <GTCard className="!p-3">
            <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500 text-center">
              WEEKLY
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-50 text-center">
              ${weeklyDeposit.toFixed(0)}
            </p>
          </GTCard>

          <GTCard className="!p-3">
            <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500 text-center">
              BI-WEEKLY
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-50 text-center">
              ${biWeeklyDeposit.toFixed(0)}
            </p>
          </GTCard>

          <GTCard className="!p-3">
            <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500 text-center">
              MONTHLY
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-50 text-center">
              ${monthlyDeposit.toFixed(0)}
            </p>
          </GTCard>
        </div>
      </div>

      <div className="border-t border-slate-800" />

      <div className="grid grid-cols-[1fr_auto_1fr] gap-6 items-center text-center">
        <div className="space-y-2 flex flex-col items-center justify-center">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
            REQUIRED BALANCE
          </p>

          <p className="mt-1 text-4xl font-bold text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.65)]">
            {formatCompactCurrency(requiredBalance)}
          </p>
        </div>

        <div className="w-px h-full bg-slate-800" />

        <div className="space-y-2 text-[11px] text-slate-400">
          <p className="uppercase tracking-[0.16em]">ACCOUNT PROGRESS</p>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span>CURRENT BALANCE</span>
              <span className="text-slate-300">
                {formatCompactCurrency(currentEquity)}
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-900 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${progressToRequired * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span>REQUIRED BALANCE</span>
              <span className="text-slate-300">
                {formatCompactCurrency(requiredBalance)}
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-900 overflow-hidden">
              <div className="h-full rounded-full bg-slate-600 w-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800" />

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
          YOU WILL HIT YOUR GOAL IN
        </p>

        <div className="flex items-center justify-between gap-4">
          <div>
            <p
              className={`text-2 font-semibold ${
                monthsToGoal > 0
                  ? "text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.45)]"
                  : "text-red-400 drop-shadow-[0_0_6px_rgba(255,0,0,0.45)]"
              }`}
            >
              {monthsToGoal > 0
                ? `${monthsToGoal} MONTHS`
                : "ADJUST DEPOSIT OR ROI"}
            </p>

            <p className="mt-1 text-[11px] text-slate-500">
              Based on your monthly deposits reaching the required account
              balance.
            </p>
          </div>

          <div className="flex items-end gap-[3px] h-10">
            {sparklineBars.map((h, idx) => (
              <div
                key={idx}
                className="w-[5px] rounded-full bg-emerald-500/80"
                style={{
                  height: `${h * 32}px`,
                  boxShadow: "0 0 8px rgba(16,185,129,0.55)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </GTCard>
  );
}
