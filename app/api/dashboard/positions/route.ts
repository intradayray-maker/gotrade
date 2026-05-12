import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/utils/supabase/route";


export const runtime = "nodejs";

export async function GET() {
  const supabase = await createRouteHandlerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const query = supabase.from("follower_positions") as any;
  const { data, error } = await query
    .select("symbol, qty, avg_price")
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ positions: data ?? [] });
}


