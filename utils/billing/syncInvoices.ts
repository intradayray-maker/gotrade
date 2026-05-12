import Stripe from "stripe";

import { createServerClient } from "@/utils/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

export async function syncInvoices(userId: string) {
  const supabase = await createServerClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", userId)
    .maybeSingle();

  if (profileError) {
    throw profileError;
  }

  if (!profile?.stripe_customer_id) {
    return [];
  }

  const invoices = await stripe.invoices.list({
    customer: profile.stripe_customer_id,
    limit: 100,
  });

  return invoices.data.map((invoice) => ({
    id: invoice.id,
    amount_due: invoice.amount_due,
    amount_paid: invoice.amount_paid,
    currency: invoice.currency,
    hosted_invoice_url: invoice.hosted_invoice_url,
    invoice_pdf: invoice.invoice_pdf,
    status: invoice.status,
    created: invoice.created,
  }));
}
