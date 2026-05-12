// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// SERVICE ROLE CLIENT (required for webhooks)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log("🔥 Stripe event:", event.type);

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("📦 Checkout completed for user:", session.client_reference_id);
      break;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub: any = event.data.object;

      console.log("🔍 FULL SUBSCRIPTION OBJECT:", JSON.stringify(sub, null, 2));

      const priceDebug = sub.items?.data?.[0]?.price;
      console.log("🔍 PRICE OBJECT:", JSON.stringify(priceDebug, null, 2));
      console.log("🔍 INTERVAL:", priceDebug?.recurring?.interval);
      console.log("🔍 INTERVAL COUNT:", priceDebug?.recurring?.interval_count);

      // Stripe moved current_period_end into subscription.items.data[0]
      const periodEndUnix =
        sub.items?.data?.[0]?.current_period_end ??
        sub.current_period_end ??
        null;

      console.log("🔍 FIXED PERIOD END:", periodEndUnix);
      console.log("🔍 STATUS:", sub.status);
      console.log("🔍 CANCEL AT PERIOD END:", sub.cancel_at_period_end);

      const userId = sub.metadata?.user_id;
      const subscriptionId = sub.id;
      const customerId = sub.customer as string;

      const price = priceDebug;
      const priceId = price?.id || null;
      const planName = price?.nickname || null;

      const periodEndISO = periodEndUnix
        ? new Date(periodEndUnix * 1000).toISOString()
        : null;

      console.log("🔄 Upserting subscription:", subscriptionId, "for user:", userId);

      if (!userId) {
        console.error("❌ Missing user_id in subscription metadata");
        break;
      }

      // Derive billing_status for profile
      let billingStatus: string = sub.status;
      if (sub.cancel_at_period_end) {
        billingStatus = "cancelling";
      }

      // --- UPSERT SUBSCRIPTIONS TABLE ---
      const { data: existing } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("stripe_subscription_id", subscriptionId)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("subscriptions")
          .update({
            status: sub.status,
            stripe_customer_id: customerId,
            stripe_price_id: priceId,
            current_period_end: periodEndISO,
            user_id: userId,
          })
          .eq("stripe_subscription_id", subscriptionId);
      } else {
        await supabase.from("subscriptions").insert({
          user_id: userId,
          stripe_subscription_id: subscriptionId,
          stripe_customer_id: customerId,
          stripe_price_id: priceId,
          current_period_end: periodEndISO,
          status: sub.status,
        });
      }

      // --- UPDATE PROFILE WITH PLAN + NEXT BILLING DATE ---
      console.log("📝 Updating profile plan + next billing date:", {
        planname: planName,
        nextbillingdate: periodEndUnix,
        billing_status: billingStatus,
      });

      await supabase
        .from("profiles")
        .update({
          planname: planName,
          nextbillingdate: periodEndUnix,
          billing_status: billingStatus,
        })
        .eq("id", userId);

      break;
    }

    case "customer.subscription.deleted": {
      const sub: any = event.data.object;

      await supabase
        .from("subscriptions")
        .update({
          status: "canceled",
        })
        .eq("stripe_subscription_id", sub.id);

      await supabase
        .from("profiles")
        .update({
          planname: null,
          nextbillingdate: null,
          billing_status: "canceled",
        })
        .eq("id", sub.metadata?.user_id || "");

      break;
    }
  }

  return NextResponse.json({ received: true });
}

