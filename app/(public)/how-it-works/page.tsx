"use client"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function HowItWorksPage() {

  const pathname = usePathname()

  // BACK TO TOP VISIBILITY HANDLER
  useEffect(() => {
    const btn = document.getElementById("backToTop")
    if (!btn) return

    const handleScroll = () => {
      if (window.scrollY > 300) {
        btn.style.display = "block"
      } else {
        btn.style.display = "none"
      }
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
              How it works — simple, hands‑free, and built for real investors.
            </h1>

            <p className="text-white/60 text-base max-w-md">
              You keep your broker, your capital, and full control.  
              Our automation handles the execution so you can focus on decisions — not button‑clicking.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800/40 bg-[#0b0b12] h-64 flex items-center justify-center text-white/30 text-sm">

<div className="rounded-lg overflow-hidden border border-slate-800/40">
<img src="/images/1.png" className="w-full h-auto" /></div>

          </div>

        </section>





        {/* 3‑STEP VISUAL CARDS */}
        <section className="space-y-10">

          <h2 className="text-2xl font-semibold tracking-tight text-white/80">
            Your day with automated trading — in 3 steps
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            {/* STEP 1 */}
            <div className="relative rounded-xl p-[2px] bg-gradient-to-br from-emerald-500/40 via-teal-400/40 to-emerald-600/40 shadow-[0_0_25px_rgba(0,0,0,0.5)]">
              <div className="rounded-xl bg-[#0b0b12] p-6 space-y-4">
                <div className="rounded-lg overflow-hidden border border-slate-800/40 h-32 flex items-center justify-center text-white/30 text-xs">

<div className="rounded-lg overflow-hidden border border-slate-800/40">
<img src="/images/2.png" className="w-full h-auto" /></div>

                </div>
                <h3 className="text-sm font-semibold text-white/80 tracking-wide">
                  Step 1 — We enter trades with precision
                </h3>
                <p className="text-sm text-white/60">
                  When the market opens, our strategy takes the trades — no guessing, no hesitation.
                </p>
              </div>
            </div>

            {/* STEP 2 */}
            <div className="relative rounded-xl p-[2px] bg-gradient-to-br from-emerald-500/40 via-teal-400/40 to-emerald-600/40 shadow-[0_0_25px_rgba(0,0,0,0.5)]">
              <div className="rounded-xl bg-[#0b0b12] p-6 space-y-4">
                <div className="rounded-lg overflow-hidden border border-slate-800/40 h-32 flex items-center justify-center text-white/30 text-xs">

<div className="rounded-lg overflow-hidden border border-slate-800/40">
<img src="/images/3.png" className="w-full h-auto" /></div>

                </div>
                <h3 className="text-sm font-semibold text-white/80 tracking-wide">
                  Step 2 — Your account copies automatically
                </h3>
                <p className="text-sm text-white/60">
                  Every buy and sell is mirrored into your own brokerage account — instantly.
                </p>
              </div>
            </div>

            {/* STEP 3 */}
            <div className="relative rounded-xl p-[2px] bg-gradient-to-br from-emerald-500/40 via-teal-400/40 to-emerald-600/40 shadow-[0_0_25px_rgba(0,0,0,0.5)]">
              <div className="rounded-xl bg-[#0b0b12] p-6 space-y-4">
                <div className="rounded-lg overflow-hidden border border-slate-800/40 h-32 flex items-center justify-center text-white/30 text-xs">

<div className="rounded-lg overflow-hidden border border-slate-800/40">
<img src="/images/4.png" className="w-full h-auto" /></div>


                </div>
                <h3 className="text-sm font-semibold text-white/80 tracking-wide">
                  Step 3 — You relax on true autopilot
                </h3>
                <p className="text-sm text-white/60">
                  Watch everything from your dashboard while automation handles the execution.
                </p>
              </div>
            </div>

          </div>
        </section>





        {/* ALTERNATING IMAGE + TEXT SECTIONS */}
        <section className="space-y-24">

          {/* BLOCK 1 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">

            <div className="rounded-xl border border-slate-800/40 bg-[#0b0b12] h-56 flex items-center justify-center text-white/30 text-sm">


<div className="rounded-lg overflow-hidden border border-slate-800/40">
<img src="/images/5.png" className="w-full h-auto" /></div>

            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white/80">
                Your broker. Your capital. Your rules.
              </h3>
              <p className="text-white/60 text-sm max-w-md">
                You stay in full control. Adjust allocation, pause automation, or disconnect anytime.
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
                Your dashboard shows trades, performance, and risk settings in one clean view.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800/40 bg-[#0b0b12] h-56 flex items-center justify-center text-white/30 text-sm">


<div className="rounded-lg overflow-hidden border border-slate-800/40">
<img src="/images/6.png" className="w-full h-auto" /></div>

            </div>

          </div>

        </section>

        {/* WHY THIS PLAN SECTION */}
        <section className="grid md:grid-cols-2 gap-12 items-center">


<div className="space-y-4">

<h3 className="text-xl font-semibold text-white/80">
Your money working for you.

</h3>

<div className="text-white/60 text-sm max-w-md space-y-3">

  <p>
    Your subscription unlocks the full automation engine — execution, risk controls, and performance tracking.
  </p>

  <p>
    When the system generates profits, a 20% performance fee keeps our incentives aligned.
  </p>

  <p>
    Transparent. Scalable. Built for traders who value precision.
  </p>

</div>
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
  )
}
