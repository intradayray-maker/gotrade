'use client'

import { useLivePnl } from "@/hooks/useLivePnl"
import EquityCurveChart from '@/components/dashboard/EquityCurveChart'
import PerformanceMetrics from '@/app/components/dashboard/PerformanceMetrics'
import RecentTradesTable from '@/app/components/dashboard/RecentTradesTable'
import PercentCalculator from '@/app/components/dashboard/PercentCalculator'
import { GoalPlanner } from "@/components/dashboard/GoalPlanner"
import { CalculatorCard } from "@/components/dashboard/CalculatorCard"
import { GlassCard } from "@/components/ui/GlassCard"
import { useLivePositions } from "@/hooks/useLivePositions"
import { useEquityHistory } from "@/hooks/useEquityHistory"
import { useGoals } from "@/hooks/useGoals"
import { useBrokerPerformance } from "@/hooks/useBrokerPerformance"
import MarketTimeCard from '@/components/dashboard/MarketTimeCard'

import {
Chart as ChartJS,
CategoryScale,
LinearScale,
PointElement,
LineElement,
Tooltip,
Legend,
Filler,
} from 'chart.js'

ChartJS.register(
CategoryScale,
LinearScale,
PointElement,
LineElement,
Tooltip,
Legend,
Filler
)

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function formatCompactCurrency(value: number) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`
  return `$${Math.floor(value)}`
}


const gtButtonBase =
"px-4 py-2 rounded-lg font-semibold tracking-wide transition-all duration-200 shadow-[0_0_15px_rgba(0,0,0,0.4)] border-2"

export const GTButtonGreen =
gtButtonBase +
" bg-[rgb(3,82,65)] text-[rgb(225,254,234)] border-[rgb(3,82,65)] hover:brightness-110 hover:-translate-y-[1px]"

export const GTButtonRed =
gtButtonBase +
" bg-[rgb(84,33,33)] text-[rgb(225,254,234)] border-[rgb(84,33,33)] hover:brightness-110 hover:-translate-y-[1px]"

export const GTButtonGold =
gtButtonBase +
" bg-[rgb(113,97,20)] text-[rgb(225,254,234)] border-[rgb(113,97,20)] hover:brightness-110 hover:-translate-y-[1px]"

export default function DashboardPage() {

const live = useLivePnl()
const livePositions = useLivePositions()
const positionList = livePositions?.data?.positions ?? []
const { history } = useEquityHistory("1Y", "1D", "SPY")
const { goals } = useGoals()

const totalUnrealizedPnl = positionList.reduce(
(sum, pos) => sum + (pos.unrealizedPnl ?? 0),
0
)

const {
expectedMonthlyReturnPct: brokerExpectedReturnPct,
loading: expectedReturnLoading,
} = useBrokerPerformance()

const effectiveMonthlyReturnPct =
expectedReturnLoading ? 0 : brokerExpectedReturnPct || 0

const currentBalance = history.length
? history[history.length - 1].equity
: 0

return (

<div className="min-h-screen bg-[#050509] text-slate-100">

<main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6">

<header
  className="
  animate-fadeIn
  [animation-duration:0.6s]
  "
>

  {/* BREADCRUMB (Dashboard only — no link needed) */}
  <div
    className="
    flex
    items-center
    gap-2
    text-[13px]
    text-white/40
    mb-3
    "
  >
    <span className="text-white/60">Dashboard</span>
  </div>

  {/* TF ICON + TITLE */}
  <div className="flex items-center gap-3">

    {/* TF ICON */}
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


    <h1
      className="
      text-3xl
      font-bold
      tracking-tight
      text-white/90
      drop-shadow-[0_0_10px_rgba(0,255,180,0.25)]
      "
    >
      Dashboard
    </h1>

  </div>

  {/* SUBHEADING */}
  <p
    className="
    text-white/50
    text-sm
    mt-2
    tracking-wide
    max-w-md
    "
  >
    Your trading overview and system insights.
  </p>

  {/* FLOATING EMERALD UNDERLINE */}
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


<section className="grid gap-4 md:grid-cols-4">

{/* LIVE PNL */}
<div className="relative rounded-xl p-[2px] bg-gradient-to-br from-emerald-500/40 via-teal-400/40 to-emerald-600/40 shadow-[0_0_25px_rgba(0,0,0,0.5)]">
<div className="rounded-xl bg-[#0b0b12] p-4 h-full flex flex-col gap-4">

<div className="w-full rounded-lg bg-[#0f0f17] border border-slate-800/40 p-3 text-center">
<h3 className="text-xs bold text-slate-400 tracking-wide"> TOTAL LIVE P&L </h3></div>

<div className="w-full rounded-lg bg-[#0f0f17] border border-slate-800/40 p-5 text-center">
<p className={`text-3xl font-semibold ${totalUnrealizedPnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
{formatCurrency(totalUnrealizedPnl)} </p></div>

<div className="w-full rounded-lg bg-[#0f0f17] border border-slate-800/40 p-3 text-center">
<p className={`text-sm ${live.data?.dayPnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
{live.data?.dayPnl >= 0 ? "+" : ""}
{formatCurrency(live.data?.dayPnl ?? 0)} today
</p>
</div>

</div>
</div>

{/* OPEN POSITIONS */}
<div className="relative rounded-xl p-[2px] bg-gradient-to-br from-emerald-500/40 via-teal-400/40 to-emerald-600/40 shadow-[0_0_25px_rgba(0,0,0,0.5)]">
<div className="rounded-xl bg-[#0b0b12] p-4 h-full">
<div className="flex flex-col h-full text-center">

<div className="grid grid-cols-1 gap-4 w-full">

<div className="py-2 px-3 rounded-md bg-[#0f0f17] border border-slate-800/40">
<h3 className="text-xs bold text-slate-400 tracking-wide">
CURRENT POSITIONS
</h3>
</div>

{positionList.map((pos, i) => {
const pnl = pos.unrealizedPnl ?? 0
const color = pnl >= 0 ? "text-emerald-400" : "text-rose-400"

return (
<div
key={i}
className="grid grid-cols-3 text-sm py-2 px-3 rounded-md bg-[#0f0f17] border border-slate-800/40"
>
<span className="text-slate-300 text-left">
{pos.symbol}
</span>
<span className="text-slate-300 text-center">
x{pos.qty}
</span>
<span className={`${color} text-right`}>
{formatCurrency(pnl)}
</span>
</div>
)
})}

</div>

</div>
</div>
</div>

{/* BUYING POWER */}
<div className="relative rounded-xl p-[2px] bg-gradient-to-br from-emerald-500/40 via-teal-400/40 to-emerald-600/40 shadow-[0_0_25px_rgba(0,0,0,0.5)]">
<div className="rounded-xl bg-[#0b0b12] p-4 h-full flex flex-col gap-4">

<div className="w-full rounded-lg bg-[#0f0f17] border border-slate-800/40 p-3 text-center">
<h3 className="text-xs bold text-slate-400 tracking-wide">
BUYING POWER
</h3>
</div>

<div className="w-full rounded-lg bg-[#0f0f17] border border-slate-800/40 p-4 text-center">
<p className="text-4xl font-semibold text-white">
{formatCompactCurrency(live.data?.buyingPower ?? 0)}
</p>
</div>

<div className="w-full rounded-lg bg-[#0f0f17] border border-slate-800/40 p-3 text-center">
<p className="text-sm text-slate-500">
Equity: {formatCompactCurrency(live.data?.equity ?? 0)}
</p>
</div>

</div>
</div>

{/* MARKET TIME */}
<div className="relative rounded-xl p-[2px] bg-gradient-to-br from-emerald-500/40 via-teal-400/40 to-emerald-600/40 shadow-[0_0_25px_rgba(0,0,0,0.5)]">
<div className="rounded-xl bg-[#0b0b12] p-4 h-full flex flex-col">
<div>
<MarketTimeCard />
</div>
</div>
</div>

</section>

{/* PERFORMANCE METRICS + RECENT TRADES */}
<section className="grid gap-4 md:grid-cols-2">

<div className="relative rounded-xl p-[2px] bg-gradient-to-br from-emerald-500/40 via-teal-400/40 to-emerald-600/40 shadow-[0_0_25px_rgba(0,0,0,0.5)]">
<div className="rounded-xl bg-[#0b0b12] p-4 h-full flex flex-col gap-4">

<div className="w-full rounded-lg bg-[#0f0f17] border border-slate-800/40 p-3 flex items-center justify-between">
<h2 className="text-sm font-medium text-slate-200">
Performance Metrics
</h2>
<span className="text-xs text-slate-500">
Real-time
</span>
</div>

<div className="w-full rounded-lg bg-[#0f0f17] border border-slate-800/40 p-4 flex-grow">
<PerformanceMetrics />
</div>

</div>
</div>

<div className="relative rounded-xl p-[2px] bg-gradient-to-br from-emerald-500/40 via-teal-400/40 to-emerald-600/40 shadow-[0_0_25px_rgba(0,0,0,0.5)]">
<div className="rounded-xl bg-[#0b0b12] p-4 h-full flex flex-col gap-4">

<div className="w-full rounded-lg bg-[#0f0f17] border border-slate-800/40 p-3 flex items-center justify-between">
<h2 className="text-sm font-medium text-slate-200">
Recent Trades
</h2>
<span className="text-xs text-slate-500">
Last 4 trades
</span>
</div>

<div className="w-full rounded-lg bg-[#0f0f17] border border-slate-800/40 p-4 flex-grow">
<RecentTradesTable />
</div>

</div>
</div>

</section>

{/* GOAL CENTER */}
<section className="grid gap-4 md:grid-cols-3">

<div className="relative rounded-xl p-[2px] bg-gradient-to-br from-emerald-500/40 via-teal-400/40 to-emerald-600/40 shadow-[0_0_25px_rgba(0,0,0,0.5)]">
<div className="rounded-xl bg-[#0b0b12] p-4 h-full flex flex-col">

<div className="space-y-2 p-1 pt-3 pb-3">
<p className="text-[16px] font-medium uppercase tracking-[0.18em] text-slate-400 text-center">
Income Goal Planner
</p>
<div className="w-full h-px bg-slate-700/40"></div>
</div>

<div className="flex-grow">
<GoalPlanner
currentBalance={currentBalance}
monthlyIncomeGoal={goals?.monthlyIncomeGoal ?? 0}
annualIncomeGoal={goals?.annualIncomeGoal ?? 0}
expectedMonthlyReturnPct={effectiveMonthlyReturnPct}
/>
</div></div></div>

<div className="relative rounded-xl p-[2px] bg-gradient-to-br from-emerald-500/40 via-teal-400/40 to-emerald-600/40 shadow-[0_0_25px_rgba(0,0,0,0.5)]">
<div className="rounded-xl bg-[#0b0b12] p-4 h-full flex flex-col">

<div className="space-y-2 p-1 pt-3 pb-3">
<p className="text-[16px] font-medium uppercase tracking-[0.18em] text-slate-400 text-center">
Percent Calculator
</p>
<div className="w-full h-px bg-slate-700/40"></div>
</div>

<div className="flex-grow">
<PercentCalculator />
</div>

</div>
</div>

<div className="relative rounded-xl p-[2px] bg-gradient-to-br from-emerald-500/40 via-teal-400/40 to-emerald-600/40 shadow-[0_0_25px_rgba(0,0,0,0.5)]">
<div className="rounded-xl bg-[#0b0b12] p-4 h-full flex flex-col">

<div className="space-y-2 p-1 pt-3 pb-3">
<p className="text-[16px] font-medium uppercase tracking-[0.18em] text-slate-400 text-center">
Basic Calculator
</p>
<div className="w-full h-px bg-slate-700/40"></div>
</div>

<div className="flex-grow">
<CalculatorCard />
</div>

</div>
</div>

</section>

{/* EQUITY CURVE */}
{/* <section className="grid gap-4 md:grid-cols-4">

<div className="md:col-span-4 min-w-0">

<div className="relative rounded-xl p-[2px] bg-gradient-to-br from-emerald-500/40 via-teal-400/40 to-emerald-600/40 shadow-[0_0_25px_rgba(0,0,0,0.5)]">
<div className="rounded-xl bg-[#0b0b12] p-4 h-full flex flex-col">

<div>
<EquityCurveChart equityHistory={history} />
</div>

</div>
</div>

</div>

</section> */}
</main>

</div>

)

}

