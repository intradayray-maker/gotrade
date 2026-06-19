"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import type { CopyTradingSettingsPayload } from "@/types/copy-trading";

type RiskFormProps = {
  onSave: (settings: CopyTradingSettingsPayload) => Promise<void>;
};

export default function RiskForm({ onSave }: RiskFormProps) {
  const [riskMultiplier, setRiskMultiplier] = useState(1);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave({
      risk_multiplier: Number(riskMultiplier),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 rounded-xl border border-white/10 bg-neutral-900/40 shadow-lg shadow-black/40 backdrop-blur-sm"
    >
      <h2 className="text-xl font-semibold text-white/90">Risk Multiplier</h2>

      <input
        type="number"
        step="0.1"
        value={riskMultiplier}
        onChange={(e) => setRiskMultiplier(Number(e.target.value))}
        className="w-full border rounded px-3 py-2 bg-black/20 border-gray-700 text-white"
      />

      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">
        Save Risk
      </button>
    </form>
  );
}
