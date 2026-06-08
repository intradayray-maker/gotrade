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
      />
    );
  }

  // Safe: user.id is guaranteed to exist here
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.is_admin === true;
  const hasPro = profile?.plan_probundle === true;

  const canEUR = isAdmin || hasPro || profile?.plan_eurusd === true;
  const canETH = isAdmin || hasPro || profile?.plan_ethusdtp === true;

  return (
    <DashboardClient
      canEUR={canEUR}
      canETH={canETH}
    />
  );
}
