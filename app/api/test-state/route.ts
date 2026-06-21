import { NextResponse } from "next/server";

let state = { side: "flat" };

export async function GET() {
  return NextResponse.json(state);
}

export async function POST(req: Request) {
  const body = await req.json();
  state.side = body.side;
  return NextResponse.json(state);
}
