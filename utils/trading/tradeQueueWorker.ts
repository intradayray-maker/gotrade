import { createServerClient } from "@/utils/supabase/server";
import { executeFollowerTrade } from "@/utils/trading/followerExecutor";
import { calculateNewEquity } from "@/utils/trading/pnl";

export async function processTradeQueue() {
  const supabase = await createServerClient();

  const { data: jobs } = await supabase
    .from("trade_queue")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(3);

  if (!jobs || jobs.length === 0) return;

  for (const job of jobs) {
    await supabase
      .from("trade_queue")
      .update({ status: "processing" })
      .eq("id", job.id);

    const result = await executeFollowerTrade({
      userId: job.follower_user_id!,   // FIXED
      symbol: job.symbol,
      side: job.side as "buy" | "sell",
      qty: job.qty,
    });

    if (result?.success) {
      // 1. Insert follower trade
      await supabase.from("follower_trades").insert({
        follower_user_id: job.follower_user_id!,
        symbol: job.symbol,
        side: job.side,
        qty: job.qty,
        filled_avg_price: result.order.filled_avg_price ?? null,
        filled_qty: result.order.filled_qty ?? job.qty,
        created_at: new Date().toISOString(),
      });

      // 2. Fetch equity + HWM
      const { data: eq } = await supabase
        .from("follower_equity")
        .select("*")
        .eq("follower_user_id", job.follower_user_id!)  // FIXED
        .single();

      if (!eq) throw new Error("Missing follower_equity row");

      const previousEquity = eq.equity ?? 0;
      const previousHWM = eq.high_water_mark ?? 0;

      const newEquity = calculateNewEquity(
        previousEquity,
        job.side as "buy" | "sell",
        job.qty,
        result.order.filled_avg_price
      );

      const newHWM = Math.max(previousHWM, newEquity);

      // 3. Update equity + HWM
      await supabase.from("follower_equity").upsert({
        follower_user_id: job.follower_user_id!,  // FIXED
        equity: newEquity,
        high_water_mark: newHWM,
        updated_at: new Date().toISOString(),
      });

      // 4. Insert equity history
      await supabase.from("follower_equity_history").insert({
        user_id: job.follower_user_id!,
        equity: newEquity,
        timestamp: new Date().toISOString(),
      });

      // 5. Mark completed
      await supabase
        .from("trade_queue")
        .update({ status: "completed" })
        .eq("id", job.id);

      continue;
    }

    // Retry / dead letter
    const attempts = (job.attempts ?? 0) + 1;
    const maxAttempts = job.max_attempts ?? 3;

    if (attempts >= maxAttempts) {
      await supabase
        .from("trade_queue")
        .update({
          status: "dead_letter",
          attempts,
          last_error: result?.error ?? "Unknown error",
        })
        .eq("id", job.id);
    } else {
      await supabase
        .from("trade_queue")
        .update({
          status: "pending",
          attempts,
          last_error: result?.error ?? "Unknown error",
        })
        .eq("id", job.id);
    }
  }
}
