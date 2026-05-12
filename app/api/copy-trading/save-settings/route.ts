import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/utils/supabase/route";

import type { CopyTradingSettingsPayload } from "@/types/copy-trading";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as CopyTradingSettingsPayload;
    const supabase = await createRouteHandlerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { error } = await supabase.from("copy_trading_settings").upsert(
      {
        user_id: user.id,
        ...payload,
      },
      {
        onConflict: "user_id",
      }
    );

    if (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Failed to save settings" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}


