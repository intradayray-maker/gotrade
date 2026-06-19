"use client";

import { useState, useEffect, useMemo } from "react";
import GTSlider from "@/app/components/ui/GTSlider";

function useLocalTime() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit"
        })
      );
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}

/* ==========================
   Animated Number Hook
   ========================== */
function useAnimatedNumber(value: number, duration = 400) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const start = display;
    const end = value;
    const diff = end - start;
    const startTime = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      setDisplay(start + diff * progress);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value]);

  return Math.round(display);
}

function AnimatedNumber({ value }: { value: number }) {
  const animated = useAnimatedNumber(value);
  return <>{animated.toLocaleString()}</>;
}

/* ==========================
   BabyBot Projection Tool
   ========================== */
export function BabyBotProjection() {

  // --------------------------
  // CORE INPUTS
  // --------------------------
  const [riskPerPoint, setRiskPerPoint] = useState(100);
  const [amPoints, setAmPoints] = useState(3);
  const [pmPoints, setPmPoints] = useState(3);
  const [riskBuffer, setRiskBuffer] = useState(20);
  const localTime = useLocalTime();

  // --------------------------
  // MODE TOGGLE (SMALL CAP / LARGE CAP)
  // --------------------------
  const [isSmallCap, setIsSmallCap] = useState(true);

  // --------------------------
  // SCALING ENGINE
  // --------------------------
  const [growthRatePct, setGrowthRatePct] = useState(5);
  const [intervalDays, setIntervalDays] = useState(7);

  const maxRisk = 300;
  const daysPerWeek = 7;
  const daysPerMonth = 30;
  const daysPerYear = 365;

  // --------------------------
  // CORE CALCULATIONS
  // --------------------------
  const totalAvgPoints = amPoints + pmPoints;

  // Margin per trade based on mode
  const marginPerTrade = isSmallCap ? 50 : 198.18;

  // Required balance (enforce $50 minimum for Blofin bots)
  const requiredBalance = Math.max(50, marginPerTrade * riskBuffer);

  const weeklyPoints = totalAvgPoints * daysPerWeek;
  const monthlyPoints = totalAvgPoints * daysPerMonth;
  const yearlyPoints = totalAvgPoints * daysPerYear;

  // --------------------------
  // SCALING PROJECTIONS
  // --------------------------
  const {
    nextRisk,
    riskIn30Days,
    riskIn90Days,
    daysToMaxRisk
  } = useMemo(() => {
    const g = growthRatePct / 100;
    if (g <= 0 || intervalDays <= 0) {
      return {
        nextRisk: riskPerPoint,
        riskIn30Days: riskPerPoint,
        riskIn90Days: riskPerPoint,
        daysToMaxRisk: Infinity
      };
    }

    const stepFactor = 1 + g;

    const nextRisk = Math.min(riskPerPoint * stepFactor, maxRisk);

    const steps30 = 30 / intervalDays;
    const steps90 = 90 / intervalDays;

    const riskIn30Days = Math.min(riskPerPoint * Math.pow(stepFactor, steps30), maxRisk);
    const riskIn90Days = Math.min(riskPerPoint * Math.pow(stepFactor, steps90), maxRisk);

    let daysToMaxRisk = Infinity;
    if (riskPerPoint > 0 && riskPerPoint < maxRisk) {
      const n = Math.log(maxRisk / riskPerPoint) / Math.log(stepFactor);
      daysToMaxRisk = n * intervalDays;
    }

    return {
      nextRisk,
      riskIn30Days,
      riskIn90Days,
      daysToMaxRisk
    };
  }, [riskPerPoint, growthRatePct, intervalDays]);

  // --------------------------
  // PROJECTED PNL USING NEXT RISK (OPTION A)
  // --------------------------
  const projectedWeeklyPnL = weeklyPoints * nextRisk;
  const projectedMonthlyPnL = monthlyPoints * nextRisk;
  const projectedYearlyPnL = yearlyPoints * nextRisk;

  const projectedWeeklyROI =
    requiredBalance > 0 ? (projectedWeeklyPnL / requiredBalance) * 100 : 0;

  const projectedMonthlyROI =
    requiredBalance > 0 ? (projectedMonthlyPnL / requiredBalance) * 100 : 0;

  const projectedYearlyROI =
    requiredBalance > 0 ? (projectedYearlyPnL / requiredBalance) * 100 : 0;

  const fmt = (num: number, decimals = 0) =>
    Number(num.toFixed(decimals)).toLocaleString();

  return (
    <section className="space-y-4">

{/* ==========================
    HEADER BADGE — REQ BALANCE + MODE TOGGLE
   ========================== */}
<div className="flex justify-center mt-0 mb-2 p-0">

  <div className="flex items-center gap-4">

    {/* Required Balance Badge */}
    <span className="
      px-4
      py-1.5
      text-[16px]
      font-semibold
      rounded-full
      bg-blue-500/10
      text-blue-300
      border border-blue-500/30
      shadow-[0_0_12px_rgba(0,102,255,0.35)]
      tracking-wide
    ">
      Required Account Balance: ${fmt(requiredBalance)}
    </span>

{/* Mode Toggle (iOS style, matched to badge height) */}
<div
  className="
    flex
    items-center
    cursor-pointer
    select-none
    px-4
    py-1.5
    rounded-full
    bg-slate-900/40
    border border-slate-600/40
    shadow-[0_0_12px_rgba(0,0,0,0.45)]
    backdrop-blur-sm
  "
  onClick={() => setIsSmallCap(!isSmallCap)}
>

  {/* Small Cap Label */}
  <span className={`
    text-xs
    mr-3
    tracking-wide
    ${isSmallCap ? "text-emerald-300" : "text-slate-500"}
  `}>
    Small Cap
  </span>

  {/* Switch Track */}
  <div
    className={`
      w-12
      h-6
      flex
      items-center
      rounded-full
      p-1
      transition-all
      duration-300
      ${isSmallCap ? "bg-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.45)]" 
                   : "bg-red-500/40 shadow-[0_0_8px_rgba(239,68,68,0.45)]"}
    `}
  >
    {/* Switch Thumb */}
    <div
      className={`
        w-5
        h-5
        rounded-full
        bg-white
        shadow-[0_0_6px_rgba(255,255,255,0.6)]
        transform
        transition-all
        duration-300
        ${isSmallCap ? "translate-x-0" : "translate-x-6"}
      `}
    />
  </div>

  {/* Large Cap Label */}
  <span className={`
    text-xs
    ml-3
    tracking-wide
    ${!isSmallCap ? "text-red-300" : "text-slate-500"}
  `}>
    Large Cap
  </span>

</div>


  </div>

</div>

      {/* ==========================
          INPUT GRID (GREEN)
         ========================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-1">

        {/* Risk Per Point */}
        <div className="rounded-lg border border-emerald-400/40 shadow-[0_0_5px_rgba(16,185,129,0.35)] bg-black/20 p-2">
          <GTSlider
            title="Risk Per Point"
            value={riskPerPoint}
            min={1}
            max={900}
            step={1}
            onChange={setRiskPerPoint}
            dollars
            titleClassName="text-emerald-300"
          />
        </div>

        {/* AM Session Avg Points */}
        <div className="rounded-lg border border-emerald-400/40 shadow-[0_0_5px_rgba(16,185,129,0.35)] bg-black/20 p-2">
          <GTSlider
            title="🌞 AM Session Avg Points"
            value={amPoints}
            min={0.5}
            max={15}
            step={0.5}
            onChange={setAmPoints}
            titleClassName="text-emerald-300"
          />
        </div>

        {/* PM Session Avg Points */}
        <div className="rounded-lg border border-emerald-400/40 shadow-[0_0_5px_rgba(16,185,129,0.35)] bg-black/20 p-2">
          <GTSlider
            title="🌚 PM Session Avg Points"
            value={pmPoints}
            min={0.5}
            max={15}
            step={0.5}
            onChange={setPmPoints}
            titleClassName="text-emerald-300"
          />
        </div>

{/* Risk Buffer */}
<div className="rounded-lg border border-emerald-400/40 shadow-[0_0_5px_rgba(16,185,129,0.35)] bg-black/20 p-2">
  <GTSlider
    title={`Risk Buffer (${riskBuffer} losses to account blown)`}
    value={riskBuffer}
    min={5}
    max={30}
    step={1}
    onChange={setRiskBuffer}
    titleClassName="text-emerald-300"
  />
</div>

        {/* Scaling Growth Rate */}
        <div className="rounded-lg border border-emerald-400/40 shadow-[0_0_5px_rgba(16,185,129,0.35)] bg-black/20 p-2">
          <GTSlider
            title="Risk Growth Rate (% per interval)"
            value={growthRatePct}
            min={0}
            max={500}
            step={25}
            onChange={setGrowthRatePct}
            percent
            titleClassName="text-emerald-300"
          />
        </div>

        {/* Scaling Interval Days */}
        <div className="rounded-lg border border-emerald-400/40 shadow-[0_0_5px_rgba(16,185,129,0.35)] bg-black/20 p-2">
          <GTSlider
            title="Scaling Interval (days)"
            value={intervalDays}
            min={3}
            max={30}
            step={1}
            onChange={setIntervalDays}
            titleClassName="text-emerald-300"
          />
        </div>

      </div>

      {/* ==========================
          SCALING ENGINE (RED)
         ========================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4 mb-5">

 {/* Next Risk + Cap */}
<div className="rounded-lg border border-[rgb(84,33,33)] shadow-[0_0_5px_rgba(84,33,33,0.35)] bg-black/20 p-4">

  <p className="text-xs uppercase tracking-wide text-red-900 text-center mb-3">
    Next Interval Risk
  </p>

  <div className="grid grid-cols-3 gap-3">

    <div className="rounded-md border border-red-500/20 bg-black/30 p-3 text-center">
      <p className="text-[11px] uppercase tracking-wide text-slate-500">
        Current
      </p>
      <p className="text-2xl font-bold text-slate-400 mt-1">
        ${fmt(riskPerPoint)}
      </p>
    </div>

    <div className="rounded-md border border-red-500/20 bg-black/30 p-3 text-center">
      <p className="text-[11px] uppercase tracking-wide text-slate-500">
        Next
      </p>
      <p className="text-2xl font-bold text-emerald-300 mt-1">
        ${fmt(nextRisk)}
      </p>
    </div>

    <div className="rounded-md border border-red-500/20 bg-black/30 p-3 text-center">
      <p className="text-[11px] uppercase tracking-wide text-slate-500">
        Max
      </p>
      <p className="text-2xl font-bold text-red-300 mt-1">
        ${fmt(maxRisk)}
      </p>
    </div>

  </div>

  <p className="mt-4 text-[13px] text-slate-500 text-center">
    Scaling every {intervalDays} days at {growthRatePct}% per step.
  </p>
</div>

{/* 30 / 90 Day Projection */}
<div className="rounded-lg border border-[rgb(84,33,33)] shadow-[0_0_5px_rgba(84,33,33,0.35)] bg-black/20 p-4">

  <p className="text-xs uppercase tracking-wide text-red-900 text-center mb-3">
    Risk Projection
  </p>

  <div className="grid grid-cols-2 gap-3">

    <div className="rounded-md border border-red-500/20 bg-black/30 p-3 text-center">
      <p className="text-[11px] uppercase tracking-wide text-slate-500">
        Risk in 30 Days
      </p>
      <p className="text-2xl font-bold text-slate-400 mt-1">
        ${fmt(riskIn30Days)}
      </p>
    </div>

    <div className="rounded-md border border-red-500/20 bg-black/30 p-3 text-center">
      <p className="text-[11px] uppercase tracking-wide text-slate-500">
        Risk in 90 Days
      </p>
      <p className="text-2xl font-bold text-slate-400 mt-1">
        ${fmt(riskIn90Days)}
      </p>
    </div>

  </div>

  <p className="mt-4 text-[13px] text-slate-500 text-center">
    Based on continuous scaling, capped at ${fmt(maxRisk)}.
  </p>
</div>

{/* Days to Max Risk */}
<div className="rounded-lg border border-[rgb(84,33,33)] shadow-[0_0_5px_rgba(84,33,33,0.35)] bg-black/20 p-4">

  <p className="text-xs uppercase tracking-wide text-red-900 text-center mb-3">
    Time to Max Risk
  </p>

  <div className="grid grid-cols-2 gap-3">

    <div className="rounded-md border border-red-500/20 bg-black/30 p-3 text-center">
      <p className="text-[11px] uppercase tracking-wide text-slate-500">
        Days Until Max
      </p>
      <p className="text-2xl font-bold text-emerald-300 mt-1">
        {Number.isFinite(daysToMaxRisk) ? fmt(daysToMaxRisk, 0) : "—"}
      </p>
    </div>

    <div className="rounded-md border border-red-500/20 bg-black/30 p-3 text-center">
      <p className="text-[11px] uppercase tracking-wide text-slate-500">
        Intervals
      </p>
      <p className="text-2xl font-bold text-slate-400 mt-1">
        {Number.isFinite(daysToMaxRisk)
          ? fmt(daysToMaxRisk / intervalDays, 1)
          : "—"}
      </p>
    </div>

  </div>

  <p className="mt-4 text-[13px] text-red-900 text-center">
    ⚠️ Faster scaling = faster max‑risk
  </p>
</div></div>

      {/* ==========================
          SUMMARY GRID
         ========================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">

{/* LEFT — Points Summary */}
<div className="rounded-xl border border-slate-700/60 bg-[#0f0f17] p-4">
  <p className="text-xs uppercase tracking-wide text-slate-400 text-center">
    Points Summary
  </p>

  <div className="mt-3 space-y-3">

    <div className="flex justify-between items-center p-3 rounded-lg border border-slate-700/40 bg-black/20">
      <span className="text-slate-400">🌞 AM Points:</span>
      <span className="text-xl font-semibold text-slate-400 tabular-nums">
        {fmt(amPoints, 1)}x
      </span>
    </div>

    <div className="flex justify-between items-center p-3 rounded-lg border border-slate-700/40 bg-black/20">
      <span className="text-slate-400">🌚 PM Points:</span>
      <span className="text-xl font-semibold text-slate-400 tabular-nums">
        {fmt(pmPoints, 1)}x
      </span>
    </div>

    <div className="flex justify-between items-center p-3 rounded-lg border border-slate-700/40 bg-black/20">
      <span className="text-slate-400">Total Avg Points:</span>
      <span className="text-2xl font-bold text-emerald-300 tabular-nums">
        {fmt(totalAvgPoints, 1)}x
      </span>
    </div>

  </div>
</div>


        {/* MIDDLE — PnL Summary (GREEN) */}
        <div
          className="
            rounded-xl
            border border-emerald-500/30
            bg-gradient-to-b from-emerald-500/10 to-transparent
            p-4
            shadow-[0_0_25px_rgba(16,185,129,0.25)]
          "
        >
          <p className="text-xs uppercase tracking-wide text-emerald-400 text-center">
            PnL Summary
          </p>

          <div className="mt-3 space-y-4">

            <div className="flex justify-between items-center p-3 rounded-lg border border-emerald-500/20 bg-black/20">
              <span className="text-slate-300">Weekly PnL:</span>
              <span className="text-xl font-bold text-emerald-300 tabular-nums">
                ${fmt(projectedWeeklyPnL)}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-lg border border-emerald-500/20 bg-black/20">
              <span className="text-slate-300">Monthly PnL:</span>
              <span className="text-xl font-bold text-emerald-300 tabular-nums">
                ${fmt(projectedMonthlyPnL)}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-lg border border-emerald-500/20 bg-black/20">
              <span className="text-slate-300">Yearly PnL:</span>
              <span className="text-xl font-bold text-emerald-300 tabular-nums">
                ${fmt(projectedYearlyPnL)}
              </span>
            </div>

          </div>
        </div>

        {/* RIGHT — ROI Summary */}
        <div className="rounded-xl border border-slate-700/60 bg-[#0f0f17] p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400 text-center">
            ROI Summary  •  {localTime}
          </p>

          <div className="mt-3 space-y-3">

            <div className="flex justify-between items-center p-3 rounded-lg border border-slate-700/40 bg-black/20">
              <span className="text-slate-400">Weekly ROI:</span>
              <span className="text-xl font-semibold text-slate-400 tabular-nums">
                <AnimatedNumber value={projectedWeeklyROI} />%
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-lg border border-slate-700/40 bg-black/20">
              <span className="text-slate-400">Monthly ROI:</span>
              <span className="text-xl font-semibold text-slate-400 tabular-nums">
                <AnimatedNumber value={projectedMonthlyROI} />%
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-lg border border-slate-700/40 bg-black/20">
              <span className="text-slate-400">Yearly ROI:</span>
              <span className="text-xl font-semibold text-slate-400 tabular-nums">
                <AnimatedNumber value={projectedYearlyROI} />%
              </span>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
}


