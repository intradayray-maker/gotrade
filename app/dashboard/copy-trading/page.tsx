import { createServerClient } from "@/utils/supabase/server";
import CopyTradingClient from "./CopyTradingClient";

export default async function CopyTradingPage() {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="p-10 text-center text-white">
        <h1 className="text-2xl font-bold">Unauthorized</h1>
        <p className="text-white/70 mt-2">
          Please sign in to access copy-trading.
        </p>
      </div>
    );
  }

  const { data: settings } = await supabase
    .from("copy_trading_settings")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return <CopyTradingClient initialSettings={settings} />;
}
