import { createRouteHandlerClient } from "@/utils/supabase/route";
import { createPerformanceFeeInvoice } from "@/utils/stripe/server";
import { sendNotification } from "@/utils/notifications";

export async function POST(req: Request) {
  const supabase = await createRouteHandlerClient();
  const { user_id, period_start, period_end } = await req.json();

  if (!user_id || !period_start || !period_end) {
    return Response.json(
      { error: "Missing user_id, period_start, or period_end" },
      { status: 400 }
    );
  }

  //
  // 1. Load follower settings (fee rate + HWM + Stripe customer)
  //
  const { data: settings, error: settingsError } = await supabase
    .from("copy_trading_settings")
    .select("performance_fee_rate, high_water_mark, stripe_customer_id")
    .eq("user_id", user_id)
    .single();

  if (settingsError || !settings) {
    await sendNotification({
      userId: user_id,
      type: "system_warning",
      title: "Fee Crystallization Failed",
      message: "Unable to load fee settings for your account.",
      sendEmail: true,
    });

    return Response.json(
      { error: "Settings not found for user" },
      { status: 404 }
    );
  }

  const feeRate = settings.performance_fee_rate ?? 0.20;
  const highWaterMark = settings.high_water_mark ?? 0;
  const stripeCustomerId = settings.stripe_customer_id;

  //
  // 2. Get latest equity snapshot
  //
  const { data: equityRows, error: equityError } = await supabase
    .from("follower_equity_history")
    .select("equity")
    .eq("user_id", user_id)
    .order("timestamp", { ascending: false })
    .limit(1);

  if (equityError || !equityRows || equityRows.length === 0) {
    await sendNotification({
      userId: user_id,
      type: "system_warning",
      title: "Fee Crystallization Failed",
      message: "No equity history found for your account.",
      sendEmail: true,
    });

    return Response.json(
      { error: "No equity history found" },
      { status: 404 }
    );
  }

  const currentEquity = equityRows[0].equity;

  //
  // 3. Calculate profit above HWM
  //
  const profit = Math.max(0, currentEquity - highWaterMark);
  const feeAmount = profit * feeRate;

  //
  // 4. If no profit → no fee → update HWM and exit
  //
  if (profit <= 0) {
    await supabase
      .from("copy_trading_settings")
      .update({ high_water_mark: currentEquity })
      .eq("user_id", user_id);

    return Response.json({
      success: true,
      fee_charged: false,
      reason: "No profit above high-water mark",
      new_high_water_mark: currentEquity,
    });
  }

  //
  // 5. Create fee charge record (pending)
  //
  const { data: chargeRow, error: chargeError } = await supabase
    .from("performance_fee_charges")
    .insert({
      user_id,
      period_start,
      period_end,
      profit,
      fee_rate_used: feeRate,
      fee_amount: feeAmount,
      status: "pending",
    })
    .select()
    .single();

  if (chargeError) {
    await sendNotification({
      userId: user_id,
      type: "system_warning",
      title: "Fee Crystallization Failed",
      message: "Unable to create fee charge record.",
      sendEmail: true,
    });

    return Response.json(
      { error: "Failed to create fee charge record" },
      { status: 500 }
    );
  }

  //
  // 6. Stripe invoice creation
  //
  let stripe_invoice_id: string | null = null;

  if (stripeCustomerId) {
    try {
      const { invoice } = await createPerformanceFeeInvoice({
        customerId: stripeCustomerId,
        amountUsd: feeAmount,
        description: `Performance fee for ${period_start} to ${period_end}`,
      });

      stripe_invoice_id = invoice.id;

      // Notify user invoice was created
      await sendNotification({
        userId: user_id,
        type: "invoice_created",
        title: "Performance Fee Invoice Created",
        message: `A new performance fee invoice has been created for $${feeAmount.toFixed(
          2
        )}.`,
        sendEmail: true,
      });
    } catch (err) {
      console.error("Stripe invoice creation failed", err);

      await sendNotification({
        userId: user_id,
        type: "system_warning",
        title: "Invoice Creation Failed",
        message:
          "We were unable to create your performance fee invoice. Please contact support.",
        sendEmail: true,
      });

      return Response.json(
        { error: "Stripe invoice creation failed" },
        { status: 502 }
      );
    }
  }

  //
  // 7. Update fee charge with Stripe invoice ID
  //
  await supabase
    .from("performance_fee_charges")
    .update({ stripe_invoice_id, status: "paid" })
    .eq("id", chargeRow.id);

  //
  // 8. Update high-water mark to current equity
  //
  await supabase
    .from("copy_trading_settings")
    .update({ high_water_mark: currentEquity })
    .eq("user_id", user_id);

  //
  // 9. Send fee crystallized notification
  //
  await sendNotification({
    userId: user_id,
    type: "fee_crystallized",
    title: "Performance Fee Charged",
    message: `A performance fee of $${feeAmount.toFixed(
      2
    )} has been crystallized for the period ${period_start} → ${period_end}.`,
    sendEmail: true,
  });

  //
  // 10. Return final crystallization result
  //
  return Response.json({
    success: true,
    user_id,
    period_start,
    period_end,
    equity: currentEquity,
    high_water_mark: currentEquity,
    profit,
    fee_rate: feeRate,
    fee_amount: feeAmount,
    stripe_invoice_id,
  });
}


