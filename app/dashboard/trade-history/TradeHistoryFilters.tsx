"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export type Preset = "7D" | "30D" | "YTD" | "custom"
export type SideFilter = "all" | "buy" | "sell"

export type TradeFiltersState = {
preset: Preset
customStart: string | null
customEnd: string | null
symbol: string
side: SideFilter
}

type Props = {
value: TradeFiltersState
onChange: (value: TradeFiltersState) => void
onReset: () => void
}

export default function TradeHistoryFilters({ value, onChange, onReset }: Props) {

const [local, setLocal] = useState<TradeFiltersState>(value)

useEffect(() => {
onChange(local)
}, [local])

function update<K extends keyof TradeFiltersState>(key: K, val: TradeFiltersState[K]) {
setLocal(prev => ({ ...prev, [key]: val }))
}

function handlePresetClick(preset: Preset) {
setLocal(prev => ({
...prev,
preset,
customStart: preset === "custom" ? prev.customStart : null,
customEnd: preset === "custom" ? prev.customEnd : null,
}))
}

function handleReset() {
const reset = {
preset: "7D",
customStart: null,
customEnd: null,
symbol: "",
side: "all",
} as const

setLocal(reset)
onReset()
}

return (

<div
className="
relative
rounded-xl
p-[2px]
bg-gradient-to-br
from-emerald-300/60
to-emerald-700/60
shadow-[0_0_34px_rgba(3,82,65,0.45)]
mx-auto
max-w-5xl
"
>

<div
className="
rounded-xl
bg-[#0c0c0e]/99
backdrop-blur-xl
px-6
py-6
"
>

<div
className="
flex
flex-col
gap-6
md:flex-row
md:items-end
md:justify-between
"
>

{/* -------------------------
   LEFT — DATE RANGE
-------------------------- */}
<div
className="
flex
flex-col
gap-3
"
>

<span
className="
text-[11px]
uppercase
tracking-wide
text-white/50
"
>
Date Range
</span>

<div
className="
flex
items-center
gap-2
rounded-md
border
border-white/15
bg-[#111]
px-2
py-2
"
>

{(["7D", "30D", "YTD", "custom"] as Preset[]).map((preset) => (

<button
key={preset}
type="button"
onClick={() => handlePresetClick(preset)}
className={cn(
"px-3 py-1.5 text-xs rounded-md transition-all",
local.preset === preset
? "bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.4)]"
: "text-white/70 hover:bg-white/10"
)}
>
{preset === "custom" ? "Custom" : preset}
</button>

))}

</div>

{local.preset === "custom" && (

<div
className="
flex
flex-wrap
gap-4
pt-2
"
>

{/* START DATE */}
<div
className="
flex
flex-col
gap-2
"
>

<span
className="
text-[11px]
uppercase
tracking-wide
text-white/50
"
>
Start
</span>

<input
type="date"
value={local.customStart ?? ""}
onChange={(e) => update("customStart", e.target.value || null)}
className="
rounded-md
border
border-white/15
bg-[#111]
px-3
py-2
text-sm
text-white
w-40
focus:outline-none
focus:ring-2
focus:ring-white/20
[color-scheme:dark]
"
/>

</div>

{/* END DATE */}
<div
className="
flex
flex-col
gap-2
"
>

<span
className="
text-[11px]
uppercase
tracking-wide
text-white/50
"
>
End
</span>

<input
type="date"
value={local.customEnd ?? ""}
onChange={(e) => update("customEnd", e.target.value || null)}
className="
rounded-md
border
border-white/15
bg-[#111]
px-3
py-2
text-sm
text-white
w-40
focus:outline-none
focus:ring-2
focus:ring-white/20
[color-scheme:dark]
"
/>

</div>

</div>

)}

</div>

{/* -------------------------
   RIGHT — SYMBOL / SIDE / RESET
-------------------------- */}
<div
className="
flex
flex-wrap
items-end
gap-6
"
>

{/* SYMBOL */}
<div
className="
flex
flex-col
gap-2
"
>

<span
className="
text-[11px]
uppercase
tracking-wide
text-white/50
"
>
Symbol
</span>

<div
className="
relative
"
>

<select
value={local.symbol}
onChange={(e) => update("symbol", e.target.value)}
className="
rounded-md
border
border-white/15
bg-[#111]
text-white
px-3
py-2
text-sm
w-40
pr-8
focus:outline-none
focus:ring-2
focus:ring-white/20
appearance-none
"
>

<option value="">All Symbols</option>

<option value="TSLA">TSLA</option>
<option value="TSLL">TSLL (TSLA Long)</option>
<option value="TSLQ">TSLQ (TSLA Short)</option>

<option value="NVDA">NVDA</option>
<option value="NVDL">NVDL (NVDA Long)</option>
<option value="NVDS">NVDS (NVDA Short)</option>

</select>

<div
className="
pointer-events-none
absolute
right-3
top-1/2
-translate-y-1/2
text-white/50
"
>
▼
</div>

</div>

</div>

{/* SIDE */}
<div
className="
flex
flex-col
gap-2
"
>

<span
className="
text-[11px]
uppercase
tracking-wide
text-white/50
"
>
Side
</span>

<div
className="
relative
"
>

<select
value={local.side}
onChange={(e) => update("side", e.target.value as any)}
className="
rounded-md
border
border-white/15
bg-[#111]
text-white
px-3
py-2
text-sm
w-32
pr-8
focus:outline-none
focus:ring-2
focus:ring-white/20
appearance-none
"
>

<option value="all">All</option>
<option value="buy">Buy</option>
<option value="sell">Sell</option>

</select>

<div
className="
pointer-events-none
absolute
right-3
top-1/2
-translate-y-1/2
text-white/50
"
>
▼
</div>

</div>

</div>

{/* RESET BUTTON */}
<button
  type="button"
  onClick={handleReset}
  className="
    bg-[rgb(84,33,33)]
    text-[rgb(225,254,234)]
    border-[5px] border-[rgb(84,33,33)]
    rounded-[6px]
    px-[14px] py-[4px]
    shadow-[0_0_34px_rgba(84,33,33,0.55)]
    text-sm font-semibold
    transition-all duration-150
    hover:bg-[rgb(90,33,33)]
    hover:shadow-[0_0_44px_rgba(84,33,33,0.75)]
    hover:-translate-y-[1px]
    active:translate-y-[0px]
  "
  title="Reset Filters"
>
  Reset
</button>



</div>

</div>

</div>

</div>

)

}
