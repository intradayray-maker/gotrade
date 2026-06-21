import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/utils/supabase/route";

import { getBillingPortalUrl } from "@/utils/billing/getBillingPortalUrl";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const supabase = await createRouteHandlerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { returnUrl?: string };
  const origin = new URL(request.url).origin;
  const returnUrl = body.returnUrl ?? `${origin}/dashboard/billing`;
  const url = await getBillingPortalUrl(user.id, user.email, returnUrl);

  return NextResponse.json({ url });
}


