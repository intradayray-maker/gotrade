import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/utils/supabase/route";
import { getAccount } from "@/lib/brokers/router";

export const runtime = "nodejs";

export async function GET() {
  const supabase = await createRouteHandlerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // TODO: Blofin-specific account normalization will be expanded here later.
    const account = await getAccount(user.id);

    return NextResponse.json({
      equity: account.equity,
      cash: (account as any).cash,
      buying_power: (account as any).buying_power,
      portfolio_value: (account as any).portfolio_value,
      status: account.status,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch account";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
