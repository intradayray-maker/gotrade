// app/api/webhook-test/route.ts
import { NextResponse } from "next/server";

let last = {
  time: null as string | null,
  ip: null as string | null,
  ua: null as string | null,
  body: null as any,
};

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const ua = req.headers.get("user-agent") || "unknown";

  const body = await req.json();

  last = {
    time: new Date().toISOString(),
    ip,
    ua,
    body,
  };

  console.log("WEBHOOK-TEST HIT:", last);

  return NextResponse.json({ ok: true, last });
}

export async function GET() {
  return NextResponse.json(last);
}
