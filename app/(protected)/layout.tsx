//app\(protected)\layout.tsx

import Header from "@/components/Header";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export default async function ProtectedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // FIX: cookies() must be awaited in your environment
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: "", ...options });
        }
      }
    }
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();

  let isAdmin = false;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*, is_admin")
      .eq("id", user.id)
      .single();

    isAdmin = profile?.is_admin ?? false;
  }

  return (
    <div className="min-h-screen bg-[#050509] text-white">
      <Header
        variant="dashboard"
        user={user}
        isAdmin={isAdmin}
        homeHref="/dashboard"
      />
      <main>{children}</main>
    </div>
  );
}
