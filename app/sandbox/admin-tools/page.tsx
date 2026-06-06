"use client";

import { useState } from "react";
import Link from "next/link";

import { AdminRevenuePlanner } from "@/app/sandbox/admin-tools/GoalPlannerAdminCard/AdminRevenuePlanner";
import { BabyBotProjection } from "@/app/sandbox/admin-tools/baby-bot/BabyBotProjection";
import { AdminIncomePlannerGold } from "@/app/sandbox/admin-tools/UserPlannerAdminCard/AdminIncomePlannerGold";
import BiWeeklyGrowthChart from "@/app/sandbox/admin-tools/barchart/barchart";
import EquityCurveChart from "@/app/sandbox/admin-tools/equity-curve/EquityCurveChart";
import YTMarketingTool from "@/app/sandbox/admin-tools/YTMarketing/YTMarketingTool";
import LoanTool from "@/app/sandbox/admin-tools/Loan/LoanTool";

import {
  Squares2X2Icon,
  HomeIcon
} from "@heroicons/react/24/outline";

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

      {/* ⭐ FLOATING RIGHT‑SIDE NAV BUTTONS */}
      <div className="
        fixed
        right-6
        top-1/2
        -translate-y-1/2
        z-50
        flex
        flex-col
        gap-4
      ">

        {/* Dashboard */}
        <Link
          href="/dashboard"
          title="Dashboard"
          className="
            w-12 h-12
            flex items-center justify-center
            rounded-full
            bg-[rgb(3,3,3)]
            text-[rgb(225,254,234)]
            transition duration-150
            hover:bg-[rgb(5,100,80)]
            hover:shadow-[0_0_28px_rgba(3,82,65,0.75)]
            hover:-translate-y-[2px]
          "
        >
          <Squares2X2Icon className="h-6 w-6" />
        </Link>

        {/* Public Home */}
        <Link
          href="/"
          title="Public Home"
          className="
            w-12 h-12
            flex items-center justify-center
            rounded-full
            bg-[rgb(3,3,3)]
            text-[rgb(225,254,234)]
            transition duration-150
            hover:bg-[rgb(5,100,80)]
            hover:shadow-[0_0_28px_rgba(3,82,65,0.75)]
            hover:-translate-y-[2px]
          "
        >
          <HomeIcon className="h-6 w-6" />
        </Link>

      </div>

      {/* MAIN CONTENT */}
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

        <CollapsibleSection title="GoTrade ~ Forecast Tool">
          <LoanTool />
        </CollapsibleSection>

      </div>
    </main>
  );
}
