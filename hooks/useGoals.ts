"use client";

import { useEffect, useState } from "react";

export type GoalsData = {
  monthlyIncomeGoal: number;
  annualIncomeGoal: number;
  requiredBalance: number;
};

const DEFAULT_GOALS: GoalsData = {
  monthlyIncomeGoal: 0,
  annualIncomeGoal: 0,
  requiredBalance: 0,
};

function toNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeGoals(input: unknown): GoalsData {
  const raw = (input ?? {}) as Record<string, unknown>;

  const monthlyIncomeGoal = toNumber(raw.monthlyIncomeGoal ?? raw.monthlyGoal);
  const annualIncomeGoal =
    toNumber(raw.annualIncomeGoal ?? raw.annualGoal) || monthlyIncomeGoal * 12;
  const requiredBalance = toNumber(raw.requiredBalance);

  return {
    monthlyIncomeGoal,
    annualIncomeGoal,
    requiredBalance,
  };
}

export function useGoals() {
  const [goals, setGoals] = useState<GoalsData>(DEFAULT_GOALS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/goals", { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed with ${res.status}`);

      const json = await res.json();
      setGoals(normalizeGoals(json?.data));
    } catch (err) {
      console.error("useGoals fetch error:", err);
      setGoals(DEFAULT_GOALS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchGoals();
  }, []);

  const saveGoals = async (newGoals: Partial<GoalsData>) => {
    try {
      setSaving(true);
      const normalized = normalizeGoals(newGoals);

      const res = await fetch("/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(normalized),
      });

      if (!res.ok) throw new Error(`Failed with ${res.status}`);
      await fetchGoals();
    } catch (err) {
      console.error("useGoals save error:", err);
    } finally {
      setSaving(false);
    }
  };

  return { goals, loading, saving, saveGoals, refreshGoals: fetchGoals };
}
