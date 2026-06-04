import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

type Trade = {
  ticker: string
  side: string
  size: number
  entry: number
  tp: number
  stop: number
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Trade

    const { error } = await supabase.from("latest_trade").upsert(
      [
        {
          id: 1,
          ticker: body.ticker,
          side: body.side,
          size: body.size,
          entry: body.entry,
          tp: body.tp,
          stop: body.stop,
        },
      ],
      { onConflict: "id" }
    )

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ status: "ok" })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("latest_trade")
      .select("id,ticker,side,size,entry,tp,stop")
      .eq("id", 1)
      .maybeSingle()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
