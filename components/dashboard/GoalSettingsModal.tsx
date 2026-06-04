"use client";

import { useEffect, useMemo, useState } from "react";

type GoalSettingsModalProps = {
  open: boolean;
  initialMonthlyIncomeGoal: number;
  saving?: boolean;
  onClose: () => void;
  onSave: (payload: {
    monthlyIncomeGoal: number;
    annualIncomeGoal: number;
  }) => Promise<void>;
};

function toNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function GoalSettingsModal({
  open,
  initialMonthlyIncomeGoal,
  saving = false,
  onClose,
  onSave,
}: GoalSettingsModalProps) {
  const [monthlyInput, setMonthlyInput] = useState("0");

  useEffect(() => {
    if (!open) return;
    setMonthlyInput(String(Number.isFinite(initialMonthlyIncomeGoal) ? initialMonthlyIncomeGoal : 0));
  }, [open, initialMonthlyIncomeGoal]);

  const monthlyIncomeGoal = useMemo(() => toNumber(monthlyInput), [monthlyInput]);
  const annualIncomeGoal = monthlyIncomeGoal * 12;

  if (!open) return null;

  const handleSave = async () => {
    await onSave({
      monthlyIncomeGoal,
      annualIncomeGoal,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-[#0b0b12] p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-slate-200">Edit Goals</h2>

        <div className="space-y-4 text-sm">
          <div>
            <label className="text-slate-400" htmlFor="monthly-goal-input">
              Monthly Income Goal
            </label>
            <input
              id="monthly-goal-input"
              type="number"
              min={0}
              step="1"
              value={monthlyInput}
              onChange={(e) => setMonthlyInput(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-700 bg-black/20 p-2 text-slate-200"
            />
          </div>

          <div>
            <label className="text-slate-400" htmlFor="annual-goal-output">
              Annual Income Goal (Auto)
            </label>
            <input
              id="annual-goal-output"
              type="number"
              value={annualIncomeGoal}
              readOnly
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900/60 p-2 text-slate-300"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-slate-700 px-4 py-2 text-slate-200 hover:bg-slate-600"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-md bg-emerald-500 px-4 py-2 font-semibold text-black hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Goals"}
          </button>
        </div>
      </div>
    </div>
  );
}
