"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import type { CopyTradingSettingsPayload } from "@/types/copy-trading";

type AllocationFormProps = {
  onSave: (settings: CopyTradingSettingsPayload) => Promise<void>;
};

export default function AllocationForm({ onSave }: AllocationFormProps) {
  const [allocationModel, setAllocationModel] = useState<"fixed" | "percentage">(
    "percentage"
  );
  const [allocationValue, setAllocationValue] = useState(100);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave({
      allocation_model: allocationModel,
      allocation_value: Number(allocationValue),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 rounded-xl border border-white/10 bg-neutral-900/40 shadow-lg shadow-black/40 backdrop-blur-sm"
    >
      <h2 className="text-xl font-semibold text-white/90">Allocation</h2>

      <select
        value={allocationModel}
        onChange={(e) =>
          setAllocationModel(e.target.value as "fixed" | "percentage")
        }
        className="w-full border rounded px-3 py-2 bg-black/20 border-gray-700 text-white"
      >
        <option value="percentage">Percentage of Master</option>
        <option value="fixed">Fixed Amount</option>
      </select>

      <input
        type="number"
        value={allocationValue}
        onChange={(e) => setAllocationValue(Number(e.target.value))}
        className="w-full border rounded px-3 py-2 bg-black/20 border-gray-700 text-white"
      />

      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">
        Save Allocation
      </button>
    </form>
  );
}
