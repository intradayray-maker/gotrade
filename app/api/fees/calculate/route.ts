import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/utils/supabase/route";

export async function POST(req: Request) {
  const supabase = await createRouteHandlerClient();
  const { user_id } = await req.json();

  if (!user_id) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
  }

  // 1. Load follower settings (fee rate + HWM)
  const { data: settings, error: settingsError } = await supabase
    .from("copy_trading_settings")
    .select("performance_fee_rate, high_water_mark")
    .eq("user_id", user_id)
    .single();

  if (settingsError || !settings) {
    return NextResponse.json(
      { error: "Settings not found for user" },
      { status: 404 }
    );
  }

  const feeRate = settings.performance_fee_rate ?? 0.20;
  const highWaterMark = settings.high_water_mark ?? 0;

  // 2. Get latest equity snapshot
  const { data: equityRows, error: equityError } = await supabase
    .from("follower_equity_history")
    .select("equity")
    .eq("user_id", user_id)
    .order("timestamp", { ascending: false })
    .limit(1);

  if (equityError || !equityRows || equityRows.length === 0) {
    return NextResponse.json(
      { error: "No equity history found" },
      { status: 404 }
    );
  }

  const currentEquity = equityRows[0].equity;

  // 3. Calculate profit above HWM
  const profit = Math.max(0, currentEquity - highWaterMark);

  // 4. Calculate fee amount
  const feeAmount = profit * feeRate;

  return NextResponse.json({
    user_id,
    equity: currentEquity,
    high_water_mark: highWaterMark,
    profit,
    fee_rate: feeRate,
    fee_amount: feeAmount,
  });
}


