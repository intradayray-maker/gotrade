import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/utils/supabase/route";
import { createPerformanceFeeInvoice } from "@/utils/stripe/server";

export async function POST(req: Request) {
  const supabase = await createRouteHandlerClient();

  const { period_start, period_end } = await req.json();

  if (!period_start || !period_end) {
    return NextResponse.json(
      { error: "Missing period_start or period_end" },
      { status: 400 }
    );
  }

  //
  // 1. Load all followers with fee settings
  //
  const { data: followers, error: followerError } = await supabase
    .from("copy_trading_settings")
    .select("user_id, performance_fee_rate, high_water_mark, stripe_customer_id")
    .eq("enabled", true);

  if (followerError || !followers) {
    return NextResponse.json(
      { error: "Failed to load followers" },
      { status: 500 }
    );
  }

  const results: any[] = [];

  //
  // 2. Loop through each follower
  //
  for (const follower of followers) {
    const user_id = follower.user_id;
    if (!user_id) continue;

    //
    // 2A. Get latest equity snapshot
    //
    const { data: equityRows } = await supabase
      .from("follower_equity_history")
      .select("equity")
      .eq("user_id", user_id)
      .order("timestamp", { ascending: false })
      .limit(1);

    if (!equityRows || equityRows.length === 0) {
      results.push({
        user_id,
        status: "skipped",
        reason: "No equity history",
      });
      continue;
    }

    const currentEquity = equityRows[0].equity;
    const highWaterMark = follower.high_water_mark ?? 0;
    const feeRate = follower.performance_fee_rate ?? 0.20;

    //
    // 2B. Calculate profit above HWM
    //
    const profit = Math.max(0, currentEquity - highWaterMark);
    const feeAmount = profit * feeRate;

    //
    // 2C. If no profit → update HWM and skip fee
    //
    if (profit <= 0) {
      await supabase
        .from("copy_trading_settings")
        .update({ high_water_mark: currentEquity })
        .eq("user_id", user_id);

      results.push({
        user_id,
        status: "no_fee",
        new_high_water_mark: currentEquity,
      });

      continue;
    }

    //
    // 2D. Create fee charge record
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
      results.push({
        user_id,
        status: "error",
        error: "Failed to create fee charge record",
      });
      continue;
    }

    //
    // 2E. Stripe invoice creation
    //
    let stripe_invoice_id: string | null = null;

    if (follower.stripe_customer_id) {
      try {
        const { invoice } = await createPerformanceFeeInvoice({
          customerId: follower.stripe_customer_id,
          amountUsd: feeAmount,
          description: `Performance fee for ${period_start} to ${period_end}`,
        });

        stripe_invoice_id = invoice.id;
      } catch (err) {
        console.error("Stripe invoice creation failed", err);

        results.push({
          user_id,
          status: "stripe_error",
          error: "Stripe invoice creation failed",
        });

        // Do NOT update HWM or mark fee as paid
        continue;
      }
    }

    //
    // 2F. Mark fee as paid
    //
    await supabase
      .from("performance_fee_charges")
      .update({ status: "paid", stripe_invoice_id })
      .eq("id", chargeRow.id);

    //
    // 2G. Update high-water mark
    //
    await supabase
      .from("copy_trading_settings")
      .update({ high_water_mark: currentEquity })
      .eq("user_id", user_id);

    //
    // 2H. Push result
    //
    results.push({
      user_id,
      status: "fee_charged",
      profit,
      fee_rate: feeRate,
      fee_amount: feeAmount,
      new_high_water_mark: currentEquity,
      stripe_invoice_id,
    });
  }

  //
  // 3. Return summary of all follower results
  //
  return NextResponse.json({
    success: true,
    period_start,
    period_end,
    results,
  });
}


