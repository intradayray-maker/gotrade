import { createSupabaseServerClient } from "@/utils/supabase/server";
import CopyTradingClient from "./CopyTradingClient";

export default async function CopyTradingPage() {
  const supabase = await createSupabaseServerClient();

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

  // Load from the NEW table
  const { data: allocation } = await supabase
    .from("follower_allocation_settings")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  // Normalize into the shape your UI expects
  const settings = allocation
    ? {
        enabled: allocation.enabled,
        allocation_value: allocation.value,
        allocation_mode: allocation.mode,
        max_allocation_pct: allocation.max_allocation_pct,
      }
    : null;

  return <CopyTradingClient initialSettings={settings} />;
}
