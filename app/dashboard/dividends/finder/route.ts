// app/api/dividends/finder/route.ts

import { NextResponse } from "next/server";
import { getBatchDividendData } from "@/utils/massiveFlat";

export async function POST(req: Request) {
  console.log("🔥 [Finder API] Route HIT");

  try {
    const body = await req.json();
    const tickers = Array.isArray(body?.tickers) ? body.tickers : [];

    console.log("🔎 [Finder API] Fetching Massive data for:", tickers);

    // FIX: await the async function
    const results = await getBatchDividendData(tickers);

    console.log("📤 [Finder API] Returning results:", results);

    return NextResponse.json({ results });
  } catch (err) {
    console.error("💥 [Finder API] ERROR:", err);
    return NextResponse.json({ results: [] });
  }
}

export async function GET() {
  return NextResponse.json({ results: [] });
}
