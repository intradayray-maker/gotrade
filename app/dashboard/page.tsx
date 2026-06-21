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
<<<<<<< HEAD
=======
        canDIV={false}
>>>>>>> f8b5146b38fa55ecb4b35d4d62828ee629543d0f
      />
    );
  }

<<<<<<< HEAD
  // Explicitly select only the fields needed for gating
  const { data: profile } = await supabase
    .from("profiles")
    .select("*, is_admin, plan_EURUSD, plan_ETHUSDT, plan_PRO_BUNDLE")
=======
  // Fetch only the fields needed for gating
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin, plan_EURUSD, plan_ETHUSDT, plan_PRO_BUNDLE")
>>>>>>> f8b5146b38fa55ecb4b35d4d62828ee629543d0f
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.is_admin === true;

<<<<<<< HEAD
  // NEW: PRO plan now unlocks SWING, not EUR/ETH
=======
  // PRO bundle unlocks SWING only
>>>>>>> f8b5146b38fa55ecb4b35d4d62828ee629543d0f
  const hasSwing = profile?.plan_PRO_BUNDLE === true;

  // EURUSD day trading
  const canEUR = isAdmin || profile?.plan_EURUSD === true;

<<<<<<< HEAD
  // ETHUSDT.P day trading
=======
  // ETHUSDT day trading
>>>>>>> f8b5146b38fa55ecb4b35d4d62828ee629543d0f
  const canETH = isAdmin || profile?.plan_ETHUSDT === true;

  // SWING (4H/Daily)
  const canSWING = isAdmin || hasSwing;

<<<<<<< HEAD
=======
  // DIVIDENDS — your old dashboard always unlocked them
  const canDIV = true;

>>>>>>> f8b5146b38fa55ecb4b35d4d62828ee629543d0f
  return (
    <DashboardClient
      canEUR={canEUR}
      canETH={canETH}
      canSWING={canSWING}
<<<<<<< HEAD
=======
      canDIV={canDIV}
>>>>>>> f8b5146b38fa55ecb4b35d4d62828ee629543d0f
    />
  );
}
