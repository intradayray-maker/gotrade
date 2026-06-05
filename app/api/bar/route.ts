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
    const user_id = req.headers.get("x-user-id");

    if (!user_id) {
      return NextResponse.json({ error: "Missing x-user-id" }, { status: 400 });
    }

    const { high, low } = body;

    const { error } = await supabase.from("latest_bar").upsert(
      [
        {
          user_id,
          high,
          low,
          timestamp: new Date().toISOString(),
        },
      ],
      { onConflict: "user_id" }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
