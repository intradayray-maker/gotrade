import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/utils/supabase/route";
import Stripe from "stripe";

export async function POST() {
  try {
    const supabase = await createRouteHandlerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Load Stripe customer ID
    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    if (profileErr || !profile?.stripe_customer_id) {
      return NextResponse.json(
        { error: "Stripe customer not found" },
        { status: 400 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);


    // Fetch invoices from Stripe
    const invoices = await stripe.invoices.list({
      customer: profile.stripe_customer_id,
      limit: 20,
    });

    return NextResponse.json({ invoices: invoices.data });
  } catch (err: any) {
    console.error("Billing history error:", err);
    return NextResponse.json(
      { error: err.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}


