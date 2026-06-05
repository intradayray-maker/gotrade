// app/api/bar/route.ts

import { NextResponse } from "next/server";
import { setLatestBar } from "@/app/api/trade/store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
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
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
