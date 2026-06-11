export const dynamic = "force-dynamic"
export const runtime = "nodejs"

import { createClient } from "@supabase/supabase-js"
import Link from "next/link"

async function getCount() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { count } = await supabase
    .from("gotrade_preorders")
    .select("*", { count: "exact", head: true })

  return count || 0
}

export default async function GoTradeLanding() {
  const count = await getCount()

  return (
    <main className="min-h-screen bg-[#050509] text-white">

      <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-20 space-y-24">

 {/* HERO */}
<section className="text-center space-y-6">

  <p className="
    text-xs font-medium text-emerald-300 tracking-wide
    bg-emerald-500/10 border border-emerald-500/30
    px-3 py-1 rounded-full inline-flex items-center
  ">
    Early Access — Limited Spots
  </p>

  <h1 className="
    text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight
    text-white/90 drop-shadow-[0_0_10px_rgba(0,255,180,0.25)]
  ">
    GoTrade — Crypto Bot
    <span className="
      block bg-gradient-to-r from-emerald-400 to-teal-300
      bg-clip-text text-transparent
    ">
      Private Access
    </span>
  </h1>

  <p className="text-sm sm:text-base text-[#4da3ff] font-medium drop-shadow-[0_0_6px_rgba(0,120,255,0.45)]">
    Mirror our master strategy. Keep your own risk rules. Fully automated.
  </p>

  {/* EXECUTION DESCRIPTION */}
  <p className="text-sm sm:text-base text-white/70 max-w-xl mx-auto">
    GoTrade connects directly to your broker account and executes trades
    with precision — utilizing your max daily loss, position size, and allocation.
  </p>

{/* TRUST BADGE — CUSTODY STATEMENT */}
<div className="
  block w-fit max-w-xs mx-auto
  px-4 py-2 mt-2 mb-5
  rounded-lg
  text-emerald-300 text-sm font-medium
  border border-emerald-500/30
  bg-emerald-500/5
  shadow-[0_0_12px_rgba(16,185,129,0.25)]
  text-center
">
  We never take custody of your assets — funds stay in your own broker account.
</div>


{/* CTA BUTTON */}
<Link href="/pre-order/preorder" className="block mb-3">
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
    "
  >
    Join the Pre‑Order List
  </div>
</Link>


  {/* FREE MESSAGE */}
  <p className="text-center text-xs text-white/40 mt-2">
    Free to join — no payment required.
  </p>

  {/* COUNT BADGE */}
  <div className="
    inline-flex items-center
    px-4 py-2 mt-2 mb-2
    rounded-lg
    text-neutral-300 text-sm
    border border-emerald-500/30
    bg-emerald-500/5
    shadow-[0_0_12px_rgba(16,185,129,0.25)]
  ">
    <span className="
      inline-flex items-center justify-center
      w-5 h-5 mr-2
      rounded-full
      border border-emerald-400/40
      text-emerald-300 text-xs font-semibold
    ">
      {count}
    </span>
    Trader{count === 1 ? "" : "s"} Joined — Pre‑Orders Close June 15th 📅
  </div>

  {/* VIDEO SECTION */}
  <div className="mt-10 max-w-3xl mx-auto">
    <div className="
      rounded-xl border border-slate-800/40 bg-[#0b0b12]
      shadow-[0_0_25px_rgba(0,0,0,0.5)]
      p-6
    ">
      <div className="
        aspect-video rounded-lg overflow-hidden
        bg-neutral-900 border border-slate-800/40
        flex items-center justify-center
      ">
        <span className="text-neutral-500 text-sm">
          [Video Placeholder — Chris Talking Head]
        </span>
      </div>
    </div>
  </div>

</section>


        {/* FEATURE STRIP */}
        <section className="grid gap-6 md:grid-cols-3 -mt-10">

          <div className="relative rounded-xl p-[2px] bg-gradient-to-br from-emerald-600/40 via-teal-500/40 to-emerald-700/40 shadow-[0_0_25px_rgba(0,0,0,0.5)]">
            <div className="rounded-xl bg-[#0b0b12] p-6 space-y-3">
              <p className="text-lg font-semibold text-emerald-300">⚡ Automated Execution</p>
              <p className="text-white/60 text-sm">
                Trades mirror our master strategy instantly — bypassing hesitation and emotion.
              </p>
            </div>
          </div>

          <div className="relative rounded-xl p-[2px] bg-gradient-to-br from-blue-600/40 via-sky-500/40 to-blue-700/40 shadow-[0_0_25px_rgba(0,0,0,0.5)]">
            <div className="rounded-xl bg-[#0b0b12] p-6 space-y-3">
              <p className="text-lg font-semibold text-blue-300">📈 Real Strategy</p>
              <p className="text-white/60 text-sm">
                Powered by the same system used by pro traders — combined with automation.
              </p>
            </div>
          </div>

          <div className="relative rounded-xl p-[2px] bg-gradient-to-br from-yellow-600/40 via-amber-500/40 to-yellow-700/40 shadow-[0_0_25px_rgba(0,0,0,0.5)]">
            <div className="rounded-xl bg-[#0b0b12] p-6 space-y-3">
              <p className="text-lg font-semibold text-amber-300">🔒 Risk‑Controlled</p>
              <p className="text-white/60 text-sm">
                Utilizing your max daily loss, position size, allocation per trade, along with our protection systems in place.
              </p>
            </div>
          </div>

        </section>

        {/* HISTORICAL PERFORMANCE */}
        <section className="text-center space-y-4 -mt-10">

          <h2 className="text-2xl font-semibold text-white/90">
            Historical Performance
          </h2>

          <p className="text-white/60 text-sm">
            Our master strategy has historically produced <span className="text-emerald-300 font-semibold">13 – 18% monthly ROI</span>,
            depending on market conditions and risk settings.
          </p>

          <p className="text-xs text-white/40">
            Past performance does not guarantee future results. Trading involves risk.
          </p>

        </section>

        {/* CTA */}
        <section className="text-center space-y-4 -mt-10">

          <h2 className="text-2xl font-semibold tracking-tight text-white/80">
            Ready to automate your trading — safely?
          </h2>

          <p className="text-white/50 text-sm max-w-md mx-auto">
            GoTrade gives you the execution layer your strategy deserves.
          </p>

          <Link href="/pre-order/preorder">
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
              "
            >
              Secure Your Free Trial
            </div>
          </Link>

        </section>

      </div>

    </main>
  )
}
