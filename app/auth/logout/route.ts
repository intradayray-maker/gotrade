import { NextResponse } from "next/server";
import { createServerClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  const supabase = await createServerClient();

  await supabase.auth.signOut();

  const response = NextResponse.redirect(new URL("/login", request.url));

  response.cookies.set("sb-access-token", "", {
    expires: new Date(0),
    path: "/",
  });
  response.cookies.set("sb-refresh-token", "", {
    expires: new Date(0),
    path: "/",
  });

  return response;
}
