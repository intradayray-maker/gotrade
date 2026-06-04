export default function GoalCenterPage() {
  return (
    <main className="min-h-screen bg-[#050509] px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-300/80">
            Goal Center
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Progress overview</h1>
          <p className="max-w-2xl text-sm leading-6 text-white/60">
            This area is reserved for future goal tracking and planning tools.
            The old prop-driven heatmap component has been retired so the route
            remains valid in the Next.js app structure.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <InfoCard label="Status" value="Ready" />
          <InfoCard label="Scope" value="Single-user dashboard" />
          <InfoCard label="Focus" value="Forex automation" />
        </div>
      </div>
    </main>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b0b12] p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-white/45">{label}</p>
      <p className="mt-2 text-lg font-medium text-white/90">{value}</p>
    </div>
  );
}
