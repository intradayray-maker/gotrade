// lib/pricing.ts

export type BillingInterval = "monthly" | "yearly";

export type PlanId = "starter" | "pro" | "elite";

export interface PricingPlan {
  id: PlanId;
  name: string;
  tagline: string;
  priceMonthly: number;
  priceYearly: number;
  highlight?: boolean;
  features: string[];
  stripePriceIdMonthly?: string;
  stripePriceIdYearly?: string;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Start mirroring with tight risk controls.",
    priceMonthly: 29,
    priceYearly: 290,
    features: [
      "Link 1 Alpaca account",
      "Follow 1 master strategy",
      "Basic trade history",
      "Email notifications",
    ],
    stripePriceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER_MONTHLY,
    stripePriceIdYearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER_YEARLY,
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Scale capital with deeper analytics.",
    priceMonthly: 79,
    priceYearly: 790,
    highlight: true,
    features: [
      "Link up to 3 accounts",
      "Follow up to 3 strategies",
      "Advanced trade analytics",
      "Priority execution queue",
      "In-app + email notifications",
    ],
    stripePriceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY,
    stripePriceIdYearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY,
  },
  {
    id: "elite",
    name: "Elite",
    tagline: "High-volume traders with performance focus.",
    priceMonthly: 199,
    priceYearly: 1990,
    features: [
      "Unlimited linked accounts",
      "Unlimited strategies",
      "Performance fee reporting",
      "Custom risk controls",
      "Priority support",
    ],
    stripePriceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ELITE_MONTHLY,
    stripePriceIdYearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ELITE_YEARLY,
  },
];
