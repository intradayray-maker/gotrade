export default function CardPreviewSandbox() {
  return (
    <div className="max-w-6xl mx-auto py-20 space-y-10">
      <h1 className="text-3xl font-bold text-white text-center mb-10">
        Card Style Preview Sandbox
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* A — Glass‑Matte */}
        <div className="rounded-xl border border-white/10 bg-[#0d0d14]/80 backdrop-blur-sm shadow-[0_0_20px_rgba(0,0,0,0.3)] p-6">
          <h2 className="text-white/80 font-semibold mb-2">A — Glass‑Matte</h2>
          <p className="text-white/50 text-sm mb-4">
            Soft matte surface, thin border, subtle depth. Premium fintech look.
          </p>
          <div className="w-full h-px bg-white/10 mb-4" />
          <p className="text-white/40 text-xs">Dummy content block</p>
        </div>

        {/* B — Hard Edge Pro */}
        <div className="rounded-md border border-[#1a1a1a] bg-[#0b0b0b] shadow-inner p-6">
          <h2 className="text-white/80 font-semibold mb-2">B — Hard Edge Pro</h2>
          <p className="text-white/50 text-sm mb-4">
            Flat, sharp, minimal. Inspired by Bloomberg/TradingView.
          </p>
          <div className="w-full h-px bg-white/10 mb-4" />
          <p className="text-white/40 text-xs">Dummy content block</p>
        </div>

        {/* C — Soft Glow Panels */}
        <div className="rounded-xl border border-white/5 bg-[#0f0f16] shadow-[0_0_25px_rgba(0,0,0,0.45)] p-6">
          <h2 className="text-white/80 font-semibold mb-2">C — Soft Glow Panels</h2>
          <p className="text-white/50 text-sm mb-4">
            Soft outer glow, modern SaaS feel. Smooth and elegant.
          </p>
          <div className="w-full h-px bg-white/10 mb-4" />
          <p className="text-white/40 text-xs">Dummy content block</p>
        </div>

        {/* D — Frosted Glass Blur */}
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.4)] p-6">
          <h2 className="text-white/80 font-semibold mb-2">D — Frosted Glass Blur</h2>
          <p className="text-white/50 text-sm mb-4">
            High blur, translucent, futuristic. Works great with neon accents.
          </p>
          <div className="w-full h-px bg-white/10 mb-4" />
          <p className="text-white/40 text-xs">Dummy content block</p>
        </div>

        {/* E — Neo‑Fintech Gradient Edge */}
        <div className="rounded-xl border border-white/10 bg-[#0b0b12] relative p-6">
          <div className="absolute inset-0 rounded-xl pointer-events-none border border-transparent 
                          [mask-image:linear-gradient(white,transparent)] 
                          bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
          <h2 className="text-white/80 font-semibold mb-2">E — Gradient Edge</h2>
          <p className="text-white/50 text-sm mb-4">
            Subtle gradient border glow. Very modern fintech aesthetic.
          </p>
          <div className="w-full h-px bg-white/10 mb-4" />
          <p className="text-white/40 text-xs">Dummy content block</p>
        </div>

        {/* F — Minimal Carbon Fiber Panel */}
        <div className="rounded-lg border border-white/5 bg-[#0a0a0f] bg-[linear-gradient(135deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0)_100%)] p-6">
          <h2 className="text-white/80 font-semibold mb-2">F — Carbon Fiber Minimal</h2>
          <p className="text-white/50 text-sm mb-4">
            Subtle texture, minimal border, very clean and lightweight.
          </p>
          <div className="w-full h-px bg-white/10 mb-4" />
          <p className="text-white/40 text-xs">Dummy content block</p>
        </div>



{/* G — Gradient Matte BG + Gray Border */}
<div className="rounded-xl border border-gray-700 bg-gradient-to-br from-[#0f0f14] to-[#1a1a22] p-6 shadow-[0_0_20px_rgba(0,0,0,0.35)]">
  <h2 className="text-white/80 font-semibold mb-2">G — Gradient Matte + Gray Border</h2>
  <p className="text-white/50 text-sm mb-4">
    Subtle matte gradient with a clean gray border. Premium fintech feel.
  </p>
  <div className="w-full h-px bg-white/10 mb-4" />
  <p className="text-white/40 text-xs">Dummy content block</p>
</div>

{/* H — Dark Gray BG + Thick Gradient Border */}
<div className="relative rounded-xl p-[2px] bg-gradient-to-br from-blue-500/40 via-purple-500/40 to-blue-500/40 shadow-[0_0_25px_rgba(0,0,0,0.5)]">
  <div className="rounded-xl bg-[#0b0b12] p-6">
    <h2 className="text-white/80 font-semibold mb-2">H — Thick Gradient Border</h2>
    <p className="text-white/50 text-sm mb-4">
      Dark interior with a bold gradient frame. High‑end, modern fintech.
    </p>
    <div className="w-full h-px bg-white/10 mb-4" />
    <p className="text-white/40 text-xs">Dummy content block</p>
  </div>
</div>

{/* I — Full Gradient BG (Subtle, Not Neon) */}
<div className="rounded-xl border border-white/10 bg-gradient-to-br from-[#111118] via-[#0d0d14] to-[#1a1a22] p-6 shadow-[0_0_30px_rgba(0,0,0,0.4)]">
  <h2 className="text-white/80 font-semibold mb-2">I — Full Subtle Gradient BG</h2>
  <p className="text-white/50 text-sm mb-4">
    Smooth, understated gradient background. Clean and modern.
  </p>
  <div className="w-full h-px bg-white/10 mb-4" />
  <p className="text-white/40 text-xs">Dummy content block</p>
</div>



{/* ================================
    H — THICK GRADIENT BORDER VARIANTS
=================================== */}

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

  {/* H1 — Blue/Cyan (Fintech Professional) */}
  <div className="relative rounded-xl p-[2px] bg-gradient-to-br from-blue-500/40 via-cyan-400/40 to-blue-500/40 shadow-[0_0_25px_rgba(0,0,0,0.5)]">
    <div className="rounded-xl bg-[#0b0b12] p-6">
      <h2 className="text-white/80 font-semibold mb-2">H1 — Blue/Cyan Border</h2>
      <p className="text-white/50 text-sm mb-4">
        Clean, modern, premium fintech gradient.
      </p>
      <div className="w-full h-px bg-white/10 mb-4" />
      <p className="text-white/40 text-xs">Dummy content block</p>
    </div>
  </div>

  {/* H2 — Blue/Slate (Enterprise / Masculine) */}
  <div className="relative rounded-xl p-[2px] bg-gradient-to-br from-blue-600/30 via-slate-500/30 to-blue-700/30 shadow-[0_0_25px_rgba(0,0,0,0.5)]">
    <div className="rounded-xl bg-[#0b0b12] p-6">
      <h2 className="text-white/80 font-semibold mb-2">H2 — Blue/Slate Border</h2>
      <p className="text-white/50 text-sm mb-4">
        Enterprise-grade, masculine, serious trading aesthetic.
      </p>
      <div className="w-full h-px bg-white/10 mb-4" />
      <p className="text-white/40 text-xs">Dummy content block</p>
    </div>
  </div>

  {/* H3 — Emerald/Teal (Finance / Growth) */}
  <div className="relative rounded-xl p-[2px] bg-gradient-to-br from-emerald-500/40 via-teal-400/40 to-emerald-600/40 shadow-[0_0_25px_rgba(0,0,0,0.5)]">
    <div className="rounded-xl bg-[#0b0b12] p-6">
      <h2 className="text-white/80 font-semibold mb-2">H3 — Emerald/Teal Border</h2>
      <p className="text-white/50 text-sm mb-4">
        Growth‑oriented, financial, clean and confident.
      </p>
      <div className="w-full h-px bg-white/10 mb-4" />
      <p className="text-white/40 text-xs">Dummy content block</p>
    </div>
  </div>

  {/* H4 — Gunmetal (Tactical / Neutral) */}
  <div className="relative rounded-xl p-[2px] bg-gradient-to-br from-gray-500/40 via-gray-400/30 to-gray-600/40 shadow-[0_0_25px_rgba(0,0,0,0.5)]">
    <div className="rounded-xl bg-[#0b0b12] p-6">
      <h2 className="text-white/80 font-semibold mb-2">H4 — Gunmetal Border</h2>
      <p className="text-white/50 text-sm mb-4">
        Tactical, masculine, neutral — works with any accent color.
      </p>
      <div className="w-full h-px bg-white/10 mb-4" />
      <p className="text-white/40 text-xs">Dummy content block</p>
    </div>
  </div>

</div>






      </div>
    </div>
  );
}
