import { createRouteHandlerClient } from "@/utils/supabase/route";
import { stripe } from "@/utils/stripe/server";
import { sendNotification } from "@/utils/notifications";

export async function POST(req: Request) {
  try {
    const supabase = await createRouteHandlerClient();
    const { customer_id } = await req.json();

    if (!customer_id) {
      return Response.json(
        { error: "Missing customer_id" },
        { status: 400 }
      );
    }

    // Fetch invoices from Stripe
    const invoices = await stripe.invoices.list({
      customer: customer_id,
      limit: 50,
    });

    return Response.json({ invoices: invoices.data });
  } catch (err) {
    console.error("INVOICE LIST ERROR:", err);

    // Optional: notify admin of Stripe outage
    await sendNotification({
      userId: "admin", // replace with your admin user ID if needed
      type: "system_warning",
      title: "Invoice Retrieval Failed",
      message: "Stripe invoice listing failed. Check system logs.",
      sendEmail: true,
    });

    return Response.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}


