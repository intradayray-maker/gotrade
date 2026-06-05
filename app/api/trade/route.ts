import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ---------------------------------------------------------
// POST — TradingView Webhook Handler (Bars + Trades)
// ---------------------------------------------------------
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1) BAR ALERT HANDLER
    if (body.type === "bar") {
      const { high, low } = body;

      if (typeof high !== "number" || typeof low !== "number") {
        return NextResponse.json({ error: "Invalid bar data" }, { status: 400 });
      }

      await supabase.from("latest_bar").upsert(
        [
          {
            id: 1,
            high,
            low,
            updated_at: new Date().toISOString(),
          },
        ],
        { onConflict: "id" }
      );

      return NextResponse.json({ status: "bar stored" });
    }

    // 2) TRADE ALERT HANDLER
    const { ticker, side, entry, stop, tp, timestamp, user_id } = body;

    // TradingView CANNOT send headers → user_id MUST come from body
    if (!user_id) {
      return NextResponse.json(
        { error: "Missing user_id in alert body" },
        { status: 400 }
      );
    }

    // Fetch user settings
    const { data: settings } = await supabase
      .from("user_settings")
      .select("dollar_risk, leverage")
      .eq("user_id", user_id)
      .single();

    const dollarRisk = settings?.dollar_risk ?? 0;
    const leverage = settings?.leverage ?? 1;

    const risk_distance = Math.abs(entry - stop);
    const size = risk_distance > 0 ? dollarRisk / risk_distance : 0;
    const required_margin = leverage > 0 ? (size * entry) / leverage : 0;

    await supabase.from("latest_trade").upsert(
      [
        {
          user_id,
          ticker,
          side,
          entry,
          stop,
          tp,
          size,
          required_margin,
          risk_distance,
          timestamp,
        },
      ],
      { onConflict: "user_id" }
    );

    return NextResponse.json({ status: "trade stored" });
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );
  }
}

// ---------------------------------------------------------
// GET — Return Latest Trade for UI Polling
// ---------------------------------------------------------
export async function GET(req: Request) {
  try {
    const user_id = req.headers.get("x-user-id");

    if (!user_id) {
      return NextResponse.json(
        { error: "Missing x-user-id header" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("latest_trade")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "No trade found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch trade" },
      { status: 500 }
    );
  }
}
