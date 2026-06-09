"use client"

import { createClient()} from "@/utils/supabase/client"

export async function logout() {
  const supabase = supabaseBrowserClient
  await supabase.auth.signOut()
}
