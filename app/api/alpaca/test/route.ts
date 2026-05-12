import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/utils/supabase/route";
import { getAlpacaAccount, getAlpacaPositions } from "@/lib/alpacaClient";

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
    const [account, positions] = await Promise.all([
      getAlpacaAccount(user.id),
      getAlpacaPositions(user.id),
    ]);

    return NextResponse.json({
      success: true,
      account,
      positions,
    });
  } catch (error) {
    console.error("Alpaca test error:", error);
    return NextResponse.json(
      { error: "Failed to connect to Alpaca" },
      { status: 400 }
    );
  }
}


