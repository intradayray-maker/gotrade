import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/utils/supabase/route";
import { getAccount, getPositions } from "@/lib/brokers/router";

export const runtime = "nodejs";

export async function GET() {
  const supabase = await createRouteHandlerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    // TODO: Expand this into a Blofin-specific health check once live credentials exist.
    const [account, positions] = await Promise.all([
      getAccount(user.id),
      getPositions(user.id),
    ]);

    return NextResponse.json({
      success: true,
      account,
      positions,
    });
  } catch (error) {
    console.error("Blofin test error:", error);
    return NextResponse.json(
      { error: "Failed to connect to Blofin" },
      { status: 400 }
    );
  }
}
