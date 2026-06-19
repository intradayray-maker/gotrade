export const runtime = "nodejs";


import EquityChart from "@/components/dashboard/EquityChart";
import SummaryCards from "@/components/dashboard/SummaryCards";
import FeeHistoryTable from "@/components/dashboard/FeeHistoryTable";

export default async function FollowerDashboard({ params }: { params: { id: string } }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/pnl/follower/${params.id}`);
  const data = await res.json();

  return (
    <div className="space-y-8">
      <SummaryCards
        equity={data.equity}
        hwm={data.high_water_mark}
        realizedPnl={data.realized_pnl}
        totalFees={data.performance_fees.reduce((s: number, f: any) => s + Number(f.amount), 0)}
      />

      <EquityChart data={data.equity_history} />

      <FeeHistoryTable fees={data.performance_fees} />
    </div>
  );
}
