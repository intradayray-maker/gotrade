// app/api/margin/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const user_id = req.headers.get("x-user-id");

    if (!user_id) {
      return NextResponse.json(
        { error: "Missing x-user-id header" },
        { status: 400 }
      );
    }

    // 1. Parse incoming slider values
    const { dollar_risk, leverage } = await req.json();

    if (typeof dollar_risk !== "number" || typeof leverage !== "number") {
      return NextResponse.json(
        { error: "Invalid dollar_risk or leverage" },
        { status: 400 }
      );
    }

    // 2. Fetch the latest bar (GLOBAL — not per user)
    const { data: bar, error: barError } = await supabase
      .from("latest_bar")
      .select("high, low")
      .eq("id", 1)
      .single();

    if (barError || !bar) {
      return NextResponse.json(
        { error: "No latest bar found" },
        { status: 400 }
      );
    }

    const { high, low } = bar;

    // 3. Compute risk distance, size, margin
    const risk_distance = Math.abs(high - low);
    const size = risk_distance > 0 ? dollar_risk / risk_distance : 0;
    const required_margin = leverage > 0 ? (size * high) / leverage : 0;

    // 4. Return computed values
    return NextResponse.json({
      risk_distance,
      size,
      required_margin,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
