import { cookies } from "next/headers";
import { createServerClient as createSupabaseServerClient } from "@supabase/ssr";

import type { Database } from "@/types/supabase";
import { readAllCookies, writeAllCookies } from "@/utils/supabase/cookies";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/utils/supabase/config";

/**
 * Server-side Supabase client for API routes, server components, and cron jobs.
 * Uses async cookies() and the custom cookie adapter to ensure compatibility
 * with Next.js 16 and Supabase SSR v7.
 */
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
