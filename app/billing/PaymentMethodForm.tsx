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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

    const { paymentMethod, error: pmError } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (pmError) {
      setError(pmError.message || "Payment method error");
      setLoading(false);
      return;
    }

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
    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
      <div className="min-h-[60px] rounded-xl border border-white/10 bg-white/5 p-4">
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
        className="
          relative
          flex
          items-center
          justify-center
          rounded-[6px]
          border-[5px]
          border-white
          bg-white
          px-[30px]
          py-[14px]
          text-[14px]
          font-semibold
          text-black
          shadow-[0_0_24px_rgba(255,255,255,0.2)]
          transition
          hover:bg-slate-200
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {loading ? "Processing..." : "Add Payment Method"}
      </button>

      {error && <p className="text-sm text-red-400">{error}</p>}
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
