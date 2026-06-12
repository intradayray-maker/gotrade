import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/utils/supabase/server"

export async function GET(req: Request, context: any) {
  const { id } = await context.params
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("profiles")
    .select("*")first_name, last_name")
    .eq("id", id)
    .maybeSingle()

  if (error || !data) {
    return NextResponse.json({
      first_name: "",
      last_name: ""
    })
  }

  return NextResponse.json({
    first_name: data.first_name ?? "",
    last_name: data.last_name ?? ""
  })
}
