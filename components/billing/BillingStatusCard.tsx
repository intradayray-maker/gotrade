"use client";

import { useEffect, useState } from "react";

type BillingState = {
  billingStatus: string | null;
  stripeCustomerId: string | null;
  stripeDefaultPaymentMethod: string | null;
};

export default function BillingStatusCard() {
  const [state, setState] = useState<BillingState>({
    billingStatus: null,
    stripeCustomerId: null,
    stripeDefaultPaymentMethod: null,
  });

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/billing/customer", {
        cache: "no-store",
      });
      const data = (await response.json()) as BillingState;
      setState({
        billingStatus: data.billingStatus ?? null,
        stripeCustomerId: data.stripeCustomerId ?? null,
        stripeDefaultPaymentMethod: data.stripeDefaultPaymentMethod ?? null,
      });
    }

    void load();
  }, []);

  return (
    <div>
      <div>{state.billingStatus}</div>
      <div>{state.stripeCustomerId}</div>
      <div>{state.stripeDefaultPaymentMethod}</div>
    </div>
  );
}
