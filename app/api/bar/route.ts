// app/api/bar/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (typeof body.high !== "number" || typeof body.low !== "number") {
      return NextResponse.json({ error: "Invalid bar data" }, { status: 400 });
    }

    const payload = {
      high: body.high,
      low: body.low,
      timestamp: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("trade_state")
      .update(payload)
      .eq("id", (await getSingleId()));

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

async function getSingleId() {
  const { data, error } = await supabase
    .from("trade_state")
    .select("id")
    .limit(1)
    .single();

  if (error || !data) throw new Error("trade_state row missing");
  return data.id;
}
