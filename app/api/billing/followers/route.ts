import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/utils/supabase/route";

export async function GET() {
  const supabase = await createRouteHandlerClient();

  const { data } = await supabase
    .from("copy_trading_settings")
    .select("*");

  return NextResponse.json({ followers: data });
}


