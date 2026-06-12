"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ===============================
// LIVE STRIPE PRICE IDS (existing)
// ===============================

// Starter — LIVE
const STARTER_PRICE_ID = "price_1TYXeJKLveVAZ0tjTfeJg5k4";

// Pro — LIVE
const PRO_PRICE_ID = "price_1TYXiPKLveVAZ0tjwudC5ayt";

// Elite — LIVE
const ELITE_PRICE_ID = "price_1TYXk8KLveVAZ0tjIw2sznnv";

// Elite (Test Mode, $0) — LIVE
const ELITE_TEST_PRICE_ID = "price_1TYbLOKLveVAZ0tjHkfZb2vf";

// ===============================
// ICONS
// ===============================

const PlanIcon = () => (
  <div
    className="
      w-8 h-8
      flex items-center justify-center
      rounded-lg
      bg-emerald-500/10
      border border-emerald-500/20
      text-emerald-400
    "
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4z" />
    </svg>
  </div>
);

const CheckIconGreen = () => (
  <svg
    className="w-4 h-4 text-emerald-400 mt-0.5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M5 13l4 4L19 7" />
  </svg>
);

const CheckIconIndigo = () => (
  <svg
    className="w-4 h-4 text-indigo-400 mt-0.5 drop-shadow-[0_0_6px_rgba(129,140,248,0.35)]"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg
    className="w-4 h-4 text-white/30 mt-0.5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// ===============================
// PAGE COMPONENT
// ===============================

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  // Coupon states (one per plan)
  const [forexCoupon, setForexCoupon] = useState("");
  const [cryptoCoupon, setCryptoCoupon] = useState("");
  const [relaxCoupon, setRelaxCoupon] = useState("");

  // Toggle visibility
  const [showForexCoupon, setShowForexCoupon] = useState(false);
  const [showCryptoCoupon, setShowCryptoCoupon] = useState(false);
  const [showRelaxCoupon, setShowRelaxCoupon] = useState(false);

  useEffect(() => {
    const btn = document.getElementById("backToTop");
    if (!btn) return;

    const handleScroll = () => {
      if (window.scrollY > 300) btn.style.display = "block";
      else btn.style.display = "none";
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ⭐⭐⭐ FIXED VERSION — COOKIES NOW SENT TO SERVER ⭐⭐⭐
  const handleCheckout = async (priceId: string, coupon: string | null) => {
    try {
      setLoading(true);

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        credentials: "include", // ⭐ REQUIRED FOR SUPABASE AUTH
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, coupon }),
      });

      if (!res.ok) {
        console.error("Checkout error", await res.text());
        setLoading(false);
        return;
      }

      const data = await res.json();
      window.location.href = data.url;
    } catch (err) {
      console.error("Checkout failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050509] text-white">
      <div className="mx-auto max-w-6xl px-6 py-20 space-y-24">

        {/* HEADER */}
        <header className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3" />

          <nav className="flex items-center gap-6 text-sm text-white/60">
            <Link
              href="/"
              className="group flex items-center transition relative"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`
                  h-4 w-4 transition
                  ${
                    pathname === "/"
                      ? "text-emerald-400 drop-shadow-[0_0_6px_rgba(0,255,180,0.6)]"
                      : "text-white/60"
                  }
                  group-hover:text-white
                  group-hover:-translate-y-[1px]
                `}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h4m6 0h4a1 1 0 001-1V10"
                />
              </svg>

              {pathname === "/" && (
                <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-emerald-400 rounded-full shadow-[0_0_6px_rgba(0,255,180,0.6)]" />
              )}
            </Link>

            <Link href="/how-it-works" className="hover:text-white transition">
              How it works
            </Link>

            <Link href="/pricing" className="hover:text-white transition">
              Pricing
            </Link>

            <Link href="/about" className="hover:text-white transition">
              About
            </Link>

            <Link href="/signup">
              <div
                className="
                  rounded-[6px]
                  px-5 py-1.5 text-sm font-semibold
                  bg-[rgb(3,82,65)]
                  text-[rgb(225,254,234)]
                  border border-[rgb(3,82,65)]
                  shadow-[0_0_18px_rgba(3,82,65,0.45)]
                  transition duration-150
                  hover:bg-[rgb(5,100,80)]
                  hover:shadow-[0_0_28px_rgba(3,82,65,0.75)]
                  hover:-translate-y-[1px]
                  cursor-pointer
                "
              >
                Sign up
              </div>
            </Link>

            <Link href="/login">
              <div
                className="
                  rounded-[6px]
                  px-5 py-1.5 text-sm font-semibold
                  bg-[rgb(15,15,23)]
                  text-white/80
                  border border-slate-800/40
                  shadow-[0_0_12px_rgba(0,0,0,0.35)]
                  transition duration-150
                  hover:bg-white/5
                  hover:text-white
                  hover:-translate-y-[1px]
                  cursor-pointer
                "
              >
                Log in
              </div>
            </Link>
          </nav>
        </header>

        {/* LIFESTYLE CHOOSER */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <h1
              className="
                text-3xl font-extrabold tracking-tight
                bg-gradient-to-r from-emerald-300 via-blue-400 to-purple-400
                text-transparent bg-clip-text
                drop-shadow-[0_0_12px_rgba(0,200,255,0.35)]
              "
            >
              Choose the plan that fits your real life
            </h1>

            <p className="text-sm text-white/60 max-w-xl mx-auto leading-relaxed">
              Your schedule determines your trading style.  
              Pick the plan that matches when you’re actually available —  
              not just the features you think you need.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Forex lifestyle */}
            <div
              className="
                rounded-2xl
                border border-white/10
                bg-white/5
                p-5
                space-y-3
              "
            >
              <h2 className="text-[14px] font-semibold text-sky-300">
                Forex Signals
              </h2>
              <p className="text-[14px] text-white/70">
                If you&apos;re available between <span className="font-semibold">8am–11am on weekdays</span>,
                this plan gives you fast, structured morning setups.
              </p>
              <p className="text-[14px] text-white/50">
                Requires quick reactions and a consistent morning routine.
              </p>
            </div>

            {/* Crypto lifestyle */}
            <div
              className="
                rounded-2xl
                border border-white/10
                bg-white/5
                p-5
                space-y-3
              "
            >
              <h2 className="text-[14px] font-semibold text-sky-300">
                Crypto Signals
              </h2>
              <p className="text-[14px] text-white/70">
                If you&apos;re available <span className="font-semibold">mornings, nights, or weekends</span>,
                this plan gives you more opportunities and more volatility.
              </p>
              <p className="text-[14px] text-white/50">
                Requires attentiveness and being ready to act when signals fire.
              </p>
            </div>

            {/* Swing lifestyle */}
            <div
              className="
                rounded-2xl
                border border-white/10
                bg-white/5
                p-5
                space-y-3
              "
            >
              <h2 className="text-[14px] font-semibold text-sky-300">
                Relaxed Plan
              </h2>
              <p className="text-[14px] text-white/70">
                If you want <span className="font-semibold">flexibility and zero time pressure</span>,
                this plan gives you weekly, relaxed signals you can act on when life allows.
              </p>
              <p className="text-[14px] text-white/50">
                Perfect for busy professionals who can&apos;t be glued to their devices.
              </p>
            </div>
          </div>
        </section>

        {/* PRICING GRID */}
        <section className="grid md:grid-cols-3 gap-5">

          {/* FOREX SIGNALS */}
          <div
            className="
              flex flex-col
              rounded-2xl
              border border-white/10
              bg-white/5
              p-8
              shadow-[0_0_25px_rgba(0,0,0,0.35)]
              space-y-6
            "
          >
            <div className="flex items-center gap-3">
              <PlanIcon />
              <div>
                <h2 className="text-lg font-semibold">Forex Signals</h2>
                <p className="text-xs text-white/60">
                  Weekday mornings
                </p>
              </div>
            </div>

            <div className="h-px bg-white/10 w-full" />

            <div>
              <span className="text-4xl font-semibold">$19.99</span>
              <span className="ml-1 text-sm text-white/40">/month</span>
            </div>

            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-white/70">
                <CheckIconGreen />
                8am–11am weekday Signals
              </li>

              <li className="flex items-start gap-2 text-white/70">
                <CheckIconGreen />
                AI trading companion
              </li>

              <li className="flex items-start gap-2 text-white/70">
                <CheckIconGreen />
                Built‑in position sizing
              </li>

              <li className="flex items-start gap-2 text-white/70">
                <CheckIconGreen />
                Smart leverage guidance
              </li>

              <li className="flex items-start gap-2 text-white/70">
                <CheckIconGreen />
                Real‑time Forex signals
              </li>

              <li className="flex items-start gap-2 text-white/70">
                <CheckIconGreen />
                Entry • Stop • Targets
              </li>

              <li className="flex items-start gap-2 text-white/70">
                <CheckIconGreen />
                Daily news safety filter
              </li>

              <li className="flex items-start gap-2 text-white/70">
                <CheckIconGreen />
                Trade execution details
              </li>

              <li className="flex items-start gap-2 text-white/70">
                <CheckIconIndigo />
                Growth strategy (basic)
              </li>

              <li className="flex items-start gap-2 text-white/70">
                <CheckIconIndigo />
                Email notifications
              </li>

              <li className="flex items-start gap-2 text-white/70">
                <CheckIconIndigo />
                (1) weekly Zoom call
              </li>

              <li className="flex items-start gap-2 text-white/40">
                <XIcon />
                Crypto signals
              </li>

              <li className="flex items-start gap-2 text-white/40">
                <XIcon />
                Personalized growth strategy
              </li>

              <li className="flex items-start gap-2 text-white/40">
                <XIcon />
                Night + Weekend signals
              </li>

              <li className="flex items-start gap-2 text-white/40">
                <XIcon />
                Priority 1‑on‑1 support
              </li>

              <li className="flex items-start gap-2 text-white/40">
                <XIcon />
                Scheduled Zoom calls
              </li>

              <li className="flex items-start gap-2 text-white/40">
                <XIcon />
                Relaxed signals
              </li>
            </ul>

            {/* CHECKOUT BUTTON */}
            <button
              onClick={() => handleCheckout("price_1TgEcFKLveVAZ0tjNyB2gm66", forexCoupon)}
              disabled={loading}
              className="
                mt-auto
                rounded-[6px]
                px-6 py-3
                text-sm font-semibold
                bg-[rgb(3,82,65)]
                text-[rgb(225,254,234)]
                border border-[rgb(3,82,65)]
                shadow-[0_0_18px_rgba(3,82,65,0.45)]
                hover:bg-[rgb(5,100,80)]
                hover:shadow-[0_0_28px_rgba(3,82,65,0.75)]
                transition
              "
            >
              {loading ? "Redirecting..." : "Get Forex Signals"}
            </button>

            {/* COUPON TOGGLE */}
            <button
              onClick={() => setShowForexCoupon(!showForexCoupon)}
              className="text-xs text-emerald-300 hover:text-emerald-200 transition mt-2"
            >
              Have a coupon?
            </button>

            {/* COUPON INPUT */}
            {showForexCoupon && (
              <div className="space-y-2 mt-2">
                <input
                  value={forexCoupon}
                  onChange={(e) => setForexCoupon(e.target.value)}
                  placeholder="Enter coupon code"
                  className="
                    w-full
                    px-3 py-2
                    rounded-md
                    bg-black/20
                    border border-emerald-500/30
                    text-sm
                    text-white
                    placeholder-white/40
                    focus:outline-none
                    focus:border-emerald-400
                  "
                />

                <button
                  onClick={() => handleCheckout("price_1TgEcFKLveVAZ0tjNyB2gm66", forexCoupon)}
                  className="
                    w-full
                    rounded-md
                    px-3 py-2
                    text-sm font-semibold
                    bg-emerald-600
                    text-white
                    hover:bg-emerald-700
                    transition
                  "
                >
                  Apply Coupon
                </button>
              </div>
            )}
          </div>

          {/* CRYPTO SIGNALS */}
          <div
            className="
              flex flex-col
              rounded-2xl
              border border-emerald-400/60
              bg-white/5
              p-8
              shadow-[0_0_40px_rgba(16,185,129,0.35)]
              space-y-6
            "
          >
            <div className="flex items-center gap-3">
              <PlanIcon />
              <div>
                <h2 className="text-lg font-semibold">Crypto Signals</h2>
                <p className="text-xs text-white/60">
                  Mornings, Nights, or weekends
                </p>
              </div>
            </div>

            <div className="h-px bg-white/10 w-full" />

            <div>
              <span className="text-4xl font-semibold">$29.99</span>
              <span className="ml-1 text-sm text-white/40">/month</span>
            </div>

            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-white/70">
                <CheckIconGreen />
                Day + night + weekend signals
              </li>

              <li className="flex items-start gap-2 text-white/70">
                <CheckIconGreen />
                AI trading companion
              </li>

              <li className="flex items-start gap-2 text-white/70">
                <CheckIconGreen />
                Built‑in position sizing
              </li>

              <li className="flex items-start gap-2 text-white/70">
                <CheckIconGreen />
                Smart leverage guidance
              </li>

              <li className="flex items-start gap-2 text-white/70">
                <CheckIconGreen />
                Real‑time Crypto signals
              </li>

              <li className="flex items-start gap-2 text-white/70">
                <CheckIconGreen />
                Entry • Stop • Targets
              </li>

              <li className="flex items-start gap-2 text-white/70">
                <CheckIconGreen />
                AI volatility meter
              </li>

              <li className="flex items-start gap-2 text-white/70">
                <CheckIconGreen />
                Volatility pulse insights
              </li>

              <li className="flex items-start gap-2 text-white/70">
                <CheckIconGreen />
                Trade execution details
              </li>

              <li className="flex items-start gap-2 text-white/70">
                <CheckIconIndigo />
                Growth strategy (personalized)
              </li>

              <li className="flex items-start gap-2 text-white/70">
                <CheckIconIndigo />
                Email notifications
              </li>

              <li className="flex items-start gap-2 text-white/70">
                <CheckIconIndigo />
                (2) Zoom calls per week
              </li>

              {/* Missing */}
              <li className="flex items-start gap-2 text-white/40">
                <XIcon />
                Forex signals
              </li>

              <li className="flex items-start gap-2 text-white/40">
                <XIcon />
                Priority 1‑on‑1 support
              </li>

              <li className="flex items-start gap-2 text-white/40">
                <XIcon />
                Scheduled Zoom calls
              </li>

              <li className="flex items-start gap-2 text-white/40">
                <XIcon />
                Relaxed signals
              </li>
            </ul>

            {/* CHECKOUT BUTTON */}
            <button
              onClick={() => handleCheckout("price_1TgEe8KLveVAZ0tjTzrAeN9Y", cryptoCoupon)}
              disabled={loading}
              className="
                mt-auto
                rounded-[6px]
                px-6 py-3
                text-sm font-semibold
                bg-[rgb(3,82,65)]
                text-[rgb(225,254,234)]
                border border-[rgb(3,82,65)]
                shadow-[0_0_18px_rgba(3,82,65,0.45)]
                hover:bg-[rgb(5,100,80)]
                hover:shadow-[0_0_28px_rgba(3,82,65,0.75)]
                transition
              "
            >
              {loading ? "Redirecting..." : "Get Crypto Signals"}
            </button>

            {/* COUPON TOGGLE */}
            <button
              onClick={() => setShowCryptoCoupon(!showCryptoCoupon)}
              className="text-xs text-emerald-300 hover:text-emerald-200 transition mt-2"
            >
              Have a coupon?
            </button>

            {/* COUPON INPUT */}
            {showCryptoCoupon && (
              <div className="space-y-2 mt-2">
                <input
                  value={cryptoCoupon}
                  onChange={(e) => setCryptoCoupon(e.target.value)}
                  placeholder="Enter coupon code"
                  className="
                    w-full
                    px-3 py-2
                    rounded-md
                    bg-black/20
                    border border-emerald-500/30
                    text-sm
                    text-white
                    placeholder-white/40
                    focus:outline-none
                    focus:border-emerald-400
                  "
                />

                <button
                  onClick={() => handleCheckout("price_1TgEe8KLveVAZ0tjTzrAeN9Y", cryptoCoupon)}
                  className="
                    w-full
                    rounded-md
                    px-3 py-2
                    text-sm font-semibold
                    bg-emerald-600
                    text-white
                    hover:bg-emerald-700
                    transition
                  "
                >
                  Apply Coupon
                </button>
              </div>
            )}
          </div>

          {/* RELAXED PLAN */}
          <div
            className="
              flex flex-col
              rounded-2xl
              border border-white/10
              bg-white/5
              p-8
              shadow-[0_0_25px_rgba(0,0,0,0.35)]
              space-y-6
            "
          >
            <div className="flex items-center gap-3">
              <PlanIcon />
              <div>
                <h2 className="text-lg font-semibold">Relaxed Plan</h2>
                <p className="text-xs text-white/60">
                  Flexibility with ZERO time pressure
                </p>
              </div>
            </div>

            <div className="h-px bg-white/10 w-full" />

            <div>
              <span className="text-4xl font-semibold">$39.99</span>
              <span className="ml-1 text-sm text-white/40">/month</span>
            </div>

            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-white/70">
                <CheckIconGreen />
                Weekly relaxed signals
              </li>

              <li className="flex items-start gap-2 text-white/70">
                <CheckIconGreen />
                Weekly SMS signals
              </li>

              <li className="flex items-start gap-2 text-white/70">
                <CheckIconGreen />
                Crypto &amp; Forex signals (weekly)
              </li>

              <li className="flex items-start gap-2 text-white/70">
                <CheckIconGreen />
                AI trading companion
              </li>

              <li className="flex items-start gap-2 text-white/70">
                <CheckIconGreen />
                Built‑in position sizing
              </li>

              <li className="flex items-start gap-2 text-white/70">
                <CheckIconGreen />
                Smart leverage guidance
              </li>

              <li className="flex items-start gap-2 text-white/70">
                <CheckIconGreen />
                Entry • Stop • Targets
              </li>

              <li className="flex items-start gap-2 text-white/70">
                <CheckIconGreen />
                Trade execution details
              </li>

              <li className="flex items-start gap-2 text-white/70">
                <CheckIconIndigo />
                Weekly market outlook
              </li>

              <li className="flex items-start gap-2 text-white/70">
                <CheckIconIndigo />
                Scheduled Zoom calls
              </li>

              <li className="flex items-start gap-2 text-white/70">
                <CheckIconIndigo />
                Priority 1‑on‑1 personal support
              </li>

              <li className="flex items-start gap-2 text-white/70">
                <CheckIconIndigo />
                Email notifications
              </li>

              <li className="flex items-start gap-2 text-white/70">
                <CheckIconIndigo />
                Growth strategy (personalized)
              </li>

              {/* Missing */}
              <li className="flex items-start gap-2 text-white/40">
                <XIcon />
                Fast intraday Forex signals
              </li>

              <li className="flex items-start gap-2 text-white/40">
                <XIcon />
                Fast intraday Crypto signals
              </li>
            </ul>

            {/* CHECKOUT BUTTON */}
            <button
              onClick={() => handleCheckout("price_1TgEhiKLveVAZ0tjlaVICsCk", relaxCoupon)}
              disabled={loading}
              className="
                mt-auto
                rounded-[6px]
                px-6 py-3
                text-sm font-semibold
                bg-[rgb(3,82,65)]
                text-[rgb(225,254,234)]
                border border-[rgb(3,82,65)]
                shadow-[0_0_18px_rgba(3,82,65,0.45)]
                hover:bg-[rgb(5,100,80)]
                hover:shadow-[0_0_28px_rgba(3,82,65,0.75)]
                transition
              "
            >
              {loading ? "Redirecting..." : "Get Relaxed Plan"}
            </button>

            {/* COUPON TOGGLE */}
            <button
              onClick={() => setShowRelaxCoupon(!showRelaxCoupon)}
              className="text-xs text-emerald-300 hover:text-emerald-200 transition mt-2"
            >
              Have a coupon?
            </button>

            {/* COUPON INPUT */}
            {showRelaxCoupon && (
              <div className="space-y-2 mt-2">
                <input
                  value={relaxCoupon}
                  onChange={(e) => setRelaxCoupon(e.target.value)}
                  placeholder="Enter coupon code"
                  className="
                    w-full
                    px-3 py-2
                    rounded-md
                    bg-black/20
                    border border-emerald-500/30
                    text-sm
                    text-white
                    placeholder-white/40
                    focus:outline-none
                    focus:border-emerald-400
                  "
                />

                <button
                  onClick={() => handleCheckout("price_1TgEhiKLveVAZ0tjlaVICsCk", relaxCoupon)}
                  className="
                    w-full
                    rounded-md
                    px-3 py-2
                    text-sm font-semibold
                    bg-emerald-600
                    text-white
                    hover:bg-emerald-700
                    transition
                  "
                >
                  Apply Coupon
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
