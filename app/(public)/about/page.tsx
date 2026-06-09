"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AboutPage() {
  const pathname = usePathname();

  useEffect(() => {
    const btn = document.getElementById("backToTop");
    if (!btn) return;

    const handleScroll = () => {
      btn.style.display = window.scrollY > 300 ? "block" : "none";
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
              Built by traders who were tired of guessing, chasing, and overcomplicating the process.
            </h1>

            <p className="text-white/60 text-base max-w-md">
              We built this platform because traders deserve structure — not noise.  
              No hype. No “secret indicators.” Just clean, high‑quality signals and a system designed for clarity and consistency.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800/40 bg-[#0b0b12] h-64 flex items-center justify-center">
            <div className="rounded-lg overflow-hidden border border-slate-800/40">
              <img src="/images/9.png" className="w-full h-auto" />
            </div>
          </div>

        </section>

        {/* WHO WE BUILT THIS FOR */}
        <section className="grid md:grid-cols-2 gap-12 items-center">

          <div className="rounded-xl border border-slate-800/40 bg-[#0b0b12] h-56 flex items-center justify-center">
            <div className="rounded-lg overflow-hidden border border-slate-800/40">
              <img src="/images/10.png" className="w-full h-auto" />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-white/80">
              Built for traders at every level.
            </h2>

            <p className="text-white/60 text-sm max-w-md">
              Whether you're new and want a structured path, or experienced and tired of inconsistent results — this platform gives you a clear, repeatable way to approach the market with confidence.
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
              Traders who want structure, clarity, and high‑quality signals — without giving up control of their account.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Philosophy
            </p>
            <p className="text-slate-200">
              Your capital stays in your hands.  
              Your risk. Your execution.  
              We provide the precision — you stay in control.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Stack
            </p>
            <p className="text-slate-200">
              Next.js, Supabase, Stripe, and a custom signal engine designed for speed, reliability, and real‑time delivery.
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
              Most trading tools overwhelm you with indicators, dashboards, and noise.  
              We wanted something different — something that cuts through the clutter and gives traders exactly what they need.
            </p>

            <p className="text-white/60 text-sm max-w-md">
              So we built a signal‑driven system that delivers clear entries, exits, and structure.  
              No hype. No confusion. Just precision you can act on.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800/40 bg-[#0b0b12] h-56 flex items-center justify-center">
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
