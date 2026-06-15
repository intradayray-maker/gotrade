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

// ==========================
// MODEL PRICING (AUTO-SCALE)
// ==========================
// Based on ~1500 tokens per analysis
// Haiku: ~0.0009
// GPT‑4o Mini: ~0.00045
// Sonnet: ~0.0105
function getModelBaseCost(model: number) {
  if (model === 1) return 0.0009;
  if (model === 2) return 0.00045;
  return 0.0105;
}

export function GoProductCostPlanner() {
  const localTime = useLocalTime();

  // ==========================
  // USER + USAGE INPUTS
  // ==========================
  const [users, setUsers] = useState(500);
  const [analysesPerUser, setAnalysesPerUser] = useState(20);
  const [ugcPerUser, setUgcPerUser] = useState(10);
  const [anglesPerUser, setAnglesPerUser] = useState(8);
  const [spiesPerUser, setSpiesPerUser] = useState(5);
  const [subFee, setSubFee] = useState(29);

  // ==========================
  // EXPENSE INPUTS
  // ==========================
  const [domainCost, setDomainCost] = useState(10);
  const [emailCost, setEmailCost] = useState(30);
  const [marketingCost, setMarketingCost] = useState(500);

  // AI model
  const [modelChoice, setModelChoice] = useState(2);

  const [autoScaleEnabled, setAutoScaleEnabled] = useState(true);

  // ==========================
  // USAGE COUNTS
  // ==========================
  const totalAnalyses = users * analysesPerUser;
  const totalUgc = users * ugcPerUser;
  const totalAngles = users * anglesPerUser;
  const totalSpies = users * spiesPerUser;

  // ==========================
  // AI COST (AUTO-SCALE ONLY)
  // ==========================
  const baseCost = getModelBaseCost(modelChoice);

  const aiCostMonthly =
    totalAnalyses * baseCost +
    totalUgc * baseCost +
    totalAngles * baseCost +
    totalSpies * baseCost;

  // ==========================
  // REVENUE
  // ==========================
  const subRevenue = users * subFee;
  const totalMonthlyRevenue = subRevenue;
  const totalAnnualRevenue = totalMonthlyRevenue * 12;

  // ==========================
  // INFRA AUTO-SCALE
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
    stripeAuto = users * subFee * 0.029 + users * 0.3;
  }

  let emailAuto = 0;
  if (autoScaleEnabled) {
    const monthlyEmails = users * 60;
    const extra = Math.max(0, monthlyEmails - 3000);
    emailAuto = (extra / 1000) * 0.9;
  }

  // ==========================
  // EXPENSE TOTALS
  // ==========================
  const fixedExpensesMonthly =
    domainCost +
    emailCost +
    marketingCost;

  const autoExpensesMonthly =
    supabaseAuto +
    vercelAuto +
    stripeAuto +
    emailAuto +
    aiCostMonthly;

  const totalExpensesMonthly =
    fixedExpensesMonthly + autoExpensesMonthly;

  const totalExpensesAnnual =
    totalExpensesMonthly * 12;

  const netMonthly =
    totalMonthlyRevenue - totalExpensesMonthly;

  const netAnnual =
    totalAnnualRevenue - totalExpensesAnnual;

  // ==========================
  // UI
  // ==========================
  return (
    <section className="space-y-6">

      {/* HEADER */}
<div className="flex items-center justify-center mb-2">
  <button
    onClick={() => setAutoScaleEnabled(!autoScaleEnabled)}
    className={`
      px-4 py-1.5 text-xs font-semibold rounded-full border transition-all
      ${
        autoScaleEnabled
          ? "border-emerald-400 text-emerald-300 bg-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
          : "border-slate-600 text-slate-300 bg-slate-800"
      }
    `}
  >
    Auto‑Scale: {autoScaleEnabled ? "On" : "Off"}
    <span className="ml-2 text-[12px] opacity-70">
      ( Vercel ~ Stripe ~ Supabase ~ Resend ~ AI )
    </span>
  </button>
</div>


      {/* GREEN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

        <div className="rounded-lg border border-emerald-400/40 bg-black/20 p-3">
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

        <div className="rounded-lg border border-emerald-400/40 bg-black/20 p-3">
          <GTSlider
            title="Product Analyses per User"
            value={analysesPerUser}
            min={0}
            max={200}
            step={1}
            onChange={setAnalysesPerUser}
            titleClassName="text-emerald-300"
          />
        </div>

        <div className="rounded-lg border border-emerald-400/40 bg-black/20 p-3">
          <GTSlider
            title="UGC Scripts per User"
            value={ugcPerUser}
            min={0}
            max={200}
            step={1}
            onChange={setUgcPerUser}
            titleClassName="text-emerald-300"
          />
        </div>

        <div className="rounded-lg border border-emerald-400/40 bg-black/20 p-3">
          <GTSlider
            title="Ad Angles per User"
            value={anglesPerUser}
            min={0}
            max={200}
            step={1}
            onChange={setAnglesPerUser}
            titleClassName="text-emerald-300"
          />
        </div>

        <div className="rounded-lg border border-emerald-400/40 bg-black/20 p-3">
          <GTSlider
            title="Shopify Store Spies per User"
            value={spiesPerUser}
            min={0}
            max={200}
            step={1}
            onChange={setSpiesPerUser}
            titleClassName="text-emerald-300"
          />
        </div>

        <div className="rounded-lg border border-emerald-400/40 bg-black/20 p-3">
          <GTSlider
            title="Subscription Fee"
            value={subFee}
            min={0}
            max={200}
            step={1}
            onChange={setSubFee}
            dollars
            titleClassName="text-emerald-300"
          />
        </div>
      </div>

      {/* RED GRID — 3 CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">

        {/* Domain + Email */}
        <div className="rounded-lg border border-red-400/40 bg-black/20 p-3 shadow-[0_0_5px_rgba(248,113,113,0.35)]">
          <div className="grid grid-cols-2 gap-3">
            <GTSlider
              title="Domain (.com)"
              value={domainCost}
              min={0}
              max={50}
              step={1}
              onChange={setDomainCost}
              dollars
              titleClassName="text-red-300"
            />

            <GTSlider
              title="Pro Email"
              value={emailCost}
              min={0}
              max={200}
              step={5}
              onChange={setEmailCost}
              dollars
              titleClassName="text-red-300"
            />
          </div>
        </div>

        {/* Marketing Budget */}
        <div className="rounded-lg border border-red-400/40 bg-black/20 p-3 shadow-[0_0_5px_rgba(248,113,113,0.35)]">
          <GTSlider
            title="Marketing Budget"
            value={marketingCost}
            min={0}
            max={5000}
            step={50}
            onChange={setMarketingCost}
            dollars
            titleClassName="text-red-300"
          />
        </div>

        {/* AI Model */}
        <div className="rounded-lg border border-red-400/40 bg-black/20 p-3 shadow-[0_0_5px_rgba(248,113,113,0.35)]">
          <GTSlider
            title="1=Haiku • 2=GPT‑4o Mini • 3=Sonnet"
            value={modelChoice}
            min={1}
            max={3}
            step={1}
            onChange={setModelChoice}
            titleClassName="text-red-300"
          />
        </div>
      </div>


      {/* RESULTS GRID */}
      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">

        {/* Monthly Breakdown */}
        <div className="rounded-xl border border-slate-700/60 bg-[#0f0f17] p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400 text-center">
            Monthly Breakdown
          </p>

          <div className="mt-3 space-y-3">

            <div className="flex justify-between items-center p-3 rounded-lg border border-slate-700/40 bg-black/20">
              <span className="text-slate-400">Subscription Revenue:</span>
              <span className="text-xl font-semibold text-slate-50">
                $<AnimatedNumber value={subRevenue} />
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-lg border border-slate-700/40 bg-black/20">
              <span className="text-slate-400">AI Cost (Auto‑Scale):</span>
              <span className="text-xl font-semibold text-red-400">
                -$<AnimatedNumber value={aiCostMonthly} />
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-lg border border-slate-700/40 bg-black/20">
              <span className="text-slate-400">Expenses (Fixed):</span>
              <span className="text-xl font-semibold text-red-400">
                -$<AnimatedNumber value={fixedExpensesMonthly} />
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-lg border border-slate-700/40 bg-black/20">
              <span className="text-slate-400">Infra (Auto‑Scale):</span>
              <span className="text-xl font-semibold text-red-400">
                -$<AnimatedNumber value={autoExpensesMonthly - aiCostMonthly} />
              </span>
            </div>

          </div>
        </div>

        {/* Summary */}
        <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 to-transparent p-4 shadow-[0_0_25px_rgba(16,185,129,0.25)]">
          <p className="text-xs uppercase tracking-wide text-emerald-400 text-center">
            Summary
          </p>

          <div className="mt-3 space-y-4">

            <div className="flex justify-between items-center p-3 rounded-lg border border-emerald-500/20 bg-black/20">
              <span className="text-slate-300">Total Monthly (Gross):</span>
              <span className="text-xl font-bold text-emerald-400">
                $<AnimatedNumber value={totalMonthlyRevenue} />
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-lg border border-emerald-500/20 bg-black/20">
              <span className="text-slate-300">Total Monthly Expenses:</span>
              <span className="text-xl font-bold text-red-400">
                -$<AnimatedNumber value={totalExpensesMonthly} />
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-lg border border-emerald-500/20 bg-black/20">
              <span className="text-slate-300">Net Monthly:</span>
              <span
                className={`
                  text-2xl font-bold
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
                  text-2xl font-bold
                  ${netAnnual >= 0 ? "text-emerald-400" : "text-red-400"}
                `}
              >
                $<AnimatedNumber value={netAnnual} />
              </span>
            </div>

          </div>
        </div>

        {/* Annual Breakdown */}
        <div className="rounded-xl border border-slate-700/60 bg-[#0f0f17] p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400 text-center">
            Annual Breakdown
          </p>

          <div className="mt-3 space-y-3">

            <div className="flex justify-between items-center p-3 rounded-lg border border-slate-700/40 bg-black/20">
              <span className="text-slate-400">Subscription Revenue:</span>
              <span className="text-xl font-semibold text-slate-50">
                $<AnimatedNumber value={totalAnnualRevenue} />
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-lg border border-slate-700/40 bg-black/20">
              <span className="text-slate-400">AI Cost (Annual):</span>
              <span className="text-xl font-semibold text-red-400">
                -$<AnimatedNumber value={aiCostMonthly * 12} />
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-lg border border-slate-700/40 bg-black/20">
              <span className="text-slate-400">Expenses (Fixed):</span>
              <span className="text-xl font-semibold text-red-400">
                -$<AnimatedNumber value={fixedExpensesMonthly * 12} />
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-lg border border-slate-700/40 bg-black/20">
              <span className="text-slate-400">Infra (Auto‑Scale):</span>
              <span className="text-xl font-semibold text-red-400">
                -$<AnimatedNumber value={(autoExpensesMonthly - aiCostMonthly) * 12} />
              </span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
