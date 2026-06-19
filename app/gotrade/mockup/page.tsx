export default function GoTradeMockup() {
  return (
    <div className="py-20 max-w-4xl mx-auto">
      
      <h1 className="text-5xl font-bold mb-6 text-center">
        GoTrade Dashboard Preview
      </h1>

      <p className="text-neutral-400 text-center text-lg mb-12">
        A sneak peek at what’s coming.  
        Clean. Automated. Built for DSJ traders.
      </p>

      {/* Mockup Container */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-8 shadow-xl">
        
        <h2 className="text-2xl font-semibold mb-6">
          📊 Daily Performance Overview
        </h2>

        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="p-5 rounded-lg bg-neutral-800 border border-neutral-700">
            <div className="text-neutral-400 text-sm mb-1">Today’s R</div>
            <div className="text-3xl font-bold">+2.78R</div>
          </div>

          <div className="p-5 rounded-lg bg-neutral-800 border border-neutral-700">
            <div className="text-neutral-400 text-sm mb-1">Win Rate</div>
            <div className="text-3xl font-bold">71%</div>
          </div>

          <div className="p-5 rounded-lg bg-neutral-800 border border-neutral-700">
            <div className="text-neutral-400 text-sm mb-1">Trades Today</div>
            <div className="text-3xl font-bold">6</div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4">
          📈 Equity Curve (Preview)
        </h2>

        <div className="rounded-lg overflow-hidden border border-neutral-700 bg-neutral-800 h-64 flex items-center justify-center">
          <span className="text-neutral-500">
            [Equity Curve Placeholder]
          </span>
        </div>

        <h2 className="text-2xl font-semibold mt-12 mb-4">
          ⚙️ Copy‑Trading Settings
        </h2>

        <div className="grid grid-cols-2 gap-6">
          <div className="p-5 rounded-lg bg-neutral-800 border border-neutral-700">
            <div className="text-neutral-400 text-sm mb-1">Risk Multiplier</div>
            <div className="text-xl font-semibold">1.0x</div>
          </div>

          <div className="p-5 rounded-lg bg-neutral-800 border border-neutral-700">
            <div className="text-neutral-400 text-sm mb-1">Max Daily Loss</div>
            <div className="text-xl font-semibold">‑2R</div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <a
            href="/gotrade/preorder"
            className="px-6 py-3 bg-blue-600 text-white rounded text-lg font-semibold"
          >
            Join the Pre‑Order List
          </a>
        </div>

      </div>
    </div>
  )
}
