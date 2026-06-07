// app/api/trade/route.ts

import { NextResponse } from "next/server";
import {
  latestTrade,
  latestBar,
  setLatestTrade,
  setLatestBar,
  TradeData,
  tradeVersion,
} from "./store";

const validSides = new Set(["long", "short", "flat"]);

const isValidTradeSide = (side: unknown): side is "long" | "short" | "flat" =>
  typeof side === "string" && validSides.has(side.toLowerCase());

const isSameTrade = (a: TradeData | null, b: TradeData) => {
  return (
    a !== null &&
    a.ticker === b.ticker &&
    a.side === b.side &&
    a.entry === b.entry &&
    a.stop === b.stop &&
    a.tp === b.tp
  );
};

export async function POST(req: Request) {
  try {
    console.log("🔥 INSTANCE:", Math.random());

    const webhookSecret = process.env.TRADINGVIEW_WEBHOOK_SECRET;
    if (webhookSecret) {
      const headerSecret = req.headers.get("x-webhook-secret");
      if (headerSecret !== webhookSecret) {
        return NextResponse.json(
          { error: "Unauthorized webhook" },
          { status: 401 }
        );
      }
    }

    const body = await req.json();
    console.log("🔥 WEBHOOK RECEIVED:", body);

    // BAR UPDATE
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

    // IGNORE NON-TRADE
    if (body.type !== "trade") {
      return NextResponse.json({ status: "ignored non-trade" });
    }

    // TRADE UPDATE
    if (typeof body.ticker !== "string" || !body.ticker.trim()) {
      return NextResponse.json({ error: "Invalid ticker" }, { status: 400 });
    }

    if (!isValidTradeSide(body.side)) {
      return NextResponse.json({ error: "Invalid side" }, { status: 400 });
    }

    if (
      typeof body.entry !== "number" ||
      typeof body.stop !== "number" ||
      typeof body.tp !== "number" ||
      !Number.isFinite(body.entry) ||
      !Number.isFinite(body.stop) ||
      !Number.isFinite(body.tp)
    ) {
      return NextResponse.json({ error: "Invalid trade values" }, { status: 400 });
    }

    const trade: TradeData = {
      ticker: body.ticker.trim(),
      side: String(body.side).toLowerCase(),
      entry: body.entry,
      stop: body.stop,
      tp: body.tp,
      timestamp: String(body.timestamp ?? ""),

      news_today: Boolean(body.news_today),
      news_message: body.news_message ?? "",
      next_news_time: body.next_news_time ?? "None",

      news_window_active: Boolean(body.news_window_active),
      news_countdown: Number(body.news_countdown ?? 0),
    };

    if (isSameTrade(latestTrade, trade)) {
      return NextResponse.json({ status: "duplicate trade ignored" });
    }

    setLatestTrade(trade);

    return NextResponse.json({ status: "trade stored" });
  } catch (err) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({
    trade: latestTrade,
    bar: latestBar,
    version: tradeVersion,
  });
}
