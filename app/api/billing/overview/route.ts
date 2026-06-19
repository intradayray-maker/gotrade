import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/utils/supabase/route";

export async function GET() {
  const supabase = await createRouteHandlerClient();

  const { data } = await supabase
    .from("performance_fee_charges")
    .select("*");

  const fees = data ?? [];

  const totalRevenue = fees.reduce((sum, f) => sum + f.fee_amount, 0);

  return NextResponse.json({
    total_revenue: totalRevenue,
    total_fees: fees.length,
    fees,
  });
}


