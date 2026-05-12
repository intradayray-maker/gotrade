import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/utils/supabase/route";

export async function POST(req: Request) {
  const supabase = await createRouteHandlerClient();
  const { user_id } = await req.json();

  const { data } = await supabase
    .from("hwm_history")
    .select("*")
    .eq("user_id", user_id)
    .order("timestamp", { ascending: true });

  return NextResponse.json({ hwm_history: data });
}


