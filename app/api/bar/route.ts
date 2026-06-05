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

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
