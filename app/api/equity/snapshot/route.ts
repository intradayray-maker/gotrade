import { cookies } from "next/headers";
import { createServerClient as createSupabaseServerClient } from "@supabase/ssr";

import type { Database } from "@/types/supabase";
import { readAllCookies, writeAllCookies } from "@/utils/supabase/cookies";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/utils/supabase/config";

export async function createServerClient() {
  const cookieStore = await cookies();

  return createSupabaseServerClient<Database>(
    getSupabaseUrl(),
    getSupabaseAnonKey(),
    {
      cookies: {
        getAll() {
          return readAllCookies(cookieStore);
        },
        setAll(cookiesToSet) {
          writeAllCookies(cookieStore, cookiesToSet);
        },
      },
    }
  );
}
