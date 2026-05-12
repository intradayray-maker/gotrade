import { NextResponse } from "next/server";
import { stripe } from "@/utils/stripe/server";

export async function POST(req: Request) {
  const { payment_method_id } = await req.json();

  if (!payment_method_id) {
    return NextResponse.json(
      { error: "Missing payment_method_id" },
      { status: 400 }
    );
  }

  await stripe.paymentMethods.detach(payment_method_id);

  return NextResponse.json({
    success: true,
  });
}
