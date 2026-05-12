import MasterSummaryCards from "@/components/dashboard/MasterSummaryCards";
import BestWorstTrades from "@/components/dashboard/BestWorstTrades";
import MasterTradesTable from "@/components/dashboard/MasterTradesTable";
import EquityChart from "@/components/dashboard/EquityChart";

export default async function MasterDashboard() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/pnl/master`, {
    cache: "no-store",
  });

  const data = await res.json();

  return (
    <div className="space-y-8">
      <MasterSummaryCards
        totalPnl={data.total_pnl}
        winRate={data.win_rate}
        avgReturn={data.avg_return}
        totalTrades={data.total_trades}
      />

      <EquityChart data={data.equity_curve} />

      <BestWorstTrades best={data.best_trade} worst={data.worst_trade} />

      <MasterTradesTable trades={data.raw_trades} />
    </div>
  );
}
