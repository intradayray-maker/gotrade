import { placeOrder } from "@/utils/trading/placeOrder";
import { createServerClient } from "@/utils/supabase/server";

export async function executeMasterTrade(params: {
  symbol: string;
  side: "buy" | "sell";
  qty: number;
}) {
  console.log("🚀 MASTER EXECUTOR STARTED");

  const { symbol, side, qty } = params;

  // 🔥 Your actual master trader UUID
  const masterTraderId = "cab941c3-df75-4e54-9f27-384952525fb1";

  console.log("MASTER TRADER ID USED:", masterTraderId);
  console.log("MASTER TRADE PARAMS:", { symbol, side, qty });

  const supabase = await createServerClient();

  try {
    // 1. Execute master trade
    console.log("📡 PLACING MASTER ORDER...");
    let masterOrder;

    try {
      masterOrder = await placeOrder({
        symbol,
        side,
        qty,
        accountType: "master",
      });
    } catch (err) {
      console.error("❌ MASTER ORDER FAILED:", err);
      throw err;
    }

    console.log("✅ MASTER ORDER RESULT:", masterOrder);

    const masterFillPrice = masterOrder?.filled_avg_price ?? null;

    // ⭐ NEW STEP: Insert master trade into master_trades
    console.log("📝 INSERTING MASTER TRADE INTO master_trades...");

    const { data: masterTradeRow, error: masterInsertErr } = await supabase
      .from("master_trades")
      .insert({
        id: masterOrder.id,
        symbol,
        side,
        qty,
        status: masterOrder.status,
        limit_price: masterOrder.limit_price,
        filled_avg_price: masterFillPrice,
        created_at: masterOrder.created_at,
      })
      .select()
      .single();

    if (masterInsertErr) {
      console.error("❌ MASTER TRADE INSERT ERROR:", masterInsertErr);
      throw masterInsertErr;
    }

    console.log("✅ MASTER TRADE INSERTED:", masterTradeRow);

    // 2. Load followers for THIS master trader
    console.log("🔍 LOADING FOLLOWERS FOR TRADER:", masterTraderId);

    const { data: rawFollowers, error: followerErr } = await supabase
      .from("copy_trading_settings")
      .select("user_id, allocation")
      .eq("trader_id", masterTraderId)
      .eq("enabled", true);

    console.log("📊 RAW FOLLOWERS:", rawFollowers);
    console.log("❗ FOLLOWER QUERY ERROR:", followerErr);

    const followers =
      rawFollowers?.filter(
        (f: any) =>
          typeof f.user_id === "string" &&
          typeof f.allocation === "number"
      ) ?? [];

    console.log("📌 FILTERED FOLLOWERS:", followers);

    // 3. Enqueue follower trades
    console.log("🧵 STARTING FOLLOWER QUEUE INSERT LOOP...");

    for (const follower of followers) {
      console.log("➡️ INSERTING QUEUE JOB FOR FOLLOWER:", follower.user_id);

      const followerQty = qty * (follower.allocation ?? 1);

      const { error: insertErr } = await supabase
        .from("trade_queue")
        .insert({
          follower_user_id: follower.user_id,
          symbol,
          side,
          qty: followerQty,
          master_trade_id: masterOrder.id, // now valid
        });

      if (insertErr) {
        console.error("❌ FOLLOWER QUEUE INSERT ERROR:", insertErr);
      } else {
        console.log("✅ QUEUED FOLLOWER TRADE:", {
          follower_user_id: follower.user_id,
          qty: followerQty,
        });
      }
    }

    console.log("🎉 MASTER EXECUTOR FINISHED SUCCESSFULLY");

    return { masterOrder, followers };
  } catch (err) {
    console.error("🔥 MASTER TRADE ERROR:", err);
    throw err;
  }
}
