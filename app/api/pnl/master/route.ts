import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/utils/supabase/route";

export async function GET() {
  const supabase = await createRouteHandlerClient();

  try {
    // 1. Load all master trades (executions)
    const { data: trades, error: tradesErr } = await supabase
      .from("master_trades")
      .select("*")
      .order("created_at", { ascending: true });

    if (tradesErr) {
      return NextResponse.json(
        { error: "Failed to load master trades" },
        { status: 500 }
      );
    }

    if (!trades || trades.length === 0) {
      return NextResponse.json({
        total_pnl: 0,
        win_rate: 0,
        avg_return: 0,
        total_trades: 0,
        equity_curve: [],
        best_trade: null,
        worst_trade: null,
      });
    }

    // 2. Compute PnL per execution
    const tradeStats = trades.map((t) => {
      const price = Number(t.filled_avg_price ?? 0);
      const qty = Number(t.filled_qty ?? t.qty ?? 0);

      // BUY = negative cash flow, SELL = positive cash flow
      const pnl = t.side === "buy" ? -price * qty : price * qty;

      return {
        ...t,
        pnl,
        returnPct: 0, // cannot compute return without entry/exit pair
      };
    });

    // 3. Aggregate stats
    const totalPnl = tradeStats.reduce((sum, t) => sum + t.pnl, 0);

    // Win rate is meaningless without entry/exit pairs → set to 0
    const winRate = 0;

    // 4. Best / worst executions
    const bestTrade = tradeStats.reduce((a, b) => (a.pnl > b.pnl ? a : b));
    const worstTrade = tradeStats.reduce((a, b) => (a.pnl < b.pnl ? a : b));

    // 5. Equity curve (cumulative cash flow)
    let cumulative = 0;
    const equityCurve = tradeStats.map((t) => {
      cumulative += t.pnl;
      return {
        timestamp: t.created_at,
        equity: cumulative,
      };
    });

    return NextResponse.json({
      total_pnl: totalPnl,
      win_rate: winRate,
      avg_return: 0,
      total_trades: tradeStats.length,
      equity_curve: equityCurve,
      best_trade: bestTrade,
      worst_trade: worstTrade,
      raw_trades: tradeStats,
    });
  } catch (err) {
    console.error("Master PnL API error:", err);
    return NextResponse.json(
      { error: "Failed to load master PnL" },
      { status: 500 }
    );
  }
}


