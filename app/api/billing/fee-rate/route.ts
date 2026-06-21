import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/utils/supabase/route";

export async function POST(req: Request) {
  const supabase = await createRouteHandlerClient();
  const { user_id, fee_rate } = await req.json();

  await supabase
    .from("copy_trading_settings")
    .update({ performance_fee_rate: fee_rate })
    .eq("user_id", user_id);

  return NextResponse.json({ success: true });
}


