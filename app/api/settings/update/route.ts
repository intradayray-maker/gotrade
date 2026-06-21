import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/utils/supabase/route";

export async function POST(req: Request) {
  const body = await req.json();
  const supabase = await createRouteHandlerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  await supabase
    .from("profiles")
    .update({
      first_name: body.first_name,
      last_name: body.last_name,
    })
    .eq("id", user.id);

  return NextResponse.json({ success: true });
}


