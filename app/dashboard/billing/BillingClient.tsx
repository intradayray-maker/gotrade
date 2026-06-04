"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import BillingPortalButton from "@/components/dashboard/BillingPortalButton";

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

export type InvoiceItem = {
  id: string;
  amount_due: number;
  amount_paid: number;
  currency: string;
  hosted_invoice_url?: string | null;
  invoice_pdf?: string | null;
  status: string | null;
  created: number;
};

type BillingClientProps = {
  profile: BillingProfile;
  savedCard: SavedCard | null;
  subscriptionId: string | null;
  invoices: InvoiceItem[];
  showPaymentForm: boolean;
};

const statusMap: Record<string, string> = {
  payment_method_attached: "Payment Method Added",
  inactive: "Inactive",
  active: "Active",
  cancelling: "Cancelling",
};

// ⭐ Local flat card — replaces GTCard
function BillingCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`
        rounded-xl
        border-[2px]
        border border-emerald-500/30
        bg-transparent
        p-6
        h-full
        flex flex-col
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default function BillingClient({
  profile,
  savedCard,
  subscriptionId,
  invoices,
  showPaymentForm,
}: BillingClientProps) {
  const [canceling, startTransition] = useTransition();
  const [cancelError, setCancelError] = useState<string | null>(null);

  const billingStatus = statusMap[profile.billingStatus ?? "inactive"] ?? "Inactive";
  const nextBilling =
    profile.nextBillingDate &&
    new Date(profile.nextBillingDate * 1000).toLocaleDateString();

  const hasSavedCard = Boolean(savedCard);
  const canCancel = Boolean(subscriptionId) && profile.billingStatus === "active";

  async function cancelSubscription() {
    if (!subscriptionId) return;

    setCancelError(null);
    startTransition(async () => {
      const res = await fetch("/api/stripe/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setCancelError(data.error ?? "Failed to cancel subscription");
        return;
      }

      window.location.reload();
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8">

      {/* Breadcrumb + Header */}
      <div className="max-w-5xl space-y-4">
        <div className="flex items-center gap-2 pt-3 text-[13px] text-white/40">
          <Link href="/dashboard" className="transition-colors hover:text-white/70">
            Dashboard
          </Link>
          <span className="text-white/30">/</span>
          <span className="text-white/60">Billing</span>
        </div>

        <div>
          <div className="flex items-center gap-3">
            <svg
              className="h-7 w-7 text-emerald-400 drop-shadow-[0_0_6px_rgba(0,255,180,0.35)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 10h18" />
              <path d="M7 15h2" />
              <path d="M11 15h4" />
            </svg>

            <h1 className="text-3xl font-bold tracking-tight text-white/90 drop-shadow-[0_0_10px_rgba(0,255,180,0.25)]">
              Billing
            </h1>
          </div>

          <p className="mt-2 max-w-md text-sm tracking-wide text-white/50">
            Manage your subscription, payment method, and billing history.
          </p>

          <div className="mt-5 h-[2px] w-24 rounded-full bg-gradient-to-r from-emerald-400/80 to-emerald-700/80 shadow-[0_0_12px_rgba(0,255,180,0.35)]" />
        </div>
      </div>

      {/* 3-Card Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-stretch">

        {/* BILLING OVERVIEW */}
        <BillingCard>
          <div className="w-full text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-white/45">
              Billing Overview
            </p>
          </div>

          {/* ⭐ Replace Customer ID with Payment Method Added */}
          {hasSavedCard && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(16,185,129,0.8)]" />
              <span className="text-emerald-400 text-sm font-medium tracking-wide">
                Payment Method Added
              </span>
            </div>
          )}

          <div className="mt-6 space-y-4 flex-1">
            <div className="rounded-xl border border-emerald-500/20 bg-transparent p-5">
              <p className="text-[17px] font-semibold text-white/90">
                {profile.planName ?? "No active plan"}
              </p>

              {nextBilling && (
                <p className="mt-1 text-sm text-white/60">
                  Next billing date: {nextBilling}
                </p>
              )}

              <p className="mt-3 inline-flex rounded-full border border-emerald-500/20 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70">
                {billingStatus}
              </p>
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-transparent p-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <BillingPortalButton label="Manage" />

                <button
                  type="button"
                  disabled={!canCancel || canceling}
                  onClick={cancelSubscription}
                  className="
                    relative
                    flex
                    items-center
                    justify-center
                    rounded-[6px]
                    border-[5px]
                    border-[rgb(84,33,33)]
                    bg-[rgb(84,33,33)]
                    bg-clip-padding
                    px-[30px]
                    py-[14px]
                    text-[14px]
                    font-semibold
                    text-[rgb(225,254,234)]
                    shadow-[0_0_34px_rgba(84,33,33,0.45)]
                    transition
                    hover:bg-[rgb(100,40,40)]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {canceling ? "Cancelling..." : "Cancel"}
                </button>
              </div>

              {cancelError && (
                <p className="mt-3 text-sm text-red-400">{cancelError}</p>
              )}
            </div>
          </div>
        </BillingCard>

 {/* PAYMENT METHOD */}
<BillingCard>
  <div className="w-full text-center justify-center">
    <p className="text-sm uppercase tracking-[0.2em] text-white/45">
      Payment Method
    </p>
  </div>

  {hasSavedCard && !showPaymentForm && (
    <div className="flex items-center justify-center gap-2 pt-3 justify-center">
      <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(16,185,129,0.8)]" />
      <span className="text-emerald-400 text-sm font-medium tracking-wide">
        Payment Method Added
      </span>
    </div>
  )}

  <div className="mt-6 flex-1 flex flex-col gap-5 justify-center">

    {hasSavedCard && !showPaymentForm ? (
      <>
        {/* CARD INFO CELL */}
        <div className="rounded-xl border border-emerald-500/20 bg-transparent p-6 text-center justify-center">
          <p className="text-xs uppercase tracking-[0.2em] text-white/45">
            Card on file
          </p>
          <p className="mt-2 text-xl font-medium capitalize text-white/90">
            {savedCard?.brand} •••• {savedCard?.last4}
          </p>
          <p className="mt-1 text-sm text-white/55">
            Expires {savedCard?.exp_month}/{savedCard?.exp_year}
          </p>
        </div>

        {/* BUTTON CELL */}
        <div className="flex flex-wrap justify-center gap-3 mt-auto pb-2">
          <UpdateCardButton />
          <RemoveCardButton />
        </div>
      </>
    ) : (
      /* FORM CELL */
      <div className="rounded-xl border border-emerald-500/20 bg-transparent p-5 flex-1 flex flex-col items-center justify-center">
        <p className="text-center text-lg font-medium text-white/90 justify-center">
          {savedCard ? "Update Payment Method" : "Add Payment Method"}
        </p>
        <p className="mt-1 text-center text-sm text-white/55 justify-center">
          Your card is securely stored with Stripe.
        </p>

        {/* THIS is the part that actually centers the form */}
        <div className="mt-4 w-full flex justify-center">
          <div className="w-full max-w-md justify-center">
            <PaymentMethodForm />
          </div>
        </div>
      </div>
    )}

  </div>
</BillingCard>


        {/* INVOICES */}
        <BillingCard>
          <div className="w-full text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-white/45">
              Invoices
            </p>
          </div>

          <div className="mt-6 flex-1 flex flex-col">
            {invoices.length === 0 ? (
              <div className="rounded-xl border border-emerald-500/20 bg-transparent p-5 flex flex-col items-center justify-center text-white/70 flex-1">
                No invoices yet.
                <span className="text-white/40 text-xs mt-1">
                  Completed billing activity will appear here.
                </span>
              </div>
            ) : (
              <div className="divide-y divide-emerald-500/20 overflow-y-auto pr-2 flex-1">
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between gap-4 py-4"
                  >
                    <div>
                      <p className="font-medium text-white/90">
                        ${(invoice.amount_paid / 100).toFixed(2)}
                      </p>
                      <p className="mt-1 text-sm text-white/55">
                        {invoice.status ?? "unknown"}
                      </p>
                      <p className="mt-1 text-xs text-white/40">
                        {new Date(invoice.created * 1000).toLocaleDateString()}
                      </p>
                    </div>

                    {invoice.invoice_pdf ? (
                      <a
                        href={invoice.invoice_pdf}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-emerald-300 underline hover:text-emerald-200"
                      >
                        PDF
                      </a>
                    ) : invoice.hosted_invoice_url ? (
                      <a
                        href={invoice.hosted_invoice_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-emerald-300 underline hover:text-emerald-200"
                      >
                        View
                      </a>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </BillingCard>

      </div>
    </div>
  );
}
