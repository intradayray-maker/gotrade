//app\dashboard\layout.tsx
 
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

  // Also check profiles table for `is_admin` flag (server-side authoritative)
  try {
    if (user?.id) {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      if (!error && profile && (profile as any).is_admin) {
        isAdmin = true;
      }
    }
  } catch (err) {
    // keep fallback isAdmin value
    console.error("Failed to check profiles.is_admin:", err);
  }

  return (
    <div className="min-h-screen bg-[#050509] text-slate-100">
      <Header
        user={user}
        isAdmin={isAdmin}
        variant="dashboard"
        homeHref="/dashboard"
      />
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
