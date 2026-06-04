"use client"

import { useEffect } from "react"
import Link from "next/link"
import { ShieldCheck, LineChart, Zap } from "lucide-react"
import GTCard from "@/components/ui/GTCard"
import { usePathname } from "next/navigation"



export default function PublicLandingPage() {




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

      <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-16 space-y-16">



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
        <section className="grid gap-10 md:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)] md:items-center">

          <div className="space-y-6">

            <p className="text-xs font-medium text-emerald-300 tracking-wide bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full inline-flex items-center">
              Built for intraday traders who already have an edge.
            </p>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white/90 drop-shadow-[0_0_10px_rgba(0,255,180,0.25)]">
              Copy our best trades.
              <span className="block bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                Keep your own risk rules.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#4da3ff] font-medium drop-shadow-[0_0_6px_rgba(0,120,255,0.45)]">
              Bot‑powered auto‑trading connected directly to your own brokerage account.
            </p>

            <p className="text-sm sm:text-base text-white/70 max-w-xl">
              Our Trading Bot connects to your{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent font-semibold drop-shadow-[0_0_8px_rgba(0,255,180,0.35)]">
                own broker account,
              </span>{" "}
              mirrors our BEST master strategy in real time, and enforces your risk limits — so you can scale without the complexity.
            </p>

            <div className="flex flex-wrap items-center gap-4">

              <Link href="/pricing">
                <div
                  className="
                    bg-[rgb(3,82,65)]
                    text-[rgb(225,254,234)]
                    border-[5px] border-[rgb(3,82,65)]
                    rounded-[6px]
                    p-[15px]
                    shadow-[0_0_34px_rgba(3,82,65,0.55)]
                    text-sm font-semibold
                    cursor-pointer
                    transition duration-150
                    hover:bg-[rgb(5,100,80)]
                    hover:shadow-[0_0_44px_rgba(3,82,65,0.8)]
                    hover:-translate-y-[1px]
                    active:translate-y-0
                  "
                >
                  View pricing & start
                </div>
              </Link>

              <Link href="/how-it-works">
                <div className="rounded-[6px] border border-slate-800/40 px-6 py-2.5 text-sm font-medium text-white/70 hover:bg-white/5 cursor-pointer">
                  See how it works
                </div>
              </Link>

            </div>

            <p className="text-xs text-white/40">
              No lock-in. Cancel anytime. Not investment advice.
            </p>

          </div>

        </section>




        {/* PAIN / TRAP / SOLUTION CARDS */}
        <section className="grid gap-6 md:grid-cols-3">

          {/* PAIN */}
          <div className="relative rounded-xl p-[2px] bg-gradient-to-br from-rose-600/40 via-red-500/40 to-rose-700/40 shadow-[0_0_25px_rgba(0,0,0,0.5)]">
            <div className="rounded-xl bg-[#0b0b12] p-4 space-y-3">
              <p className="text-sm font-semibold text-rose-400 text-center">
                Day trading ALONE does NOT work
              </p>
              <div className="rounded-lg overflow-hidden border border-slate-800/40">
                <img src="/images/gotrade-pain.png" className="w-full h-auto" />
              </div>
            </div>
          </div>

          {/* TRAP */}
          <div className="relative rounded-xl p-[2px] bg-gradient-to-br from-yellow-600/40 via-amber-500/40 to-yellow-700/40 shadow-[0_0_25px_rgba(0,0,0,0.5)]">
            <div className="rounded-xl bg-[#0b0b12] p-4 space-y-3">
              <p className="text-sm font-semibold text-amber-300 text-center">
                The trap of slow long‑term returns
              </p>
              <div className="rounded-lg overflow-hidden border border-slate-800/40">
                <img src="/images/gotrade-trap.png" className="w-full h-auto" />
              </div>
            </div>
          </div>

          {/* SOLUTION */}
          <div className="relative rounded-xl p-[2px] bg-gradient-to-br from-emerald-500/40 via-teal-400/40 to-emerald-600/40 shadow-[0_0_25px_rgba(0,0,0,0.5)]">
            <div className="rounded-xl bg-[#0b0b12] p-4 space-y-3">
              <p className="text-sm font-semibold text-emerald-300 text-center">
                Our balanced Auto‑Trading solution
              </p>
              <div className="rounded-lg overflow-hidden border border-slate-800/40">
                <img src="/images/gotrade-solution.png" className="w-full h-auto" />
              </div>
            </div>
          </div>

        </section>




        {/* LIVE SNAPSHOT CARD */}
        <GTCard>
          <div className="space-y-4">

            <p className="text-xs font-medium text-emerald-300 tracking-wide">
              Today’s session snapshot
            </p>

            <p className="text-xs text-white/50">
              Our premium master strategy at work — LIVE account
            </p>

            <div className="grid grid-cols-3 gap-3 text-xs">

              <div className="rounded-lg bg-[#0f0f17] border border-slate-800/40 p-3 text-center">
                <p className="text-white/50">P&L (realized)</p>
                <p className="mt-1 text-sm font-semibold text-emerald-400">+$482.13</p>
              </div>

              <div className="rounded-lg bg-[#0f0f17] border border-slate-800/40 p-3 text-center">
                <p className="text-white/50">Win rate</p>
                <p className="mt-1 text-sm font-semibold text-white">63%</p>
              </div>

              <div className="rounded-lg bg-[#0f0f17] border border-slate-800/40 p-3 text-center">
                <p className="text-white/50">Max drawdown</p>
                <p className="mt-1 text-sm font-semibold text-amber-300">-1.9%</p>
              </div>

            </div>

            <div className="rounded-lg bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-3 text-xs text-white/70 border border-emerald-500/20">
              Our Auto‑Trader enforces your max daily loss, position size, and allocation per trade — automatically.
            </div>

          </div>
        </GTCard>




        {/* 3‑STEP SECTION */}
        <section className="space-y-6">

          <div className="flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-emerald-400" strokeWidth="1.6" />
            <h2 className="text-2xl font-semibold tracking-tight text-white/80">
              How it all works — in 3 simple steps
            </h2>
          </div>

          <p className="text-white/50 text-sm max-w-md">
            No charts to study. No signals to chase. Just a clean, hands‑free experience.
          </p>

          <div className="grid md:grid-cols-3 gap-4">

            <GTCard>
              <div className="space-y-2">
                <LineChart className="w-6 h-6 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white/70">Step 1 — We carefully enter trades</h3>
                <p className="text-sm text-white/60">
                  When the market opens, our strategy takes the trades — no guessing, no hesitation.
                </p>
              </div>
            </GTCard>

            <GTCard>
              <div className="space-y-2">
                <Zap className="w-6 h-6 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white/70">Step 2 — Your account copies us</h3>
                <p className="text-sm text-white/60">
                  Our bot mirrors every buy and sell directly into your own brokerage account.
                </p>
              </div>
            </GTCard>

            <GTCard>
              <div className="space-y-2">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white/70">Step 3 — You relax on true autopilot</h3>
                <p className="text-sm text-white/60">
                  Watch everything from the dashboard while our trading bot handles execution for you.
                </p>
              </div>
            </GTCard>

          </div>

        </section>




        {/* CTA SECTION */}
        <section className="space-y-4 text-center">

          <h2 className="text-2xl font-semibold tracking-tight text-white/80">
            Ready to scale your account with us — safely?
          </h2>

          <p className="text-white/50 text-sm max-w-md mx-auto">
            We give you the execution layer your strategy deserves — without you EVER having to make a BUY / SELL decision.
          </p>

          <Link href="/pricing">
            <div
              className="
                inline-block
                bg-[rgb(3,82,65)]
                text-[rgb(225,254,234)]
                border-[5px] border-[rgb(3,82,65)]
                rounded-[6px]
                p-[15px]
                shadow-[0_0_34px_rgba(3,82,65,0.55)]
                text-sm font-semibold
                cursor-pointer
                transition duration-150
                hover:bg-[rgb(5,100,80)]
                hover:shadow-[0_0_44px_rgba(3,82,65,0.8)]
                hover:-translate-y-[1px]
                active:translate-y-0
              "
            >
              Get started
            </div>
          </Link>

        </section>




        {/* FOOTER */}
        <footer className="border-t border-slate-800/40 pt-6 text-xs text-white/40">
          © {new Date().getFullYear()} Trading involves risk, including the potential loss of capital.
          Automated trading systems do not guarantee profits or prevent losses.
          Past performance is not indicative of future results.
          Nothing on this site should be interpreted as financial advice.
        </footer>



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

