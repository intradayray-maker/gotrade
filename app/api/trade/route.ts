import { NextResponse } from "next/server"

type Trade = {
  ticker: string
  side: "long" | "short"
  size: number
  entry: number
  tp: number
  stop: number
} | null

let latestTrade: Trade = null

export async function POST(req: Request) {
  const body: Trade = await req.json()
  latestTrade = body
  return NextResponse.json({ status: "ok" })
}

export async function GET() {
  return NextResponse.json(latestTrade)
}
