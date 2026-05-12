import { NextResponse } from "next/server";
import { stripe } from "@/utils/stripe/server";

export async function POST(req: Request) {
  const { customer_id } = await req.json();

  if (!customer_id) {
    return NextResponse.json(
      { error: "Missing customer_id" },
      { status: 400 }
    );
  }

  const setupIntent = await stripe.setupIntents.create({
    customer: customer_id,
    payment_method_types: ["card"],
  });

  return NextResponse.json({
    client_secret: setupIntent.client_secret,
  });
}
