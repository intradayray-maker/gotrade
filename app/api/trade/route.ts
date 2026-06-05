//app\api\trade\route.ts

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create a Supabase client WITH auth context
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// JSON TradingView sends
type PineTrade = {
  ticker: string;
  side: string;
  entry: number;
  stop: number;
  tp: number;
  timestamp: string;
};

export async function POST(req: Request) {
  try {
    // 1. Parse incoming JSON
    const body = (await req.json()) as PineTrade;
    const { ticker, side, entry, stop, tp, timestamp } = body;

    // 2. Extract user_id from header (sent by your frontend)
    const user_id = req.headers.get("x-user-id");

    if (!user_id) {
      return NextResponse.json(
        { error: "Missing x-user-id header" },
        { status: 400 }
      );
    }

    // 3. Fetch user settings
    const { data: settings, error: settingsError } = await supabase
      .from("user_settings")
      .select("dollar_risk, leverage")
      .eq("user_id", user_id)
      .single();

    if (settingsError) {
      return NextResponse.json(
        { error: settingsError.message },
        { status: 400 }
      );
    }

    const dollarRisk = settings.dollar_risk;
    const leverage = settings.leverage;

    // 4. Compute risk, size, margin
    const risk_distance = Math.abs(entry - stop);
    const size = risk_distance > 0 ? dollarRisk / risk_distance : 0;
    const required_margin = leverage > 0 ? (size * entry) / leverage : 0;

    // 5. Store latest trade for this user
    const { error } = await supabase.from("latest_trade").upsert(
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

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

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
      .select(
        "ticker, side, size, entry, tp, stop, required_margin, risk_distance"
      )
      .eq("user_id", user_id)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
