import { placeOrder } from "@/utils/trading/placeOrder";
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

    // 2. (REMOVED) Notification system disabled for webhooks
    // await sendNotification({
    //   userId: null,
    //   type: "master_trade_executed",
    //   title: "Master Trade Executed",
    //   message: `${side.toUpperCase()} ${qty} ${symbol} executed.`,
    //   sendEmail: true,
    // });

    // 3. Load followers
    const { data: rawFollowers } = await supabase
      .from("copy_trading_settings")
      .select("user_id, allocation");

    const followers = (rawFollowers?.filter(
      (f: any) => typeof f.user_id === "string" && typeof f.allocation === "number"
    ) ?? []) as { user_id: string; allocation: number }[];

    // 4. Enqueue follower trades
    for (const follower of followers) {
      const followerQty = qty * follower.allocation;

      await supabase.from("trade_queue").insert({
        follower_user_id: follower.user_id,
        symbol,
        side,
        qty: followerQty,
      } as any);
    }

    return { masterOrder, followers };

  } catch (err) {
    // (REMOVED) Notification system disabled for webhooks
    // await sendNotification({
    //   userId: null,
    //   type: "system_warning",
    //   title: "Master Trade Failed",
    //   message: `Master trade failed for ${symbol}.`,
    //   sendEmail: true,
    // });

    throw err;
  }
}
