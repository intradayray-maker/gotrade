export type BillingInterval = "monthly" | "yearly";
export type PlanId = "starter" | "pro" | "elite";

export const pricingPlans: Record<PlanId, Record<BillingInterval, { priceId: string }>> = {
  starter: {
    monthly: { priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER_MONTHLY! },
    yearly: { priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER_YEARLY! },
  },
  pro: {
    monthly: { priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY! },
    yearly: { priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY! },
  },
  elite: {
    monthly: { priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ELITE_MONTHLY! },
    yearly: { priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ELITE_YEARLY! },
  },
};
