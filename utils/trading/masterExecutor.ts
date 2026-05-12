import { placeOrder } from "@/utils/trading/placeOrder";
import { sendNotification } from "@/utils/notifications";
import { createServerClient } from "@/utils/supabase/server";

export async function executeMasterTrade(params: {
  symbol: string;
  side: "buy" | "sell";
  qty: number;
}) {
  const { symbol, side, qty } = params;

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

    // 2. Notify master (system-level)
    await sendNotification({
      userId: null,   // ✅ FIXED
      type: "master_trade_executed",
      title: "Master Trade Executed",
      message: `${side.toUpperCase()} ${qty} ${symbol} executed.`,
      sendEmail: true,
    });

    // 3. Load followers
    const { data: rawFollowers } = await supabase
      .from("copy_trading_settings")
      .select("user_id, allocation");

    const followers =
      rawFollowers?.filter(
        (f): f is { user_id: string; allocation: number | null } =>
          typeof f.user_id === "string"
      ) ?? [];

    // 4. Enqueue follower trades
    for (const follower of followers) {
      const followerQty = qty * (follower.allocation ?? 1);

      await supabase.from("trade_queue").insert({
        follower_user_id: follower.user_id,
        symbol,
        side,
        qty: followerQty,
      });
    }

    return { masterOrder, followers };

  } catch (err) {
    await sendNotification({
      userId: null,   // ✅ FIXED
      type: "system_warning",
      title: "Master Trade Failed",
      message: `Master trade failed for ${symbol}.`,
      sendEmail: true,
    });

    throw err;
  }
}
