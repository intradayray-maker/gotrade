import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/utils/supabase/route";

export const runtime = "nodejs";

export async function GET() {
  try {
  const supabase = await createRouteHandlerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("NOTIFICATIONS LIST ERROR:", error);
      return NextResponse.json(
        { error: "Failed to fetch notifications" },
        { status: 500 }
      );
    }

    return NextResponse.json({ notifications: data });
  } catch (err) {
    console.error("NOTIFICATIONS LIST ROUTE ERROR:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}


