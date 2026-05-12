"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function InnerForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!stripe || !elements) {
      setError("Stripe failed to load");
      setLoading(false);
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      setError("Card element missing");
      setLoading(false);
      return;
    }

    const { paymentMethod, error: pmError } =
      await stripe.createPaymentMethod({
        type: "card",
        card,
      });

    if (pmError) {
      setError(pmError.message || "Payment method error");
      setLoading(false);
      return;
    }

    // ⭐ FIXED: send correct field name + correct headers
    const res = await fetch("/api/billing/payment-method", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentMethodId: paymentMethod.id,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Server error");
      setLoading(false);
      return;
    }

    setLoading(false);
    window.location.reload();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <div className="p-4 bg-white/5 border border-white/10 rounded-lg min-h-[60px]">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#fff",
                "::placeholder": { color: "#888" },
              },
              invalid: { color: "#ff6b6b" },
            },
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="px-4 py-2 bg-white text-black rounded-lg"
      >
        {loading ? "Processing…" : "Add Payment Method"}
      </button>

      {error && <p className="text-red-400 text-sm">{error}</p>}
    </form>
  );
}

export default function PaymentMethodForm() {
  return (
    <Elements stripe={stripePromise}>
      <InnerForm />
    </Elements>
  );
}
