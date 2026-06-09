"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ===============================
// LIVE STRIPE PRICE IDS
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
  <div className="
    w-8 h-8
    flex items-center justify-center
    rounded-lg
    bg-emerald-500/10
    border border-emerald-500/20
    text-emerald-400
  ">
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

const CheckIcon = () => (
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

  // BACK TO TOP VISIBILITY HANDLER
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

  // ===============================
  // CHECKOUT HANDLER (LIVE)
  // ===============================
  const handleCheckout = async (priceId: string) => {
    try {
      setLoading(true);

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
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

          <div className="flex items-center gap-3"></div>

          <nav className="flex items-center gap-6 text-sm text-white/60">

            {/* HOME ICON WITH ACTIVE HIGHLIGHT */}
            <Link
              href="/"
              className="group flex items-center transition relative"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`
                  h-4 w-4 transition
                  ${pathname === "/" 
                    ? "text-emerald-400 drop-shadow-[0_0_6px_rgba(0,255,180,0.6)]" 
                    : "text-white/60"}
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
                <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-emerald-400 rounded-full shadow-[0_0_6px_rgba(0,255,180,0.6)]"></span>
              )}
            </Link>

            <Link
              href="/how-it-works"
              className={`
                hover:text-white transition relative
                ${pathname === "/how-it-works" ? "text-emerald-400" : ""}
              `}
            >
              How it works
              {pathname === "/how-it-works" && (
                <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-emerald-400 rounded-full"></span>
              )}
            </Link>

            <Link
              href="/pricing"
              className={`
                hover:text-white transition relative
                ${pathname === "/pricing" ? "text-emerald-400" : ""}
              `}
            >
              Pricing
              {pathname === "/pricing" && (
                <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-emerald-400 rounded-full"></span>
              )}
            </Link>

            <Link
              href="/about"
              className={`
                hover:text-white transition relative
                ${pathname === "/about" ? "text-emerald-400" : ""}
              `}
            >
              About
              {pathname === "/about" && (
                <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-emerald-400 rounded-full"></span>
              )}
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

          </nav>

        </header>





        {/* HERO SECTION */}
        <section className="grid md:grid-cols-2 gap-12 items-center">

          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight text-white/90">
              Pricing that respects your time and your capital.
            </h1>

            <p className="text-white/60 text-base max-w-md">
              Three plans. No fluff. No hidden fees. Just clean access to the signals and structure that keep you consistent.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800/40 bg-[#0b0b12] h-64 flex items-center justify-center text-white/30 text-sm">

<div className="rounded-lg overflow-hidden border border-slate-800/40">
<img src="/images/7.png" className="w-full h-auto" /></div>

          </div>

        </section>

{/* PRICING GRID */}
<section className="grid md:grid-cols-3 gap-10">

  {/* STARTER PLAN */}
  <div className="
    flex flex-col
    rounded-2xl
    border border-white/10
    bg-white/5
    p-8
    shadow-[0_0_25px_rgba(0,0,0,0.35)]
    space-y-6
  ">

    {/* Title + Icon */}
    <div className="flex items-center gap-3">
      <PlanIcon />
      <h2 className="text-lg font-semibold">Forex Signals</h2>
    </div>

    {/* Separator */}
    <div className="h-px bg-white/10 w-full" />

    {/* Price */}
    <div>
      <span className="text-4xl font-semibold">$19.99</span>
      <span className="ml-1 text-sm text-white/40">/month</span>
    </div>

    {/* Features */}
    <ul className="space-y-3 text-sm">

      <li className="flex items-start gap-2 text-white/70">
        <CheckIcon />
        AI trading companion
      </li>

      <li className="flex items-start gap-2 text-white/70">
        <CheckIcon />
        Built‑in position sizing
      </li>

      <li className="flex items-start gap-2 text-white/70">
        <CheckIcon />
        Smart leverage guidance
      </li>

      <li className="flex items-start gap-2 text-white/70">
        <CheckIcon />
        Real‑time trade signals
      </li>

      <li className="flex items-start gap-2 text-white/70">
        <CheckIcon />
        Entry • Stop • Targets
      </li>

      <li className="flex items-start gap-2 text-white/70">
        <CheckIcon />
        Daily news safety filter
      </li>


      <li className="flex items-start gap-2 text-white/70">
        <CheckIcon />
        AI market reflections
      </li>

      <li className="flex items-start gap-2 text-white/70">
        <CheckIcon />
        Trade execution details
      </li>

      <li className="flex items-start gap-2 text-white/70">
        <CheckIcon />
        Weekday trading signals
      </li>  



      <li className="flex items-start gap-2 text-white/70">
        <CheckIcon />
        Growth strategy (basic)
      </li>

      <li className="flex items-start gap-2 text-white/70">
        <CheckIcon />
        Email notifications
      </li>

      <li className="flex items-start gap-2 text-white/70">
        <CheckIcon />
        (1) weekly Zoom call
      </li>

    

      {/* Missing */}
      <li className="flex items-start gap-2 text-white/40">
        <XIcon />
        Crypto Signals
      </li>

      <li className="flex items-start gap-2 text-white/40">
        <XIcon />
        Personalized growth strategy
      </li>

      <li className="flex items-start gap-2 text-white/40">
        <XIcon />
        Night and Weekend Signals
      </li>
    </ul>



<button
  onClick={() => handleCheckout("price_1TgEcFKLveVAZ0tjNyB2gm66")}
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


  </div>



  {/* PRO PLAN */}
  <div className="
    flex flex-col
    rounded-2xl
    border border-emerald-400/60
    bg-white/5
    p-8
    shadow-[0_0_40px_rgba(16,185,129,0.35)]
    space-y-6
  ">

    {/* Title + Icon */}
    <div className="flex items-center gap-3">
      <PlanIcon />
      <h2 className="text-lg font-semibold">Crypto Signals</h2>
    </div>


    {/* Urgency Badge */}
    <div className="
      text-xs font-semibold
      text-yellow-300
      bg-yellow-300/10
      border border-yellow-300/20
      px-2 py-1 rounded-md
      w-fit
      shadow-[0_0_10px_rgba(255,215,0,0.35)]
    ">
      Trending Now
    </div>


    {/* Separator */}
    <div className="h-px bg-white/10 w-full" />

    {/* Price */}
    <div>
      <span className="text-4xl font-semibold">$29.99</span>
      <span className="ml-1 text-sm text-white/40">/month</span>
    </div>

    {/* Features */}
    <ul className="space-y-3 text-sm">

      <li className="flex items-start gap-2 text-white/70">
        <CheckIcon />
        AI trading companion
      </li>

      <li className="flex items-start gap-2 text-white/70">
        <CheckIcon />
        Built‑in position sizing
      </li>

      <li className="flex items-start gap-2 text-white/70">
        <CheckIcon />
        Smart leverage guidance
      </li>

      <li className="flex items-start gap-2 text-white/70">
        <CheckIcon />
        Real‑time crypto signals
      </li>

      <li className="flex items-start gap-2 text-white/70">
        <CheckIcon />
        Entry • Stop • Targets
      </li>

      <li className="flex items-start gap-2 text-white/70">
        <CheckIcon />
        AI volatility meter
      </li>

      <li className="flex items-start gap-2 text-white/70">
        <CheckIcon />
        Volatility pulse insights
      </li>

      <li className="flex items-start gap-2 text-white/70">
        <CheckIcon />
        Trade execution details
      </li>

      <li className="flex items-start gap-2 text-white/70">
        <CheckIcon />
          Day, Night and Weekend Signals
      </li>



      <li className="flex items-start gap-2 text-white/70">
        <CheckIcon />
        Growth strategy (personalized)
      </li>

      <li className="flex items-start gap-2 text-white/70">
        <CheckIcon />
        Email notifications
      </li>

      <li className="flex items-start gap-2 text-white/70">
        <CheckIcon />
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

    </ul>

<button
  onClick={() => handleCheckout("price_1TgEe8KLveVAZ0tjTzrAeN9Y")}
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


  </div>



  {/* PRO PLAN */}
  <div className="
    flex flex-col
    rounded-2xl
    border border-white/10
    bg-white/5
    p-8
    shadow-[0_0_25px_rgba(0,0,0,0.35)]
    space-y-6
  ">

    {/* Title + Icon */}
    <div className="flex items-center gap-3">
      <PlanIcon />
      <h2 className="text-lg font-semibold">Pro Bundle</h2>
    </div>

    {/* Separator */}
    <div className="h-px bg-white/10 w-full" />

    {/* Price */}
    <div>
      <span className="text-4xl font-semibold">$39.99</span>
      <span className="ml-1 text-sm text-white/40">/month</span>
    </div>

    {/* Features */}
    <ul className="space-y-3 text-sm">

 <li className="flex items-start gap-2 text-white/70">
  <CheckIcon />
  AI trading companion
</li>

<li className="flex items-start gap-2 text-white/70">
  <CheckIcon />
  Built‑in position sizing
</li>

<li className="flex items-start gap-2 text-white/70">
  <CheckIcon />
  Smart leverage guidance
</li>

<li className="flex items-start gap-2 text-white/70">
  <CheckIcon />
  Real‑time Forex signals
</li>

<li className="flex items-start gap-2 text-white/70">
  <CheckIcon />
  Real‑time Crypto signals
</li>

<li className="flex items-start gap-2 text-white/70">
  <CheckIcon />
  Entry • Stop • Targets
</li>

<li className="flex items-start gap-2 text-white/70">
  <CheckIcon />
  Daily news safety filter (Forex)
</li>

<li className="flex items-start gap-2 text-white/70">
  <CheckIcon />
  AI volatility meter (Crypto)
</li>

<li className="flex items-start gap-2 text-white/70">
  <CheckIcon />
  Volatility pulse insights
</li>

<li className="flex items-start gap-2 text-white/70">
  <CheckIcon />
  Trade execution details
</li>

<li className="flex items-start gap-2 text-white/70">
  <CheckIcon />
  Day, Night and Weekend Signals
</li>


<li className="flex items-start gap-2 text-white/70">
  <CheckIcon />
  Growth strategy (personalized)
</li>

<li className="flex items-start gap-2 text-white/70">
  <CheckIcon />
  Email notifications
</li>

<li className="flex items-start gap-2 text-white/70">
  <CheckIcon />
  Scheduled Zoom calls
</li>

<li className="flex items-start gap-2 text-white/70">
  <CheckIcon />
  Priority 1‑on‑1 personal support
</li>
</ul>

<button
  onClick={() => handleCheckout("price_1TgEhiKLveVAZ0tjlaVICsCk")}
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
  {loading ? "Redirecting..." : "Get Pro Bundle"}
</button>

</div>

</section>

{/* FOOTER */}

<p className="font-medium text-white/70"></p>
<p className="mt-1"></p>

</div>

      {/* BACK TO TOP BUTTON */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        id="backToTop"
        className="
          fixed bottom-6 right-6 z-50
          w-12 h-12
          flex items-center justify-center
          rounded-full
          bg-[rgb(3,82,65)]
          text-[rgb(225,254,234)]
          shadow-[0_0_18px_rgba(3,82,65,0.45)]
          transition duration-150
          hover:bg-[rgb(5,100,80)]
          hover:shadow-[0_0_28px_rgba(3,82,65,0.75)]
          hover:-translate-y-[2px]
          cursor-pointer
          hidden
        "
      >
        ↑
      </button>

    </main>
  );
}
