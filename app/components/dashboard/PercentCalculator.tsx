"use client";

import { useState, useRef } from "react";

export default function PercentCalculator() {

const [v1, setV1] = useState("");
const [v2, setV2] = useState("");
const [v3, setV3] = useState("");
const [v4, setV4] = useState("");
const [v5, setV5] = useState("");
const [v6, setV6] = useState("");

const baseButton = `
w-full
px-4 py-4
rounded-md
text-sm font-semibold
transition-all duration-150
border
`;

const gtGreenButton = `
${baseButton}
text-[rgb(225,254,234)]
bg-[rgb(3,82,65)]
border-[5px] border-transparent
rounded-[6px]
shadow-[0_0_34px_rgba(3,82,65,0.55)]
relative overflow-hidden
before:absolute before:inset-0 before:p-[2px]
before:rounded-[6px]
before:bg-gradient-to-br before:from-emerald-300 before:to-emerald-700
before:-z-10
`;

const gtRedButton = `
${baseButton}
text-[rgb(225,254,234)]
bg-[rgb(84,33,33)]
border-[5px] border-transparent
rounded-[6px]
shadow-[0_0_34px_rgba(84,33,33,0.55)]
relative overflow-hidden
before:absolute before:inset-0 before:p-[2px]
before:rounded-[6px]
before:bg-gradient-to-br before:from-red-300 before:to-red-800
before:-z-10
`;

const [r1, setR1] = useState<string | null>(null);
const [r2, setR2] = useState<string | null>(null);
const [r3, setR3] = useState<string | null>(null);

const [hasResult1, setHasResult1] = useState(false);
const [hasResult2, setHasResult2] = useState(false);
const [hasResult3, setHasResult3] = useState(false);

const [history, setHistory] = useState<{ text: string; pinned?: boolean }[]>([]);
const [drawerOpen, setDrawerOpen] = useState(true);
const [lastAddedIndex, setLastAddedIndex] = useState<number | null>(null);

const swipeStartX = useRef<number | null>(null);
const swipeIndex = useRef<number | null>(null);

const fadeInClass = "animate-[fadeIn_0.35s_ease-out_forwards] opacity-0";

const baseInput = "w-full bg-black/40 rounded-md px-4 py-4 text-sm appearance-none focus:outline-none text-right placeholder:text-right italic transition-all duration-150";
const inactiveInput = "text-slate-600 border border-neutral-800";
const activeInput = "text-emerald-300 border border-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.28)] font-semibold";

const formatNumber = (value: string) => {
if (!value) return value;
if (value === "-" || value === "." || value === "-.") return value;
const hasTrailingDot = value.endsWith(".");
const [rawInt, rawDec] = value.split(".");
let intPart = rawInt.replace(/,/g, "");
let sign = "";
if (intPart.startsWith("-")) {
sign = "-";
intPart = intPart.slice(1);
if (intPart === "") return value;
}
if (isNaN(Number(intPart))) return value;
const formattedInt = Number(intPart).toLocaleString("en-US");
if (rawDec !== undefined) return `${sign}${formattedInt}.${rawDec}`;
if (hasTrailingDot) return `${sign}${formattedInt}.`;
return `${sign}${formattedInt}`;
};

const formatMoney = (value: string) => {
const formatted = formatNumber(value);
if (!formatted || formatted === "-" || formatted === "." || formatted === "-.") return formatted;
return `$${formatted}`;
};

const pushHistory = (text: string) => {
setHistory(prev => {
const updated = [{ text, pinned: false }, ...prev].slice(0, 20);
setLastAddedIndex(0);
return updated;
});
};

const togglePin = (index: number) => {
setHistory(prev => {
const updated = [...prev];
updated[index].pinned = !updated[index].pinned;
return updated;
});
};

const renderWeekYear = (value: number | null) => {
if (!value) return null;
const weekly = `$${Math.round(value * 52).toLocaleString("en-US")}`;
const yearly = `$${Math.round(value * 12).toLocaleString("en-US")}`;
return (
<div className="mt-1 italic text-slate-500 text-sm flex items-center gap-4 animate-[fadeIn_0.35s_ease-out_forwards] opacity-0">
<span>x52 = {weekly}</span>
<span className="text-slate-700">|</span>
<span>x12 = {yearly}</span>
</div>
);
};

const calc1 = () => {
if (!v1 || !v2) return;
const r = (Number(v1) / 100) * Number(v2);
const rounded = Math.round(r);
const result = `$${rounded.toLocaleString("en-US")}`;
const text = `${v1}% of ${formatMoney(v2)} = ${result}`;
setR1(text);
setHasResult1(true);
pushHistory(text);
};

const calc2 = () => {
if (!v3 || !v4) return;
const r = (Number(v3) / Number(v4)) * 100;
const rounded = Math.round(r);
const result = `${rounded.toLocaleString("en-US")}%`;
const text = `${formatNumber(v3)} of ${formatMoney(v4)} = ${result}`;
setR2(text);
setHasResult2(true);
pushHistory(text);
};

const calc3 = () => {
if (!v5 || !v6) return;
const r = ((Number(v6) - Number(v5)) / Number(v5)) * 100;
const rounded = Math.round(r);
const result = `${rounded.toLocaleString("en-US")}%`;
const text = `${formatMoney(v5)} to ${formatMoney(v6)} = ${result}`;
setR3(text);
setHasResult3(true);
pushHistory(text);
};

const autoCalc1 = (val: string, other: string) => val && other && calc1();
const autoCalc2 = (val: string, other: string) => val && other && calc2();
const autoCalc3 = (val: string, other: string) => val && other && calc3();

const handleSwipeStart = (e: any, index: number) => {
swipeStartX.current = e.touches ? e.touches[0].clientX : e.clientX;
swipeIndex.current = index;
};

const handleSwipeEnd = (e: any) => {
if (swipeStartX.current === null || swipeIndex.current === null) return;
const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
if (swipeStartX.current - endX > 60) {
setHistory(prev => prev.filter((_, i) => i !== swipeIndex.current));
}
swipeStartX.current = null;
swipeIndex.current = null;
};

const renderResult = (str: string | null) => {
if (!str) return null;
const [prefix, value] = str.split("=");
const numeric = Number(value.replace(/[^0-9.-]/g, ""));
return (
<>
<div className="mt-4 flex items-center gap-2 animate-[fadeIn_0.35s_ease-out_forwards] opacity-0">
<span className="italic text-slate-500 text-sm whitespace-nowrap">
{prefix.trim()} =
</span>
<span className="text-emerald-300 text-2xl font-semibold whitespace-nowrap">
{value.trim()}
</span>
</div>
{renderWeekYear(numeric)}
</>
);
};

const Check = ({ show }: { show: boolean }) => {
return (
<span className={`text-green-400 text-lg font-bold transition-all duration-200 ${show ? "opacity-100 scale-100 drop-shadow-[0_0_6px_rgba(34,197,94,0.35)]" : "opacity-0 scale-75"}`}>
✔
</span>
);
};

return (

<div className="pt-1 pb-10 space-y-4">

{/* -------------------------
     1: What is X% of Y
-------------------------- */}
<div className="space-y-6">

<div className="flex items-center justify-between">
<div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
📊 <span className="italic">What is X% of Y</span>
</div>
<Check show={v1 && v2 ? true : false} />
</div>

<div className="grid grid-cols-2 gap-4">
<input
type="text"
placeholder="10% of"
value={formatNumber(v1)}
onChange={(e) => {
const val = e.target.value.replace(/,/g, "");
setV1(val);
autoCalc1(val, v2);
}}
onKeyDown={(e) => e.key === "Enter" && calc1()}
className={`${baseInput} ${v1 ? activeInput : inactiveInput}`}
/>
<input
type="text"
placeholder="$100"
value={formatMoney(v2)}
onChange={(e) => {
const val = e.target.value.replace(/[^0-9.-]/g, "");
setV2(val);
autoCalc1(v1, val);
}}
onKeyDown={(e) => e.key === "Enter" && calc1()}
className={`${baseInput} ${v2 ? activeInput : inactiveInput}`}
/>
</div>

<button
onClick={
hasResult1
? () => {
setR1(null);
setHasResult1(false);
}
: calc1
}
className={hasResult1 ? gtRedButton : gtGreenButton}
>
{hasResult1 ? "Clear" : "Calculate"}
</button>

{renderResult(r1)}

</div>

<div className="border-t border-neutral-800 pt-10" />

{/* -------------------------
     2: X is what % of Y
-------------------------- */}
<div className="space-y-6">

<div className="flex items-center justify-between">
<div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
📈 <span className="italic">X is what % of Y</span>
</div>
<Check show={v3 && v4 ? true : false} />
</div>

<div className="grid grid-cols-2 gap-4">
<input
type="text"
placeholder="10"
value={formatNumber(v3)}
onChange={(e) => {
const val = e.target.value.replace(/,/g, "");
setV3(val);
autoCalc2(val, v4);
}}
onKeyDown={(e) => e.key === "Enter" && calc2()}
className={`${baseInput} ${v3 ? activeInput : inactiveInput}`}
/>
<input
type="text"
placeholder="$100"
value={formatMoney(v4)}
onChange={(e) => {
const val = e.target.value.replace(/[^0-9.-]/g, "");
setV4(val);
autoCalc2(v3, val);
}}
onKeyDown={(e) => e.key === "Enter" && calc2()}
className={`${baseInput} ${v4 ? activeInput : inactiveInput}`}
/>
</div>

<button
onClick={
hasResult2
? () => {
setR2(null);
setHasResult2(false);
}
: calc2
}
className={hasResult2 ? gtRedButton : gtGreenButton}
>
{hasResult2 ? "Clear" : "Calculate"}
</button>

{renderResult(r2)}

</div>

<div className="border-t border-neutral-800 pt-10" />

{/* -------------------------
     3: Percent Increase / Decrease
-------------------------- */}
<div className="space-y-6">

<div className="flex items-center justify-between">
<div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
🔄 <span className="italic">Percent Increase / Decrease</span>
</div>
<Check show={v5 && v6 ? true : false} />
</div>

<div className="grid grid-cols-2 gap-4">
<input
type="text"
placeholder="$100"
value={formatMoney(v5)}
onChange={(e) => {
const val = e.target.value.replace(/[^0-9.-]/g, "");
setV5(val);
autoCalc3(val, v6);
}}
onKeyDown={(e) => e.key === "Enter" && calc3()}
className={`${baseInput} ${v5 ? activeInput : inactiveInput}`}
/>
<input
type="text"
placeholder="$120"
value={formatMoney(v6)}
onChange={(e) => {
const val = e.target.value.replace(/[^0-9.-]/g, "");
setV6(val);
autoCalc3(v5, val);
}}
onKeyDown={(e) => e.key === "Enter" && calc3()}
className={`${baseInput} ${v6 ? activeInput : inactiveInput}`}
/>
</div>

<button
onClick={
hasResult3
? () => {
setR3(null);
setHasResult3(false);
}
: calc3
}
className={hasResult3 ? gtRedButton : gtGreenButton}
>
{hasResult3 ? "Clear" : "Calculate"}
</button>

{renderResult(r3)}

</div>

{/* -------------------------
     HISTORY DRAWER (MATCHED)
-------------------------- */}
<div className="mt-10 border-t border-neutral-800 pt-6">

<div className="flex items-center justify-between mb-3">
<p className="text-xs uppercase tracking-[0.12em] text-slate-500">
History
</p>

<div className="flex items-center gap-4">

{history.length > 0 && (
<button
onClick={() => setHistory([])}
className="text-[10px] uppercase tracking-wide text-red-400 hover:text-red-300 transition"
>
Clear
</button>
)}

<button
onClick={() => setDrawerOpen(!drawerOpen)}
className="text-[10px] uppercase tracking-wide text-slate-400 hover:text-slate-200 transition"
>
{drawerOpen ? "Hide" : "Show"}
</button>

</div>
</div>

{drawerOpen && (
<div className="max-h-48 overflow-y-auto pr-1 space-y-2 custom-scrollbar">

{history.map((item, idx) => {
const isNew = idx === lastAddedIndex;

return (
<div
key={idx}
className={
"flex items-center justify-between p-2 rounded-md transition cursor-pointer select-none " +
(isNew
? "bg-emerald-500/10 drop-shadow-[0_0_6px_rgba(16,185,129,0.55)] " + fadeInClass
: "hover:bg-white/5")
}
onClick={() => {
const parts = item.text.split("=");
const result = parts[1]?.trim();
if (result) alert(`Restored: ${result}`);
}}
onMouseDown={(e) => handleSwipeStart(e, idx)}
onMouseUp={(e) => handleSwipeEnd(e)}
onTouchStart={(e) => handleSwipeStart(e, idx)}
onTouchEnd={(e) => handleSwipeEnd(e)}
>

<p className="text-sm font-mono truncate text-slate-300">
{item.text}
</p>

<button
onClick={(e) => {
e.stopPropagation();
togglePin(idx);
}}
className={
"text-xs ml-3 " +
(item.pinned
? "text-emerald-400"
: "text-slate-500 hover:text-slate-300")
}
>
📌
</button>

</div>
);
})}

</div>
)}

</div>

</div>

);

}

