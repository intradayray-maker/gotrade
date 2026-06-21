// app/api/dividends/finder/route.ts

import { NextResponse } from "next/server";
import { getBatchDividendData } from "@/utils/massiveFlat";

export async function POST(req: Request) {
  console.log("🔥 [Finder API] Route HIT");

  try {
    const body = await req.json();
    const tickers = Array.isArray(body?.tickers) ? body.tickers : [];

    console.log("🔎 [Finder API] Fetching Massive Flat data for:", tickers);

    if (tickers.length === 0) {
      console.warn("⚠️ [Finder API] No tickers provided");
      return NextResponse.json({ results: [] });
    }

    const results = getBatchDividendData(tickers);

    console.log("📤 [Finder API] Returning results:", results);

    return NextResponse.json({ results });
  } catch (err) {
    console.error("💥 [Finder API] ERROR:", err);
    return NextResponse.json({
      results: [],
      error: "Finder API failed"
    });
  }
}
