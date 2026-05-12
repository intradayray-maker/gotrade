// app/(public)/about/page.tsx
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-16">
        <header className="flex items-center justify-between">
          <Link href="/" className="text-sm text-slate-300 hover:text-white">
            ← Back to home
          </Link>
          <Link
            href="/pricing"
            className="rounded-full bg-emerald-400 px-4 py-1.5 text-xs font-semibold text-black hover:bg-emerald-300"
          >
            View pricing
          </Link>
        </header>

        <section className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight">
            Built by traders who were tired of duct-taping tools together.
          </h1>
          <p className="text-sm text-slate-300">
            FlowTrade is for active traders who already have an edge, but don&apos;t
            want to spend every session manually mirroring trades, updating
            position sizes, and checking risk across multiple accounts.
          </p>
          <p className="text-sm text-slate-300">
            Instead of another &quot;signal service&quot;, FlowTrade is
            infrastructure: it links your Alpaca account, mirrors a master
            strategy, and enforces your own risk rules—so you stay in control of
            capital while removing the repetitive work.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Focus
            </p>
            <p className="mt-2 text-slate-200">
              Intraday equity traders using Alpaca who want copy-trading without
              giving up risk control.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Philosophy
            </p>
            <p className="mt-2 text-slate-200">
              Your rules first. FlowTrade enforces your max loss, allocation,
              and position limits before any trade is sent.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Stack
            </p>
            <p className="mt-2 text-slate-200">
              Next.js, Supabase, Stripe, Alpaca, and a trading engine designed
              for low-latency execution.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
