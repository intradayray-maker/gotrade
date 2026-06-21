import GTCard from "@/components/ui/GTCard";

const cards = [
  {
    label: 'Total Balance',
    value: '$10,842.12',
    sub: '+$1,842 today',
    tone: 'positive',
  },
  {
    label: 'Open Positions',
    value: '4',
    sub: '2 long · 2 short',
    tone: 'neutral',
  },
  {
    label: 'Copy-Trading Accounts',
    value: '3',
    sub: '2 active · 1 paused',
    tone: 'neutral',
  },
  {
    label: 'Broker Status',
    value: 'Connected',
    sub: 'Alpaca · Live',
    tone: 'positive',
  },
];

export default function AccountSummaryGrid() {
  return (
    <>
      {cards.map((c) => (
        <GTCard key={c.label} className="!p-4">
          <div className="text-xs text-slate-400">{c.label}</div>
          <div className="mt-1 text-lg font-semibold text-slate-100">
            {c.value}
          </div>
          <div
            className={
              'mt-1 text-xs ' +
              (c.tone === 'positive'
                ? 'text-emerald-400'
                : c.tone === 'negative'
                ? 'text-rose-400'
                : 'text-slate-500')
            }
          >
            {c.sub}
          </div>
        </GTCard>
      ))}
    </>
  );
}
