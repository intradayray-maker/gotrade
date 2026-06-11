"use client";

import Link from "next/link";
import GTCard from "@/components/ui/GTCard";
import { AcademicCapIcon, PlayCircleIcon } from "@heroicons/react/24/outline";

export default function SchoolPage() {
  return (
    <div
      className="
        w-full
        max-w-5xl
        mx-auto
        px-4
        md:px-6
        lg:px-8
        space-y-10
        text-white
      "
    >
      {/* -------------------------
         TF PAGE HEADER (UNIVERSAL)
      -------------------------- */}
      <div
        className="
          w-full
          px-1
          md:px-6
          lg:px-2
          space-y-4
          animate-fadeIn
        "
      >
        {/* Breadcrumb */}
        <div
          className="
            flex
            items-center
            gap-2
            text-[13px]
            text-white/40
            pt-3
          "
        >
          <Link
            href="/dashboard"
            className="
              hover:text-white/70
              transition-colors
              cursor-pointer
            "
          >
            Dashboard
          </Link>

          <span className="text-white/30">/</span>

          <span className="text-white/60">Academy</span>
        </div>

        {/* Header Title */}
        <div className="[animation-duration:0.6s]">
          <div className="flex items-center gap-3">
            <AcademicCapIcon
              className="
                w-8
                h-8
                text-emerald-400
                drop-shadow-[0_0_6px_rgba(0,255,180,0.35)]
              "
            />

            <h1
              className="
                text-3xl
                font-bold
                tracking-tight
                text-white/90
                drop-shadow-[0_0_10px_rgba(0,255,180,0.25)]
              "
            >
              GoTrade Academy
            </h1>
          </div>

          <p
            className="
              text-white/50
              text-sm
              mt-2
              tracking-wide
              max-w-md
            "
          >
            Learn how to use GoTrade, automate your trading, and master the platform.
          </p>

          <div
            className="
              mt-5
              h-[2px]
              w-24
              bg-gradient-to-r
              from-emerald-400/80
              to-emerald-700/80
              rounded-full
              shadow-[0_0_12px_rgba(0,255,180,0.35)]
              animate-fadeIn
              [animation-delay:0.2s]
            "
          ></div>
        </div>
      </div>

      {/* -------------------------
         LESSONS GRID (GT CARDS)
      -------------------------- */}
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          gap-8
          animate-fadeIn
          [animation-delay:0.3s]
        "
      >
        {/* LESSON CARD */}
        <GTCard className="space-y-4 p-6">
          <div
            className="
              flex
              items-center
              justify-center
              h-12
              w-12
              rounded-xl
              bg-black/40
              border
              border-white/10
            "
          >
            <PlayCircleIcon className="h-7 w-7 text-white/70" />
          </div>

          <h3 className="text-white font-semibold tracking-tight">
            Getting Started with GoTrade
          </h3>

          <p className="text-sm text-white/60">
            Introduction to the platform, navigation, and core features.
          </p>

          <span className="text-xs text-white/40 italic">
            Video coming soon
          </span>
        </GTCard>

        {/* LESSON CARD */}
        <GTCard className="space-y-4 p-6">
          <div
            className="
              flex
              items-center
              justify-center
              h-12
              w-12
              rounded-xl
              bg-black/40
              border
              border-white/10
            "
          >
            <PlayCircleIcon className="h-7 w-7 text-white/70" />
          </div>

          <h3 className="text-white font-semibold tracking-tight">
            Setting Up Automated Trading
          </h3>

          <p className="text-sm text-white/60">
            Learn how to connect accounts, configure automation, and manage risk.
          </p>

          <span className="text-xs text-white/40 italic">
            Video coming soon
          </span>
        </GTCard>

        {/* LESSON CARD */}
        <GTCard className="space-y-4 p-6">
          <div
            className="
              flex
              items-center
              justify-center
              h-12
              w-12
              rounded-xl
              bg-black/40
              border
              border-white/10
            "
          >
            <PlayCircleIcon className="h-7 w-7 text-white/70" />
          </div>

          <h3 className="text-white font-semibold tracking-tight">
            Understanding Signals & AI Cards
          </h3>

          <p className="text-sm text-white/60">
            How to read signals, interpret AI output, and execute trades.
          </p>

          <span className="text-xs text-white/40 italic">
            Video coming soon
          </span>
        </GTCard>
      </div>
    </div>
  );
}
