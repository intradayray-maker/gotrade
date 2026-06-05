// app/api/margin/route.ts

import { NextResponse } from "next/server";
import { latestBar } from "@/app/api/trade/route";

export async function POST(req: Request) {
  try {
    const { dollar_risk, leverage } = await req.json();

    if (typeof dollar_risk !== "number" || typeof leverage !== "number") {
      return NextResponse.json(
        { error: "Invalid dollar_risk or leverage" },
        { status: 400 }
      );
    }

    if (!latestBar) {
      return NextResponse.json(
        { error: "No latest bar found" },
        { status: 400 }
      );
    }

    const { high, low } = latestBar;
    const risk_distance = Math.abs(high - low);
    const size = risk_distance > 0 ? dollar_risk / risk_distance : 0;
    const required_margin = leverage > 0 ? (size * high) / leverage : 0;

    return NextResponse.json({
      risk_distance,
      size,
      required_margin,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
