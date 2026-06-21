//middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function middleware(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  const isLoggedIn = !!data.user;
  const path = req.nextUrl.pathname;

  const isPublic =
    path.startsWith("/login") ||
    path.startsWith("/signup") ||
    path === "/";

  if (!isLoggedIn && !isPublic) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*", "/profile/:path*"],
};
