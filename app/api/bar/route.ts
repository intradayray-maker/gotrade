// app/api/bar/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ROW_ID = "65f3ad34-2fd0-4dab-91c2-80fc676198e9";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Convert strings → numbers
    const high = Number(body.high);
    const low = Number(body.low);

    if (isNaN(high) || isNaN(low)) {
      return NextResponse.json({ error: "Invalid bar data" }, { status: 400 });
    }

    const payload = {
      high,
      low,
      timestamp: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("trade_state")
      .update(payload)
      .eq("id", ROW_ID);

    if (error) {
      console.error("SUPABASE BAR UPDATE ERROR:", error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("BAR WEBHOOK ERROR:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
