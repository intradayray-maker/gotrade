import { createStripeCustomer } from "@/utils/billing/createStripeCustomer";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

export async function getBillingPortalUrl(
  userId: string,
  email: string | null | undefined,
  returnUrl: string
) {
  const customerId = await createStripeCustomer(userId, email);

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session.url;
}
