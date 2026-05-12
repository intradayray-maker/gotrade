import { createServerClient } from "@/utils/supabase/server";
import { sendNotification } from "@/utils/notifications";
// import { createInvoiceForFee } from "@/utils/billing/createInvoice"; // optional

export async function crystallizePerformanceFees() {
  const supabase = await createServerClient();

  try {
    // 1. Load all followers with equity
    const { data: followers, error: followerErr } = await supabase
      .from("follower_equity")
      .select("*");

    if (followerErr) {
      console.error("LOAD FOLLOWERS ERROR:", followerErr);
      return;
    }

    if (!followers || followers.length === 0) return;

    const periodStart = new Date();
    periodStart.setMonth(periodStart.getMonth() - 1);

    const periodEnd = new Date();

    for (const f of followers) {
      const equity = Number(f.equity ?? 0);
      const hwm = Number(f.high_water_mark ?? 0);

      const newProfit = equity - hwm;

      if (newProfit <= 0) {
        // No new profits → no fee
        continue;
      }

      const fee = newProfit * 0.20;

      // 2. Insert fee record
      const { data: feeRecord, error: feeErr } = await supabase
        .from("performance_fees")
        .insert({
          follower_user_id: f.follower_user_id,
          amount: fee,
          period_start: periodStart.toISOString().slice(0, 10),
          period_end: periodEnd.toISOString().slice(0, 10),
          crystallized_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (feeErr) {
        console.error("FEE INSERT ERROR:", feeErr);

        await sendNotification({
          userId: f.follower_user_id,
          type: "system_warning",
          title: "Fee Crystallization Failed",
          message: "We were unable to crystallize your performance fee.",
          sendEmail: true,
        });

        continue;
      }

      // 3. Reset HWM to current equity
      await supabase
        .from("follower_equity")
        .update({
          high_water_mark: equity,
          updated_at: new Date().toISOString(),
        })
        .eq("follower_user_id", f.follower_user_id);

      // 4. Send crystallization notification
      await sendNotification({
        userId: f.follower_user_id,
        type: "fee_crystallized",
        title: "Performance Fee Crystallized",
        message: `A performance fee of $${fee.toFixed(
          2
        )} has been crystallized for this period.`,
        sendEmail: true,
      });

      // 5. Optional: Create invoice
      /*
      const invoice = await createInvoiceForFee({
        userId: f.follower_user_id,
        feeId: feeRecord.id,
        amount: fee,
      });

      await sendNotification({
        userId: f.follower_user_id,
        type: "invoice_created",
        title: "Invoice Generated",
        message: `Your performance fee invoice for $${fee.toFixed(
          2
        )} is now available.`,
        sendEmail: true,
      });
      */
    }
  } catch (err) {
    console.error("CRYSTALLIZATION ENGINE ERROR:", err);
  }
}
