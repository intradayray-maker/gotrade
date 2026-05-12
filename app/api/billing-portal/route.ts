import { NextResponse } from "next/server";
import Stripe from "stripe";

import { createRouteHandlerClient } from "@/utils/supabase/route";

export const runtime = "nodejs";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type BillingPortalRequestBody = {
  returnUrl?: string;
};

export async function POST(request: Request) {
  try {
    const supabase = await createRouteHandlerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as BillingPortalRequestBody;
    const origin = new URL(request.url).origin;
    const returnUrl = body.returnUrl
      ? new URL(body.returnUrl, origin).toString()
      : `${origin}/dashboard/billing`;

    const { data: subscription, error: subError } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id, stripe_subscription_id, current_period_end, status")
      .eq("user_id", user.id)
      .eq("status", "active")
      .not("stripe_customer_id", "is", null)
      .not("stripe_subscription_id", "is", null)
      .not("current_period_end", "is", null)
      .order("current_period_end", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (subError) {
      return NextResponse.json(
        { error: "Failed to load active subscription", details: subError.message },
        { status: 500 }
      );
    }

    const customerId = subscription?.stripe_customer_id;
    if (!customerId?.startsWith("cus_")) {
      return NextResponse.json(
        { error: "No valid Stripe customer found for active subscription" },
        { status: 400 }
      );
    }

    const customer = await stripe.customers.retrieve(customerId);
    if (customer.deleted) {
      return NextResponse.json(
        { error: "Stripe customer was deleted. Please re-subscribe." },
        { status: 400 }
      );
    }

    const expectedLiveMode = process.env.STRIPE_SECRET_KEY?.startsWith("sk_live_") ?? false;
    if (customer.livemode !== expectedLiveMode) {
      return NextResponse.json(
        {
          error:
            "Stripe customer mode does not match the configured Stripe secret key mode.",
        },
        { status: 409 }
      );
    }

    // Guard against missing portal configuration in the active Stripe mode.
    const portalConfigs = await stripe.billingPortal.configurations.list({
      active: true,
      limit: 1,
    });
    if (!portalConfigs.data.length) {
      return NextResponse.json(
        {
          error:
            "No active Stripe Billing Portal configuration found for this Stripe mode.",
        },
        { status: 500 }
      );
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a billing portal URL" },
        { status: 500 }
      );
    }

    return NextResponse.redirect(session.url, { status: 303 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to create billing portal session", details: message },
      { status: 500 }
    );
  }
}
