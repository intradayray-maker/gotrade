"use client"

import { supabaseBrowserClient } from "@/utils/supabase/client"

export async function logout() {
  const supabase = supabaseBrowserClient
  await supabase.auth.signOut()
}
