// app/api/webhooks/stripe/route.ts
import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient() } from "@supabase/supabase-js"

export const runtime = "nodejs"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// SERVICE ROLE client (required for secure DB writes)
const supabase = createClient()(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")!

  let event: any

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message)
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  try {
    switch (event.type) {
      // ---------------------------------------------------------
      // CHECKOUT COMPLETED
      // ---------------------------------------------------------
      case "checkout.session.completed": {
        const session: any = event.data.object

        const userId = session.metadata?.user_id
        const subscriptionId = session.subscription

        if (!userId || !subscriptionId) break

        console.log("🔥 Checkout completed for user:", userId)

        await supabase
          .from("profiles")
          .update({
            stripe_subscription_id: subscriptionId,
            billing_status: "active",
            subscription_status: "active"
          })
          .eq("id", userId)

        break
      }

      // ---------------------------------------------------------
      // SUBSCRIPTION CREATED / UPDATED
      // ---------------------------------------------------------
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub: any = event.data.object

        const userId = sub.metadata?.user_id
        const priceId = sub.items?.data?.[0]?.price?.id

        if (!userId || !priceId) break

        console.log("🔄 Subscription update for user:", userId, "price:", priceId)

        // Reset all plan flags
        const updates: any = {
          plan_EURUSD: false,
          plan_ETHUSDT: false,
          plan_PRO_BUNDLE: false
        }

        // Map price → plan flag
        if (priceId === process.env.NEXT_PUBLIC_PRICE_FOREX) {
          updates.plan_EURUSD = true
        }

        if (priceId === process.env.NEXT_PUBLIC_PRICE_CRYPTO) {
          updates.plan_ETHUSDT = true
        }

        if (priceId === process.env.NEXT_PUBLIC_PRICE_PRO) {
          updates.plan_PRO_BUNDLE = true
        }

        updates.stripe_subscription_id = sub.id
        updates.stripe_price_id = priceId
        updates.billing_status = sub.status
        updates.subscription_status = sub.status
        updates.current_period_end = new Date(sub.current_period_end * 1000)

        await supabase.from("profiles").update(updates).eq("id", userId)

        break
      }

      // ---------------------------------------------------------
      // SUBSCRIPTION DELETED
      // ---------------------------------------------------------
      case "customer.subscription.deleted": {
        const sub: any = event.data.object
        const userId = sub.metadata?.user_id

        if (!userId) break

        console.log("⚠️ Subscription canceled for user:", userId)

        await supabase
          .from("profiles")
          .update({
            billing_status: "canceled",
            subscription_status: "canceled",
            plan_EURUSD: false,
            plan_ETHUSDT: false,
            plan_PRO_BUNDLE: false
          })
          .eq("id", userId)

        break
      }

      // ---------------------------------------------------------
      // PAYMENT FAILED
      // ---------------------------------------------------------
      case "invoice.payment_failed": {
        const invoice: any = event.data.object
        const userId = invoice.metadata?.user_id

        if (!userId) break

        console.log("⚠️ Payment failed for user:", userId)

        await supabase
          .from("profiles")
          .update({
            billing_status: "past_due",
            subscription_status: "past_due"
          })
          .eq("id", userId)

        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error("❌ Webhook handler error:", err.message)
    return new NextResponse("Webhook handler failed", { status: 500 })
  }
}
