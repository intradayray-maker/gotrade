// ========================================
// FILE: app/dashboard/DashboardClient.tsx
// ========================================

"use client";

import { useState } from "react";
import GatedFeature from "./components/GatedFeature";

import EURUSD_AiCard from "@/app/dashboard/products/EURUSD/EURUSD_AiCard";
import EURUSD_NewsCard from "@/app/dashboard/products/EURUSD/EURUSD_NewsCard";
import EURUSD_TradeOutputCard from "@/app/dashboard/products/EURUSD/EURUSD_TradeOutputCard";

import ETHUSDT_AiCard from "@/app/dashboard/products/ETHUSD/ETHUSDT_AiCard";
import ETHUSDT_NewsCard from "@/app/dashboard/products/ETHUSD/ETHUSDT_NewsCard";
import ETHUSDT_TradeOutputCard from "@/app/dashboard/products/ETHUSD/ETHUSDT_TradeOutputCard";

import SWING_AiCard from "@/app/dashboard/products/SWING/SWING_AiCard";
import SWING_NewsCard from "@/app/dashboard/products/SWING/SWING_NewsCard";
import SWING_TradeOutputCard from "@/app/dashboard/products/SWING/SWING_TradeOutputCard";

interface DashboardClientProps {
  canEUR: boolean;
  canETH: boolean;
  canSWING: boolean;
  canDIV: boolean;
}

export default function DashboardClient({
  canEUR,
  canETH,
  canSWING,
  canDIV,
}: DashboardClientProps) {
  const [previewMode, setPreviewMode] = useState("actual");

  let effectiveEUR = canEUR;
  let effectiveETH = canETH;
  let effectiveSWING = canSWING;
  let effectiveDIV = canDIV;

  if (previewMode === "eur") {
    effectiveEUR = true;
    effectiveETH = false;
    effectiveSWING = false;
    effectiveDIV = false;
  }
  if (previewMode === "eth") {
    effectiveEUR = false;
    effectiveETH = true;
    effectiveSWING = false;
    effectiveDIV = false;
  }
  if (previewMode === "swing") {
    effectiveEUR = false;
    effectiveETH = false;
    effectiveSWING = true;
    effectiveDIV = false;
  }
  if (previewMode === "div") {
    effectiveEUR = false;
    effectiveETH = false;
    effectiveSWING = false;
    effectiveDIV = true;
  }
  if (previewMode === "both") {
    effectiveEUR = true;
    effectiveETH = true;
    effectiveSWING = true;
    effectiveDIV = true;
  }
  if (previewMode === "none") {
    effectiveEUR = false;
    effectiveETH = false;
    effectiveSWING = false;
    effectiveDIV = false;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-1 space-y-10">

      {/* ============================
          DEVELOPER PREVIEW BAR
      ============================ */}
      <div className="flex justify-center gap-2 pt-4 pb-2">
        {[
          ["actual", "Actual"],
          ["none", "All Locked"],
          ["eur", "Forex Only"],
          ["eth", "Crypto Only"],
          ["swing", "Swing Only"],
          ["div", "Dividends Only"],
          ["both", "All Unlocked"],
        ].map(([mode, label]) => (
          <button
            key={mode}
            onClick={() => setPreviewMode(mode)}
            className={`
              px-3 py-1.5 rounded-lg text-xs font-semibold transition
              ${
                previewMode === mode
                  ? "bg-gradient-to-r from-emerald-300 via-blue-400 to-purple-400 text-black shadow-[0_0_12px_rgba(0,200,255,0.45)]"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ============================
          DIVIDEND FINDER MODULE
      ============================ */}
      <div className="space-y-6">

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
            Dividend Finder
          </h2>

          <p className="text-slate-400 text-sm tracking-wide">
            Discover the safest, highest‑quality dividend stocks.
          </p>

          {!effectiveDIV && (
            <span className="px-2 py-0.5 text-xs rounded-md bg-red-500/20 text-red-300 border border-red-500/30 inline-block mt-1">
              Dividend Plan Required
            </span>
          )}
        </div>

      </div>

      {/* ============================
          EURUSD MODULE
      ============================ */}
      <div className="space-y-3">
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
              Forex Plan Required
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
              Crypto Plan Required
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

      {/* ============================
          SWING MODULE
      ============================ */}
      <div className="space-y-3">
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
            Your Personal AI Relaxed Trading Assistant
          </h2>

          <p className="text-slate-400 text-sm tracking-wide">
            Weekly relaxed signals designed for real‑life schedules.
          </p>

          {!effectiveSWING && (
            <span className="px-2 py-0.5 text-xs rounded-md bg-red-500/20 text-red-300 border border-red-500/30 inline-block mt-1">
              Swing Plan Required
            </span>
          )}
        </div>

        <GatedFeature allowed={effectiveSWING}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <SWING_AiCard />
            <SWING_NewsCard />
            <SWING_TradeOutputCard />
          </div>
        </GatedFeature>
      </div>

    </div>
  );
}
// test 5