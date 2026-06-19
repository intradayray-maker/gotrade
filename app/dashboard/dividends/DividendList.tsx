"use client";

import { Shield, DollarSign } from "lucide-react";

interface DividendListProps {
  allowed: boolean;
  selectedTicker: string | null;
  onSelectTicker?: (ticker: string) => void;
  items: {
    ticker: string;
    companyName: string;
    dividendYield: number | null;
    payoutRatio: number | null;
    beta: number | null;
    sector: string | null;
    exDividendDate: string | null;
  }[];
}

export default function DividendList({
  allowed,
  selectedTicker,
  onSelectTicker,
  items
}: DividendListProps) {

  if (!allowed) {
    return (
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 text-center text-sm text-slate-400">
        Dividend Finder is locked. Upgrade your plan to see live dividend recommendations.
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 text-center text-sm text-slate-400">
        No dividend picks found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((item) => {
        const isActive = selectedTicker === item.ticker;

        return (
          <button
            key={item.ticker}
            onClick={() => onSelectTicker?.(item.ticker)}
            className={`
              w-full text-left rounded-lg border px-3 py-3
              bg-neutral-900 border-slate-800 flex flex-col gap-2 transition
              ${
                isActive
                  ? "border-transparent shadow-[0_0_16px_rgba(0,200,255,0.45)] bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-transparent"
                  : "hover:bg-neutral-800/60"
              }
            `}
          >
            <div className="flex items-center justify-between">
              <span className="text-slate-200 font-semibold text-lg">
                {item.ticker}
              </span>
              <span className="text-slate-500 text-sm">
                {item.companyName}
              </span>
            </div>

            <div className="flex items-center justify-between mt-1 text-sm">
              <div className="flex items-center gap-1 text-emerald-300">
                <Shield size={18} />
                <span>
                  {item.payoutRatio
                    ? `Payout ${item.payoutRatio.toFixed(2)}`
                    : "No Ratio"}
                </span>
              </div>

              <div className="flex items-center gap-1 text-blue-300">
                <DollarSign size={18} />
                <span>
                  {item.dividendYield
                    ? `${item.dividendYield.toFixed(2)}%`
                    : "0.00%"}
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
