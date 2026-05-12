"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import PaymentMethodForm from "@/app/billing/PaymentMethodForm";
import RemoveCardButton from "@/app/billing/RemoveCardButton";
import UpdateCardButton from "@/app/billing/UpdateCardButton";

export type SavedCard = {
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
};

export type BillingProfile = {
  stripeCustomerId: string | null;
  billingStatus: string;
  planName?: string | null;
  nextBillingDate?: number | null;
};

type BillingHistoryResponse = {
  invoices: Array<{
    created: number;
    id: string;
    status: string;
    total: number;
    hosted_invoice_url?: string;
    invoice_pdf?: string;
  }>;
  fee_charges: Array<{
    created_at: string;
    fee_amount: number;
    fee_rate_used: number;
    id: string;
    profit: number;
  }> | null;
  equity_history: any[] | null;
  hwm_history: any[] | null;
  settings: any;
  error?: string;
};

type BillingClientProps = {
  profile: BillingProfile;
  savedCard: SavedCard | null;
  subscriptionId: string | null;
  showPaymentForm: boolean;
};


const statusMap: Record<string, string> = {
  payment_method_attached: "Payment Method Added",
  inactive: "Inactive",
  active: "Active",
  cancelling: "Cancelling",
};

export default function BillingClient({
  profile,
  savedCard,
  subscriptionId,
  showPaymentForm,
}: BillingClientProps) {
  console.log("[BillingClient] profile", profile);
  console.log("[BillingClient] subscriptionId", subscriptionId);

  const [loading, setLoading] = useState(true);
  const [billing, setBilling] = useState<BillingHistoryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const plans = [
    {
      id: "pro",
      name: "Pro",
      description: "Full access to FlowTrade with higher limits.",
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO!,
    },
    {
      id: "elite",
      name: "Elite",
      description: "Maximum limits, priority execution, and premium features.",
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ELITE!,
    },
  ];

  const startUpgrade = async (priceId: string) => {
    const res = await fetch("/api/billing/upgrade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId }),
    });

    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  useEffect(() => {
    const load = async () => {
      try {
        const historyRes = await fetch("/api/billing/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const historyJson = (await historyRes.json()) as BillingHistoryResponse;

        if (!historyRes.ok) {
          setError(historyJson.error ?? "Failed to load billing history.");
          setBilling(null);
          return;
        }

        setBilling(historyJson);
      } catch (err) {
        console.error("Billing history load failed:", err);
        setError("Failed to load billing history.");
        setBilling(null);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const invoices = billing?.invoices ?? [];
  const fees = billing?.fee_charges ?? [];
  const equity = billing?.equity_history ?? [];
  const hwm = billing?.hwm_history ?? [];

  const billingStatus =
    statusMap[profile.billingStatus ?? "inactive"] ?? "Inactive";

  const statusColor =
    profile.billingStatus === "active"
      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
      : profile.billingStatus === "payment_method_attached"
      ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
      : profile.billingStatus === "cancelling"
      ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
      : "bg-white/10 text-white/60 border-white/20";

  const nextBilling =
    profile.nextBillingDate &&
    new Date(profile.nextBillingDate * 1000).toLocaleDateString();
  const canRenderSubscriptionControls =
    Boolean(profile.stripeCustomerId) && Boolean(subscriptionId);
  const isCancelling = profile.billingStatus === "cancelling";
  const isCancelEnabled = profile.billingStatus === "active";

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* HEADER CARD */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_0_50px_rgba(0,0,0,0.4)] backdrop-blur-xl"
      >
        <p className="text-sm uppercase tracking-[0.2em] text-white/45">
          Billing
        </p>

        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Subscription & Payment Methods
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-white/60">
              Manage your payment method, review invoices, and keep your
              FlowTrade subscription in good standing.
            </p>

            {/* PLAN NAME + NEXT BILLING DATE */}
            {profile.planName && (
              <p className="mt-3 text-white/70 text-sm">
                <span className="font-medium text-white">{profile.planName}</span>
                {nextBilling && <> • Next billing date: {nextBilling}</>}
                {profile.billingStatus === "cancelling" && nextBilling && (
                  <span className="text-amber-300 ml-2">
                    (Cancels on {nextBilling})
                  </span>
                )}
              </p>
            )}
          </div>

          <span
            className={`px-3 py-1 rounded-full text-sm border ${statusColor}`}
          >
            {billingStatus}
          </span>

          {canRenderSubscriptionControls && (
            <div className="flex gap-3">





<form
  action="/api/billing-portal"
  method="POST"
  onSubmit={(e) => {
    // Prevent Next.js from intercepting the POST
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  }}
>
  <button
    type="submit"
    className="rounded-md bg-gray-800 px-4 py-2 text-white hover:bg-gray-700"
  >
    Manage
  </button>
</form>






              <button
                onClick={() => setShowUpgradeModal(true)}
                className="rounded-xl bg-emerald-500/20 px-4 py-2.5 text-sm font-semibold text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition"
              >
                Upgrade
              </button>

              <button
                disabled={!isCancelEnabled}
                onClick={() => setShowCancelModal(true)}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold border transition ${
                  isCancelling
                    ? "bg-white/10 text-white/40 border-white/20 cursor-not-allowed"
                    : "bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30"
                }`}
              >
                {isCancelling
                  ? "Cancelling..."
                  : "Cancel"}
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* CANCEL SUBSCRIPTION MODAL */}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="rounded-2xl bg-white/10 border border-white/20 p-8 max-w-md w-full backdrop-blur-xl shadow-xl"
            >
              <h2 className="text-xl font-semibold text-white">
                Cancel Subscription
              </h2>
              <p className="mt-2 text-white/70 text-sm">
                Your subscription will remain active until the end of your
                current billing period. You will not be charged again.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 rounded-xl border border-white/20 bg-white/10 py-2 text-white hover:bg-white/20 transition"
                >
                  Keep Plan
                </button>

                <button
                  onClick={async () => {
                    await fetch("/api/stripe/cancel", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ subscriptionId }),
                    });
                    setShowCancelModal(false);
                    window.location.reload();
                  }}
                  className="flex-1 rounded-xl bg-red-600 text-white py-2 font-semibold hover:bg-red-700 transition"
                >
                  Cancel at Period End
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* UPGRADE MODAL */}
      <AnimatePresence>
        {showUpgradeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="rounded-2xl bg-white/10 border border-white/20 p-8 max-w-lg w-full backdrop-blur-xl shadow-xl"
            >
              <h2 className="text-xl font-semibold text-white">Upgrade Plan</h2>
              <p className="mt-2 text-white/70 text-sm">
                Choose a plan below. You’ll be redirected to Stripe Checkout to
                complete the upgrade.
              </p>

              <div className="mt-6 space-y-4">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className="rounded-xl border border-white/10 bg-black/20 p-5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-semibold text-white">
                          {plan.name}
                        </p>
                        <p className="text-white/60 text-sm">
                          {plan.description}
                        </p>
                      </div>

                      <button
                        onClick={() => startUpgrade(plan.priceId)}
                        className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white border border-white/20 hover:bg-white/20 transition"
                      >
                        Upgrade
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-white hover:bg-white/20 transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PAYMENT + FEES */}
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <GlassCard title="Payment Method">
          <AnimatePresence mode="wait">
            {savedCard && !showPaymentForm ? (
              <motion.div
                key="saved-card"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                className="space-y-5"
              >
                <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                    Card on file
                  </p>
                  <p className="mt-2 text-xl font-medium capitalize text-white">
                    {savedCard.brand} •••• {savedCard.last4}
                  </p>
                  <p className="mt-1 text-sm text-white/55">
                    Expires {savedCard.exp_month}/{savedCard.exp_year}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <UpdateCardButton />
                  <RemoveCardButton />
                </div>
              </motion.div>
            ) : null}

            {showPaymentForm && (
              <motion.div
                key="payment-form"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5"
              >
                <p className="text-lg font-medium text-white">
                  {savedCard ? "Update Payment Method" : "Add Payment Method"}
                </p>
                <p className="mt-1 text-sm text-white/55">
                  Your card is securely stored with Stripe.
                </p>

                <div className="mt-4">
                  <PaymentMethodForm />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>






































        <GlassCard title="Performance Fees">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <SummaryTile
              label="Total Fees"
              value={
                loading
                  ? "Loading..."
                  : `$${fees
                      .reduce((sum, fee) => sum + (fee.fee_amount ?? 0), 0)
                      .toFixed(2)}`
              }
            />
            <SummaryTile
              label="Equity Snapshots"
              value={loading ? "Loading..." : equity.length.toString()}
            />
            <SummaryTile
              label="HWM Entries"
              value={loading ? "Loading..." : hwm.length.toString()}
            />
          </div>
        </GlassCard>
      </section>

      {/* INVOICES + FEES HISTORY */}
      <section className="grid gap-6 lg:grid-cols-2">
        <GlassCard title="Invoices">
          {error ? (
            <EmptyState message={error} tone="error" />
          ) : loading ? (
            <EmptyState message="Loading invoices..." />
          ) : invoices.length === 0 ? (
            <EmptyState message="No invoices yet. Completed billing activity will appear here." />
          ) : (
            <div className="divide-y divide-white/10">
              {invoices.map((invoice) => (
                <Row
                  key={invoice.id}
                  primary={`$${(invoice.total / 100).toFixed(2)}`}
                  secondary={invoice.status}
                  meta={new Date(invoice.created * 1000).toLocaleDateString()}
                  action={
                    invoice.invoice_pdf ? (
                      <a
                        href={invoice.invoice_pdf}
                        target="_blank"
                        className="text-sm text-blue-300 hover:text-blue-400 underline"
                      >
                        PDF
                      </a>
                    ) : invoice.hosted_invoice_url ? (
                      <a
                        href={invoice.hosted_invoice_url}
                        target="_blank"
                        className="text-sm text-blue-300 hover:text-blue-400 underline"
                      >
                        View
                      </a>
                    ) : null
                  }
                />
              ))}
            </div>
          )}
        </GlassCard>

        <GlassCard title="Fee History">
          {error ? (
            <EmptyState message={error} tone="error" />
          ) : loading ? (
            <EmptyState message="Loading fee history..." />
          ) : fees.length === 0 ? (
            <EmptyState message="No performance fees have been charged yet." />
          ) : (
            <div className="divide-y divide-white/10">
              {fees.map((fee) => (
                <Row
                  key={fee.id}
                  primary={`$${fee.fee_amount.toFixed(2)}`}
                  secondary={`Profit: $${fee.profit.toFixed(
                    2
                  )} • Rate: ${(fee.fee_rate_used * 100).toFixed(2)}%`}
                  meta={new Date(fee.created_at).toLocaleString()}
                />
              ))}
            </div>
          )}
        </GlassCard>
      </section>
    </div>
  );
}


function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-white/45">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}



function GlassCard({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_40px_rgba(0,0,0,0.35)] backdrop-blur-xl"
    >
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <div className="mt-5">{children}</div>
    </motion.div>
  );
}

function Row({
  primary,
  secondary,
  meta,
  action,
}: {
  primary: string;
  secondary?: string;
  meta?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 text-sm">
      <div>
        <div className="font-medium text-white">{primary}</div>
        {secondary && (
          <div className="mt-1 text-xs text-white/55">{secondary}</div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {meta && <div className="text-xs text-white/45">{meta}</div>}
        {action}
      </div>
    </div>
  );
}

function EmptyState({
  message,
  tone = "muted",
}: {
  message: string;
  tone?: "error" | "muted";
}) {
  return (
    <div
      className={`flex min-h-28 items-center justify-center rounded-2xl border px-4 text-center text-sm ${
        tone === "error"
          ? "border-red-500/25 bg-red-500/10 text-red-300"
          : "border-white/10 bg-black/20 text-white/55"
      }`}
    >
      {message}
    </div>
  );
}
