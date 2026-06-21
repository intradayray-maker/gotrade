import Stripe from "stripe";

import { createStripeCustomer } from "@/utils/billing/createStripeCustomer";
import { createSupabaseServerClient } from "@/utils/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

export async function attachPaymentMethod(
  userId: string,
  email: string | null | undefined,
  paymentMethodId: string
) {
  const supabase = await createSupabaseServerClient();
  const customerId = await createStripeCustomer(userId, email);

  try {
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
  } catch (error) {
    if (!(error instanceof Stripe.errors.StripeError) || error.code !== "resource_already_exists") {
      throw error;
    }
  }

  await stripe.customers.update(customerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  });

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      stripe_default_payment_method: paymentMethodId,
      billing_status: "payment_method_attached",
    } as never)
    .eq("id", userId);

  if (updateError) {
    throw updateError;
  }

  return {
    customerId,
    paymentMethodId,
  };
}
