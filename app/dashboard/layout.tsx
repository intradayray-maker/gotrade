// app/dashboard/layout.tsx

import Header from "@/components/Header";
import { isAdminUser } from "@/utils/auth/admin";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Default admin detection via configured admin email
  let isAdmin = isAdminUser(user ? { email: user.email } : undefined);

  // Fetch plan flags + admin flag from profiles
  let plan_EURUSD = false;
  let plan_ETHUSDT = false;
  let plan_PRO_BUNDLE = false;

  try {
    if (user?.id) {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")is_admin, plan_EURUSD, plan_ETHUSDT, plan_PRO_BUNDLE")
        .eq("id", user.id)
        .single();

      if (!error && profile) {
        if (profile.is_admin) isAdmin = true;

        plan_EURUSD = profile.plan_EURUSD === true;
        plan_ETHUSDT = profile.plan_ETHUSDT === true;
        plan_PRO_BUNDLE = profile.plan_PRO_BUNDLE === true;
      }
    }
  } catch (err) {
    console.error("Failed to load profile flags:", err);
  }

  return (
    <div className="min-h-screen bg-[#050509] text-slate-100">
      <Header
        user={user}
        isAdmin={isAdmin}
        variant="dashboard"
        homeHref="/dashboard"
        planEUR={plan_EURUSD}
        planETH={plan_ETHUSDT}
        planSWING={plan_PRO_BUNDLE} // PRO plan = Swing plan
      />
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
