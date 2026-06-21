import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(stripeSecretKey);

/**
 * Create a one-off performance fee invoice for a follower.
 * NOTE: This version contains NO notification or email logic.
 * Webhook will handle notifications after invoice events fire.
 */
export async function createPerformanceFeeInvoice(params: {
  customerId: string;
  amountUsd: number;
  description: string;
}) {
  const { customerId, amountUsd, description } = params;

  try {
    const amountInCents = Math.round(amountUsd * 100);

    // Create invoice item
    const invoiceItem = await stripe.invoiceItems.create({
      customer: customerId,
      amount: amountInCents,
      currency: "usd",
      description,
    });

    // Create invoice
    const invoice = await stripe.invoices.create({
      customer: customerId,
      auto_advance: true,
      collection_method: "charge_automatically",
    });

    return { invoiceItem, invoice };
  } catch (err) {
    console.error("STRIPE INVOICE CREATION ERROR:", err);
    throw err;
  }
}
