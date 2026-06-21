import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/utils/supabase/route";
import { attachPaymentMethod } from "@/utils/billing/attachPaymentMethod";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const supabase = await createRouteHandlerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as { paymentMethodId?: string };

    if (!body.paymentMethodId) {
      return NextResponse.json(
        { error: "paymentMethodId is required" },
        { status: 400 }
      );
    }

    const result = await attachPaymentMethod(
      user.id,
      user.email,
      body.paymentMethodId
    );

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    console.error("PAYMENT METHOD ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}


