import GTCard from "@/components/ui/GTCard";

const notifications = [
  {
    title: "New trade executed",
    body: "RSI Strategy opened a long position in AAPL.",
    time: "2m ago",
  },
  {
    title: "Goal update",
    body: "You reached 65% of your weekly P&L target.",
    time: "1h ago",
  },
  {
    title: "Broker sync",
    body: "Alpaca account successfully synced.",
    time: "3h ago",
  },
];

export default function NotificationsPreview() {
  return (
    <div className="flex flex-col gap-3 text-sm">
      {notifications.map((n, i) => (
        <GTCard key={i} className="!p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-100">
              {n.title}
            </span>
            <span className="text-[10px] text-slate-500">{n.time}</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">{n.body}</p>
        </GTCard>
      ))}
      <button className="mt-1 w-full rounded-md bg-slate-800/70 py-1.5 text-center text-xs font-medium text-slate-200 hover:bg-slate-700">
        View all notifications
      </button>
    </div>
  );
}
