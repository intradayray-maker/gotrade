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

  const methods = await stripe.paymentMethods.list({
    customer: customer_id,
    type: "card",
  });

  return NextResponse.json({
    payment_methods: methods.data,
  });
}
