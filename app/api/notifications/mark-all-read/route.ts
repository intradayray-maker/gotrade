import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/utils/supabase/route";

export const runtime = "nodejs";

export async function POST() {
  try {
  const supabase = await createRouteHandlerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id);

    if (error) {
      console.error("MARK ALL READ ERROR:", error);
      return NextResponse.json(
        { error: "Failed to mark all notifications as read" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("MARK ALL READ ROUTE ERROR:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}


