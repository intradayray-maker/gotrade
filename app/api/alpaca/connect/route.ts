import { createRouteHandlerClient } from "@/utils/supabase/route";
import { encrypt } from "@/lib/encryption";
import { sendNotification } from "@/utils/notifications";

export async function POST(req: Request) {
  try {
    const supabase = await createRouteHandlerClient();

    // 1. Get user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ success: false, error: "Not authenticated" });
    }

    // 2. Parse body
    const { apiKeyId, apiSecret, paperTrading } = await req.json();

    if (!apiKeyId || !apiSecret) {
      return Response.json({
        success: false,
        error: "Missing API key or secret",
      });
    }

    // 3. Validate keys with Alpaca
    const baseUrl = paperTrading
      ? "https://paper-api.alpaca.markets"
      : "https://api.alpaca.markets";

    const validateRes = await fetch(`${baseUrl}/v2/account`, {
      headers: {
        "APCA-API-KEY-ID": apiKeyId,
        "APCA-API-SECRET-KEY": apiSecret,
      },
    });

    if (!validateRes.ok) {
      await sendNotification({
        userId: user.id,
        type: "system_warning",
        title: "Broker Connection Failed",
        message:
          "Your Alpaca API keys could not be validated. Please check your credentials.",
        sendEmail: true,
      });

      return Response.json({
        success: false,
        error: "Invalid Alpaca API credentials",
      });
    }

    // 4. Encrypt secret
    const encryptedSecret = encrypt(apiSecret);

    // 5. Save broker connection
    const { error: upsertError } = await supabase
      .from("broker_connections")
      .upsert(
        {
          user_id: user.id,
          broker: "alpaca",
          api_key_id: apiKeyId,
          api_secret_encrypted: encryptedSecret,
          paper_trading: paperTrading,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,broker" }
      );

    if (upsertError) {
      console.error("UPSERT ERROR:", upsertError);
      return Response.json({
        success: false,
        error: "Failed to save broker connection",
      });
    }

    // 6. Send success notification
    await sendNotification({
      userId: user.id,
      type: "system_warning",
      title: "Broker Connected",
      message: "Your Alpaca account is now linked successfully.",
      sendEmail: true,
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("CONNECT ERROR:", err);
    return Response.json({ success: false, error: "Unexpected error" });
  }
}


