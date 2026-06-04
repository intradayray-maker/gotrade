// app/api/webhooks/stripe/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// SERVICE ROLE client (required for secure DB writes)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: any;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session: any = event.data.object;

        const userId = session.client_reference_id || session.metadata?.user_id;
        const subscriptionId = session.subscription;
        const priceId =
          session?.line_items?.data?.[0]?.price?.id ||
          session.metadata?.price_id;

        if (userId && subscriptionId) {
          await supabase
            .from("profiles")
            .update({
              stripe_subscription_id: subscriptionId,
              stripe_price_id: priceId,
              billing_status: "active",
              subscription_status: "active"
            })
            .eq("id", userId);
        }

        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub: any = event.data.object;

        const userId = sub.metadata?.user_id;
        const priceId = sub.items?.data?.[0]?.price?.id;

        if (userId) {
          await supabase
            .from("profiles")
            .update({
              stripe_subscription_id: sub.id,
              stripe_price_id: priceId,
              billing_status: sub.status,
              subscription_status: sub.status,
              current_period_end: new Date(sub.current_period_end * 1000)
            })
            .eq("id", userId);
        }

        break;
      }

      case "customer.subscription.deleted": {
        const sub: any = event.data.object;
        const userId = sub.metadata?.user_id;

        if (userId) {
          await supabase
            .from("profiles")
            .update({
              billing_status: "canceled",
              subscription_status: "canceled"
            })
            .eq("id", userId);
        }

        break;
      }

      case "invoice.payment_failed": {
        const invoice: any = event.data.object;
        const userId = invoice.metadata?.user_id;

        if (userId) {
          await supabase
            .from("profiles")
            .update({
              billing_status: "past_due",
              subscription_status: "past_due"
            })
            .eq("id", userId);
        }

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("❌ Webhook handler error:", err.message);
    return new NextResponse("Webhook handler failed", { status: 500 });
  }
}
