"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import type { CopyTradingSettingsPayload } from "@/types/copy-trading";

type LimitsFormProps = {
  onSave: (settings: CopyTradingSettingsPayload) => Promise<void>;
};

export default function LimitsForm({ onSave }: LimitsFormProps) {
  const [maxDailyLoss, setMaxDailyLoss] = useState(0);
  const [maxPositionSize, setMaxPositionSize] = useState(0);
  const [enabled, setEnabled] = useState(true);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave({
      max_daily_loss: Number(maxDailyLoss),
      max_position_size: Number(maxPositionSize),
      enabled,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 rounded-xl border border-white/10 bg-neutral-900/40 shadow-lg shadow-black/40 backdrop-blur-sm"
    >
      <h2 className="text-xl font-semibold text-white/90">Limits</h2>

      <input
        type="number"
        placeholder="Max Daily Loss"
        value={maxDailyLoss}
        onChange={(e) => setMaxDailyLoss(Number(e.target.value))}
        className="w-full border rounded px-3 py-2 bg-black/20 border-gray-700 text-white"
      />

      <input
        type="number"
        placeholder="Max Position Size"
        value={maxPositionSize}
        onChange={(e) => setMaxPositionSize(Number(e.target.value))}
        className="w-full border rounded px-3 py-2 bg-black/20 border-gray-700 text-white"
      />

      <label className="flex items-center gap-2 text-white/90">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />
        Enable Copy‑Trading
      </label>

      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">
        Save Limits
      </button>
    </form>
  );
}
