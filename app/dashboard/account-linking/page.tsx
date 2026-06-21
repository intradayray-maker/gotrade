"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getBrokerApiBase } from "@/lib/brokers/getBrokerApiBase"

export default function AccountLinkingPage() {

const [keyId, setKeyId] = useState("")
const [secretKey, setSecretKey] = useState("")
const [environment, setEnvironment] = useState("paper")
const [loading, setLoading] = useState(false)
const [result, setResult] = useState<any>(null)
const [error, setError] = useState("")
const [connected, setConnected] = useState<boolean | null>(null)

const pageTitle = "Link Your Broker"
const pageDescription = "Link your Alpaca account to enable automated trading."

async function refreshStatus() {
try {
const base = getBrokerApiBase()
const res = await fetch(`${base}/status`, { cache: "no-store" })
const data = await res.json()
setConnected(data.status === "connected")
} catch {
setConnected(false)
}
}

useEffect(() => {
refreshStatus()
}, [])

useEffect(() => {
setResult(null)
setError("")
if (connected === false) {
setKeyId("")
setSecretKey("")
}
}, [connected])

async function handleSubmit(e: any) {

e.preventDefault()
setLoading(true)
setError("")
setResult(null)

try {

const base = getBrokerApiBase()
const res = await fetch(`${base}/link`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ keyId, secretKey, environment })
})

const contentType = res.headers.get("content-type") ?? ""
const data = contentType.includes("application/json")
? await res.json()
: { error: await res.text() }

if (!res.ok) {
setError(data.error || "Failed to save keys")
} else {
setResult(data)
await refreshStatus()
}

} catch (err: any) {

setError(err?.message || "Unexpected error saving broker credentials")

} finally {
setLoading(false)
}

}

async function handleDisconnect() {

setLoading(true)
setError("")
setResult(null)

try {

const base = getBrokerApiBase()
const res = await fetch(`${base}/disconnect`, {
method: "DELETE",
cache: "no-store"
})

if (!res.ok) {
setError("Failed to disconnect broker")
} else {
setResult({ success: true })
await refreshStatus()
}

} catch {
setError("Unexpected error disconnecting broker")
} finally {
setLoading(false)
}

}

return (

<div className="max-w-xl mx-auto py-10 space-y-8 mt-0 pt-0">

{/* -------------------------
   TF PAGE HEADER (UNIVERSAL)
-------------------------- */}
<div className="w-full px-1 md:px-6 lg:px-2 space-y-4 max-w-5xl mx-none">

<div className="flex items-center gap-2 text-[13px] text-white/40 pt-3 animate-fadeIn">
<Link
href="/dashboard"
className="hover:text-white/70 transition-colors cursor-pointer"
>
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
  <path d="M12 5v4" />
  <path d="M12 15v4" />
  <rect x="7" y="9" width="10" height="6" rx="2" />
  <path d="M5 12h2" />
  <path d="M17 12h2" />
</svg>


<h1 className="text-3xl font-bold tracking-tight text-white/90 drop-shadow-[0_0_10px_rgba(0,255,180,0.25)]">
{pageTitle}
</h1>
</div>

<p className="text-white/50 text-sm mt-2 tracking-wide max-w-md">
{pageDescription}
</p>

<div className="mt-5 h-[2px] w-24 bg-gradient-to-r from-emerald-400/80 to-emerald-700/80 rounded-full shadow-[0_0_12px_rgba(0,255,180,0.35)] animate-fadeIn [animation-delay:0.2s]"></div>

</div>

</div>

{/* CONNECTED */}
{connected === true && (

<div className="relative rounded-xl p-[2px] bg-gradient-to-br from-emerald-500/40 via-teal-400/40 to-emerald-600/40 shadow-[0_0_25px_rgba(0,0,0,0.5)]">

<div className="rounded-xl bg-[#0b0b12] p-6 space-y-6">

<div className="p-4 rounded-lg bg-emerald-900/20 border border-emerald-500/30">
<div className="flex items-center gap-2 mb-1">
<span className="text-emerald-400 text-lg">●</span>
<h2 className="font-semibold text-emerald-300">
Broker Connected
</h2>
</div>
<p className="text-sm text-emerald-200/80">
{/* TODO: Blofin-specific account labels may replace Alpaca wording later. */}
Your Alpaca account is currently linked.
</p>
</div>

<button
onClick={handleDisconnect}
disabled={loading}
className="
w-full
px-4 py-3
rounded-lg
font-semibold
text-[rgb(225,254,234)]
bg-[rgb(84,33,33)]
border-[3px] border-transparent
shadow-[0_0_25px_rgba(84,33,33,0.55)]
hover:brightness-110 hover:-translate-y-[1px]
transition-all
"
>
{loading ? "Disconnecting..." : "Disconnect Broker"}
</button>

</div>

</div>

)}

{/* DISCONNECTED */}
{connected === false && (

<div className="relative rounded-xl p-[2px] bg-gradient-to-br from-emerald-500/40 via-teal-400/40 to-emerald-600/40 shadow-[0_0_25px_rgba(0,0,0,0.5)]">

<div className="rounded-xl bg-[#0b0b12] p-6 space-y-6">

<form onSubmit={handleSubmit} className="space-y-5">

{/* KEY ID */}
<div className="space-y-1 my-6">
<label className="text-sm text-slate-400">
API Key ID
</label>

<input
type="text"
value={keyId}
onChange={e => setKeyId(e.target.value)}
placeholder="Your Alpaca API Key ID"
required
className="
w-full
rounded-lg
bg-[rgb(17,18,24)]
text-white
border border-slate-800
px-6 py-4
placeholder-slate-500
focus:outline-none
focus:ring-2 focus:ring-emerald-500/40
focus:border-emerald-500/40
transition-all
[color-scheme:dark]
"
/>
</div>


{/* SECRET KEY */}
<div className="space-y-1">
<label className="text-sm text-slate-400">
Secret Key
</label>
<input
type="password"
value={secretKey}
onChange={e => setSecretKey(e.target.value)}
placeholder="Your Alpaca Secret Key"
required
className="
w-full
rounded-lg
bg-[rgb(17,18,24)]
text-white
border border-slate-800
px-6 py-4
placeholder-slate-500
focus:outline-none
focus:ring-2 focus:ring-emerald-500/40
focus:border-emerald-500/40
transition-all
[color-scheme:dark]
"

/>
</div>

{/* ENVIRONMENT */}
<div className="space-y-1 my-6">

<label className="text-sm text-slate-400 py-2">
Environment
</label>

<div className="relative">

<select
value={environment}
onChange={e => setEnvironment(e.target.value)}
className={`
w-full
appearance-none
rounded-lg
bg-[rgb(17,18,24)]
border border-slate-800
px-4 py-3
pr-12
focus:outline-none
focus:ring-2 focus:ring-emerald-500/40
focus:border-emerald-500/40
transition-all
[color-scheme:dark]
${
environment === "paper"
? "text-[rgb(128,117,0)]"
: "text-[rgb(3,150,65)]"
}
`}
>
<option
value="paper"
className="
text-[rgb(113,97,20)]
text-lg
leading-10
"
>
Paper Trading
</option>

<option
value="live"
className="
text-[rgb(3,82,65)]
text-lg
leading-10
"
>
Live Trading
</option>

</select>


{/* CUSTOM ARROW */}
<div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/60 text-xs">
▼
</div></div></div>


{/* SUBMIT */}
<button
type="submit"
disabled={loading}
className="
w-full
px-6 py-4
rounded-lg
font-semibold
text-[rgb(225,254,234)]
bg-[rgb(3,82,65)]
border-[3px] border-transparent
shadow-[0_0_25px_rgba(3,82,65,0.55)]
hover:brightness-110 hover:-translate-y-[1px]
transition-all
"
>
{loading ? "Saving..." : "Save Keys"}
</button>

</form>

{/* ERROR */}
{error && (
<p className="text-red-400 font-medium text-sm">
{error}
</p>
)}

{/* SUCCESS */}
{result?.success && (

<div className="p-4 rounded-lg bg-emerald-900/20 border border-emerald-500/30">
<div className="flex items-center gap-2 mb-1">
<span className="text-emerald-400 text-lg">●</span>
<h2 className="font-semibold text-emerald-300">
Broker Linked
</h2>
</div>
<p className="text-sm text-emerald-200/80">
Your keys have been securely stored and are now ready for trading operations.
</p>
</div>

)}

</div>

</div>

)}

{/* LOADING */}
{connected === null && (
<p className="text-white/60">
Checking broker status…
</p>
)}

</div>

)

}
