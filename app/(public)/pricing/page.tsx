"use client";

import { useState } from "react";

const ELITE_PRICE_ID = "price_1TTNGkKLveVAZ0tjCYKnJ9m0";

export default function PricingPage() {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    try {
      setLoading(true);

      console.log("Sending to backend:", { priceId: ELITE_PRICE_ID });

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: ELITE_PRICE_ID }),
      });

      if (!res.ok) {
        console.error("Checkout error", await res.text());
        setLoading(false);
        return;
      }

      const data = await res.json();
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-16">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight">
            Pricing built for real traders.
          </h1>
          <a
            href="/"
            className="text-xs text-slate-400 underline-offset-2 hover:text-slate-200 hover:underline"
          >
            Back to home
          </a>
        </header>

        <section className="space-y-4">
          <p className="text-sm text-slate-300">
            Start on paper, then scale to live capital when you&apos;re ready.
            Includes Alpaca integration, copy-trading engine, and risk controls.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-1">
          <div className="flex flex-col rounded-2xl border bg-white/5 p-5 border-emerald-400/60 shadow-[0_0_40px_rgba(16,185,129,0.35)]">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold">Elite</h2>
                <p className="mt-1 text-xs text-slate-300">
                  High-volume traders with performance focus.
                </p>
              </div>

              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                Most popular
              </span>
            </div>

            <div className="mb-4">
              <span className="text-3xl font-semibold">$199</span>
              <span className="ml-1 text-xs text-slate-400">/month</span>
            </div>

            <ul className="mb-4 flex-1 space-y-2 text-xs text-slate-200">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Unlimited linked accounts
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Unlimited strategies
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Performance fee reporting
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Custom risk controls
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Priority support
              </li>
            </ul>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className={`mt-2 rounded-full px-4 py-2 text-xs font-semibold transition bg-emerald-400 text-black hover:bg-emerald-300 ${
                loading ? "opacity-60" : ""
              }`}
            >
              {loading ? "Redirecting to checkout..." : "Continue to checkout"}
            </button>
          </div>
        </section>

        <p className="text-xs text-slate-500">
          You can manage your subscription anytime from the billing portal.
        </p>
      </div>
    </main>
  );
}
