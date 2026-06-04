"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AboutPage() {
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
              Built by traders who were tired of duct‑taping tools together.
            </h1>

            <p className="text-white/60 text-base max-w-md">
              We created this platform because active investors deserve automation
              that feels clean, reliable, and built for real‑world execution —
              not another “signal service” or hype‑driven promise.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800/40 bg-[#0b0b12] h-64 flex items-center justify-center text-white/30 text-sm">

<div className="rounded-lg overflow-hidden border border-slate-800/40">
<img src="/images/9.png" className="w-full h-auto" /></div>


          </div>

        </section>





        {/* WHO WE BUILT THIS FOR */}
        <section className="grid md:grid-cols-2 gap-12 items-center">

          <div className="rounded-xl border border-slate-800/40 bg-[#0b0b12] h-56 flex items-center justify-center text-white/30 text-sm">
<div className="rounded-lg overflow-hidden border border-slate-800/40">
<img src="/images/10.png" className="w-full h-auto" /></div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-white/80">
              No technical skills required.
            </h2>

            <p className="text-white/60 text-sm max-w-md">
Whether you're a day trader who doesn’t want to sit through long, boring trades, tired of losing money in the market, or simply someone looking to invest in your future — this platform was built for you.
            </p>
          </div>

        </section>





        {/* 3 INFO CARDS */}
        <section className="grid md:grid-cols-3 gap-6">

          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Focus
            </p>
            <p className="text-slate-200">
              Active equity traders who want automation without giving up control.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Philosophy
            </p>
            <p className="text-slate-200">
              Your rules first. Your risk limits enforced automatically.  
              You stay in control of capital at all times.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Stack
            </p>
            <p className="text-slate-200">
              Next.js, Supabase, Stripe, Alpaca, and a custom trading engine
              designed for low‑latency execution.
            </p>
          </div>

        </section>





        {/* WHY WE EXIST */}
        <section className="grid md:grid-cols-2 gap-12 items-center">

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-white/80">
              Why we exist
            </h2>

            <p className="text-white/60 text-sm max-w-md">
              Most trading tools are either too simple, too slow, or too
              complicated. We wanted something that felt like a real execution
              layer — fast, reliable, and built for traders who care about
              precision.
            </p>

            <p className="text-white/60 text-sm max-w-md">
              So we built an automation engine that mirrors trades instantly,
              respects your risk settings, and removes the repetitive work that
              drains your focus.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800/40 bg-[#0b0b12] h-56 flex items-center justify-center text-white/30 text-sm">
          
<div className="rounded-lg overflow-hidden border border-slate-800/40">
<img src="/images/11.png" className="w-full h-auto" />

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
  );
}
