"use client";

import { useState, useEffect } from "react";
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

export function AdminRevenuePlanner() {

  const localTime = useLocalTime();

  // ==========================
  // USER + REVENUE INPUTS
  // ==========================
  const [users, setUsers] = useState(100);
  const [avgAccount, setAvgAccount] = useState(5000);
  const [subFee, setSubFee] = useState(25);
  const [perfFeePct, setPerfFeePct] = useState(0.00);
  const [roiPct, setRoiPct] = useState(0.20);
  const [yourBalance, setYourBalance] = useState(10000);

  // ==========================
  // EXPENSE INPUTS
  // ==========================
  const [domainCost, setDomainCost] = useState(0.33);
  const [emailCost, setEmailCost] = useState(6);
  const [marketingCost, setMarketingCost] = useState(95);
  const [tvBasicCost, setTvBasicCost] = useState(15);
  const [tvDataCost, setTvDataCost] = useState(10);

  // Auto-scale controlled expenses
  const [vercelCost, setVercelCost] = useState(0);
  const [supabaseCost, setSupabaseCost] = useState(0);
  const [stripeBaseCost, setStripeBaseCost] = useState(0);

  const [autoScaleEnabled, setAutoScaleEnabled] = useState(true);

  // ==========================
  // REVENUE CALCULATIONS
  // ==========================
  const subRevenue = users * subFee;
  const perfRevenue = users * avgAccount * roiPct * perfFeePct;
  const yourTradingRevenue = yourBalance * roiPct;

  const totalMonthly = subRevenue + perfRevenue + yourTradingRevenue;
  const totalAnnual = totalMonthly * 12;

  // ==========================
  // AUTO-SCALE LOGIC
  // ==========================
  let supabaseAuto = 0;
  if (autoScaleEnabled) {
    if (users > 10000) supabaseAuto = 100;
    else if (users > 2000) supabaseAuto = 50;
    else if (users > 500) supabaseAuto = 25;
  }

  let vercelAuto = 0;
  if (autoScaleEnabled) {
    if (users > 20000) vercelAuto = 80;
    else if (users > 5000) vercelAuto = 40;
    else if (users > 1000) vercelAuto = 20;
  }

  let stripeAuto = 0;
  if (autoScaleEnabled) {
    stripeAuto = users * subFee * 0.029 + users * 0.30;
  }

  // ==========================
  // EXPENSE TOTALS
  // ==========================
  const fixedExpensesMonthly =
    domainCost +
    emailCost +
    marketingCost +
    tvBasicCost +
    tvDataCost +
    vercelCost +
    supabaseCost +
    stripeBaseCost;

  const autoExpensesMonthly =
    supabaseAuto +
    vercelAuto +
    stripeAuto;

  const totalExpensesMonthly =
    fixedExpensesMonthly + autoExpensesMonthly;

  const totalExpensesAnnual =
    totalExpensesMonthly * 12;

  const netMonthly =
    totalMonthly - totalExpensesMonthly;

  const netAnnual =
    totalAnnual - totalExpensesAnnual;
  // ==========================
  // UI START
  // ==========================
  return (
    <section className="space-y-6">

      {/* ==========================
          HEADER + AUTO-SCALE TOGGLE
         ========================== */}
      <div className="flex items-center justify-center mb-5">

        <button
          onClick={() => setAutoScaleEnabled(!autoScaleEnabled)}
          className={`
            px-4 py-1.5 text-xs font-semibold rounded-full border transition-all
            ${autoScaleEnabled
              ? "border-emerald-400 text-emerald-300 bg-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
              : "border-slate-600 text-slate-300 bg-slate-800"}
          `}
        >
          Auto‑Scale: {autoScaleEnabled ? "On" : "Off"}  
          <span className="ml-2 text-[12px] opacity-70">
            ( Vercel ~ Stripe ~ Supabase )
          </span>
        </button>

      </div>



      {/* ==========================
          GREEN GRID — TOP 6 SLIDERS
         ========================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

        {/* Number of Users */}
        <div className="rounded-lg border border-emerald-400/40 bg-black/20 p-3 shadow-[0_0_5px_rgba(16,185,129,0.35)]">
          <GTSlider
            title="Number of Users"
            value={users}
            min={10}
            max={20000}
            step={10}
            onChange={setUsers}
            titleClassName="text-emerald-300"
          />
        </div>

        {/* Avg User Account Size */}
        <div className="rounded-lg border border-emerald-400/40 bg-black/20 p-3 shadow-[0_0_5px_rgba(16,185,129,0.35)]">
          <GTSlider
            title="Avg User Account Size"
            value={avgAccount}
            min={500}
            max={50000}
            step={500}
            onChange={setAvgAccount}
            dollars
            titleClassName="text-emerald-300"
          />
        </div>

        {/* Bot ROI % */}
        <div className="rounded-lg border border-emerald-400/40 bg-black/20 p-3 shadow-[0_0_5px_rgba(16,185,129,0.35)]">
          <GTSlider
            title="Bot ROI % (NVDA avg 4.78%)"
            value={roiPct * 100}
            min={1}
            max={50}
            step={0.5}
            onChange={(v) => setRoiPct(v / 100)}
            percent
            titleClassName="text-emerald-300"
          />
        </div>

        {/* Performance Fee % */}
        <div className="rounded-lg border border-emerald-400/40 bg-black/20 p-3 shadow-[0_0_5px_rgba(16,185,129,0.35)]">
          <GTSlider
            title="Performance Fee %"
            value={perfFeePct * 100}
            min={0}
            max={40}
            step={1}
            onChange={(v) => setPerfFeePct(v / 100)}
            percent
            titleClassName="text-emerald-300"
          />
        </div>

        {/* Subscription Fee */}
        <div className="rounded-lg border border-emerald-400/40 bg-black/20 p-3 shadow-[0_0_5px_rgba(16,185,129,0.35)]">
          <GTSlider
            title="Subscription Fee"
            value={subFee}
            min={0}
            max={200}
            step={5}
            onChange={setSubFee}
            dollars
            titleClassName="text-emerald-300"
          />
        </div>

        {/* Your Trading Balance */}
        <div className="rounded-lg border border-emerald-400/40 bg-black/20 p-3 shadow-[0_0_5px_rgba(16,185,129,0.35)]">
          <GTSlider
            title="Your Trading Balance"
            value={yourBalance}
            min={1000}
            max={250000}
            step={1000}
            onChange={setYourBalance}
            dollars
            titleClassName="text-emerald-300"
          />
        </div>

      </div>



      {/* ==========================
          RED GRID — EXPENSES (3 CELLS)
         ========================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">

        {/* Domain + Email (shared cell) */}
        <div className="rounded-lg border border-[rgb(84,33,33)] bg-black/20 p-3 shadow-[0_0_5px_rgba(84,33,33,0.35)]">


          <div className="grid grid-cols-2 gap-3">

            <GTSlider
              title="Domain (.com)"
              value={domainCost}
              min={0}
              max={2}
              step={0.01}
              onChange={setDomainCost}
              dollars
              titleClassName="text-red-300"
            />

            <GTSlider
              title="Pro Email"
              value={emailCost}
              min={0}
              max={10}
              step={1}
              onChange={setEmailCost}
              dollars
              titleClassName="text-red-300"
            />

          </div>
        </div>

        {/* Marketing */}
        <div className="rounded-lg border border-[rgb(84,33,33)] bg-black/20 p-3 shadow-[0_0_5px_rgba(84,33,33,0.35)]">
          <GTSlider
            title="Marketing"
            value={marketingCost}
            min={0}
            max={2000}
            step={25}
            onChange={setMarketingCost}
            dollars
            titleClassName="text-red-300"
          />
        </div>

        {/* CHART Basic + Live Data (shared cell) */}
        <div className="rounded-lg border border-[rgb(84,33,33)] bg-black/20 p-3 shadow-[0_0_5px_rgba(84,33,33,0.35)]">

          <div className="grid grid-cols-2 gap-3">

            <GTSlider
              title="TV Chart Basic"
              value={tvBasicCost}
              min={0}
              max={100}
              step={5}
              onChange={setTvBasicCost}
              dollars
              titleClassName="text-red-300"
            />

            <GTSlider
              title="NYSE Live Data"
              value={tvDataCost}
              min={0}
              max={50}
              step={1}
              onChange={setTvDataCost}
              dollars
              titleClassName="text-red-300"
            />

          </div>
        </div>

      </div>
      {/* ==========================
          RESULTS GRID (SLATE → GREEN → SLATE)
         ========================== */}
      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">

        {/* ==========================
            COLUMN 1 — Monthly Breakdown (SLATE)
           ========================== */}
        <div className="rounded-xl border border-slate-700/60 bg-[#0f0f17] p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400 text-center">
            Monthly Breakdown
          </p>

          <div className="mt-3 space-y-3">

            <div className="flex justify-between items-center p-3 rounded-lg border border-slate-700/40 bg-black/20">
              <span className="text-slate-400">Subscription Revenue:</span>
              <span className="text-xl font-semibold text-slate-50 tabular-nums">
                $<AnimatedNumber value={subRevenue} />
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-lg border border-slate-700/40 bg-black/20">
              <span className="text-slate-400">Performance Revenue:</span>
              <span className="text-xl font-semibold text-slate-50 tabular-nums">
                $<AnimatedNumber value={perfRevenue} />
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-lg border border-slate-700/40 bg-black/20">
              <span className="text-slate-400">Personal Trading:</span>
              <span className="text-xl font-semibold text-slate-50 tabular-nums">
                $<AnimatedNumber value={yourTradingRevenue} />
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-lg border border-slate-700/40 bg-black/20">
              <span className="text-slate-400">Expenses (Fixed):</span>
              <span className="text-xl font-semibold text-red-400 tabular-nums">
                -$<AnimatedNumber value={fixedExpensesMonthly} />
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-lg border border-slate-700/40 bg-black/20">
              <span className="text-slate-400">Expenses (Auto-Scale):</span>
              <span className="text-xl font-semibold text-red-400 tabular-nums">
                -$<AnimatedNumber value={autoExpensesMonthly} />
              </span>
            </div>

          </div>
        </div>



        {/* ==========================
            COLUMN 2 — Summary (GREEN)
           ========================== */}
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
            Summary
          </p>

          <div className="mt-3 space-y-4">

            <div className="flex justify-between items-center p-3 rounded-lg border border-emerald-500/20 bg-black/20">
              <span className="text-slate-300">Total Monthly (Gross):</span>
              <span className="text-xl font-bold text-emerald-400 tabular-nums">
                $<AnimatedNumber value={totalMonthly} />
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-lg border border-emerald-500/20 bg-black/20">
              <span className="text-slate-300">Total Monthly Expenses:</span>
              <span className="text-xl font-bold text-red-400 tabular-nums">
                -$<AnimatedNumber value={totalExpensesMonthly} />
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-lg border border-emerald-500/20 bg-black/20">
              <span className="text-slate-300">Net Monthly:</span>
              <span
                className={`
                  text-2xl font-bold tabular-nums
                  ${netMonthly >= 0 ? "text-emerald-400" : "text-red-400"}
                `}
              >
                $<AnimatedNumber value={netMonthly} />
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-lg border border-emerald-500/20 bg-black/20">
              <span className="text-slate-300">Net Yearly:</span>
              <span
                className={`
                  text-2xl font-bold tabular-nums
                  ${netAnnual >= 0 ? "text-emerald-400" : "text-red-400"}
                `}
              >
                $<AnimatedNumber value={netAnnual} />
              </span>
            </div>

          </div>
        </div>



        {/* ==========================
            COLUMN 3 — Annual Breakdown (SLATE)
           ========================== */}
        <div className="rounded-xl border border-slate-700/60 bg-[#0f0f17] p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400 text-center">
            Annual Breakdown
          </p>

          <div className="mt-3 space-y-3">

            <div className="flex justify-between items-center p-3 rounded-lg border border-slate-700/40 bg-black/20">
              <span className="text-slate-400">Subscription Revenue:</span>
              <span className="text-xl font-semibold text-slate-50 tabular-nums">
                $<AnimatedNumber value={subRevenue * 12} />
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-lg border border-slate-700/40 bg-black/20">
              <span className="text-slate-400">Performance Revenue:</span>
              <span className="text-xl font-semibold text-slate-50 tabular-nums">
                $<AnimatedNumber value={perfRevenue * 12} />
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-lg border border-slate-700/40 bg-black/20">
              <span className="text-slate-400">Personal Trading:</span>
              <span className="text-xl font-semibold text-slate-50 tabular-nums">
                $<AnimatedNumber value={yourTradingRevenue * 12} />
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-lg border border-slate-700/40 bg-black/20">
              <span className="text-slate-400">Expenses (Fixed):</span>
              <span className="text-xl font-semibold text-red-400 tabular-nums">
                -$<AnimatedNumber value={fixedExpensesMonthly * 12} />
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-lg border border-slate-700/40 bg-black/20">
              <span className="text-slate-400">Expenses (Auto-Scale):</span>
              <span className="text-xl font-semibold text-red-400 tabular-nums">
                -$<AnimatedNumber value={autoExpensesMonthly * 12} />
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}


