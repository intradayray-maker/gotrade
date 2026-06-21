//lib\supabase\server.ts


import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // required for updates
  {
    auth: { persistSession: false }
  }
);


export { createSupabaseServerClient } from "@/utils/supabase/server";
