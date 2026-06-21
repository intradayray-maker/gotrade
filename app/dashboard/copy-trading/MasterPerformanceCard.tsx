"use client";

type Settings = {
  enabled?: boolean;
};

export default function MasterPerformanceCard({
  initialSettings,
}: {
  initialSettings: Settings | null;
}) {
  const enabled = initialSettings?.enabled ?? false;

  return (
    <div className="w-full max-w-3xl mx-auto rounded-xl border border-white/10 bg-zinc-900/60 p-8 shadow-lg backdrop-blur-md space-y-4">
      <h2 className="text-xl font-semibold text-white flex items-center gap-2">
        📊 Copy‑Trading Status
      </h2>

      <p className="text-white/60 text-sm">
        {enabled
          ? "Your automated trading is currently active and following the master strategy."
          : "Copy‑Trading is disabled. Enable it below to begin mirroring trades."}
      </p>

      <div className="flex items-center gap-3">
        <span
          className={`h-3 w-3 rounded-full ${
            enabled ? "bg-emerald-400 shadow-[0_0_8px_#34d399]" : "bg-red-400"
          }`}
        />
        <span className="text-white/80 text-sm">
          {enabled ? "Active" : "Inactive"}
        </span>
      </div>
    </div>
  );
}
