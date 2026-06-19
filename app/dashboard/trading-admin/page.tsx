import { createSupabaseServerClient } from "@/utils/supabase/server";
import { requireAdminUser } from "@/utils/auth/admin";
import TradingAdminClient from "./TradingAdminClient";

export default async function Page() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  requireAdminUser(user);

  return (
  <div className="w-full max-w-7xl mx-auto px-8 pt-12 pb-24">
    <TradingAdminClient />
  </div>
);

}
