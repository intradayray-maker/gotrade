import { placeOrder } from "@/utils/trading/placeOrder";
import { sendNotification } from "@/utils/notifications";

export async function executeFollowerTrade(params: {
  userId: string;
  symbol: string;
  side: "buy" | "sell";
  qty: number;
  masterFillPrice?: number; // passed from master executor
}) {
  const { userId, symbol, side, qty, masterFillPrice } = params;

  // Retry delays (ms)
  const retryDelays = [250, 500, 1000];

  for (let attempt = 0; attempt <= retryDelays.length; attempt++) {
    try {
      // 1. Execute follower trade
      const order = await placeOrder({
        symbol,
        side,
        qty,
        accountType: "follower",
        userId,
      });

      const followerFillPrice = order.filled_avg_price ?? null;

      // 2. Slippage detection (admin only)
      if (masterFillPrice && followerFillPrice) {
        const slippage = followerFillPrice - masterFillPrice;
        const slippagePct = (slippage / masterFillPrice) * 100;

        if (slippagePct > 2 && slippagePct <= 5) {
          await sendNotification({
            userId: "admin",
            type: "system_warning",
            title: "High Slippage Detected",
            message: `Follower ${userId} experienced ${slippagePct.toFixed(
              2
            )}% slippage on ${symbol}.`,
            sendEmail: true,
          });
        }

        if (slippagePct > 5) {
          await sendNotification({
            userId: "admin",
            type: "system_warning",
            title: "Extreme Slippage Detected",
            message: `Follower ${userId} experienced EXTREME slippage (${slippagePct.toFixed(
              2
            )}%) on ${symbol}.`,
            sendEmail: true,
          });
        }
      }

      // 3. Notify follower of successful trade
      await sendNotification({
        userId,
        type: "follower_trade_executed",
        title: "Trade Executed",
        message: `${side.toUpperCase()} ${qty} ${symbol} executed.`,
        sendEmail: true,
      });

      return { success: true, order };
    } catch (err: any) {
      const message = err?.message?.toLowerCase() ?? "";

      // 4. Hard failures (no retry)
      if (
        message.includes("insufficient") ||
        message.includes("buying power") ||
        message.includes("pdt") ||
        message.includes("unsettled") ||
        message.includes("forbidden") ||
        message.includes("unauthorized") ||
        message.includes("invalid key")
      ) {
        await sendNotification({
          userId,
          type: "follower_trade_failed",
          title: "Trade Failed",
          message: `Your trade for ${symbol} failed: ${err?.message}`,
          sendEmail: true,
        });

        await sendNotification({
          userId: "admin",
          type: "system_warning",
          title: "Follower Trade Failed",
          message: `Follower ${userId} failed to trade ${symbol}: ${err?.message}`,
          sendEmail: true,
        });

        return { success: false, error: err?.message };
      }

      // 5. Retry logic for soft failures
      if (attempt < retryDelays.length) {
        await new Promise((res) => setTimeout(res, retryDelays[attempt]));
        continue;
      }

      // 6. Retry exhausted → notify
      await sendNotification({
        userId,
        type: "follower_trade_failed",
        title: "Trade Failed",
        message: `Your trade for ${symbol} failed after multiple attempts.`,
        sendEmail: true,
      });

      await sendNotification({
        userId: "admin",
        type: "system_warning",
        title: "Follower Trade Retry Exhausted",
        message: `Follower ${userId} failed to trade ${symbol} after all retries.`,
        sendEmail: true,
      });

      return { success: false, error: err?.message };
    }
  }
}
