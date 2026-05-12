const metrics = [
  {
    label: 'Total P&L',
    value: '+$1,842',
    sub: '+12.4%',
    tone: 'positive',
  },
  {
    label: 'Max Drawdown',
    value: '-$420',
    sub: '-3.1%',
    tone: 'negative',
  },
  {
    label: 'Win Rate',
    value: '57.8%',
    sub: '37 / 64 trades',
    tone: 'neutral',
  },
  {
    label: 'Profit Factor',
    value: '1.42',
    sub: 'Risk-adjusted',
    tone: 'neutral',
  },
];

export default function PerformanceMetrics() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="rounded-lg border border-slate-800 bg-[#050509] px-3 py-2.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">{m.label}</span>
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-lg font-semibold text-slate-100">
              {m.value}
            </span>
            <span
              className={
                'text-xs ' +
                (m.tone === 'positive'
                  ? 'text-emerald-400'
                  : m.tone === 'negative'
                  ? 'text-rose-400'
                  : 'text-slate-400')
              }
            >
              {m.sub}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
