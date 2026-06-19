import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/utils/supabase/route";

export async function POST(req: Request) {
  const supabase = await createRouteHandlerClient();
  const { user_id } = await req.json();

  const { data } = await supabase
    .from("performance_fee_charges")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ fees: data });
}


