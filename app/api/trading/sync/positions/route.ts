import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    // 1. Load master positions
    const { data: masterPositions } = await supabase
      .from("master_positions")
      .select("*");

    if (!masterPositions) {
      return json({ error: "No master positions found" }, 404);
    }

    // 2. Load all followers
    const { data: followers } = await supabase
      .from("copy_trading_settings")
      .select("user_id, allocation_mode, allocation_value, risk_multiplier");

    if (!followers || followers.length === 0) {
      return json({ success: true, message: "No followers" }, 200);
    }

    const syncResults = [];

    for (const follower of followers) {
      for (const masterPos of masterPositions) {
        const symbol = masterPos.symbol;
        const masterQty = Number(masterPos.qty);

        // 3. Load follower position
        const { data: followerPos } = await supabase
          .from("follower_positions")
          .select("*")
          .eq("follower_user_id", follower.user_id)
          .eq("symbol", symbol)
          .single();

        const followerQty = Number(followerPos?.qty ?? 0);

        // 4. Calculate target qty
        const targetQty = calculateFollowerQty(masterQty, follower);

        // 5. Difference
        const correctionQty = targetQty - followerQty;

        if (Math.abs(correctionQty) < 0.01) {
          continue; // already in sync
        }

        // 6. Insert correction into queue
        await supabase.from("trade_queue").insert({
          master_trade_id: null,
          follower_user_id: follower.user_id,
          symbol,
          side: correctionQty > 0 ? "buy" : "sell",
          qty: Math.abs(correctionQty),
          status: "queued",
        });

        // 7. Log sync
        await supabase.from("sync_logs").insert({
          follower_user_id: follower.user_id,
          symbol,
          master_qty: masterQty,
          follower_qty: followerQty,
          correction_qty: correctionQty,
          status: "corrected",
        });

        syncResults.push({
          follower: follower.user_id,
          symbol,
          correction: correctionQty,
        });
      }
    }

    return json({ success: true, syncResults }, 200);
  } catch (err) {
    console.error("Sync error:", err);
    return json({ error: "Unexpected server error" }, 500);
  }
}

function calculateFollowerQty(masterQty: number, follower: any) {
  const mode = follower.allocation_mode;
  const value = Number(follower.allocation_value);
  const risk = Number(follower.risk_multiplier ?? 1);

  if (mode === "percent") {
    return Number((masterQty * (value / 100) * risk).toFixed(2));
  }

  if (mode === "fixed") {
    return Number((value * risk).toFixed(2));
  }

  return masterQty;
}

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
