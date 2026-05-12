// app/(public)/how-it-works/page.tsx
import Link from "next/link";

const steps = [
  {
    title: "1. Create your FlowTrade account",
    body: "Sign up, verify your email, and land in your dashboard. No credit card required to explore.",
  },
  {
    title: "2. Link your Alpaca account",
    body: "Add your Alpaca API key and secret. We validate connectivity and show your balance and positions.",
  },
  {
    title: "3. Choose allocation and risk",
    body: "Set your allocation per strategy, max daily loss, and max position size. These rules are enforced on every trade.",
  },
  {
    title: "4. Follow a master strategy",
    body: "Select a master strategy to mirror. FlowTrade listens to the master feed and queues trades for your account.",
  },
  {
    title: "5. Trades are mirrored with controls",
    body: "Our engine adjusts for your account size, open positions, and risk settings before sending orders to Alpaca.",
  },
  {
    title: "6. Review performance and fees",
    body: "See trade history, P&L, and performance fees in a single billing dashboard.",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-white">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-16">
        <header className="flex items-center justify-between">
          <Link href="/" className="text-sm text-slate-300 hover:text-white">
            ← Back to home
          </Link>
          <Link
            href="/pricing"
            className="rounded-full bg-emerald-400 px-4 py-1.5 text-xs font-semibold text-black hover:bg-emerald-300"
          >
            Get started
          </Link>
        </header>

        <section className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight">
            How FlowTrade fits into your trading day.
          </h1>
          <p className="text-sm text-slate-300">
            You keep your broker, your capital, and your strategy. FlowTrade
            handles the execution and risk enforcement so you can focus on
            decisions—not button-clicking.
          </p>
        </section>

        <section className="grid gap-4">
          {steps.map((step) => (
            <div
              key={step.title}
              className="rounded-xl border border-white/10 bg-white/5 p-4"
            >
              <h2 className="text-sm font-semibold text-emerald-300">
                {step.title}
              </h2>
              <p className="mt-1 text-sm text-slate-200">{step.body}</p>
            </div>
          ))}
        </section>

        <section className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
          <p className="font-medium">
            FlowTrade never takes custody of funds. All capital stays in your
            Alpaca account.
          </p>
          <p className="mt-1 text-emerald-200/80">
            You can disconnect at any time, adjust allocation, or pause
            copy-trading from your dashboard.
          </p>
        </section>
      </div>
    </main>
  );
}
