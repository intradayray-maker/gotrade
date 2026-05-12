"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export type Preset = "7D" | "30D" | "YTD" | "custom";
export type SideFilter = "all" | "buy" | "sell";

export type TradeFiltersState = {
  preset: Preset;
  customStart: string | null;
  customEnd: string | null;
  symbol: string;
  side: SideFilter;
};

type Props = {
  value: TradeFiltersState;
  onChange: (value: TradeFiltersState) => void;
  onReset: () => void;
};

export default function TradeHistoryFilters({
  value,
  onChange,
  onReset,
}: Props) {
  const [local, setLocal] = useState<TradeFiltersState>(value);

  function update<K extends keyof TradeFiltersState>(
    key: K,
    val: TradeFiltersState[K]
  ) {
    const next = { ...local, [key]: val };
    setLocal(next);
  }

  function apply() {
    onChange(local);
  }

  function handlePresetClick(preset: Preset) {
    const next: TradeFiltersState = { ...local, preset };
    if (preset !== "custom") {
      next.customStart = null;
      next.customEnd = null;
    }
    setLocal(next);
    onChange(next);
  }

  function handleReset() {
    const reset = {
      preset: "7D",
      customStart: null,
      customEnd: null,
      symbol: "SPY",
      side: "all",
    } as const;

    setLocal(reset);
    onReset();
  }

  return (
    <div className="mx-auto max-w-5xl rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-6 py-6 shadow-[0_0_30px_rgba(0,0,0,0.4)]">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

        {/* LEFT — PRESETS */}
        <div className="flex flex-col gap-3">
          <span className="text-xs uppercase tracking-wide text-white/50">
            Date Range
          </span>

          <div className="flex gap-2 rounded-full bg-white/10 p-1">
            {(["7D", "30D", "YTD", "custom"] as Preset[]).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handlePresetClick(preset)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-medium transition-all",
                  local.preset === preset
                    ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                    : "text-white/70 hover:bg-white/10"
                )}
              >
                {preset === "custom" ? "Custom" : preset}
              </button>
            ))}
          </div>

          {local.preset === "custom" && (
            <div className="flex flex-wrap gap-4 pt-2">

              {/* START DATE */}
              <div className="flex flex-col gap-2">
                <span className="text-[11px] uppercase tracking-wide text-white/50">
                  Start
                </span>

                <style jsx>{`
                  input[type="date"]::-webkit-calendar-picker-indicator {
                    filter: invert(1) brightness(2);
                  }
                `}</style>

                <input
                  type="date"
                  value={local.customStart ?? ""}
                  onChange={(e) =>
                    update("customStart", e.target.value || null)
                  }
                  className="rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white w-40 focus:outline-none focus:ring-2 focus:ring-white/20 cursor-pointer"
                />
              </div>

              {/* END DATE */}
              <div className="flex flex-col gap-2">
                <span className="text-[11px] uppercase tracking-wide text-white/50">
                  End
                </span>

                <style jsx>{`
                  input[type="date"]::-webkit-calendar-picker-indicator {
                    filter: invert(1) brightness(2);
                  }
                `}</style>

                <input
                  type="date"
                  value={local.customEnd ?? ""}
                  onChange={(e) =>
                    update("customEnd", e.target.value || null)
                  }
                  className="rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white w-40 focus:outline-none focus:ring-2 focus:ring-white/20 cursor-pointer"
                />
              </div>

            </div>
          )}
        </div>

        {/* RIGHT — SYMBOL + SIDE + BUTTONS */}
        <div className="flex flex-wrap items-end gap-6">

          {/* SYMBOL */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] uppercase tracking-wide text-white/50">
              Symbol
            </span>

            <div className="relative">
              <select
                value={local.symbol}
                onChange={(e) => update("symbol", e.target.value)}
                className="rounded-md border border-white/15 bg-[#111] text-white px-3 py-2 text-sm w-32 pr-8 focus:outline-none focus:ring-2 focus:ring-white/20 appearance-none"
              >
                <option value="SPY">SPY</option>
                <option value="QQQ">QQQ</option>
                <option value="AAPL">AAPL</option>
              </select>

              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/50">
                ▼
              </div>
            </div>
          </div>

          {/* SIDE */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] uppercase tracking-wide text-white/50">
              Side
            </span>

            <div className="relative">
              <select
                value={local.side}
                onChange={(e) => update("side", e.target.value as any)}
                className="rounded-md border border-white/15 bg-[#111] text-white px-3 py-2 text-sm w-32 pr-8 focus:outline-none focus:ring-2 focus:ring-white/20 appearance-none"
              >
                <option value="all">All</option>
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>

              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/50">
                ▼
              </div>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col gap-2 self-end">
            <button
              type="button"
              onClick={apply}
              className="rounded-md bg-white px-5 py-2 text-xs font-semibold text-black shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:bg-white/90"
            >
              Apply Filters
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="text-[12px] text-white/60 hover:text-white"
            >
              Reset
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
