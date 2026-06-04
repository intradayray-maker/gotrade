import { createRouteHandlerClient } from "@/utils/supabase/route";
import { encrypt } from "@/lib/encryption";
import { sendNotification } from "@/utils/notifications";
import { getAccount } from "@/lib/brokers/router";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const supabase = await createRouteHandlerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ success: false, error: "Not authenticated" });
    }

    const { apiKeyId, apiSecret, paperTrading } = await req.json();

    if (!apiKeyId || !apiSecret) {
      return Response.json({
        success: false,
        error: "Missing API key or secret",
      });
    }

    // TODO: Replace this save-then-validate flow with a true Blofin credential check.
    const encryptedSecret = encrypt(apiSecret);

    const { error: upsertError } = await supabase
      .from("broker_connections")
      .upsert(
        {
          user_id: user.id,
          broker: "blofin",
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

    try {
      await getAccount(user.id);
    } catch (validationError) {
      await sendNotification({
        userId: user.id,
        type: "system_warning",
        title: "Broker Connection Failed",
        message:
          "Your Blofin API keys could not be validated. Please check your credentials.",
        sendEmail: true,
      });

      return Response.json({
        success: false,
        error: "Invalid Blofin API credentials",
      });
    }

    await sendNotification({
      userId: user.id,
      type: "system_warning",
      title: "Broker Connected",
      message: "Your Blofin account is now linked successfully.",
      sendEmail: true,
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("CONNECT ERROR:", err);
    return Response.json({ success: false, error: "Unexpected error" });
  }
}
