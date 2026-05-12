"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <button
      onClick={logout}
      className="text-sm text-neutral-400 hover:text-white"
    >
      Logout
    </button>
  );
}
