import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@/utils/supabase/route"

export async function POST(req: Request) {
  try {
    const supabase = await createRouteHandlerClient()
    const body = await req.json()
    const { name, email, capital } = body

    // Allow public preorders (no auth required). If a logged-in user exists,
    // we could attach their id, but keep the insert simple for public usage.
    const { error } = await supabase
      .from("gotrade_preorders")
      .insert([{ name, email, capital }])

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
