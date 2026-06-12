import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/utils/supabase/route";

import { createStripeCustomer } from "@/utils/billing/createStripeCustomer";
import { syncInvoices } from "@/utils/billing/syncInvoices";

export const runtime = "nodejs";

export async function GET() {
  const supabase = await createRouteHandlerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")stripe_customer_id, stripe_default_payment_method")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  const invoices = await syncInvoices(user.id);

  return NextResponse.json({
    stripeCustomerId: profile?.stripe_customer_id ?? null,
    stripeDefaultPaymentMethod: profile?.stripe_default_payment_method ?? null,
    billingStatus: (profile as { billing_status?: string | null } | null)?.billing_status ?? null,
    invoices,
  });
}

export async function POST() {
  const supabase = await createRouteHandlerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const customerId = await createStripeCustomer(user.id, user.email);

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")stripe_default_payment_method")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  const invoices = await syncInvoices(user.id);

  return NextResponse.json({
    stripeCustomerId: customerId,
    stripeDefaultPaymentMethod: profile?.stripe_default_payment_method ?? null,
    billingStatus: (profile as { billing_status?: string | null } | null)?.billing_status ?? null,
    invoices,
  });
}


