import { placeOrder } from "@/lib/brokers/router";
import { createSupabaseServerClient } from "@/utils/supabase/server";

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

  const supabase = await createSupabaseServerClient();

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

    // ⭐ Insert master trade into master_trades (type-safe)
    console.log("📝 INSERTING MASTER TRADE INTO master_trades...");

    const { data: masterTradeRow, error: masterInsertErr } = await supabase
      .from("master_trades")
      .insert({
        order_id: masterOrder.id, // Alpaca order ID
        symbol,
        side,
        qty,
        status: masterOrder.status,
        filled_avg_price: masterFillPrice,
        filled_qty: masterOrder.filled_qty ?? null,
      })
      .select()
      .single();

    if (masterInsertErr) {
      console.error("❌ MASTER TRADE INSERT ERROR:", masterInsertErr);
      throw masterInsertErr;
    }

    console.log("✅ MASTER TRADE INSERTED:", masterTradeRow);

    // 2. Load followers
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
          master_trade_id: masterTradeRow.id, // VALID FK
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

    // ⭐ MASTER EXIT MIRRORING
    // ---------------------------------------------------------
    console.log("🔎 CHECKING FOR MASTER EXIT...");

    if (side === "sell") {
      console.log("➡️ MASTER SELL DETECTED — checking master position...");

      // 1. Load master position AFTER the trade
      const { data: masterPos, error: masterPosErr } = await supabase
        .from("follower_positions") // master uses same table but with masterTraderId
        .select("qty")
        .eq("follower_user_id", masterTraderId)
        .eq("symbol", symbol)
        .maybeSingle();

      if (masterPosErr) {
        console.error("❌ ERROR LOADING MASTER POSITION:", masterPosErr);
      } else {
        const masterQty = masterPos?.qty ?? 0;

        console.log("📉 MASTER POSITION AFTER SELL:", masterQty);

        // 2. If master is now FLAT → followers must exit too
        if (masterQty === 0) {
          console.log("🚨 MASTER EXIT CONFIRMED — MIRRORING FOLLOWER EXITS...");

          // Load followers who currently hold this symbol
          const { data: followerPositions, error: followerPosErr } =
            await supabase
              .from("follower_positions")
              .select("follower_user_id, qty")
              .eq("symbol", symbol)
              .gt("qty", 0);

          if (followerPosErr) {
            console.error("❌ ERROR LOADING FOLLOWER POSITIONS:", followerPosErr);
          } else {
            console.log("📊 FOLLOWERS HOLDING POSITION:", followerPositions);

            for (const fp of followerPositions ?? []) {
              console.log(
                "➡️ QUEUING FOLLOWER EXIT:",
                fp.follower_user_id,
                "qty:",
                fp.qty
              );

              const { error: exitErr } = await supabase
                .from("trade_queue")
                .insert({
                  follower_user_id: fp.follower_user_id,
                  symbol,
                  side: "sell",
                  qty: fp.qty,
                  master_trade_id: masterTradeRow.id,
                });

              if (exitErr) {
                console.error("❌ FOLLOWER EXIT QUEUE ERROR:", exitErr);
              } else {
                console.log("✅ FOLLOWER EXIT QUEUED:", {
                  follower_user_id: fp.follower_user_id,
                  qty: fp.qty,
                });
              }
            }
          }
        } else {
          console.log("ℹ️ MASTER STILL HAS POSITION — no exit mirroring needed.");
        }
      }
    }
    // ---------------------------------------------------------

    console.log("🎉 MASTER EXECUTOR FINISHED SUCCESSFULLY");

    return { masterOrder, followers };
  } catch (err) {
    console.error("🔥 MASTER TRADE ERROR:", err);
    throw err;
  }
}

export const runMasterExecutor = executeMasterTrade;
