import { placeOrder } from "@/utils/trading/placeOrder";
import { createServerClient } from "@/utils/supabase/server";

export async function executeMasterTrade(params: {
  symbol: string;
  side: "buy" | "sell";
  qty: number;
}) {
  const { symbol, side, qty } = params;

  // 🔥 Your actual master trader UUID
  const masterTraderId = "cab941c3-df75-4e54-9f27-384952525fb1";

  console.log("MASTER TRADER ID USED:", masterTraderId);

  const supabase = await createServerClient();

  try {
    // 1. Execute master trade
    const masterOrder = await placeOrder({
      symbol,
      side,
      qty,
      accountType: "master",
    });

    const masterFillPrice = masterOrder.filled_avg_price ?? null;

    // 2. Load followers for THIS master trader
    const { data: rawFollowers, error: followerErr } = await supabase
      .from("copy_trading_settings")
      .select("user_id, allocation")
      .eq("trader_id", masterTraderId)
      .eq("enabled", true);

    if (followerErr) {
      console.error("Follower load error:", followerErr);
    }

    console.log("RAW FOLLOWERS:", rawFollowers);

    const followers =
      rawFollowers?.filter(
        (f: any) =>
          typeof f.user_id === "string" &&
          typeof f.allocation === "number"
      ) ?? [];

    console.log("FILTERED FOLLOWERS:", followers);

    // 3. Enqueue follower trades
    for (const follower of followers) {
      // ⭐ Fix TypeScript null warning
      const followerQty = qty * (follower.allocation ?? 1);

      const { error: insertErr } = await supabase
        .from("trade_queue")
        .insert({
          follower_user_id: follower.user_id,
          symbol,
          side,
          qty: followerQty,
          master_trade_id: masterOrder.id ?? null,
        });

      if (insertErr) {
        console.error("Follower queue insert error:", insertErr);
      } else {
        console.log("Queued follower trade:", {
          follower_user_id: follower.user_id,
          qty: followerQty,
        });
      }
    }

    return { masterOrder, followers };
  } catch (err) {
    console.error("MASTER TRADE ERROR:", err);
    throw err;
  }
}
