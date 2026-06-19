"use client";

import { useState } from "react";

import { AdminRevenuePlanner } from "@/app/sandbox/admin-tools/GoalPlannerAdminCard/AdminRevenuePlanner";
import { BabyBotProjection } from "@/app/sandbox/admin-tools/baby-bot/BabyBotProjection";
import { AdminIncomePlannerGold } from "@/app/sandbox/admin-tools/UserPlannerAdminCard/AdminIncomePlannerGold";
import BiWeeklyGrowthChart from "@/app/sandbox/admin-tools/barchart/barchart";
import EquityCurveChart from "@/app/sandbox/admin-tools/equity-curve/EquityCurveChart";
import YTMarketingTool from "@/app/sandbox/admin-tools/YTMarketing/YTMarketingTool";
import LoanTool from "@/app/sandbox/admin-tools/Loan/LoanTool";   // ⭐ NEW IMPORT

console.log("SUPABASE URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

function CollapsibleSection({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <section className="space-y-3">

      {/* Title */}
      <button
        onClick={() => setOpen(!open)}
        className="
          w-full
          text-center
          text-xl
          font-semibold
          tracking-wide
          text-slate-400
          py-2
          transition
          hover:text-slate-200
        "
      >
        {title}
        <span className="ml-2 text-slate-500 text-sm">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {/* Content */}
      {open && (
        <div className="pt-2">
          {children}
        </div>
      )}

    </section>
  );
}

export default function AdminToolsPage() {
  return (
    <main className="min-h-screen bg-[#050509] text-white p-6">
      <div className="mx-auto max-w-5xl space-y-14">

        <CollapsibleSection title="NVDA Equity Curve Chart">
          <EquityCurveChart />
        </CollapsibleSection>

        <CollapsibleSection title="YouTube Marketing Planner">
          <YTMarketingTool />
        </CollapsibleSection>

        <CollapsibleSection title="GoTrade ~ User Income Planner">
          <AdminIncomePlannerGold />
        </CollapsibleSection>

        <CollapsibleSection title="GoTrade ~ Admin Income Planner">
          <AdminRevenuePlanner />
        </CollapsibleSection>

        <CollapsibleSection title="BabyBot ~ Income Planner">
          <BabyBotProjection />
        </CollapsibleSection>

        {/* ⭐ NEW — Loan Tool */}
        <CollapsibleSection title="GoTrade ~ Forecast Tool">
          <LoanTool />
        </CollapsibleSection>

      </div>
    </main>
  );
}


