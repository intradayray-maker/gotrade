"use client"

import { useState } from "react"
import GTSlider from "@/app/components/ui/GTSlider"

export default function PreorderPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [capital, setCapital] = useState(5000)

  async function handleSubmit(e: any) {
    e.preventDefault()
    setLoading(true)

    try {
      const form = e.target as HTMLFormElement
      const fd = new FormData(form)
      const name = (fd.get("name") || "").toString()
      const email = (fd.get("email") || "").toString()

      const res = await fetch("/api/gotrade/preorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, capital }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Failed to submit")

      setSuccess(true)
      e.target.reset()
      setCapital(5000)
    } catch (err: any) {
      console.error("Preorder submit error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#050509] text-white px-4 py-20">

      <div className="max-w-md mx-auto space-y-8">

        {/* HEADER */}
        <h1 className="
          text-4xl font-bold text-center
          text-white/90 drop-shadow-[0_0_10px_rgba(0,255,180,0.25)]
        ">
          GoTrade Pre‑Order
        </h1>

        <p className="text-center text-white/60 text-sm">
          Join the early access list and secure your spot before launch.
        </p>

        {/* SUCCESS MESSAGE + COUPON */}
        {success && (
          <div className="
            p-4 rounded-lg text-sm font-medium
            bg-emerald-600/20 border border-emerald-500/40
            text-emerald-300 shadow-[0_0_20px_rgba(0,255,180,0.25)]
            space-y-3
          ">
            <p>You’re on the list — here’s your pre‑launch discount code:</p>

            <div className="
              text-center text-xl font-bold tracking-wider
              bg-black/30 p-3 rounded-lg border border-emerald-500/40
            ">
              PRELAUNCH10
            </div>

            <p className="text-xs text-emerald-200/70">
              Copy and save this code. You’ll use it on launch day to unlock your discount.
            </p>
          </div>
        )}

        {/* FORM CARD */}
        {!success && (
          <div className="
            rounded-xl p-[2px]
            bg-gradient-to-br from-emerald-600/40 via-teal-500/40 to-emerald-700/40
            shadow-[0_0_25px_rgba(0,0,0,0.5)]
          ">
            <div className="rounded-xl bg-[#0b0b12] p-6 space-y-8">

              <form onSubmit={handleSubmit} className="space-y-8">

                {/* NAME */}
                <div className="space-y-2">
                  <label className="block text-[15px] text-white/60">Your Name</label>
                  <input
                    name="name"
                    placeholder="First & Last Name"
                    className="
                      w-full p-3 rounded-lg bg-[#0f0f17]
                      border border-slate-800/40 text-white/80
                      placeholder-white/10
                      focus:outline-none focus:border-emerald-400/40
                      transition
                    "
                  />
                </div>

                {/* EMAIL */}
                <div className="space-y-2">
                  <label className="block text-[15px] text-white/60">Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="
                      w-full p-3 rounded-lg bg-[#0f0f17]
                      border border-slate-800/40 text-white/80
                      placeholder-white/10
                      focus:outline-none focus:border-emerald-400/40
                      transition
                    "
                  />
                </div>

                {/* CAPITAL SLIDER */}
                <div className="space-y-2">
                  <label className="block text-[15px] text-white/60">Trading Capital</label>

                  <div className="
                    rounded-lg border border-emerald-400/40 bg-black/20 p-3
                    shadow-[0_0_5px_rgba(16,185,129,0.35)]
                  ">
                    <GTSlider
                      title="Whatever you are comfortable with 🙂"
                      value={capital}
                      min={500}
                      max={10000}
                      step={500}
                      onChange={setCapital}
                      dollars
                    />
                  </div>
                </div>

                {/* BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="
                    w-full text-center
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
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  {loading ? "Submitting..." : "Join Pre‑Order"}
                </button>

              </form>

            </div>
          </div>
        )}

        <p className="text-center text-xs text-white/40">
          No payment required. Cancel anytime. Not financial advice.
        </p>

      </div>

    </main>
  )
}
