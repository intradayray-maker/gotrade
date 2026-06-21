import GTCard from "@/components/ui/GTCard";

export default function DashboardShell() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-neutral-400 mt-1">
          Your trading overview and system insights111.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <GTCard className="!p-5">
          <p className="text-neutral-400 text-sm">Total Balance</p>
          <h2 className="text-2xl font-semibold mt-2">$0.00</h2>
        </GTCard>

        <GTCard className="!p-5">
          <p className="text-neutral-400 text-sm">Open Positions</p>
          <h2 className="text-2xl font-semibold mt-2">0</h2>
        </GTCard>

        <GTCard className="!p-5">
          <p className="text-neutral-400 text-sm">Copy-Trading Accounts</p>
          <h2 className="text-2xl font-semibold mt-2">0</h2>
        </GTCard>

        <GTCard className="!p-5">
          <p className="text-neutral-400 text-sm">AI Insights</p>
          <h2 className="text-2xl font-semibold mt-2">—</h2>
        </GTCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <GTCard className="h-80 flex items-center justify-center text-neutral-500">
            TradingView Chart Placeholder
          </GTCard>

          <GTCard>
            <h3 className="text-xl font-semibold mb-3">AI Market Insights</h3>
            <p className="text-neutral-400">
              Your AI-powered market commentary will appear here.
            </p>
          </GTCard>
        </div>

        <div className="space-y-6">
          <GTCard>
            <h3 className="text-xl font-semibold mb-3">Open Positions</h3>
            <p className="text-neutral-400">No open positions.</p>
          </GTCard>

          <GTCard>
            <h3 className="text-xl font-semibold mb-3">Recent Activity</h3>
            <p className="text-neutral-400">No recent activity.</p>
          </GTCard>
        </div>
      </div>
    </div>
  );
}
<<<<<<< HEAD
=======

// trest
>>>>>>> f8b5146b38fa55ecb4b35d4d62828ee629543d0f
