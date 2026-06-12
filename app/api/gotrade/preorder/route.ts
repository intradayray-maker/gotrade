import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@/utils/supabase/route"
import { createClient } from "@supabase/supabase-js"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const sort = url.searchParams.get("sort") ?? "newest"
    const filter = url.searchParams.get("filter") ?? "all"
    const query = (url.searchParams.get("q") ?? "").trim().toLowerCase()

    const supabase = await createRouteHandlerClient()
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")is_admin")
      .eq("id", userData.user.id)
      .single()

    if (profileError || !profile?.is_admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { data: preorders, error: preordersError } = await supabase
      .from("gotrade_preorders")
      .select("*")*")
      .order("created_at", { ascending: false })

    if (preordersError) {
      return NextResponse.json({ error: preordersError.message }, { status: 500 })
    }

    let items = preorders || []

    if (query) {
      items = items.filter((p: any) =>
        (p.name || "").toLowerCase().includes(query) ||
        (p.email || "").toLowerCase().includes(query)
      )
    }

    if (filter === "has-capital") {
      items = items.filter((p: any) => p.capital && p.capital > 0)
    }

    if (filter === "no-capital") {
      items = items.filter((p: any) => !p.capital || p.capital === 0)
    }

    if (sort === "oldest") {
      items = [...items].sort(
        (a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )
    } else if (sort === "capital-high") {
      items = [...items].sort((a: any, b: any) => (b.capital || 0) - (a.capital || 0))
    } else if (sort === "capital-low") {
      items = [...items].sort((a: any, b: any) => (a.capital || 0) - (b.capital || 0))
    }

    return NextResponse.json(items)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, capital } = body

    const supabase =
      createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

    const { error } =
      await supabase
        .from("gotrade_preorders")
        .insert([
          { name, email, capital }
        ])

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
