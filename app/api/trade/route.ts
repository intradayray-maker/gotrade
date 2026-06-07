// app/api/bar/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ROW_ID = "65f3ad34-2fd0-4dab-91c2-80fc676198e9";

export async function POST(req: Request) {
  // Respond to TradingView immediately
  const response = NextResponse.json({ ok: true });

  // Process the update asynchronously (non-blocking)
  (async () => {
    try {
      const body = await req.json();

      const high = Number(body.high);
      const low = Number(body.low);

      if (isNaN(high) || isNaN(low)) {
        console.error("Invalid bar data:", body);
        return;
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
      }
    } catch (err) {
      console.error("BAR WEBHOOK ERROR:", err);
    }
  })();

  return response;
}
