// app/api/stripe/checkout/route.ts
import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createRouteHandlerClient } from "@/utils/supabase/route"

export const runtime = "nodejs"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  console.log("🔥 USING PATCHED CHECKOUT ROUTE")

  const supabase = await createRouteHandlerClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    console.error("❌ No authenticated user")
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { priceId } = await req.json()

  if (!priceId) {
    console.error("❌ Missing priceId")
    return NextResponse.json({ error: "Missing priceId" }, { status: 400 })
  }

  console.log("➡️ Creating checkout session with price:", priceId)

  const origin =
    req.headers.get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000"

  // ⭐ STEP 1: Get or create Stripe customer
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single()

  let customerId = profile?.stripe_customer_id

  if (!customerId) {
    console.log("➡️ Creating new Stripe customer")

    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { user_id: user.id }
    })

    customerId = customer.id

    await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id)
  }

  // ------------------------------------------------------------
  // ⭐ DETECT PRO PLAN (RELAX) AND STORE user_id IMMEDIATELY
  // ------------------------------------------------------------
  const RELAX_PRICE_IDS = [
    process.env.NEXT_PUBLIC_PRICE_PRO,   // ⭐ your real RELAX/PRO plan
  ].filter(Boolean)

  const isRelaxPlan = RELAX_PRICE_IDS.includes(priceId)

  if (isRelaxPlan) {
    console.log("🧘 PRO/RELAX PLAN DETECTED — storing user_id:", user.id)

    // ⭐ FIX: Bypass TS because this client uses a different Database type
    await (supabase as any)
      .from("SWING_trades_state")
      .update({ user_id: user.id })
      .eq("id", "81587010-c8c1-4857-a1e8-f476aa04c439")
  }

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
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
