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
// POST — TradingView Webhook Handler (Bars + Trades)
// ---------------------------------------------------------
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // -----------------------------------------------------
    // BAR UPDATE
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
      });

      return NextResponse.json({ status: "bar stored" });
    }

    // -----------------------------------------------------
    // TRADE UPDATE (with news fields)
    // -----------------------------------------------------
    const {
      ticker,
      side,
      entry,
      stop,
      tp,
      timestamp,

      // NEW FIELDS FROM PINE SCRIPT
      news_today,
      news_message,
      next_news_time,
    } = body;

    if (
      typeof ticker !== "string" ||
      typeof side !== "string" ||
      typeof entry !== "number" ||
      typeof stop !== "number" ||
      typeof tp !== "number" ||
      typeof timestamp !== "string"
    ) {
      return NextResponse.json({ error: "Invalid trade data" }, { status: 400 });
    }

    const trade: TradeData = {
      ticker,
      side,
      entry,
      stop,
      tp,
      timestamp,

      // NEW FIELDS (safe defaults)
      news_today: Boolean(news_today),
      news_message: news_message ?? "NO NEWS TODAY",
      next_news_time: next_news_time ?? "None",
    };

    setLatestTrade(trade);

    return NextResponse.json({ status: "trade stored" });
  } catch {
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
