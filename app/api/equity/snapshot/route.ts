export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  return NextResponse.json({ ok: true });
}
