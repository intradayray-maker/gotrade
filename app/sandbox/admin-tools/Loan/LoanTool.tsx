"use client";

import { useState } from "react";
import GTSlider from "@/app/components/ui/GTSlider";

export default function LoanTool() {

  const fmt = (num: number, decimals = 0) =>
    Number(num.toFixed(decimals)).toLocaleString();

  // ==========================
  // ⭐ ONE-TIME COSTS (ALL)
  // ==========================
  const [domainCost, setDomainCost] = useState(4);
  const [emailCost, setEmailCost] = useState(72);
  const [marketingCost, setMarketingCost] = useState(285);
  const [tvBasic, setTvBasic] = useState(45);
  const [tvLiveData, setTvLiveData] = useState(30);

  const [babybotTesting, setBabybotTesting] = useState(200);   // Ray – BabyBot Budget
  const [nvdaRay, setNvdaRay] = useState(0);                   // Misc
  const [solEthTesting, setSolEthTesting] = useState(200);     // Chris – BabyBot Budget

  const [miscSurprises, setMiscSurprises] = useState(315);

  // ==========================
  // ⭐ TOTAL CALCULATION
  // ==========================
  const totalLoanRequired =
    domainCost +
    emailCost +
    marketingCost +
    tvBasic +
    tvLiveData +
    babybotTesting +
    nvdaRay +
    solEthTesting +
    miscSurprises;

  return (
    <section className="space-y-3">

      {/* ==========================
          ONE-TIME COST GRID (GREEN)
         ========================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-1">

        {/* Domain */}
        <div className="rounded-lg border border-emerald-400/40 bg-black/20 p-2 shadow-[0_0_5px_rgba(16,185,129,0.35)]">
          <GTSlider title="Domain (GoTrade.one)" value={domainCost} min={0} max={50} step={1} onChange={setDomainCost} dollars />
        </div>

        {/* Email */}
        <div className="rounded-lg border border-emerald-400/40 bg-black/20 p-2 shadow-[0_0_5px_rgba(16,185,129,0.35)]">
          <GTSlider title="Email" value={emailCost} min={0} max={200} step={5} onChange={setEmailCost} dollars />
        </div>

        {/* Marketing */}
        <div className="rounded-lg border border-emerald-400/40 bg-black/20 p-2 shadow-[0_0_5px_rgba(16,185,129,0.35)]">
          <GTSlider title="Marketing (AI Videos)" value={marketingCost} min={0} max={1000} step={10} onChange={setMarketingCost} dollars />
        </div>

        {/* TradingView Basic */}
        <div className="rounded-lg border border-emerald-400/40 bg-black/20 p-2 shadow-[0_0_5px_rgba(16,185,129,0.35)]">
          <GTSlider title="TradingView Basic" value={tvBasic} min={0} max={100} step={5} onChange={setTvBasic} dollars />
        </div>

        {/* TradingView Live Data */}
        <div className="rounded-lg border border-emerald-400/40 bg-black/20 p-2 shadow-[0_0_5px_rgba(16,185,129,0.35)]">
          <GTSlider title="TradingView Live Data" value={tvLiveData} min={0} max={100} step={5} onChange={setTvLiveData} dollars />
        </div>

        {/* Chris – BabyBot Budget (formerly SOL/ETH Large-Cap Testing) */}
        <div className="rounded-lg border border-red-400/40 bg-black/20 p-2 shadow-[0_0_5px_rgba(16,185,129,0.35)]">
          <GTSlider title="Chris – BabyBot Budget" value={solEthTesting} min={0} max={2000} step={50} onChange={setSolEthTesting} dollars />
        </div>

        {/* Ray – BabyBot Budget (formerly BabyBot Testing Budget) */}
        <div className="rounded-lg border border-red-400/40 bg-black/20 p-4 shadow-[0_0_5px_rgba(16,185,129,0.35)]">
          <GTSlider title="Ray – BabyBot Budget" value={babybotTesting} min={0} max={2000} step={50} onChange={setBabybotTesting} dollars />
        </div>

        {/* Misc (formerly NVDA Testing (Ray)) — now BLUE border */}
        <div className="rounded-lg border border-red-400/40 bg-black/20 p-4 shadow-[0_0_5px_rgba(59,130,246,0.35)]">
          <GTSlider title="Misc" value={nvdaRay} min={0} max={2000} step={50} onChange={setNvdaRay} dollars />
        </div>

        {/* Removed NVDA Testing (Chris) — leaves one empty slot */}
        <div className="rounded-lg border border-transparent bg-transparent p-4"></div>

      </div>

      {/* ==========================
          THIN HORIZONTAL SUMMARY BAR
         ========================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="rounded-lg border border-emerald-500/30 bg-[#05070b] p-3 flex justify-between items-center">
          <span className="text-slate-400 text-sm">Total Costs:</span>
          <span className="text-lg font-semibold text-emerald-300 tabular-nums">
            ${fmt(totalLoanRequired)}
          </span>
        </div>

        <div className="rounded-lg border border-blue-500/30 bg-[#05060a] p-3 flex justify-between items-center">
          <span className="text-slate-400 text-sm">Total Loan:</span>
          <span className="text-xl font-bold text-blue-300 tabular-nums">
            ${fmt(totalLoanRequired)}
          </span>
        </div>

        <div className="rounded-lg border border-yellow-500/30 bg-[#09060a] p-3 flex justify-between items-center">
          <span className="text-slate-400 text-sm">Misc Included:</span>
          <span className="text-lg font-semibold text-yellow-300 tabular-nums">
            ${fmt(miscSurprises)}
          </span>
        </div>

      </div>

    </section>
  );
}
