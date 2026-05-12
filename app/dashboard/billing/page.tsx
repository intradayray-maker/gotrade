import { redirect } from "next/navigation";
import Stripe from "stripe";

import BillingClient, {
  type BillingProfile,
  type SavedCard,
} from "./BillingClient";

import { createServerClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

type BillingPageProps = {
  searchParams?: {
    update?: string;
  };
};

export default async function BillingPage({ searchParams }: BillingPageProps) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // -----------------------------
  // 1. Fetch profile fields
  // -----------------------------
  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "stripe_default_payment_method, billing_status, planname, nextbillingdate"
    )
    .eq("id", user.id)
    .single();

  // -----------------------------
  // 2. Fetch ALL active subscription rows
  // -----------------------------
  const { data: subs } = await supabase
    .from("subscriptions")
    .select(
      "stripe_subscription_id, stripe_price_id, current_period_end, stripe_customer_id"
    )
    .eq("user_id", user.id)
    .eq("status", "active");

  // -----------------------------
  // 3. Pick the REAL subscription row
  // -----------------------------
  const subscription =
    subs
      ?.filter(
        (s) =>
          s.current_period_end !== null &&
          s.current_period_end !== "null" &&
          s.stripe_subscription_id &&
          s.stripe_customer_id
      )
      ?.sort(
        (a, b) =>
          new Date(b.current_period_end ?? 0).getTime() -
          new Date(a.current_period_end ?? 0).getTime()
      )[0] ?? null;


  // -----------------------------
  // 4. Fetch saved card from Stripe
  // -----------------------------
  let savedCard: SavedCard | null = null;

  if (profile?.stripe_default_payment_method) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const paymentMethod = await stripe.paymentMethods.retrieve(
      profile.stripe_default_payment_method
    );

    if ("card" in paymentMethod && paymentMethod.card) {
      savedCard = {
        brand: paymentMethod.card.brand,
        last4: paymentMethod.card.last4,
        exp_month: paymentMethod.card.exp_month,
        exp_year: paymentMethod.card.exp_year,
      };
    }
  }

  // -----------------------------
  // 5. Build billing profile
  // -----------------------------
  const billingProfile: BillingProfile = {
    stripeCustomerId: subscription?.stripe_customer_id ?? null,
    billingStatus: profile?.billing_status ?? "inactive",
    planName: profile?.planname ?? null,
    nextBillingDate: profile?.nextbillingdate ?? null,
  };

  // -----------------------------
  // 6. Render client component
  // -----------------------------
  return (
    <BillingClient
      profile={billingProfile}
      savedCard={savedCard}
      subscriptionId={subscription?.stripe_subscription_id ?? null}
      showPaymentForm={!savedCard || searchParams?.update === "1"}
    />
  );
}
