"use client"

import { useState, useMemo } from "react"
import type { Tables } from "@/types/supabase"
import GTCard from "@/components/ui/GTCard"
import Link from "next/link"
import { useLivePnl } from "@/hooks/useLivePnl"
import GTSlider from "@/app/components/ui/GTSlider"

type Settings = Pick<
  Tables<"copy_trading_settings">,
  "enabled" | "allocation_value"
>

export default function UnifiedSettingsForm({ initialSettings }: { initialSettings: Settings | null }) {

  const pageTitle = "Risk Settings"
  const pageDescription = "Manage your risk limits and safety thresholds."

  const safe: Partial<Settings> = initialSettings ?? {}

  const [enabled, setEnabled] = useState<boolean>(safe.enabled ?? false)
  const [allocationValue, setAllocationValue] = useState<number>(safe.allocation_value ?? 100)

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const LOW = 0.60
  const MODERATE = 0.90

  const { data: live, isLoading: liveLoading } = useLivePnl()
  const buyingPower = live?.buyingPower ?? 0

  const hasUnsavedChanges = useMemo(() => {
    return (
      enabled !== (safe.enabled ?? false) ||
      allocationValue !== (safe.allocation_value ?? 100)
    )
  }, [enabled, allocationValue, safe])

  async function save() {
    setSaving(true)
    setSaved(false)

    const payload =
     {
      enabled,
      allocation_value: allocationValue,
      allocation_mode: "fixed_dollar",
      max_allocation_pct: 0.8,
     }

    const res =
     await fetch("/api/copy-trading/save-settings",
     {
      method: "POST",
      body: JSON.stringify(payload),
     })

    setSaving(false)

    if (res.ok)
    {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }
  return (
    <>
      <div className="w-full px-1 md:px-6 lg:px-2 space-y-4 max-w-5xl mx-none">

        <div className="flex items-center gap-2 text-[13px] text-white/40 pt-3 animate-fadeIn">
          <Link href="/dashboard" className="hover:text-white/70 transition-colors cursor-pointer">
            Dashboard
          </Link>
          <span className="text-white/30">/</span>
          <span className="text-white/60">{pageTitle}</span>
        </div>

        <div className="animate-fadeIn [animation-duration:0.6s]">

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
              <path d="M3 12h18" />
              <path d="M12 3v18" />
            </svg>

            <h1 className="text-3xl font-bold tracking-tight text-white/90 drop-shadow-[0_0_10px_rgba(0,255,180,0.25)]">
              {pageTitle}
            </h1>
          </div>

          <p className="text-white/50 text-sm mt-2 tracking-wide max-w-md">
            {pageDescription}
          </p>

          <div className="mt-5 h-[2px] w-24 bg-gradient-to-r from-emerald-400/80 to-emerald-700/80 rounded-full shadow-[0_0_12px_rgba(0,255,180,0.35)]"></div>

        </div>

      </div>

      <form className="max-w-6xl mx-auto space-y-2 mt-2">

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mx-auto max-w-7xl">

          {/* -------------------------
             CARD 1 — TRADING STATUS
          -------------------------- */}
          <GTCard className="flex flex-col min-h-[520px]">

            <h2 className="text-xs font-medium uppercase mb-1" style={{ color:"rgb(156,156,156)" }}>
              Trading Status
            </h2>

            <p className="text-[13px] mb-4" style={{ color:"rgb(109,109,109)" }}>
              Choose if you want BOT to enter trades or not.
            </p>

            <div className="w-full h-px bg-slate-800 mb-4"></div>

            <div className="flex flex-col flex-grow">

              <div className="flex flex-col items-center gap-3">
                <div
                  onClick={() => setEnabled(!enabled)}
                  className={`relative w-44 h-12 rounded-full cursor-pointer transition-all duration-300 ${
                    enabled
                      ? "bg-emerald-500/60 shadow-[0_0_16px_rgba(16,185,129,0.6)]"
                      : "bg-zinc-600/60 shadow-[0_0_16px_rgba(113,113,122,0.6)]"
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 h-10 w-10 rounded-full bg-white shadow-md transition-all duration-300 ${
                      enabled
                        ? "translate-x-32 shadow-[0_0_16px_rgba(16,185,129,0.6)]"
                        : "shadow-[0_0_16px_rgba(113,113,122,0.6)]"
                    }`}
                  ></div>
                </div>

                <div
                  key={"status-" + enabled}
                  className="symbol-anim text-center"
                  style={{
                    color: enabled ? "rgb(16,185,129)" : "rgb(113,113,122)",
                    fontFamily:"Verdana",
                    fontSize:"24px",
                    fontWeight:"600"
                  }}
                >
                  {enabled ? "Enabled" : "Disabled"}
                </div>
              </div>







<div className="flex flex-col items-center mt-8 mb-6">
  <div key={"donut-" + enabled} className="relative w-52 h-52 flex items-center justify-center donutFade">

    <div
      className="absolute w-52 h-52 rounded-full glow-pulse"
      style={{
        background: enabled ? "rgba(16,185,129,0.25)" : "rgba(113,113,122,0.25)",
        filter:"blur(34px)",
        opacity:0.35
      }}
    ></div>

    <svg className="w-52 h-52 transform -rotate-90 relative z-10">
      <circle cx="104" cy="104" r="78" stroke="#1e1e2a" strokeWidth="10" fill="none"></circle>
      <circle
        cx="104"
        cy="104"
        r="78"
        stroke={enabled ? "rgb(16,185,129)" : "rgb(113,113,122)"}
        strokeWidth="10"
        fill="none"
        strokeDasharray={2 * Math.PI * 78}
        strokeDashoffset={0}
        strokeLinecap="round"
      ></circle>
    </svg>

    <div
      className="absolute z-20 symbol-anim"
      style={{
        color: enabled ? "rgb(16,185,129)" : "rgb(113,113,122)",
        fontFamily:"Verdana",
        fontSize:"92px",
        fontWeight:"bold",
        textShadow:"0 0 22px rgba(16,185,129,0.55)"
      }}
    >
      {enabled ? "✓" : "✕"}
    </div>

  </div>
</div>


              <div className="flex-grow"></div>

              <div
                className="mt-6 p-3 rounded-lg text-center"
                style={{
                  background:"rgba(11,11,18,0.95)",
                  border: enabled
                    ? "1px solid rgba(16,185,129,0.5)"
                    : "1px solid rgba(113,113,122,0.5)",
                  fontFamily:"Verdana"
                }}
              >
                <p className="text-[12px] font-medium" style={{ color:"rgb(156,156,156)" }}>
                  Status: {enabled ? "Active" : "Inactive"}
                </p>
                <p className="text-[11px] mt-2" style={{ color:"rgb(109,109,109)" }}>
                  {enabled
                    ? "Bot WILL trade on your behalf."
                    : "Bot will NOT trade on your behalf."}
                </p>
              </div>

            </div>
          </GTCard>
          {/* -------------------------
             CARD 2 — FIXED CASH AMOUNT
          -------------------------- */}
          <GTCard className="flex flex-col min-h-[520px]">

            <h2 className="text-xs font-medium uppercase mb-1" style={{ color:"rgb(156,156,156)" }}>
              Allocation Value
            </h2>

            <p className="text-[13px] mb-4" style={{ color:"rgb(109,109,109)" }}>
              Set the fixed cash amount to allocate per trade.
            </p>

            <div className="w-full h-px bg-slate-800 mb-4"></div>

            <div className="flex flex-col flex-grow justify-between">

              {/* BUYING POWER */}
              <div className="mb-4 text-center" style={{ fontFamily:"Verdana" }}>
                <p className="text-[13px] font-medium" style={{ color:"rgb(156,156,156)" }}>
                  {liveLoading ? "Available…" : `Available: $${buyingPower.toLocaleString()}`}
                </p>
              </div>

              {/* RISK LEVEL */}
              <div className="flex flex-col items-center mb-6" style={{ fontFamily:"Verdana" }}>

                {(() => {
                  const pct = allocationValue / (buyingPower || 1)

                  const riskLabel =
                    pct < LOW
                      ? "Low Risk"
                      : pct < MODERATE
                      ? "Moderate Risk"
                      : "High Risk"

                  const riskColor =
                    pct < LOW
                      ? "rgb(34,197,94)"
                      : pct < MODERATE
                      ? "rgb(234,179,8)"
                      : "rgb(239,68,68)"

                  return (
                    <div
                      key={`risk-${riskLabel}`}
                      className="symbol-anim"
                      style={{
                        color: riskColor,
                        fontSize:"22px",
                        fontWeight:"600"
                      }}
                    >
                      {riskLabel}
                    </div>
                  )
                })()}

                <div
                  className="mb-1"
                  style={{
                    height: "19px",
                    background: "black"
                  }}
                ></div>

              </div>

              {/* VALUE DISPLAY */}
              <div className="flex flex-col items-center mb-6">

<div
  style={{
    color:"rgb(41,137,247)",
    fontFamily:"Verdana",
    fontSize:"42px",
    fontWeight:"700",
    textShadow:"0 0 18px rgba(41,137,247,0.45)"
  }}
>
  {liveLoading ? "…" : `$${allocationValue.toLocaleString()}`}
</div>


                <div
                  className="mt-2 px-3 py-1 rounded-full text-[12px] shadow-[0_0_8px_rgba(41,137,247,0.35)]"
                  style={{
                    background:"rgba(41,137,247,0.12)",
                    border:"1px solid rgba(41,137,247,0.35)",
                    color:"rgb(180,200,255)",
                    fontFamily:"Verdana",
                    fontWeight:"500",
                    letterSpacing:"0.5px"
                  }}
                >
                  {buyingPower > 0 && !liveLoading
                    ? `${Math.round((allocationValue / buyingPower) * 100)}% of buying power`
                    : "Loading…"}
                </div>

              </div>

              {/* GTSlider — THE NEW SLIDER */}
              <div className="rounded-lg border border-emerald-400/40 bg-black/20 p-3 shadow-[0_0_5px_rgba(16,185,129,0.35)]">
                <GTSlider
                  title="Allocation Per Trade"
                  value={allocationValue}
                  min={100}
                  max={Math.max(100, buyingPower)}
                  step={100}
                  onChange={setAllocationValue}
                  dollars
                />
              </div>

              {/* FOOTER */}
              <div
                className="mt-8 p-3 rounded-lg text-center"
                style={{
                  background:"rgba(11,11,18,0.95)",
                  border:"1px solid rgba(3,82,65,0.5)"
                }}
              >
                <p className="text-[12px] font-medium" style={{ color:"rgb(156,156,156)" }}>
                  Recommended: No more than 80% of buying power
                </p>

                <p className="text-[11px] mt-1" style={{ color:"rgb(109,109,109)" }}>
                  Keeping a buffer helps protect against volatility
                </p>
              </div>

            </div>
          </GTCard>
        </section>
      </form>

      {hasUnsavedChanges && (
        <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 border-t border-white/10 py-4 px-6 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.4)] animate-slideUp">

          <span className="text-white/70 text-sm font-medium">You have unsaved changes</span>

          <div className="flex items-center gap-3">

            <div className="rounded-md p-[2px] bg-gradient-to-br from-emerald-500/40 via-teal-400/40 to-emerald-600/40 shadow-lg">
              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="rounded-md bg-[#0b0b12] px-5 py-2 text-[13px] font-medium text-emerald-300 hover:bg-[#14141f] disabled:opacity-60 transition"
              >
                {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
              </button>
            </div>

          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes glowPulse {
          0% { opacity: 0.25; transform: scale(0.96); }
          50% { opacity: 0.45; transform: scale(1); }
          100% { opacity: 0.25; transform: scale(0.96); }
        }
        .glow-pulse {
          animation: glowPulse 2.4s ease-in-out infinite;
        }

        @keyframes symbolFade {
          0% { opacity: 0; transform: scale(0.6); }
          60% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        .symbol-anim {
          animation: symbolFade 2.2s cubic-bezier(0.22, 1, 0.36, 1);
        }

        @keyframes donutFade {
          0% { opacity: 0; transform: scale(0.85); }
          60% { opacity: 1; transform: scale(1.03); }
          100% { opacity: 1; transform: scale(1); }
        }
        .donutFade {
          animation: donutFade 2.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
      `}</style>

    </>
  )
}
