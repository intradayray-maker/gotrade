import { createRouteHandlerClient } from "@/utils/supabase/route";

export async function GET() {
  try {
    const supabase = createRouteHandlerClient();
    const { data, error } = await supabase.auth.getUser();

    console.log("USER:", data);
    console.log("ERROR:", error);

    return Response.json({ data, error });
  } catch (err) {
    console.error("TEST ERROR:", err);
    return Response.json({ err });
  }
}
