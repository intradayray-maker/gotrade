import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/utils/supabase/server"

export async function POST(req: Request, context: any) {
  const { id } = await context.params
  const supabase = await createSupabaseServerClient()
  const body = await req.json()

  const { first_name, last_name } = body

  const { error } = await supabase
    .from("profiles")
    .update({
      first_name,
      last_name
    })
    .eq("id", id)

  if (error) {
    console.error("Alias update error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
