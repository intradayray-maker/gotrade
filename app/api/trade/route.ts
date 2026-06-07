// app/api/trade/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Your single-row UUID
const ROW_ID = "65f3ad34-2fd0-4dab-91c2-80fc676198e9";

export async function POST(req: Request) {
  // Respond to TradingView immediately (prevents 500 timeout)
  const response = NextResponse.json({ ok: true });

  // Process the trade update asynchronously
  (async () => {
    try {
      const body = await req.json();

      // Convert numeric fields safely
      const entry = Number(body.entry);
      const stop = Number(body.stop);
      const tp = Number(body.tp);

      // Validate required fields
      if (!body.side || isNaN(entry) || isNaN(stop)) {
        console.error("Invalid trade payload:", body);
        return;
      }

      const payload = {
        side: body.side,
        ticker: body.ticker ?? "ETHUSDT.P",
        entry,
        stop,
        tp: isNaN(tp) ? null : tp,
        timestamp: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("trade_state")
        .update(payload)
        .eq("id", ROW_ID);

      if (error) {
        console.error("SUPABASE TRADE UPDATE ERROR:", error);
      }
    } catch (err) {
      console.error("TRADE WEBHOOK ERROR:", err);
    }
  })();

  return response;
}
