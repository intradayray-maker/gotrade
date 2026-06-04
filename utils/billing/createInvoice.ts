import Stripe from "stripe";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { sendNotification } from "@/utils/notifications";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createInvoiceForFee({
  userId,
  feeId,
  amount,
}: {
  userId: string;
  feeId: string;
  amount: number;
}) {
  const supabase = await createSupabaseServerClient();

  try {
    // 1. Load Stripe customer ID
    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", userId)
      .single();

    if (profileErr || !profile?.stripe_customer_id) {
      throw new Error("Missing Stripe customer ID");
    }

    const customerId = profile.stripe_customer_id;

    // 2. Create invoice item
    const invoiceItem = await stripe.invoiceItems.create({
      customer: customerId,
      amount: Math.round(amount * 100),
      currency: "usd",
      description: `Performance Fee (Fee ID: ${feeId})`,
    });

    // 3. Create invoice
    const invoice = await stripe.invoices.create({
      customer: customerId,
      auto_advance: true,
      metadata: { fee_id: feeId },
    });

    // 4. Send invoice_created notification
    await sendNotification({
      userId,
      type: "invoice_created",
      title: "Invoice Generated",
      message: `Your performance fee invoice for $${amount.toFixed(
        2
      )} has been created.`,
      sendEmail: true,
    });

    return { success: true, invoice, invoiceItem };
  } catch (err) {
    console.error("INVOICE CREATION ERROR:", err);

    await sendNotification({
      userId,
      type: "invoice_failed",
      title: "Invoice Creation Failed",
      message:
        "We were unable to generate your performance fee invoice. Our team has been notified.",
      sendEmail: true,
    });

    return { success: false, error: "Invoice creation failed" };
  }
}
