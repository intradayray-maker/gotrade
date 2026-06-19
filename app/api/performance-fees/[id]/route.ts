import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/utils/supabase/route";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const supabase = await createRouteHandlerClient();
  const { id: followerId } = await context.params;

  try {
    // 1. Load fee history
    const { data: fees, error } = await supabase
      .from("performance_fees")
      .select("*")
      .eq("follower_user_id", followerId)
      .order("crystallized_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Failed to load performance fees" },
        { status: 500 }
      );
    }

    // 2. Total fees paid
    const totalFees = (fees ?? []).reduce(
      (sum, f) => sum + Number(f.amount),
      0
    );

    // 3. Most recent crystallization
    const lastCrystallized = fees?.[0]?.crystallized_at ?? null;

    // 4. Next crystallization date (1st of next month)
    const now = new Date();
    const nextCrystallization = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );

    return NextResponse.json({
      follower_id: followerId,
      total_fees_paid: totalFees,
      last_crystallized_at: lastCrystallized,
      next_crystallization: nextCrystallization.toISOString(),
      fee_history: fees ?? [],
    });
  } catch (err) {
    console.error("Performance fee API error:", err);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}

