// app/components/LogoutButton.tsx

'use client';

import { useRouter } from "next/navigation";
import { supabaseBrowserClient } from "@/utils/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = supabaseBrowserClient;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 rounded bg-red-600 text-white"
    >
      Log Out
    </button>
  );
}
