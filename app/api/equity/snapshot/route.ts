import { NextResponse } from "next/server";
import { createServerClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createServerClient();

  // your logic here
  return NextResponse.json({ ok: true });
}
