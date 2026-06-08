// app/coming-soon/page.tsx

export default function ComingSoonPage() {

return (

<div className="min-h-screen w-full bg-[#050712] text-slate-100 flex items-center justify-center px-4">

<div className="max-w-xl w-full border border-slate-800/60 bg-[#080a18] rounded-2xl shadow-[0_0_40px_rgba(88,101,242,0.35)] p-8 flex flex-col gap-6">

<div className="flex flex-col gap-2">

<p className="text-xs tracking-[0.25em] uppercase text-slate-400">
GoTrade Private Beta
</p>

<p className="text-3xl font-semibold tracking-tight text-slate-50">
Launching soon — not quite live yet.
</p>

</div>

<div className="flex flex-col gap-3">

<p className="text-xs font-medium text-slate-300">
Join the early access waitlist
</p>

<form
className="flex flex-col sm:flex-row gap-3"
action="/api/waitlist"
method="POST"
>

<input
type="email"
name="email"
required
placeholder="you@example.com"
className="flex-1 rounded-lg bg-[#050712] border border-slate-700/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500"
/>

<button
type="submit"
className="rounded-lg bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 transition-colors px-4 py-2 text-sm font-semibold text-slate-50 shadow-[0_0_20px_rgba(88,101,242,0.45)]"
>
Get notified at launch
</button> </form>

<p className="text-[11px] text-slate-500">
No spam. You’ll only get a single email when GoTrade opens to the public.
</p> </div>

<div className="flex flex-col gap-1 pt-2 border-t border-slate-800/60 mt-2">

<p className="text-[11px] text-slate-500">
Current status:
<span className="ml-1 text-[11px] font-semibold text-emerald-400">
Private beta · Signals live · Public launch pending investor timing
</span>
</p>

<p className="text-[11px] text-slate-600">
If you already have access, you can log in to your dashboard directly from your private link.
</p> </div> </div> </div>

);

}
