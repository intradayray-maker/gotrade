import { createRouteHandlerClient } from "../../../../utils/supabase/route";


export const runtime = "nodejs";

export async function DELETE() {
  console.log("🔥 DISCONNECT ROUTE STARTED");

  try {
    const supabase = await createRouteHandlerClient();
    console.log("🔥 SUPABASE CLIENT CREATED");

    const {
      data: { user },
      error: userErr
    } = await supabase.auth.getUser();

    console.log("🔥 USER:", user, "ERR:", userErr);

    if (!user) {
      console.log("🔥 NO USER FOUND");
      return Response.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const userId = user.id;
    console.log("🔥 USER ID:", userId);

    const { error: deleteConnErr } = await supabase
      .from("broker_connections")
      .delete()
      .eq("user_id", userId)
      .eq("broker", "alpaca");

    console.log("🔥 DELETE broker_connections ERROR:", deleteConnErr);

    const { error: deleteKeysErr } = await supabase
      .from("alpaca_keys")
      .delete()
      .eq("user_id", userId);

    console.log("🔥 DELETE alpaca_keys ERROR:", deleteKeysErr);

    return Response.json({ success: true });
  } catch (err) {
    console.error("🔥 DISCONNECT ROUTE CRASHED:", err);
    return Response.json({ success: false, error: "Unexpected error" }, { status: 500 });
  }
}
