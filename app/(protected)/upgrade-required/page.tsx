"use client";

export default function UpgradeRequiredPage() {
  return (
    <main className="min-h-screen bg-[#050509] text-white flex items-center justify-center px-4">

      <div className="w-full max-w-2xl bg-[#0A0A0F] border border-white/10 rounded-xl p-10 shadow-[0_0_40px_rgba(0,255,180,0.08)] space-y-8 text-center">

        <h1 className="text-3xl font-bold tracking-tight">
          Upgrade Required
        </h1>

        <p className="text-white/60 text-sm leading-relaxed max-w-md mx-auto">
          Your account is active, but you don’t have a subscription yet.
          Choose a plan to unlock real‑time signals, AI tools, and your full GoTrade dashboard.
        </p>

        <div className="pt-4">
          <a
            href="/pricing"
            className="
              inline-block
              px-8
              py-3
              rounded-lg
              font-semibold
              bg-emerald-400
              text-black
              hover:bg-emerald-300
              transition
              shadow-[0_0_20px_rgba(0,255,180,0.35)]
            "
          >
            View Plans
          </a>
        </div>

        <p className="text-white/40 text-xs">
          Already subscribed? Try refreshing your dashboard.
        </p>

      </div>

    </main>
  );
}
