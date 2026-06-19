// app/api/trades/list/route.ts

import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@/utils/supabase/route"
import { getAlpacaConfigForUser } from "@/lib/brokers/alpaca/alpacaClient"

export const runtime = "nodejs"

type AlpacaActivity = {
  activity_type: string
  id: string
  price: string
  qty: string
  side: "buy" | "sell"
  symbol: string
  transaction_time: string
}

function normalizeTrade(a: AlpacaActivity) {
  return {
    id: a.id,
    symbol: a.symbol,
    side: a.side,
    qty: Number(a.qty),
    price: Number(a.price),
    created_at: a.transaction_time,
  }
}

export async function GET(req: Request) {
  try {

    const url = new URL(req.url)

    const page = Number(url.searchParams.get("page") || "1")
    const limit = Number(url.searchParams.get("limit") || "20")

    const symbol = url.searchParams.get("symbol") || undefined
    const side = url.searchParams.get("side") || undefined
    const start = url.searchParams.get("start") || undefined
    const end = url.searchParams.get("end") || undefined

    const supabase = await createRouteHandlerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    const config = await getAlpacaConfigForUser(user.id)

    const params = new URLSearchParams()
    params.set("activity_types", "FILL")

    if (symbol) params.set("symbol", symbol)
    if (start) params.set("after", start)
    if (end) params.set("until", end)

    const res = await fetch(
      `${config.baseUrl}/v2/account/activities?${params.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
          "APCA-API-KEY-ID": config.apiKeyId,
          "APCA-API-SECRET-KEY": config.apiSecret,
        },
      }
    )

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json(
        {
          error: "Failed to fetch trades from Alpaca",
          details: text,
        },
        { status: res.status }
      )
    }

    const activities = (await res.json()) as AlpacaActivity[]

    let fills = activities.filter(
      (a) => a.activity_type === "FILL"
    )

    if (side === "buy" || side === "sell") {
      fills = fills.filter(
        (fill) => fill.side === side
      )
    }

    // ⭐ FIX: Alpaca ignores ?symbol= — filter manually
    if (symbol) {
      const s = symbol.toUpperCase()
      fills = fills.filter(
        (fill) => fill.symbol.toUpperCase() === s
      )
    }

    fills.sort(
      (a, b) =>
        new Date(b.transaction_time).getTime() -
        new Date(a.transaction_time).getTime()
    )

    const total = fills.length
    const totalPages = Math.max(
      1,
      Math.ceil(total / limit)
    )

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    return NextResponse.json({
      data: fills
        .slice(startIndex, endIndex)
        .map(normalizeTrade),
      page,
      totalPages,
    })

  } catch (err) {

    console.error("Trade history fetch failed:", err)

    const message =
      err instanceof Error
        ? err.message
        : "Unexpected error fetching trades"

    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
