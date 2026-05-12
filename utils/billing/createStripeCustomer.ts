import { createServerClient } from "@/utils/supabase/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

export async function createStripeCustomer(userId: string, email?: string | null) {
  const supabase = await createServerClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", userId)
    .maybeSingle();

  if (profileError) {
    throw profileError;
  }

  if (profile?.stripe_customer_id) {
    return profile.stripe_customer_id;
  }

  const customer = await stripe.customers.create({
    email: email ?? undefined,
    metadata: {
      userId,
    },
  });

  const { error: updateError } = await supabase
    .from("profiles")
    .upsert({
      id: userId,
      stripe_customer_id: customer.id,
    } as never);

  if (updateError) {
    throw updateError;
  }

  return customer.id;
}
