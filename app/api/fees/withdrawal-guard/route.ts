import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/utils/supabase/route";
import { createPerformanceFeeInvoice } from "@/utils/stripe/server";

export async function POST(req: Request) {
  const supabase = await createRouteHandlerClient();
  const { user_id, withdrawal_amount } = await req.json();

  if (!user_id || withdrawal_amount === undefined) {
    return NextResponse.json(
      { error: "Missing user_id or withdrawal_amount" },
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
    return NextResponse.json(
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
    return NextResponse.json(
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
  // 4. If no profit → allow withdrawal immediately
  //
  if (profit <= 0) {
    return NextResponse.json({
      allowed: true,
      fee_required: false,
      reason: "No profit above high-water mark",
      withdrawal_amount,
    });
  }

  //
  // 5. Profit exists → fee must be crystallized BEFORE withdrawal
  //
  const period_start = new Date().toISOString().slice(0, 10);
  const period_end = period_start;

  //
  // 5A. Create fee charge record
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
    return NextResponse.json(
      { error: "Failed to create fee charge record" },
      { status: 500 }
    );
  }

  //
  // 5B. Stripe invoice creation
  //
  let stripe_invoice_id: string | null = null;

  if (stripeCustomerId) {
    try {
      const { invoice } = await createPerformanceFeeInvoice({
        customerId: stripeCustomerId,
        amountUsd: feeAmount,
        description: `Performance fee crystallized before withdrawal`,
      });

      stripe_invoice_id = invoice.id;
    } catch (err) {
      console.error("Stripe invoice creation failed", err);

      return NextResponse.json(
        { error: "Stripe invoice creation failed" },
        { status: 502 }
      );
    }
  }

  //
  // 5C. Mark fee as paid
  //
  await supabase
    .from("performance_fee_charges")
    .update({ status: "paid", stripe_invoice_id })
    .eq("id", chargeRow.id);

  //
  // 6. Update high-water mark
  //
  await supabase
    .from("copy_trading_settings")
    .update({ high_water_mark: currentEquity })
    .eq("user_id", user_id);

  //
  // 7. Return withdrawal approval
  //
  return NextResponse.json({
    allowed: true,
    fee_required: true,
    fee_amount: feeAmount,
    profit,
    fee_rate: feeRate,
    new_high_water_mark: currentEquity,
    withdrawal_amount,
    stripe_invoice_id,
  });
}


