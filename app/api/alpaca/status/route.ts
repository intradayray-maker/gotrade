export const dynamic = "force-dynamic"; // ⭐ prevents 30s caching
// export const revalidate = 0; // (alternative)

import { createRouteHandlerClient } from "@/utils/supabase/route";
import { decrypt } from "@/lib/encryption";

export async function GET() {
  try {
    const supabase = await createRouteHandlerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json(
        { status: "disconnected", brokerConnected: false },
        { status: 401 }
      );
    }

    const { data: row } = await supabase
      .from("broker_connections")
      .select("*")
      .eq("user_id", user.id)
      .eq("broker", "alpaca")
      .single();

    if (!row || !row.api_key_id || !row.api_secret_encrypted) {
      return Response.json(
        { status: "disconnected", brokerConnected: false },
        { status: 404 }
      );
    }

    let decryptedSecret;
    try {
      decryptedSecret = decrypt(row.api_secret_encrypted);
    } catch {
      return Response.json(
        { status: "disconnected", brokerConnected: false },
        { status: 500 }
      );
    }

    const baseUrl = row.paper_trading
      ? "https://paper-api.alpaca.markets"
      : "https://api.alpaca.markets";

    const alpacaRes = await fetch(`${baseUrl}/v2/account`, {
      headers: {
        "APCA-API-KEY-ID": row.api_key_id,
        "APCA-API-SECRET-KEY": decryptedSecret,
      },
      cache: "no-store", // ⭐ also helps
    });

    if (!alpacaRes.ok) {
      return Response.json(
        { status: "disconnected", brokerConnected: false },
        { status: 400 }
      );
    }

    return Response.json(
      { status: "connected", brokerConnected: true },
      { status: 200 }
    );
  } catch {
    return Response.json(
      { status: "disconnected", brokerConnected: false },
      { status: 500 }
    );
  }
}
