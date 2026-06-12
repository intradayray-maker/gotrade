import { createRouteHandlerClient } from "@/utils/supabase/route";

export async function GET() {
  try {
  const supabase = await createRouteHandlerClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      return Response.json(
        { user: null, profile: null, error: userError.message },
        { status: 401 }
      );
    }

    if (!user) {
      return Response.json(
        { user: null, profile: null, error: "Auth session missing!" },
        { status: 401 }
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      return Response.json(
        { user, profile: null, error: profileError.message },
        { status: 500 }
      );
    }

    return Response.json({ user, profile });
  } catch {
    return Response.json(
      { user: null, profile: null, error: "Unexpected server error" },
      { status: 500 }
    );
  }
}


