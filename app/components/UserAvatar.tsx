"use client";

import { useState, useEffect } from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { createClient()} from "@/utils/supabase/client";

export default function UserAvatar() {
  const supabase = supabaseBrowserClient;
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, []);

  if (!email) {
    return <UserCircleIcon className="w-8 h-8 text-neutral-500" />;
  }

  const initials = email[0].toUpperCase();

  return (
    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold">
      {initials}
    </div>
  );
}
