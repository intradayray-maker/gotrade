"use client"

import { useEffect, useState } from "react"

type RecentTrade = {
id: string
symbol: string
side: "buy" | "sell"
qty: number
price: number
created_at: string
}

export default function RecentTradesTable() {

const [trades, setTrades] = useState<RecentTrade[] | null>(null)
const [loading, setLoading] = useState(true)

const CELL_BG = "rgba(47, 56, 113, 0.12)"   // ← change this once to recolor all cells

useEffect(() => {

const load = async () => {

try {

const res = await fetch("/api/trades/list?limit=50", { cache: "no-store" })
const json = await res.json()
const allTrades = json.data ?? []

allTrades.sort(
(a: RecentTrade, b: RecentTrade) =>
new Date(b.created_at).getTime() -
new Date(a.created_at).getTime()
)

setTrades(allTrades.slice(0, 4))

} catch (error) {

console.error("Recent trades fetch error:", error)
setTrades([])

} finally {

setLoading(false)

}

}

load()

}, [])

if (loading) {

return (

<div className="space-y-3">
<div className="h-10 rounded-md animate-pulse" style={{ background: CELL_BG }}></div>
<div className="h-10 rounded-md animate-pulse" style={{ background: CELL_BG }}></div>
<div className="h-10 rounded-md animate-pulse" style={{ background: CELL_BG }}></div>
</div>

)

}

if (!trades || trades.length === 0) {

return (

<div className="text-neutral-400 text-sm py-4 text-center">
No recent trades
</div>

)

}

return (

<div className="space-y-3">

{trades.map(t => (

<div
key={t.id}
className="flex items-center justify-between rounded-lg px-4 py-4"
style={{ background: CELL_BG }}
>

<div className="flex flex-col">
<span className="text-white font-medium">
{t.symbol}
</span>
<span className="text-neutral-400 text-xs">
{new Date(t.created_at).toLocaleString()}
</span>
</div>

<div className="flex items-center gap-6">

<span
className={`text-sm font-semibold ${
t.side === "buy" ? "text-green-400" : "text-red-400"
}`}
>
{t.side.toUpperCase()}
</span>

<span className="text-neutral-300 text-sm">
{t.qty} @ ${t.price.toFixed(2)}
</span>

</div>

</div>

))}

</div>

)

}
