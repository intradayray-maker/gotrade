import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/utils/supabase/route";
import { stripe } from "@/utils/stripe/server";

export async function POST(req: Request) {
  const supabase = await createRouteHandlerClient();
  const { user_id, email } = await req.json();

  if (!user_id || !email) {
    return NextResponse.json(
      { error: "Missing user_id or email" },
      { status: 400 }
    );
  }

  // Create Stripe customer
  const customer = await stripe.customers.create({
    email,
    metadata: { user_id },
  });

  // Store in Supabase
  await supabase
    .from("copy_trading_settings")
    .update({ stripe_customer_id: customer.id })
    .eq("user_id", user_id);

  return NextResponse.json({
    success: true,
    stripe_customer_id: customer.id,
  });
}


