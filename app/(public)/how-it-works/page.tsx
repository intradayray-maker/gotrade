"use client"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"

// ⭐ Universal card style
function BillingCard({
  children,
  className = ""
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`
        rounded-xl
        border-[2px]
        border border-emerald-500/30
        bg-transparent
        p-6
        h-full
        flex flex-col
        ${className}
      `}
    >
      {children}
    </div>
  )
}

export default function HowItWorksPage() {

  const pathname = usePathname()

  // BACK TO TOP VISIBILITY HANDLER
  useEffect(() => {
    const btn = document.getElementById("backToTop")
    if (!btn) return

    const handleScroll = () => {
      btn.style.display = window.scrollY > 300 ? "block" : "none"
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main className="min-h-screen bg-[#050509] text-white">

      <div className="mx-auto max-w-6xl px-6 py-20 space-y-24">

 {/* HEADER */}
<header className="flex items-center justify-between py-2">

  <div className="flex items-center gap-3"></div>

  <nav className="flex items-center gap-6 text-sm text-white/60">

    {/* HOME ICON WITH HOVER */}
    <Link
      href="/"
      className="group flex items-center transition relative"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`
          h-4 w-4 transition
          ${pathname === "/" ? "text-emerald-400 drop-shadow-[0_0_6px_rgba(0,255,180,0.6)]" : "text-white/60"}
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

    <Link href="/how-it-works" className="hover:text-white transition">
      How it works
    </Link>

    <Link href="/pricing" className="hover:text-white transition">
      Pricing
    </Link>

    <Link href="/about" className="hover:text-white transition">
      About
    </Link>

    {/* SIGN UP BUTTON */}
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

    {/* LOGIN BUTTON (NEW) */}
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


        {/* HERO SECTION */}
        <section className="grid md:grid-cols-2 gap-12 items-center">

          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight text-white/90">
              How it works — simple, structured, and built for real traders.
            </h1>

            <p className="text-white/60 text-base max-w-md">
              You keep your broker, your capital, and full control.  
              We deliver real‑time Forex & Crypto signals built from our premium master strategy — so you can execute with confidence and consistency.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800/40 bg-[#0b0b12] h-64 flex items-center justify-center text-white/30 text-sm">
            <div className="rounded-lg overflow-hidden border border-slate-800/40">
              <img src="/images/1.png" className="w-full h-auto" />
            </div>
          </div>

        </section>

        {/* 3‑STEP CARDS */}
        <section className="space-y-10">

          <h2 className="text-2xl font-semibold tracking-tight text-white/80">
            Your day with GoTrade — in 3 steps
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            {/* STEP 1 */}
            <BillingCard>
              <img
                src="/images/2.png"
                className="w-full h-auto rounded-lg border border-emerald-500/20"
              />

              <h3 className="text-sm font-semibold text-white/80 tracking-wide mt-4">
                Step 1 — We take the trades with precision
              </h3>

              <p className="text-sm text-white/60">
                Our master strategy executes in real time — identifying high‑probability setups across Forex & Crypto.
              </p>
            </BillingCard>

            {/* STEP 2 */}
            <BillingCard>
              <img
                src="/images/3.png"
                className="w-full h-auto rounded-lg border border-emerald-500/20"
              />

              <h3 className="text-sm font-semibold text-white/80 tracking-wide mt-4">
                Step 2 — You receive the signals instantly
              </h3>

              <p className="text-sm text-white/60">
                Entries, stops, and take‑profits delivered the moment they trigger — no noise, no delay.
              </p>
            </BillingCard>

            {/* STEP 3 */}
            <BillingCard>
              <img
                src="/images/4.png"
                className="w-full h-auto rounded-lg border border-emerald-500/20"
              />

              <h3 className="text-sm font-semibold text-white/80 tracking-wide mt-4">
                Step 3 — You execute with control
              </h3>

              <p className="text-sm text-white/60">
                You choose your size, manage your risk, and execute inside your own brokerage account — with structure guiding every move.
              </p>
            </BillingCard>

          </div>
        </section>

        {/* ALTERNATING IMAGE + TEXT SECTIONS */}
        <section className="space-y-24">

          {/* BLOCK 1 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">

            <div className="rounded-xl border border-slate-800/40 bg-[#0b0b12] h-56 flex items-center justify-center text-white/30 text-sm">
              <div className="rounded-lg overflow-hidden border border-slate-800/40">
                <img src="/images/5_2.png" className="w-full h-auto" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white/80">
                Your broker. Your capital. Your rules.
              </h3>
              <p className="text-white/60 text-sm max-w-md">
                You stay in full control. Adjust position size, manage allocation, or sit out a session — your account stays in your hands at all times.
              </p>
            </div>

          </div>

          {/* BLOCK 2 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white/80">
                Built for clarity, not confusion.
              </h3>
              <p className="text-white/60 text-sm max-w-md">
                Your dashboard shows signals, performance, and session history in one clean, simple view — no clutter, no distractions.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800/40 bg-[#0b0b12] h-56 flex items-center justify-center text-white/30 text-sm">
              <div className="rounded-lg overflow-hidden border border-slate-800/40">
                <img src="/images/6_2.png" className="w-full h-auto" />
              </div>
            </div>

          </div>

        </section>

        {/* WHY THIS PLAN SECTION */}
        <section className="grid md:grid-cols-2 gap-12 items-center">

          <div className="space-y-4">

            <h3 className="text-xl font-semibold text-white/80">
              Why traders choose GoTrade.
            </h3>

            <div className="text-white/60 text-sm max-w-md space-y-3">

              <p>
                You get the same high‑precision signals we use in our own live accounts — without needing to build or maintain a strategy yourself.
              </p>

              <p>
                No bots. No automation. No brokerage connections.  
                Just clean, real‑time signals you can execute with confidence.
              </p>

              <p>
                Transparent. Structured. Built for traders who value precision and control.
              </p>

            </div>
          </div>

        </section>

        {/* FOOTER */}
        <p className="font-medium text-white/70"></p>
        <p className="mt-1"></p>

      </div> {/* closes wrapper */}

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
  )
}
