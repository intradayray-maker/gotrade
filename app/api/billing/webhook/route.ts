import { headers } from "next/headers";
import { createRouteHandlerClient } from "@/utils/supabase/route";
import { NextResponse } from "next/server";
import Stripe from "stripe";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

export const runtime = "nodejs";

async function storeEvent(eventId: string) {
  const supabase = await createRouteHandlerClient();
  const table = supabase.from("stripe_events" as never) as any;

  const { data, error } = await table.select("id").eq("id", eventId).maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (data) {
    return false;
  }

  const { error: insertError } = await table.insert({ id: eventId });

  if (insertError) {
    throw new Error(insertError.message);
  }

  return true;
}

async function createNotification(userId: string, title: string, message: string, type: string) {
  const supabase = await createRouteHandlerClient();
  const { error } = await supabase.from("notifications").insert({
    user_id: userId,
    title,
    message,
    type,
    read: false,
  });

  if (error) {
    throw error;
  }
}

async function findUserIdByCustomerId(customerId: string) {
  const supabase = await createRouteHandlerClient();
  const query = supabase.from("profiles") as any;
  const { data, error } = await query
    .select("id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data?.id as string | undefined) ?? null;
}

async function updateBillingStatus(userId: string, billingStatus: string) {
  const supabase = await createRouteHandlerClient();
  const { error } = await supabase
    .from("profiles")
    .update({ billing_status: billingStatus } as never)
    .eq("id", userId);

  if (error) {
    throw error;
  }
}

export async function POST(request: Request) {
  const signature = headers().get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });
  }

  const payload = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid webhook signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const inserted = await storeEvent(event.id);

  if (!inserted) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  if (event.type === "invoice.paid" || event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice;
    const customerId =
      typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id ?? null;

    if (customerId) {
      const userId = await findUserIdByCustomerId(customerId);

      if (userId) {
        if (event.type === "invoice.paid") {
          await updateBillingStatus(userId, "active");
          await createNotification(
            userId,
            "Invoice paid",
            "Your latest invoice was paid successfully.",
            "invoice.paid"
          );
        } else {
          await updateBillingStatus(userId, "payment_failed");
          await createNotification(
            userId,
            "Invoice payment failed",
            "Your latest invoice payment failed.",
            "invoice.payment_failed"
          );
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}


