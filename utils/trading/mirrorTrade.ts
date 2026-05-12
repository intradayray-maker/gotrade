import { createServerClient } from "@/utils/supabase/server";
import { sendNotification } from "@/utils/notifications";

export async function mirrorTrade(job: any) {
  const supabase = await createServerClient();

  const {
    follower_user_id,
    master_trade_id,
    symbol,
    side,
    qty,
    // advanced fields passed in from queue job
    retry_count = 0,
    max_position_size,   // optional, from copy-trading settings
    max_slippage_pct,    // optional, from copy-trading settings
    master_price,        // optional, price of master trade
  } = job;

  try {
    // 0. Risk: max position size (if provided)
    if (typeof max_position_size === "number" && qty > max_position_size) {
      // Record skipped trade
      await supabase.from("follower_trades").insert({
        follower_user_id,
        master_trade_id: master_trade_id ?? null,
        order_id: null,
        symbol,
        side,
        qty,
        filled_qty: null,
        filled_avg_price: null,
        status: "skipped",
        error_message: "Quantity exceeds max position size",
      });

      await sendNotification({
        userId: follower_user_id,
        type: "system_warning",
        title: "Trade Skipped",
        message: `Trade for ${symbol} was skipped because quantity ${qty} exceeds your max position size.`,
        sendEmail: false,
      });

      return { skipped: true };
    }

    // 1. Load Alpaca keys for follower
    const { data: keys, error: keyErr } = await supabase
      .from("alpaca_keys")
      .select("key_id, secret_key, environment")
      .eq("user_id", follower_user_id)
      .single();

    if (keyErr || !keys) {
      throw new Error("Missing Alpaca keys for follower");
    }

    const baseUrl =
      keys.environment === "paper"
        ? "https://paper-api.alpaca.markets"
        : "https://api.alpaca.markets";

    // 2. Execute order on Alpaca
    const orderRes = await fetch(`${baseUrl}/v2/orders`, {
      method: "POST",
      headers: {
        "APCA-API-KEY-ID": keys.key_id,
        "APCA-API-SECRET-KEY": keys.secret_key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        symbol,
        qty,
        side,
        type: "market",
        time_in_force: "gtc",
      }),
    });

    const orderJson = await orderRes.json();

    if (!orderRes.ok) {
      throw new Error(orderJson.message || "Order failed");
    }

    const filledQty = orderJson.filled_qty ?? null;
    const filledAvgPrice = orderJson.filled_avg_price ?? null;

    // 3. Slippage check (if master_price + max_slippage_pct provided)
    if (
      typeof master_price === "number" &&
      typeof max_slippage_pct === "number" &&
      filledAvgPrice !== null
    ) {
      const slippage =
        Math.abs(filledAvgPrice - master_price) / master_price;

      if (slippage > max_slippage_pct) {
        await sendNotification({
          userId: follower_user_id,
          type: "system_warning",
          title: "Slippage Warning",
          message: `Your trade for ${symbol} experienced slippage of ${(
            slippage * 100
          ).toFixed(2)}%, above your configured limit.`,
          sendEmail: false,
        });
      }
    }

    // 4. Insert successful follower trade
    await supabase.from("follower_trades").insert({
      follower_user_id,
      master_trade_id: master_trade_id ?? null,
      order_id: orderJson.id ?? null,
      symbol,
      side,
      qty,
      filled_qty: filledQty,
      filled_avg_price: filledAvgPrice,
      status: "filled",
      error_message: null,
    });

    // 5. Success notification
    await sendNotification({
      userId: follower_user_id,
      type: "system_warning",
      title: "Trade Mirrored",
      message: `Your account executed a ${side.toUpperCase()} order for ${qty} ${symbol}.`,
      sendEmail: false,
    });

    return { success: true, order: orderJson };
  } catch (err: any) {
    console.error("FOLLOWER TRADE ERROR:", err);

    // 6. Retry logic
    if (retry_count < 3) {
      await sendNotification({
        userId: follower_user_id,
        type: "system_warning",
        title: "Trade Retry Triggered",
        message: `Retrying trade for ${symbol}. Attempt ${retry_count + 1}/3.`,
        sendEmail: false,
      });

      return {
        retry: true,
        retry_count: retry_count + 1,
      };
    }

    // 7. Final failure: record failed trade
    await supabase.from("follower_trades").insert({
      follower_user_id,
      master_trade_id: master_trade_id ?? null,
      order_id: null,
      symbol,
      side,
      qty,
      filled_qty: null,
      filled_avg_price: null,
      status: "failed",
      error_message: err.message ?? "Unknown error",
    });

    // 8. Failure notification
    await sendNotification({
      userId: follower_user_id,
      type: "system_warning",
      title: "Trade Failed",
      message: `We were unable to execute your trade for ${symbol} after multiple attempts.`,
      sendEmail: true,
    });

    return { success: false, error: "Trade failed after retries" };
  }
}
