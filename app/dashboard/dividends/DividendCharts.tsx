// ================================================
// FILE: app/dashboard/dividends/DividendCharts.tsx
// ================================================

"use client"

export default function DividendCharts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">

      {/* ============================
          DONUT CHART PLACEHOLDER
      ============================ */}
      <div
        className="
          flex flex-col items-center justify-center
          border border-neutral-800 rounded-xl p-6
          bg-neutral-900/40
        "
      >
        <span className="text-neutral-400 text-sm mb-3">
          Dividend Safety Breakdown
        </span>

        <div
          className="
            w-40 h-40 rounded-full
            border-8 border-neutral-800
            border-t-blue-400
            animate-spin
          "
        />

        <span className="text-neutral-500 text-xs mt-4">
          (Donut chart placeholder)
        </span>
      </div>

      {/* ============================
          BAR CHART PLACEHOLDER
      ============================ */}
      <div
        className="
          flex flex-col items-center justify-center
          border border-neutral-800 rounded-xl p-6
          bg-neutral-900/40
        "
      >
        <span className="text-neutral-400 text-sm mb-3">
          12‑Month Income Projection
        </span>

        <div className="flex items-end gap-2 h-40">

          <div className="w-4 bg-blue-500/40 rounded-sm h-10" />
          <div className="w-4 bg-blue-500/50 rounded-sm h-16" />
          <div className="w-4 bg-blue-500/60 rounded-sm h-24" />
          <div className="w-4 bg-blue-500/70 rounded-sm h-32" />
          <div className="w-4 bg-blue-500/80 rounded-sm h-20" />
          <div className="w-4 bg-blue-500/60 rounded-sm h-28" />
          <div className="w-4 bg-blue-500/50 rounded-sm h-14" />

        </div>

        <span className="text-neutral-500 text-xs mt-4">
          (Bar chart placeholder)
        </span>
      </div>

    </div>
  )
}
