// utils\supabase\client.ts

"use client";

import { getBrowserSupabase } from "@/lib/supabase/browserClient";

export function createClient() {
  return getBrowserSupabase();
}

