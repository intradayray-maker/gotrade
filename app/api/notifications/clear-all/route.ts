import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/utils/supabase/route";

export async function POST() {
  const supabase = await createRouteHandlerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  await supabase.from("notifications").delete().eq("user_id", user.id);

  return NextResponse.json({ success: true });
}


