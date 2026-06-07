// app/api/trade/route.ts

import { NextResponse } from "next/server";
import {
  latestTrade,
  latestBar,
  setLatestTrade,
  setLatestBar,
  TradeData,
} from "./store";

// ---------------------------------------------------------
// POST — TradingView Webhook Handler
// ---------------------------------------------------------
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // -----------------------------------------------------
    // BAR UPDATE — IGNORE FOR TRADE LOGIC
    // -----------------------------------------------------
    if (body.type === "bar") {
      const { high, low } = body;

      if (typeof high !== "number" || typeof low !== "number") {
        return NextResponse.json({ error: "Invalid bar data" }, { status: 400 });
      }

      setLatestBar({
        high,
        low,
        updated_at: new Date().toISOString(),

        news_today: Boolean(body.news_today),
        news_message: body.news_message ?? "",
        next_news_time: body.next_news_time ?? "None",

        news_window_active: Boolean(body.news_window_active),
        news_countdown: Number(body.news_countdown ?? 0),
      });

      return NextResponse.json({ status: "bar stored" });
    }

    // -----------------------------------------------------
    // IGNORE ANYTHING THAT IS NOT A TRADE
    // -----------------------------------------------------
    if (body.type !== "trade") {
      return NextResponse.json({ status: "ignored non-trade" });
    }

    // -----------------------------------------------------
    // TRADE UPDATE
    // -----------------------------------------------------
    const trade: TradeData = {
      ticker: String(body.ticker ?? ""),
      side: String(body.side ?? ""),
      entry: Number(body.entry ?? 0),
      stop: Number(body.stop ?? 0),
      tp: Number(body.tp ?? 0),
      timestamp: String(body.timestamp ?? ""),

      news_today: Boolean(body.news_today),
      news_message: body.news_message ?? "",
      next_news_time: body.next_news_time ?? "None",

      news_window_active: Boolean(body.news_window_active),
      news_countdown: Number(body.news_countdown ?? 0),
    };

    setLatestTrade(trade);

    return NextResponse.json({ status: "trade stored" });
  } catch (err) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}

// ---------------------------------------------------------
// GET — Return Latest Trade + Bar
// ---------------------------------------------------------
export async function GET() {
  return NextResponse.json({
    trade: latestTrade,
    bar: latestBar,
  });
}
