// app/api/webhooks/tradingview/route.ts

import { NextResponse } from "next/server"
import { createTradeIntent } from "@/utils/trading/tradeIntentEngine"

export async function POST(req: Request)
{
 const body = await req.json().catch(() => null)

 if (!body)
  return NextResponse.json(
   { success: false, error: "Invalid JSON" },
   { status: 400 },
  )

 const intent =
  await createTradeIntent(body)

 return NextResponse.json(
  { success: true, intent },
 )
}
