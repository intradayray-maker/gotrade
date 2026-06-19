export const dynamic = "force-dynamic";

import { createRouteHandlerClient } from "@/utils/supabase/route";
import { getAccount } from "@/lib/brokers/router";

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
      .eq("broker", "blofin")
      .single();

    if (!row || !row.api_key_id || !row.api_secret_encrypted) {
      return Response.json(
        { status: "disconnected", brokerConnected: false },
        { status: 404 }
      );
    }

    try {
      // TODO: Replace this router-backed health check with a Blofin status probe.
      await getAccount(user.id);
    } catch {
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
