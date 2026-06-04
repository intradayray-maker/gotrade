import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    signals: [],
    message: "Signals placeholder endpoint",
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({
    success: true,
    received: body,
    message: "Signals placeholder endpoint",
  });
}
