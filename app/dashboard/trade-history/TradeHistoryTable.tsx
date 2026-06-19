"use client"

import GTHeaderCell from "@/app/components/GTHeaderCell"
import { GTTheme } from "@/app/theme/GTTheme"

function formatGTDate(dateString: string) {
  const d = new Date(dateString)

  const weekday = d.toLocaleDateString("en-US", { weekday: "short" })
  const month = d.toLocaleDateString("en-US", { month: "long" })
  const day = d.getDate()
  const year = d.getFullYear()

  let hours = d.getHours()
  const minutes = d.getMinutes().toString().padStart(2, "0")
  const ampm = hours >= 12 ? "pm" : "am"

  hours = hours % 12
  hours = hours === 0 ? 12 : hours

  return `${weekday}, ${month} ${day}, ${year} ~ ${hours}:${minutes} ${ampm}`
}

export type Trade = {
id: string
symbol: string
side: "buy" | "sell"
qty: number
price: number
created_at: string
}

export default function TradeHistoryTable({ trades }: { trades: Trade[] }) {

return (

<div
className={`
relative
rounded-xl
p-[2px]
${GTTheme.table.frameGradient}
${GTTheme.table.shadow}
overflow-hidden
`}
>

<div
className={`
rounded-xl
${GTTheme.table.innerBg}
backdrop-blur-xl
`}
>

<div className="overflow-x-auto px-6 py-6">

<table className="w-full text-sm">

<thead>

<tr className="border-b border-white/10">

<GTHeaderCell first>
Date
</GTHeaderCell>

<GTHeaderCell>
Symbol
</GTHeaderCell>

<GTHeaderCell>
Type
</GTHeaderCell>

<GTHeaderCell>
Amount
</GTHeaderCell>

<GTHeaderCell last>
Status
</GTHeaderCell>

</tr>

</thead>

<tbody>

{trades.map(trade => (

<tr
key={trade.id}
className={`
transition-all
${GTTheme.table.rowHover}
`}
>

<td className={`${GTTheme.table.rowPadding} ${GTTheme.table.rowText}`}>
{formatGTDate(trade.created_at)}
</td>

<td className={`${GTTheme.table.rowPadding} ${GTTheme.table.rowText} font-semibold tracking-wide`}>
{trade.symbol}
</td>

<td
className={`
${GTTheme.table.rowPadding}
uppercase font-semibold
${
trade.side === "buy"
? GTTheme.table.buyColor
: GTTheme.table.sellColor
}
`}
>
{trade.side}
</td>

<td className={`${GTTheme.table.rowPadding} ${GTTheme.table.rowText}`}>
{trade.qty} @ ${trade.price.toFixed(2)}
</td>

<td
className={`
${GTTheme.table.rowPadding}
${GTTheme.table.statusColor}
font-semibold
flex items-center gap-2
`}
>
<span className="text-[rgb(113,97,20)] drop-shadow-[0_0_6px_rgba(113,97,20,0.6)]">
✔
</span>
Filled
</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

</div>

)

}

