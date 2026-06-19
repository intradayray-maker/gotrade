import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/utils/supabase/route";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const supabase = await createRouteHandlerClient();
  const { id: followerId } = await context.params;

  try {
    // 1. Load equity + HWM
    const { data: equityRow, error: eqErr } = await supabase
      .from("follower_equity")
      .select("*")
      .eq("follower_user_id", followerId)
      .single();

    if (eqErr || !equityRow) {
      return NextResponse.json(
        { error: "Follower equity not found" },
        { status: 404 }
      );
    }

    // 2. Load equity history (for chart)
    const { data: history } = await supabase
      .from("follower_equity_history")
      .select("equity, timestamp")
      .eq("user_id", followerId)
      .order("timestamp", { ascending: true });

    // 3. Load performance fee history
    const { data: fees } = await supabase
      .from("performance_fees")
      .select("*")
      .eq("follower_user_id", followerId)
      .order("crystallized_at", { ascending: false });

    // 4. Realized PnL (simple model)
    const realizedPnl = Number(equityRow.equity) - Number(equityRow.high_water_mark);

    // 5. Next crystallization date
    const now = new Date();
    const nextCrystallization = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    return NextResponse.json({
      follower_id: followerId,
      equity: Number(equityRow.equity),
      high_water_mark: Number(equityRow.high_water_mark),
      realized_pnl: realizedPnl,
      equity_history: history ?? [],
      performance_fees: fees ?? [],
      next_crystallization: nextCrystallization.toISOString(),
    });
  } catch (err) {
    console.error("Follower PnL API error:", err);
    return NextResponse.json(
      { error: "Failed to load follower PnL" },
      { status: 500 }
    );
  }
}

