import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createRouteHandlerClient } from "@/utils/supabase/route";

export async function POST() {
  const supabase = await createRouteHandlerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, stripe_customer_id, stripe_default_payment_method")
    .eq("id", user.id)
    .single();

  if (!profile?.stripe_default_payment_method) {
    return NextResponse.json({ error: "No saved card" }, { status: 400 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  try {
    await stripe.paymentMethods.detach(profile.stripe_default_payment_method);
  } catch (err) {
    console.error("Stripe detach error:", err);
    return NextResponse.json({ error: "Stripe detach failed" }, { status: 500 });
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      stripe_default_payment_method: null,
      billing_status: "inactive",
    })
    .eq("id", user.id);

  if (updateError) {
    console.error("Supabase update error:", updateError);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

