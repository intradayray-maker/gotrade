import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/utils/supabase/route";
import { encrypt } from "@/lib/encryption";
import { getAccount } from "@/lib/brokers/router";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { keyId, secretKey, environment } = await req.json();

    if (!keyId || !secretKey) {
      return NextResponse.json(
        { error: "Missing API key or secret key" },
        { status: 400 }
      );
    }

    const supabase = await createRouteHandlerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const api_secret_encrypted = encrypt(secretKey);
    const paper_trading = environment === "paper";

    const { error } = await supabase
      .from("broker_connections")
      .upsert(
        {
          user_id: user.id,
          broker: "blofin",
          api_key_id: keyId,
          api_secret_encrypted,
          paper_trading,
        },
        { onConflict: "user_id,broker" }
      );

    if (error) {
      console.error("SUPABASE UPSERT ERROR:", error);
      return NextResponse.json(
        { error: "Failed to save Blofin connection" },
        { status: 500 }
      );
    }

    // TODO: Validate the saved Blofin connection with real Blofin credentials later.
    await getAccount(user.id);

    await supabase.from("notifications").insert({
      user_id: user.id,
      title: "Broker Connected",
      message: "Your Blofin account is now linked successfully.",
      type: "system",
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("BLOFIN LINK ROUTE ERROR:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Unexpected error saving Blofin credentials",
      },
      { status: 500 }
    );
  }
}
