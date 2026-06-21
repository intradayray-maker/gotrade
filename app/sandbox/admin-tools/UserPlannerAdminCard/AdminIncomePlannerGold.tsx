"use client";

import { useMemo, useState } from "react";
import GTSlider from "@/app/components/ui/GTSlider";



/* ------------------------------
   Money Formatter (NO + signs)
--------------------------------*/
function Money({
  value,
  align = "right",
}: {
  value: number;
  align?: "left" | "right";
}) {
  const isNegative = value < 0;
  const formatted = Math.abs(value).toLocaleString();
  const isLeftAligned = align === "left";

  return (
    <span
      className={`${isNegative ? "text-red-400" : "text-emerald-400"} tabular-nums inline-block ${isLeftAligned ? "text-left" : "min-w-[9ch] text-right"}`}
    >
      {isNegative ? `-$${formatted}` : `$${formatted}`}
    </span>
  );
}

/* ------------------------------
   Compounding Frequency Mapping
--------------------------------*/
const compoundingLabels = [
  "Off",
  "Quarterly",
  "Monthly",
  "Weekly",
];

const compoundingConfigs = [
  { rebalanceEveryMonths: Number.POSITIVE_INFINITY, reinvestShare: 0 },
  { rebalanceEveryMonths: 3, reinvestShare: 0.5 },
  { rebalanceEveryMonths: 1, reinvestShare: 0.75 },
  { rebalanceEveryMonths: 1, reinvestShare: 1 },
];

type MonthSimulation = {
  startNav: number;
  endNav: number;
  grossPnL: number;
};

function simulateMonth(
  startNav: number,
  monthlyRoiPct: number
): MonthSimulation {
  return {
    startNav,
    endNav: startNav * (1 + monthlyRoiPct),
    grossPnL: startNav * monthlyRoiPct,
  };
}

/* ------------------------------
   Main Component
--------------------------------*/
export function AdminIncomePlannerGold() {


  /* Core Inputs */
  const [tradingBalance, setTradingBalance] = useState(10000);
  const [subFee, setSubFee] = useState(100);
  const [perfFeePct, setPerfFeePct] = useState(0.20);
  const [roiPct, setRoiPct] = useState(0.05);
  const [rebates, setRebates] = useState(0);

  const [referrals, setReferrals] = useState(10);
  const [referralDiscountPct, setReferralDiscountPct] = useState(0.02);

  /* Compounding Frequency Slider (0–3) */
  const [compoundingIndex, setCompoundingIndex] = useState(0);
  const compoundingLabel = compoundingLabels[compoundingIndex];

  const compoundingColors = [
    "rgba(0,200,0,0.65)",    // Off = green
    "rgba(200,180,0,0.65)",  // Quarterly = yellow
    "rgba(255,120,0,0.65)",  // Monthly = orange
    "rgba(255,0,0,0.75)",    // Weekly = red
  ];

  const currentColor = compoundingColors[compoundingIndex];

  /* Bi‑Weekly Deposit */
  const [biWeeklyDeposit, setBiWeeklyDeposit] = useState(50);

  /* Slider Helpers */
  const sliderFill = (value: number, min: number, max: number) =>
    ((value - min) / (max - min)) * 100;

  const renderTicks = (count: number) =>
    [...Array(count)].map((_, i) => (
      <div key={i} className="h-2 w-[1px] bg-[rgba(113,97,20,0.35)]" />
    ));

  const handleCompoundingChange = (value: number) => {
    setCompoundingIndex(value);
  };

  /* Referral Logic */
  const totalReferralDiscount = referrals * referralDiscountPct;
  const adjustedPerfFeePct = Math.max(0, perfFeePct - totalReferralDiscount);

  /* Deposit Logic */
  const monthlyDeposit = (biWeeklyDeposit * 26) / 12;
  const annualDeposits = biWeeklyDeposit * 26;

  const yearlyProjection = useMemo(() => {
    const isCompoundingOff = compoundingIndex === 0;
    const config = compoundingConfigs[compoundingIndex] ?? compoundingConfigs[0];

    let nav = tradingBalance;
    let annualTradingRoi = 0;
    let annualSubCost = 0;
    let annualRebates = 0;
    let annualPerfFee = 0;

    let firstMonthGross = 0;
    let firstMonthPerfFee = 0;
    let firstMonthNet = 0;

    for (let month = 1; month <= 12; month++) {
      const startNav = isCompoundingOff ? tradingBalance : nav;
      const sim = simulateMonth(startNav, roiPct);
      const grossPnl = sim.grossPnL;
      const perfFee = Math.max(0, grossPnl * adjustedPerfFeePct);
      const netPnl = grossPnl - perfFee - subFee + rebates;

      if (month === 1) {
        firstMonthGross = grossPnl;
        firstMonthPerfFee = perfFee;
        firstMonthNet = netPnl;
      }

      annualTradingRoi += grossPnl;
      annualPerfFee += perfFee;
      annualSubCost += subFee;
      annualRebates += rebates;

      if (isCompoundingOff) {
        nav = tradingBalance;
        continue;
      }

      const shouldRebalance =
        Number.isFinite(config.rebalanceEveryMonths) &&
        month % config.rebalanceEveryMonths === 0;

      const reinvestedPnl = shouldRebalance ? netPnl * config.reinvestShare : 0;
      nav = startNav + monthlyDeposit + reinvestedPnl;
    }

    const annualNetTotal =
      annualTradingRoi - annualPerfFee - annualSubCost + annualRebates;

    const endingBalance = isCompoundingOff
      ? tradingBalance + annualNetTotal
      : nav;

    return {
      endingBalance,
      annualTradingRoi,
      annualPerfCost: -annualPerfFee,
      annualSubCost: -annualSubCost,
      annualRebates,
      annualNetTotal,
      monthlyGrossPnl: firstMonthGross,
      monthlyPerfCost: -firstMonthPerfFee,
      monthlySubCost: -subFee,
      monthlyRebates: rebates,
      monthlyNetTotal: firstMonthNet,
    };
  }, [
    tradingBalance,
    monthlyDeposit,
    roiPct,
    compoundingIndex,
    adjustedPerfFeePct,
    subFee,
    rebates,
  ]);

  /* Final Monthly Numbers */
  const userSubCost = yearlyProjection.monthlySubCost;
  const userTradingROI = yearlyProjection.monthlyGrossPnl;
  const userPerfCost = yearlyProjection.monthlyPerfCost;
  const userRebates = yearlyProjection.monthlyRebates;
  const monthlyTotal = yearlyProjection.monthlyNetTotal;
  const monthlyROI = ((monthlyTotal / tradingBalance) * 100).toFixed(0);

  const yearlyTotal = yearlyProjection.annualNetTotal;
  const yearlyROI = Math.round((yearlyTotal / tradingBalance) * 100);

  const rMonthlyDeposit = Math.round(monthlyDeposit);
  const rUserSubCost = Math.round(userSubCost);
  const rUserPerfCost = Math.round(userPerfCost);
  const rUserTradingROI = Math.round(userTradingROI);
  const rUserRebates = Math.round(userRebates);
  const rMonthlyTotal = Math.round(monthlyTotal);
  const rYearlyTotal = Math.round(yearlyTotal);
  const rAnnualSubCost = Math.round(yearlyProjection.annualSubCost);
  const rAnnualPerfCost = Math.round(yearlyProjection.annualPerfCost);
  const rAnnualTradingROI = Math.round(yearlyProjection.annualTradingRoi);
  const rAnnualRebates = Math.round(yearlyProjection.annualRebates);

  /* Account Size Toggle */
  const [accountMode, setAccountMode] = useState<"small" | "medium" | "large">("small");

  const accountSettings = {
    small: { min: 500, max: 25000, step: 500 },
    medium: { min: 25000, max: 100000, step: 1000 },
    large: { min: 100000, max: 10000000, step: 50000 },
  };

  const { min, max, step } = accountSettings[accountMode];
  return (
    <section className="space-y-6">

      {/* ==========================
          ACCOUNT MODE TOGGLE (TOP)
         ========================== */}
      <div className="flex justify-center mt-2 mb-4">
        <div className="flex gap-3">

          {[
            { key: "small", label: "Small Account" },
            { key: "medium", label: "Medium Account" },
            { key: "large", label: "Large Account" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setAccountMode(key as any)}
              className={`
                px-6 py-2 rounded-md text-xs font-semibold uppercase tracking-wide
                transition-all duration-200
                ${
                  accountMode === key
                    ? "bg-blue-500/20 text-blue-300 border border-blue-400 shadow-[0_0_10px_rgba(0,102,255,0.6)]"
                    : "bg-black/30 text-slate-400 border border-blue-400/20 hover:bg-blue-500/10"
                }
              `}
            >
              {label}
            </button>
          ))}

        </div>
      </div>

      {/* ==========================
          3×3 SLIDER GRID (GTSLIDER)
         ========================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-1">

        {/* Trading Balance */}
        <div className="rounded-lg border border-emerald-400/40 shadow-[0_0_5px_rgba(16,185,129,0.35)] bg-black/20 p-3">
          <GTSlider
            title="Trading Balance"
            value={tradingBalance}
            min={min}
            max={max}
            step={step}
            onChange={setTradingBalance}
            dollars
          />
        </div>

        {/* Subscription Fee */}
        <div className="rounded-lg border border-red-400/40 shadow-[0_0_5px_rgba(255,0,0,0.35)] bg-black/20 p-3">
          <GTSlider
            title="Subscription Fee"
            value={subFee}
            min={0}
            max={140}
            step={5}
            onChange={setSubFee}
            dollars
          />
        </div>

        {/* Performance Fee % */}
        <div className="rounded-lg border border-red-400/40 shadow-[0_0_5px_rgba(255,0,0,0.35)] bg-black/20 p-3">
          <GTSlider
            title="Performance Fee %"
            value={perfFeePct * 100}
            min={0}
            max={40}
            step={1}
            onChange={(v) => setPerfFeePct(v / 100)}
            percent
          />
        </div>
        {/* Bot ROI % */}
        <div className="rounded-lg border border-emerald-400/40 shadow-[0_0_5px_rgba(16,185,129,0.35)] bg-black/20 p-3">
          <GTSlider
            title="Bot ROI % (Monthly) NVDA 4.7%"
            value={roiPct * 100}
            min={1}
            max={50}
            step={0.5}
            onChange={(v) => setRoiPct(v / 100)}
            percent
          />
        </div>

        {/* Rebates */}
        <div className="rounded-lg border border-emerald-400/40 shadow-[0_0_5px_rgba(16,185,129,0.35)] bg-black/20 p-3">
          <GTSlider
            title="Rebates / Coupons"
            value={rebates}
            min={0}
            max={100}
            step={5}
            onChange={setRebates}
            dollars
          />
        </div>

        {/* Referrals */}
        <div className="rounded-lg border border-emerald-400/40 shadow-[0_0_5px_rgba(16,185,129,0.35)] bg-black/20 p-3">
          <GTSlider
            title="Referrals (0–100)"
            value={referrals}
            min={0}
            max={100}
            step={1}
            onChange={setReferrals}
          />
        </div>

        {/* Discount Per Referral */}
        <div className="rounded-lg border border-emerald-400/40 shadow-[0_0_5px_rgba(16,185,129,0.35)] bg-black/20 p-3">
          <GTSlider
            title="Discount Per Referral (%)"
            value={referralDiscountPct * 100}
            min={0}
            max={5}
            step={0.5}
            onChange={(v) => setReferralDiscountPct(v / 100)}
            percent
          />
        </div>

        {/* Compounding Frequency */}
        <div className="rounded-lg border border-emerald-400/40 shadow-[0_0_5px_rgba(16,185,129,0.35)] bg-black/20 p-3">
          <GTSlider
            title={`Compounding Frequency (${compoundingLabel})`}
            value={compoundingIndex}
            min={0}
            max={3}
            step={1}
            onChange={handleCompoundingChange}
          />
        </div>

        {/* Bi‑Weekly Deposit */}
        <div className="rounded-lg border border-emerald-400/40 shadow-[0_0_5px_rgba(16,185,129,0.35)] bg-black/20 p-3">
          <GTSlider
            title="Bi‑Weekly Deposit"
            value={biWeeklyDeposit}
            min={0}
            max={1000}
            step={25}
            onChange={setBiWeeklyDeposit}
            dollars
          />
        </div>

      </div> {/* end 3×3 grid */}
      {/* ==========================
          MONTHLY BREAKDOWN CARD
         ========================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">

        {/* MONTHLY BREAKDOWN */}
        <div className="rounded-xl border border-emerald-500/30 bg-[#05070b] p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400 text-center">
            Monthly Breakdown
          </p>

          <div className="mt-3 space-y-3">

            {/* Subscription Fee */}
            <div className="flex justify-between items-center p-3 rounded-lg border border-emerald-500/20 bg-black/20">
              <span className="text-slate-400">Subscription Fee:</span>
              <span className="text-xl font-semibold tabular-nums">
                <Money value={rUserSubCost} />
              </span>
            </div>

            {/* Performance Fee */}
            <div className="flex justify-between items-center p-3 rounded-lg border border-emerald-500/20 bg-black/20">
              <span className="text-slate-400">Performance Fee:</span>
              <span className="text-xl font-semibold tabular-nums">
                <Money value={rUserPerfCost} />
              </span>
            </div>

            {/* Trading ROI */}
            <div className="flex justify-between items-center p-3 rounded-lg border border-emerald-500/20 bg-black/20">
              <span className="text-slate-400">Trading ROI (Settled):</span>
              <span className="text-xl font-semibold tabular-nums">
                <Money value={rUserTradingROI} />
              </span>
            </div>

            {/* Rebates */}
            <div className="flex justify-between items-center p-3 rounded-lg border border-emerald-500/20 bg-black/20">
              <span className="text-slate-400">Rebates:</span>
              <span className="text-xl font-semibold tabular-nums">
                <Money value={rUserRebates} />
              </span>
            </div>

            {/* Monthly Deposit */}
            <div className="flex justify-between items-center p-3 rounded-lg border border-blue-500/20 bg-black/20">
              <span className="text-slate-400">Deposit (Monthly Equivalent):</span>
              <span className="text-xl font-bold text-blue-300 tabular-nums">
                ${rMonthlyDeposit.toLocaleString()}
              </span>
            </div>

          </div>
        </div>

        {/* ==========================
            SUMMARY CARD (CENTER)
           ========================== */}
        <div className="
          rounded-xl
          border border-emerald-500/30
          bg-[#05070b]
          p-4
          shadow-[0_0_13px_rgba(50,255,150,0.25)]
        ">

          <div className="mt-3 space-y-3">

            {/* Monthly Profit */}
            <div className="flex justify-between items-center p-3 rounded-lg border border-emerald-500/20 bg-black/20">
              <span className="text-slate-400">Monthly Profit:</span>
              <span className="text-3xl font-bold tabular-nums">
                <Money value={rMonthlyTotal} />
              </span>
            </div>

            {/* Yearly Profit */}
            <div className="flex justify-between items-center p-3 rounded-lg border border-emerald-500/20 bg-black/20">
              <span className="text-slate-400">Yearly Profit:</span>
              <span className="text-3xl font-bold tabular-nums">
                <Money value={rYearlyTotal} />
              </span>
            </div>

            {/* Adjusted Perf Fee */}
            <div className="flex justify-between items-center p-3 rounded-lg border border-emerald-500/20 bg-black/20">
              <span className="text-slate-400">Adjusted Perf Fee:</span>
              <span className="text-xl font-semibold text-purple-300 tabular-nums">
                {Math.round(adjustedPerfFeePct * 100)}%
              </span>
            </div>

            {/* 12‑Month Balance */}
            <div className="flex justify-between items-center p-3 rounded-lg border border-emerald-500/20 bg-black/20">
              <span className="text-slate-400">12‑Month Balance:</span>
              <span className="text-xl font-bold text-purple-300 tabular-nums min-w-[10ch] text-right">
                ${Math.round(yearlyProjection.endingBalance).toLocaleString()}
              </span>
            </div>

            {/* ROI GRID */}
            <div className="grid grid-cols-2 gap-3">

              {/* Monthly ROI */}
              <div className="p-3 rounded-lg border border-emerald-500/20 bg-black/20 text-center">
                <p
                  className={`
                    text-xl font-bold tabular-nums
                    ${Number(monthlyROI) >= 0 ? "text-emerald-400" : "text-red-400"}
                  `}
                >
                  {monthlyROI}%
                  <span className="text-xs font-normal text-slate-400 ml-1 tracking-wide">
                    / monthly
                  </span>
                </p>
              </div>

              {/* Yearly ROI */}
              <div className="p-3 rounded-lg border border-emerald-500/20 bg-black/20 text-center">
                <p
                  className={`
                    text-xl font-bold tabular-nums
                    ${Number(yearlyROI) >= 0 ? "text-emerald-400" : "text-red-400"}
                  `}
                >
                  {yearlyROI}%
                  <span className="text-xs font-normal text-slate-400 ml-1 tracking-wide">
                    / yearly
                  </span>
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* ==========================
            ANNUAL BREAKDOWN
           ========================== */}
        <div className="rounded-xl border border-emerald-500/30 bg-[#05070b] p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400 text-center">
            Annual Breakdown
          </p>

          <div className="mt-3 space-y-3">

            {/* Subscription Fee */}
            <div className="flex justify-between items-center p-3 rounded-lg border border-emerald-500/20 bg-black/20">
              <span className="text-slate-400">Subscription Fee:</span>
              <span className="text-xl font-semibold tabular-nums">
                <Money value={rAnnualSubCost} />
              </span>
            </div>

            {/* Performance Fee */}
            <div className="flex justify-between items-center p-3 rounded-lg border border-emerald-500/20 bg-black/20">
              <span className="text-slate-400">Performance Fee:</span>
              <span className="text-xl font-semibold tabular-nums">
                <Money value={rAnnualPerfCost} />
              </span>
            </div>

            {/* Trading ROI */}
            <div className="flex justify-between items-center p-3 rounded-lg border border-emerald-500/20 bg-black/20">
              <span className="text-slate-400">Trading ROI (Settled):</span>
              <span className="text-xl font-semibold tabular-nums">
                <Money value={rAnnualTradingROI} />
              </span>
            </div>

            {/* Rebates */}
            <div className="flex justify-between items-center p-3 rounded-lg border border-emerald-500/20 bg-black/20">
              <span className="text-slate-400">Rebates:</span>
              <span className="text-xl font-semibold tabular-nums">
                <Money value={rAnnualRebates} />
              </span>
            </div>

            {/* Annual Deposits */}
            <div className="flex justify-between items-center p-3 rounded-lg border border-blue-500/20 bg-black/20">
              <span className="text-slate-400">Annual Deposits:</span>
              <span className="text-xl font-bold text-blue-300 tabular-nums">
                ${annualDeposits.toLocaleString()}
              </span>
            </div>

          </div>
        </div>

      </div> {/* end summary grid */}
    </section>
  );
}

