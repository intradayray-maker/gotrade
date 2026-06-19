import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/utils/supabase/route";

export async function POST(req: Request) {
  const supabase = await createRouteHandlerClient();
  const { user_id, performance_fee_rate } = await req.json();

  if (!user_id || performance_fee_rate === undefined) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Optional: enforce sane limits
  if (performance_fee_rate < 0 || performance_fee_rate > 0.50) {
    return NextResponse.json(
      { error: "Fee rate must be between 0 and 0.50" },
      { status: 400 }
    );
  }

  // Update the follower's fee rate
  const { error } = await supabase
    .from("copy_trading_settings")
    .update({ performance_fee_rate })
    .eq("user_id", user_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    user_id,
    performance_fee_rate,
  });
}


