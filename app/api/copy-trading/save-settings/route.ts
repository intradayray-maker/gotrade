import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/utils/supabase/route";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const supabase = await createRouteHandlerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const enabled: boolean = !!body.enabled;
    const allocationValue: number = Number(body.allocation_value ?? 0);
    const allocationMode: string = body.allocation_mode ?? "fixed_dollar";
    const maxAllocationPct: number = Number(body.max_allocation_pct ?? 0.8);

    // ---------------------------------------------
    // 1) Write to follower_allocation_settings
    //    (ENGINE SOURCE OF TRUTH)
    // ---------------------------------------------
    const { error: followerError } = await supabase
      .from("follower_allocation_settings")
      .upsert(
        {
          user_id: user.id,
          mode: allocationMode,
          value: allocationValue,
          max_allocation_pct: maxAllocationPct,
          enabled,
        },
        { onConflict: "user_id" }
      );

    if (followerError) {
      console.error("Follower allocation error:", followerError);
      return NextResponse.json(
        { error: "Failed to save follower allocation settings" },
        { status: 500 }
      );
    }

    // ---------------------------------------------
    // 2) Mirror into copy_trading_settings
    //    (UI compatibility + legacy support)
    // ---------------------------------------------
    const { error: legacyError } = await supabase
      .from("copy_trading_settings")
      .upsert(
        {
          user_id: user.id,
          enabled,
          allocation_value: allocationValue,
        },
        { onConflict: "user_id" }
      );

    if (legacyError) {
      console.error("Legacy settings error:", legacyError);
      return NextResponse.json(
        { error: "Failed to save legacy settings" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
