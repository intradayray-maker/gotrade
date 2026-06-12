// app/api/stripe/checkout/route.ts
import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createRouteHandlerClient } from "@/utils/supabase/route"

export const runtime = "nodejs"

// ❗ No apiVersion override — Stripe v12+ enforces its own version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  console.log("🔥 CHECKOUT ROUTE HIT")

  const supabase = await createRouteHandlerClient()

  // -----------------------------
  // AUTH CHECK
  // -----------------------------
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    console.error("❌ No authenticated user")
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    )
  }

  // -----------------------------
  // READ BODY
  // -----------------------------
  const { priceId, coupon } = await req.json()

  if (!priceId) {
    console.error("❌ Missing priceId")
    return NextResponse.json(
      { error: "Missing priceId" },
      { status: 400 }
    )
  }

  console.log("➡️ Price ID:", priceId)
  console.log("➡️ Coupon:", coupon)

  const origin =
    req.headers.get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000"

  // -----------------------------
  // GET OR CREATE STRIPE CUSTOMER
  // -----------------------------
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single()

  let customerId = profile?.stripe_customer_id

  if (!customerId) {
    console.log("➡️ Creating new Stripe customer")

    const customer = await stripe.customers.create({
      email: user.email!,
      metadata: { user_id: user.id }
    })

    customerId = customer.id

    await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id)
  }

  // -----------------------------
  // CREATE CHECKOUT SESSION
  // -----------------------------
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,

      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],

      // ⭐ TS-SAFE PROMOTION CODE SUPPORT
      ...(coupon && coupon.trim() !== ""
        ? ({ promotion_code: coupon.trim() } as any)
        : {}),

      metadata: {
        user_id: user.id
      },

      subscription_data: {
        metadata: {
          user_id: user.id
        }
      },

      success_url: `${origin}/dashboard?checkout=success`,
      cancel_url: `${origin}/pricing?checkout=cancelled`
    })

    console.log("✅ Stripe session created:", session.url)

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error("❌ Stripe Checkout Error:", err)
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}
