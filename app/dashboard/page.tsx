'use client'

import ForexTradeOutputCard from "./tools/ForexTradeOutputCard"
import ForexNewsCard from "./tools/ForexNewsCard"
import ForexAiCard from "./tools/ForexAiCard"

import CryptoAiCard from "./tools/CryptoAiCard"
import CryptoNewsCard from "./tools/CryptoNewsCard"
import CryptoTradeOutputCard from "./tools/CryptoTradeOutputCard"

export default function DashboardPage() {

  return (
    <div className="min-h-screen bg-[#050509] text-slate-100">

      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-6">

        {/* ==========================
            DASHBOARD HEADER
           ========================== */}
        <header className="animate-fadeIn [animation-duration:0.6s]">

          <div className="flex items-center gap-2 text-[13px] text-white/40 mb-3">
            <span className="text-white/60">Dashboard</span>
          </div>

          <div className="flex items-center gap-3">

            <svg
              className="w-7 h-7 text-emerald-400 drop-shadow-[0_0_6px_rgba(0,255,180,0.35)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>

            <h1 className="text-3xl font-bold tracking-tight text-white/90 drop-shadow-[0_0_10px_rgba(0,255,180,0.25)]">
              Dashboard
            </h1>

          </div>

          <p className="text-white/50 text-sm mt-2 tracking-wide max-w-md">
            Your trading tools and execution panel.
          </p>

          <div
            className="
              mt-4
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
          />

        </header>


        {/* ==========================
            FOREX SECTION
           ========================== */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex-1 h-px bg-slate-700/50" />
          <span className="text-slate-300 text-sm tracking-wider uppercase">
            Forex Tools
          </span>
          <div className="flex-1 h-px bg-slate-700/50" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <ForexAiCard />
          <ForexNewsCard />
          <ForexTradeOutputCard />
        </div>


        {/* ==========================
            CRYPTO SECTION
           ========================== */}
        <div className="flex items-center gap-4 mt-10">
          <div className="flex-1 h-px bg-slate-700/50" />
          <span className="text-slate-300 text-sm tracking-wider uppercase">
            Crypto Tools
          </span>
          <div className="flex-1 h-px bg-slate-700/50" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <CryptoAiCard />
          <CryptoNewsCard />
          <CryptoTradeOutputCard />
        </div>

      </main>
    </div>
  )
}
