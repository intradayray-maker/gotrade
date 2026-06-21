// app/api/stripe/downgrade/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { subscriptionId, newPriceId, subscriptionItemId } = await req.json();

    if (!subscriptionId || !newPriceId || !subscriptionItemId) {
      return NextResponse.json(
        { error: "Missing subscriptionId, newPriceId, or subscriptionItemId" },
        { status: 400 }
      );
    }

    const updated = await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscriptionItemId,
          price: newPriceId,
        },
      ],
      proration_behavior: "none", // or "create_prorations" if you want credits
    });

    return NextResponse.json({ success: true, updated });
  } catch (err: any) {
    console.error("❌ Downgrade subscription error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
