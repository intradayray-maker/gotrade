import { redirect } from "next/navigation";
import Header from "@/components/Header";
import { isAdminUser } from "@/utils/auth/admin";
import { createServerClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#050509] text-slate-100">
      <Header
        variant="dashboard"
        user={user}
        isAdmin={isAdminUser(user)}
        homeHref="/dashboard"
      />
      <main>{children}</main>
    </div>
  );
}
