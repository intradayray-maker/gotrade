import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/utils/supabase/route";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing notification ID" },
        { status: 400 }
      );
    }

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
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("MARK READ ERROR:", error);
      return NextResponse.json(
        { error: "Failed to mark notification as read" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("MARK READ ROUTE ERROR:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}


