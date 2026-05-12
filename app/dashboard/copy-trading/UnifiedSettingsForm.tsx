"use client";

import { useState, useEffect, useMemo } from "react";
import type { Tables } from "@/types/supabase";

type Settings = Pick<
  Tables<"copy_trading_settings">,
  | "allocation_model"
  | "allocation_value"
  | "enabled"
  | "max_daily_loss"
  | "max_position_size"
  | "risk_multiplier"
>;

export default function UnifiedSettingsForm({
  initialSettings,
}: {
  initialSettings: Settings | null;
}) {
  const safe: Partial<Settings> = initialSettings ?? {};

  // State
  const [enabled, setEnabled] = useState<boolean>(safe.enabled ?? false);
  const [allocationModel, setAllocationModel] = useState<"percentage" | "fixed">(
    safe.allocation_model ?? "percentage"
  );
  const [allocationValue, setAllocationValue] = useState<number>(
    safe.allocation_value ?? 10
  );
  const [riskMultiplier, setRiskMultiplier] = useState<number>(
    safe.risk_multiplier ?? 1
  );
  const [maxDailyLoss, setMaxDailyLoss] = useState<number>(
    safe.max_daily_loss ?? 2
  );
  const [maxPositionSize, setMaxPositionSize] = useState<number>(
    safe.max_position_size ?? 20
  );

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Detect unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    return (
      enabled !== (safe.enabled ?? false) ||
      allocationModel !== (safe.allocation_model ?? "percentage") ||
      allocationValue !== (safe.allocation_value ?? 10) ||
      riskMultiplier !== (safe.risk_multiplier ?? 1) ||
      maxDailyLoss !== (safe.max_daily_loss ?? 2) ||
      maxPositionSize !== (safe.max_position_size ?? 20)
    );
  }, [
    enabled,
    allocationModel,
    allocationValue,
    riskMultiplier,
    maxDailyLoss,
    maxPositionSize,
    safe,
  ]);

  // Premium card styling
  const cardClass =
    "w-full max-w-3xl mx-auto rounded-xl border border-white/10 bg-zinc-900/60 p-10 shadow-[0_0_25px_rgba(0,0,0,0.45)] backdrop-blur-md space-y-10 animate-fadeIn";

  // Default settings
  function applyRecommendedSettings() {
    setEnabled(true);
    setAllocationModel("percentage");
    setAllocationValue(100);
    setRiskMultiplier(1.0);
    setMaxDailyLoss(2);
    setMaxPositionSize(20);
  }

  async function save() {
    setSaving(true);
    setSaved(false);

    const payload = {
      enabled,
      allocation_model: allocationModel,
      allocation_value: allocationValue,
      risk_multiplier: riskMultiplier,
      max_daily_loss: maxDailyLoss,
      max_position_size: maxPositionSize,
    };

    const res = await fetch("/api/copy-trading/save-settings", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  return (
    <>
      <form className="max-w-6xl mx-auto space-y-10 pt-8">

        {/* TITLE */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold text-white">Copy‑Trading Settings</h1>
          <p className="text-white/60 text-sm">
            Configure allocation, risk, and safety limits.
          </p>
        </div>

        {/* SINGLE PREMIUM CARD */}
        <div className={cardClass}>

          {/* STATUS */}
          <div className="text-center space-y-3">
            <h3 className="text-lg font-semibold text-white/90 tracking-wide flex items-center justify-center gap-2">
              🔄 Trading Status
              <Tooltip text="Enable or disable automated copy‑trading." />
            </h3>

            {/* Premium Toggle */}
            <div
              onClick={() => setEnabled(!enabled)}
              className={`relative w-16 h-9 mx-auto rounded-full cursor-pointer transition-all duration-300 
                ${enabled ? "bg-emerald-500/80 shadow-[0_0_12px_#34d399]" : "bg-zinc-700/80"}`}
            >
              <div
                className={`absolute top-1 left-1 h-7 w-7 rounded-full bg-white shadow-md transition-all duration-300 
                  ${enabled ? "translate-x-7 shadow-[0_0_12px_#34d399]" : ""}`}
              />
            </div>

            <p className="text-white/60 text-sm">
              {enabled ? "Enabled" : "Disabled"}
            </p>
          </div>

          <div className="border-t border-white/5"></div>

          {/* ALLOCATION */}
          <div className="space-y-4 text-center">
            <h3 className="text-lg font-semibold text-white/90 tracking-wide flex items-center justify-center gap-2">
              ⚡ Allocation Settings
              <Tooltip text="Control how much of your account is allocated to copy‑trading." />
            </h3>

            {/* Segmented Control */}
            <div className="flex gap-2 bg-zinc-800 p-1 rounded-lg w-fit mx-auto">
              <button
                type="button"
                onClick={() => setAllocationModel("percentage")}
                className={`px-4 py-2 rounded-md text-sm transition ${
                  allocationModel === "percentage"
                    ? "bg-emerald-500 text-black"
                    : "text-white/60"
                }`}
              >
                Percentage
              </button>

              <button
                type="button"
                onClick={() => setAllocationModel("fixed")}
                className={`px-4 py-2 rounded-md text-sm transition ${
                  allocationModel === "fixed"
                    ? "bg-emerald-500 text-black"
                    : "text-white/60"
                }`}
              >
                Fixed Amount
              </button>
            </div>

            {/* Slider */}
            <Slider
              label="Allocation Value"
              value={allocationValue}
              displayValue={
                allocationModel === "percentage"
                  ? `${allocationValue}%`
                  : `${allocationValue} USD`
              }
              onChange={setAllocationValue}
            />
          </div>

          <div className="border-t border-white/5"></div>

          {/* RISK */}
          <div className="space-y-4 text-center">
            <h3 className="text-lg font-semibold text-white/90 tracking-wide flex items-center justify-center gap-2">
              🛡 Risk Controls
              <Tooltip text="Adjust how aggressively your account mirrors the master strategy." />
            </h3>

            <Slider
              label="Risk Multiplier"
              value={riskMultiplier}
              displayValue={`${riskMultiplier}×`}
              min={0.5}
              max={3}
              step={0.1}
              onChange={setRiskMultiplier}
            />
          </div>

          <div className="border-t border-white/5"></div>

          {/* SAFETY LIMITS */}
          <div className="space-y-8 text-center">
            <h3 className="text-lg font-semibold text-white/90 tracking-wide flex items-center justify-center gap-2">
              🚫 Safety Limits
              <Tooltip text="Set maximum loss and position size to protect your account." />
            </h3>

            <Slider
              label="Max Daily Loss"
              value={maxDailyLoss}
              displayValue={`${maxDailyLoss}%`}
              min={0.5}
              max={20}
              step={0.5}
              onChange={setMaxDailyLoss}
            />

            <Slider
              label="Max Position Size"
              value={maxPositionSize}
              displayValue={`${maxPositionSize}%`}
              min={1}
              max={100}
              step={1}
              onChange={setMaxPositionSize}
            />
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={applyRecommendedSettings}
            className="px-4 py-2 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/40 hover:bg-blue-500/30 transition shadow-md"
          >
            Default Settings
          </button>

          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-md bg-emerald-500 px-6 py-2 text-sm font-medium text-black hover:bg-emerald-400 disabled:opacity-60 shadow-lg"
          >
            {saving ? "Saving..." : saved ? "Saved!" : "Save All Settings"}
          </button>
        </div>
      </form>

      {/* STICKY SAVE BAR */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/90 border-t border-white/10 py-4 px-6 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.4)] animate-slideUp">
          <span className="text-white/70 text-sm">You have unsaved changes</span>

          <button
            onClick={save}
            className="rounded-md bg-emerald-500 px-5 py-2 text-sm font-medium text-black hover:bg-emerald-400 shadow-lg"
          >
            Save Changes
          </button>
        </div>
      )}
    </>
  );
}

/* -------------------------
   Tooltip Component
-------------------------- */
function Tooltip({ text }: { text: string }) {
  return (
    <div className="relative group">
      <span className="text-white/40 text-xs cursor-help">ⓘ</span>
      <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max max-w-xs px-3 py-2 rounded-md bg-black/80 text-white/70 text-xs opacity-0 group-hover:opacity-100 transition pointer-events-none shadow-lg">
        {text}
      </div>
    </div>
  );
}

/* -------------------------
   Slider Component
-------------------------- */
function Slider({
  label,
  value,
  displayValue,
  min = 1,
  max = 100,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  displayValue: string;
  min?: number;
  max?: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-white/70">
        {label}: <span className="text-white/90">{displayValue}</span>
      </label>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
        style={{
          background: "linear-gradient(to right, #22c55e, #eab308, #ef4444)",
        }}
      />

      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: ${value < max * 0.3
            ? "#22c55e"
            : value < max * 0.7
            ? "#eab308"
            : "#ef4444"};
          box-shadow: 0 0 12px
            ${value < max * 0.3
              ? "#22c55e"
              : value < max * 0.7
              ? "#eab308"
              : "#ef4444"};
          transition: background 0.2s ease, box-shadow 0.2s ease;
        }
      `}</style>
    </div>
  );
}
