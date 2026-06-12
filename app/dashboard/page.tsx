// app/dashboard/page.tsx

import { createSupabaseServerClient } from "@/utils/supabase/server";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If no user, treat as locked
  if (!user) {
    return (
      <DashboardClient
        canEUR={false}
        canETH={false}
        canSWING={false}
      />
    );
  }

  // Explicitly select only the fields needed for gating
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")is_admin, plan_EURUSD, plan_ETHUSDT, plan_PRO_BUNDLE")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.is_admin === true;

  // NEW: PRO plan now unlocks SWING, not EUR/ETH
  const hasSwing = profile?.plan_PRO_BUNDLE === true;

  // EURUSD day trading
  const canEUR = isAdmin || profile?.plan_EURUSD === true;

  // ETHUSDT.P day trading
  const canETH = isAdmin || profile?.plan_ETHUSDT === true;

  // SWING (4H/Daily)
  const canSWING = isAdmin || hasSwing;

  return (
    <DashboardClient
      canEUR={canEUR}
      canETH={canETH}
      canSWING={canSWING}
    />
  );
}
