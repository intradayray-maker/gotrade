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
              Affordable pricing built to keep you profitable.
            </h1>

            <p className="text-white/60 text-base max-w-md">
              Three simple plans. No gimmics. No upsells.  
              Just full access to automation, risk controls, and live execution.
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
      <h2 className="text-lg font-semibold">Starter</h2>
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
      1st 100 members only
    </div>

    {/* Account Minimum */}
    <p className="text-xs text-white/50">
      Minimum Account Balance: <span className="text-white/70">$500</span>
    </p>

    {/* Separator */}
    <div className="h-px bg-white/10 w-full" />

    {/* Price */}
    <div>
      <span className="text-4xl font-semibold">$4.99</span>
      <span className="ml-1 text-sm text-white/40">/month</span>
    </div>

    {/* Features */}
    <ul className="space-y-3 text-sm">

      <li className="flex items-start gap-2 text-white/70">
        <CheckIcon />
        (1) Auto‑Trade Bot
      </li>

      <li className="flex items-start gap-2 text-white/70">
        <CheckIcon />
        Limited risk controls
      </li>

      <li className="flex items-start gap-2 text-white/70">
        <CheckIcon />
        Full trade history
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
        1 Zoom call per week
      </li>


      <li className="flex items-start gap-2 text-white/70">
        <CheckIcon />
        Performance fee reporting
      </li>

      <li className="flex items-start gap-2 text-white/70">
        <CheckIcon />
        35% performance fee
      </li>

      {/* Missing */}
      <li className="flex items-start gap-2 text-white/40">
        <XIcon />
        Standard risk controls
      </li>

      <li className="flex items-start gap-2 text-white/40">
        <XIcon />
        Personalized growth strategy
      </li>

      <li className="flex items-start gap-2 text-white/40">
        <XIcon />
        Multiple auto‑trade bots
      </li>
    </ul>

<button
  onClick={() => handleCheckout("price_1TYXeJKLveVAZ0tjTfeJg5k4")}
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
  {loading ? "Redirecting..." : "Get Starter"}
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
      <h2 className="text-lg font-semibold">Pro</h2>
    </div>

    {/* Account Minimum */}
    <p className="text-xs text-white/50">
      Minimum Account Balance: <span className="text-white/70">$5,000</span>
    </p>

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
        (3) Auto‑Trade Bots
      </li>

      <li className="flex items-start gap-2 text-white/70">
        <CheckIcon />
        Standard risk controls
      </li>

      <li className="flex items-start gap-2 text-white/70">
        <CheckIcon />
        Full trade history
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
        2 Zoom calls per week
      </li>

      <li className="flex items-start gap-2 text-white/70">
        <CheckIcon />
        Performance fee reporting
      </li>

      <li className="flex items-start gap-2 text-white/70">
        <CheckIcon />
        25% performance fee
      </li>

      {/* Missing */}
      <li className="flex items-start gap-2 text-white/40">
        <XIcon />
        Custom risk controls
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
  onClick={() => handleCheckout("price_1TYXiPKLveVAZ0tjwudC5ayt")}
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
  {loading ? "Redirecting..." : "Get Pro"}
</button>


  </div>



  {/* ELITE PLAN */}
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
      <h2 className="text-lg font-semibold">Elite</h2>
    </div>

    {/* Account Minimum */}
    <p className="text-xs text-white/50">
      Minimum Account Balance: <span className="text-white/70">$30,000</span>
    </p>

    {/* Separator */}
    <div className="h-px bg-white/10 w-full" />

    {/* Price */}
    <div>
      <span className="text-4xl font-semibold">$139.99</span>
      <span className="ml-1 text-sm text-white/40">/month</span>
    </div>

    {/* Features */}
    <ul className="space-y-3 text-sm">

      <li className="flex items-start gap-2 text-white/70">
        <CheckIcon />
        (4) Auto‑Trade Bots
      </li>

      <li className="flex items-start gap-2 text-white/70">
        <CheckIcon />
        Custom risk controls
      </li>

      <li className="flex items-start gap-2 text-white/70">
        <CheckIcon />
        Full trade history
      </li>

      <li className="flex items-start gap-2 text-white/70">
        <CheckIcon />
        Priority 1‑on‑1 personal support
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
        Performance fee reporting
      </li>

      <li className="flex items-start gap-2 text-white/70">
        <CheckIcon />
        20% performance fee
      </li>

    </ul>

<button
  onClick={() => handleCheckout("price_1TYXk8KLveVAZ0tjIw2sznnv")}
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
  {loading ? "Redirecting..." : "Get Elite"}
</button>


  </div>























{/* ELITE TEST PLAN (ADMIN ONLY) */}
<div className="
  flex flex-col
  rounded-2xl
  border border-yellow-400/20
  bg-yellow-400/5
  p-8
  shadow-[0_0_25px_rgba(255,200,0,0.25)]
  space-y-6
">

  {/* Title + Icon */}
  <div className="flex items-center gap-3">
    <PlanIcon />
    <h2 className="text-lg font-semibold text-yellow-300">Elite (Test Mode)</h2>
  </div>

  {/* Account Minimum */}
  <p className="text-xs text-yellow-200/60">
    Minimum Account Balance: <span className="text-yellow-200/80">$30,000</span>
  </p>

  {/* Separator */}
  <div className="h-px bg-yellow-300/20 w-full" />

  {/* Price */}
  <div>
    <span className="text-4xl font-semibold text-yellow-300">$0</span>
    <span className="ml-1 text-sm text-yellow-200/60">/month</span>
  </div>

  {/* Features */}
  <ul className="space-y-3 text-sm text-yellow-200/80">

    <li className="flex items-start gap-2">
      <CheckIcon />
      (4) Auto‑Trade Bots
    </li>

    <li className="flex items-start gap-2">
      <CheckIcon />
      Custom risk controls
    </li>

    <li className="flex items-start gap-2">
      <CheckIcon />
      Full trade history
    </li>

    <li className="flex items-start gap-2">
      <CheckIcon />
      Priority 1‑on‑1 personal support
    </li>

    <li className="flex items-start gap-2">
      <CheckIcon />
      Email notifications
    </li>

    <li className="flex items-start gap-2">
      <CheckIcon />
      Scheduled Zoom calls
    </li>

    <li className="flex items-start gap-2">
      <CheckIcon />
      Performance fee reporting
    </li>

    <li className="flex items-start gap-2">
      <CheckIcon />
      20% performance fee
    </li>

  </ul>

<button
  onClick={() => handleCheckout("price_1TYbLOKLveVAZ0tjHkfZb2vf")}
  disabled={loading}
  className="
    mt-auto
    rounded-[6px]
    px-6 py-3
    text-sm font-semibold
    bg-yellow-500/20
    text-yellow-200
    border border-yellow-500/40
    shadow-[0_0_18px_rgba(255,200,0,0.35)]
    hover:bg-yellow-500/30
    hover:shadow-[0_0_28px_rgba(255,200,0,0.55)]
    transition
  "
>
  {loading ? "Redirecting..." : "Get Elite (Test $0)"}
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
