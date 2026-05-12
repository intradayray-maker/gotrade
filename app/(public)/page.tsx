// app/(public)/page.tsx
import Link from "next/link";

export default function PublicLandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-16 px-6 py-16">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 overflow-hidden rounded-md bg-white/5">
              {/* you can swap this for your /logo/flowtrade.png image component later */}
            </div>
            <span className="text-lg font-semibold tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                FlowTrade
              </span>
            </span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-slate-300">
            <Link href="/how-it-works" className="hover:text-white">
              How it works
            </Link>
            <Link href="/pricing" className="hover:text-white">
              Pricing
            </Link>
            <Link href="/about" className="hover:text-white">
              About
            </Link>
            <Link
              href="/(public)/login"
              className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium hover:bg-white/15"
            >
              Sign in
            </Link>
          </nav>
        </header>

        <section className="grid gap-10 md:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)] md:items-center">
          <div className="space-y-6">
            <p className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
              Built for intraday traders who already have an edge.
            </p>
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              Copy your best trades.
              <span className="block bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Keep your own risk rules.
              </span>
            </h1>
            <p className="max-w-xl text-sm text-slate-300 sm:text-base">
              FlowTrade connects to your Alpaca account, mirrors a master
              strategy in real time, and enforces your risk limits—so you can
              scale without staring at every tick.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/pricing"
                className="rounded-full bg-emerald-400 px-6 py-2.5 text-sm font-semibold text-black shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-300"
              >
                View pricing & start
              </Link>
              <Link
                href="/how-it-works"
                className="rounded-full border border-white/10 px-6 py-2.5 text-sm font-medium text-slate-200 hover:border-white/20 hover:bg-white/5"
              >
                See how it works
              </Link>
            </div>
            <p className="text-xs text-slate-400">
              No lock-in. Cancel anytime. Not investment advice.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_0_80px_rgba(16,185,129,0.25)]">
            <div className="rounded-xl bg-black/70 p-4">
              <p className="text-xs font-medium text-emerald-300">
                Today&apos;s session snapshot
              </p>
              <p className="mt-1 text-xs text-slate-400">
                SPY master strategy · Paper account
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
                <div className="rounded-lg bg-white/5 p-3">
                  <p className="text-slate-400">P&L (realized)</p>
                  <p className="mt-1 text-sm font-semibold text-emerald-400">
                    +$482.13
                  </p>
                </div>
                <div className="rounded-lg bg-white/5 p-3">
                  <p className="text-slate-400">Win rate</p>
                  <p className="mt-1 text-sm font-semibold text-white">63%</p>
                </div>
                <div className="rounded-lg bg-white/5 p-3">
                  <p className="text-slate-400">Max drawdown</p>
                  <p className="mt-1 text-sm font-semibold text-amber-300">
                    -1.9%
                  </p>
                </div>
              </div>
              <div className="mt-4 rounded-lg bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 p-3 text-xs text-slate-300">
                FlowTrade enforces your max daily loss, position size, and
                allocation per trade—automatically.
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/5 pt-6 text-xs text-slate-500">
          © {new Date().getFullYear()} FlowTrade. Trading involves risk of loss.
        </footer>
      </div>
    </main>
  );
}
