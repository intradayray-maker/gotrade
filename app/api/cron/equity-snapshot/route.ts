import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/utils/supabase/route";
import { getAlpacaEquity } from "@/utils/alpaca/getEquity";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createRouteHandlerClient();

  const { data: followers } = await supabase
    .from("copy_trading_settings")
    .select("user_id, enabled")
    .eq("enabled", true);

  if (!followers || followers.length === 0) {
    return NextResponse.json({ message: "No active followers" });
  }

  const results: any[] = [];

  for (const follower of followers) {
    // Skip invalid rows
    if (!follower.user_id) {
      results.push({
        user_id: null,
        error: "Follower has null user_id — skipping",
      });
      continue;
    }

    try {
      const equity = await getAlpacaEquity(follower.user_id);

      await supabase.from("follower_equity_history").insert({
        user_id: follower.user_id,
        equity,
      });

      results.push({ user_id: follower.user_id, equity });
    } catch (err) {
      results.push({
        user_id: follower.user_id,
        error: (err as Error).message,
      });
    }
  }

  return NextResponse.json({
    success: true,
    snapshots: results,
  });
}


