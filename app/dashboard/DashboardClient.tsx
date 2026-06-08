"use client";

import { useState } from "react";
import GatedFeature from "./components/GatedFeature";

import EURUSD_AiCard from "@/app/dashboard/products/EURUSD/EURUSD_AiCard";
import EURUSD_NewsCard from "@/app/dashboard/products/EURUSD/EURUSD_NewsCard";
import EURUSD_TradeOutputCard from "@/app/dashboard/products/EURUSD/EURUSD_TradeOutputCard";

import ETHUSDT_AiCard from "@/app/dashboard/products/ETHUSD/ETHUSDT_AiCard";
import ETHUSDT_NewsCard from "@/app/dashboard/products/ETHUSD/ETHUSDT_NewsCard";
import ETHUSDT_TradeOutputCard from "@/app/dashboard/products/ETHUSD/ETHUSDT_TradeOutputCard";

export default function DashboardClient({ canEUR, canETH }) {
  const [previewMode, setPreviewMode] = useState("actual");

  // Compute effective permissions
  let effectiveEUR = canEUR;
  let effectiveETH = canETH;

  if (previewMode === "eur") {
    effectiveEUR = true;
    effectiveETH = false;
  }
  if (previewMode === "eth") {
    effectiveEUR = false;
    effectiveETH = true;
  }
  if (previewMode === "both") {
    effectiveEUR = true;
    effectiveETH = true;
  }
  if (previewMode === "none") {
    effectiveEUR = false;
    effectiveETH = false;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-1 space-y-10">

      {/* ============================
          DEVELOPER PREVIEW BAR (TOP)
      ============================ */}
      <div className="flex justify-center gap-2 pt-4 pb-2">
        {[
          ["actual", "Actual"],
          ["none", "Both Locked"],
          ["eur", "EUR Only"],
          ["eth", "ETH Only"],
          ["both", "Both Unlocked"],
        ].map(([mode, label]) => (
          <button
            key={mode}
            onClick={() => setPreviewMode(mode)}
            className={`
              px-3 py-1.5 rounded-lg text-xs font-semibold transition
              ${previewMode === mode
                ? "bg-purple-500 text-black"
                : "bg-slate-800 text-slate-300"}
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ============================
          EURUSD MODULE
      ============================ */}
      <div className="space-y-3">

        {/* Section Header (2-line hero style) */}
        <div className="text-center space-y-1 pb-1">
          <h2
            className="
              text-2xl font-extrabold 
              bg-gradient-to-r from-emerald-300 via-blue-400 to-purple-400 
              text-transparent bg-clip-text 
              drop-shadow-[0_0_12px_rgba(0,200,255,0.45)]
              animate-float-slow
            "
          >
            Your Personal AI Forex Trading Assistant
          </h2>

          <p className="text-slate-400 text-sm tracking-wide">
            Real‑time analysis, risk intelligence, and automated execution math.
          </p>

          {!effectiveEUR && (
            <span className="px-2 py-0.5 text-xs rounded-md bg-red-500/20 text-red-300 border border-red-500/30 inline-block mt-1">
              Locked
            </span>
          )}
        </div>

        <GatedFeature allowed={effectiveEUR}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <EURUSD_AiCard />
            <EURUSD_NewsCard />
            <EURUSD_TradeOutputCard />
          </div>
        </GatedFeature>
      </div>

      {/* ============================
          ETHUSDT MODULE
      ============================ */}
      <div className="space-y-3">

        {/* Section Header (2-line hero style) */}
        <div className="text-center space-y-1 pb-1">
          <h2
            className="
              text-2xl font-extrabold 
              bg-gradient-to-r from-emerald-300 via-blue-400 to-purple-400 
              text-transparent bg-clip-text 
              drop-shadow-[0_0_12px_rgba(0,200,255,0.45)]
              animate-float-slow
            "
          >
            Your Personal AI Crypto Trading Assistant
          </h2>

          <p className="text-slate-400 text-sm tracking-wide">
            Real‑time analysis, risk intelligence, and automated execution math.
          </p>

          {!effectiveETH && (
            <span className="px-2 py-0.5 text-xs rounded-md bg-red-500/20 text-red-300 border border-red-500/30 inline-block mt-1">
              Locked
            </span>
          )}
        </div>

        <GatedFeature allowed={effectiveETH}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <ETHUSDT_AiCard />
            <ETHUSDT_NewsCard />
            <ETHUSDT_TradeOutputCard />
          </div>
        </GatedFeature>
      </div>

    </div>
  );
}
