import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/utils/supabase/route";
import { getPositions } from "@/lib/brokers/router";

export const runtime = "nodejs";

type BlofinPositionView = {
  avg_entry_price?: string;
  current_price?: string;
  market_value?: string;
  qty?: string;
  side?: string;
  symbol: string;
  unrealized_pl?: string;
  unrealized_plpc?: string;
};

export async function GET() {
  const supabase = await createRouteHandlerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // TODO: Blofin position fields will be normalized once the real API is wired.
    const positions = await getPositions(user.id);
    const normalized = positions.map((position: BlofinPositionView) => ({
      avg_entry_price: position.avg_entry_price,
      current_price: position.current_price,
      market_value: position.market_value,
      qty: position.qty,
      side: position.side,
      symbol: position.symbol,
      unrealized_pl: position.unrealized_pl,
      unrealized_plpc: position.unrealized_plpc,
    }));

    return NextResponse.json({ positions: normalized });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch positions";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
