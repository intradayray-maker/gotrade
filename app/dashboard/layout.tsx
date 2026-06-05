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

  const isAdmin = isAdminUser(user ? { email: user.email } : undefined);

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
