import { NextResponse } from "next/server";
import { stripe } from "@/utils/stripe/server";

export async function POST(req: Request) {
  const { customer_id, payment_method_id } = await req.json();

  if (!customer_id || !payment_method_id) {
    return NextResponse.json(
      { error: "Missing customer_id or payment_method_id" },
      { status: 400 }
    );
  }

  // Attach card
  await stripe.paymentMethods.attach(payment_method_id, {
    customer: customer_id,
  });

  // Make it default
  await stripe.customers.update(customer_id, {
    invoice_settings: {
      default_payment_method: payment_method_id,
    },
  });

  return NextResponse.json({
    success: true,
    payment_method_id,
  });
}
