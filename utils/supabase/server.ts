<<<<<<< HEAD
// utils\supabase\server.ts

=======
//utils\supabase\server.ts
export const runtime = "nodejs";
>>>>>>> f8b5146b38fa55ecb4b35d4d62828ee629543d0f

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
<<<<<<< HEAD
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // ignore write errors
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // ignore
          }
=======
          cookieStore.set(name, value, options);
        },
        remove(name: string, options: any) {
          cookieStore.set(name, "", options);
>>>>>>> f8b5146b38fa55ecb4b35d4d62828ee629543d0f
        },
      },
    }
  );
}
<<<<<<< HEAD
=======
// tezt2
>>>>>>> f8b5146b38fa55ecb4b35d4d62828ee629543d0f
