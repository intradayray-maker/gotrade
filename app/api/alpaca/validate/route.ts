import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/utils/supabase/route";
import { getAlpacaAccount } from "@/lib/alpacaClient";

export const runtime = "nodejs";

export async function POST() {
  const supabase = await createRouteHandlerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const account = await getAlpacaAccount(user.id);

    return NextResponse.json({
      success: true,
      account: {
        equity: account.equity,
        cash: account.cash,
        buying_power: account.buying_power,
        portfolio_value: account.portfolio_value,
        status: account.status,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Validation failed";

    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}


