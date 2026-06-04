"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import PaymentMethodForm from "@/app/billing/PaymentMethodForm";
import RemoveCardButton from "@/app/billing/RemoveCardButton";
import UpdateCardButton from "@/app/billing/UpdateCardButton";

import GTCard from "@/components/ui/GTCard";
import Link from "next/link";

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

  const [loading, setLoading] = useState(true);
  const [billing, setBilling] = useState<BillingHistoryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const plans = [
    {
      id: "pro",
      name: "Pro",
      description: "Full access to GoTrade with higher limits.",
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

    <div
    className="
    mx-auto
    flex
    w-full
    max-w-6xl
    flex-col
    gap-10
    px-4
    py-8
    sm:px-6
    lg:px-8
    "
    >

      {/* -------------------------
         TF PAGE HEADER
      -------------------------- */}
      <div
      className="
      w-full
      px-1
      md:px-6
      lg:px-2
      space-y-4
      max-w-5xl
      "
      >

        <div
        className="
        flex
        items-center
        gap-2
        text-[13px]
        text-white/40
        pt-3
        animate-fadeIn
        "
        >
          <Link
          href="/dashboard"
          className="
          hover:text-white/70
          transition-colors
          cursor-pointer
          "
          >
            Dashboard
          </Link>

          <span className="text-white/30">/</span>

          <span className="text-white/60">
            Billing
          </span>
        </div>

        <div
        className="
        animate-fadeIn
        [animation-duration:0.6s]
        "
        >

          <div
          className="
          flex
          items-center
          gap-3
          "
          >

            <svg
            className="
            w-7
            h-7
            text-emerald-400
            drop-shadow-[0_0_6px_rgba(0,255,180,0.35)]
            "
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

            <h1
            className="
            text-3xl
            font-bold
            tracking-tight
            text-white/90
            drop-shadow-[0_0_10px_rgba(0,255,180,0.25)]
            "
            >
              Billing
            </h1>

          </div>

          <p
          className="
          text-white/50
          text-sm
          mt-2
          tracking-wide
          max-w-md
          "
          >
            Manage your subscription, payment method, and billing history.
          </p>

          <div
          className="
          mt-5
          h-[2px]
          w-24
          bg-gradient-to-r
          from-emerald-400/80
          to-emerald-700/80
          rounded-full
          shadow-[0_0_12px_rgba(0,255,180,0.35)]
          animate-fadeIn
          [animation-delay:0.2s]
          "
          ></div>

        </div>

      </div>



      {/* -------------------------
         TOP ROW — 3 CARDS
      -------------------------- */}
      <div
      className="
      grid
      grid-cols-1
      md:grid-cols-2
      lg:grid-cols-3
      gap-6
      "
      >

{/* -------------------------
    BILLING OVERVIEW CARD (STACKED 3‑CELL VERSION)
-------------------------- */}
<GTCard>

  {/* CENTERED TITLE */}
  <div
  className="
  w-full
  text-center
  "
  >
    <p
    className="
    text-sm
    uppercase
    tracking-[0.2em]
    text-white/45
    "
    >
      Billing Overview
    </p>
  </div>


  {/* STACKED GRID */}
  <div
  className="
  mt-6
  grid
  grid-cols-1
  gap-4
  "
  >


    {/* -------------------------
        CELL 1 — PLAN + NEXT BILLING
    -------------------------- */}
    <div
    className="
    rounded-xl
    p-5
    bg-[#0b0b12]
    border
    border-white/10
    "
    >
      <p
      className="
      text-white/90
      text-[17px]
      font-semibold
      "
      >
        {profile.planName ?? "No active plan"}
      </p>

      {nextBilling && (
        <p
        className="
        mt-1
        text-white/60
        text-sm
        "
        >
          Next billing date: {nextBilling}
        </p>
      )}

      {profile.billingStatus === "cancelling" && nextBilling && (
        <p
        className="
        mt-1
        text-amber-300
        text-sm
        "
        >
          Cancels on {nextBilling}
        </p>
      )}
    </div>



    {/* -------------------------
        CELL 2 — STATUS + GLOW DOT
    -------------------------- */}
    <div
    className="
    rounded-xl
    p-5
    bg-[#0b0b12]
    border
    border-white/10
    flex
    items-center
    justify-center
    gap-3
    "
    >

      {/* GLOW DOT */}
      <div
      className={`
      h-3.5
      w-3.5
      rounded-full
      ${
        profile.billingStatus === "active"
          ? "bg-emerald-400 shadow-[0_0_10px_rgba(0,255,180,0.9)]"
          : "bg-red-400 shadow-[0_0_10px_rgba(255,0,0,0.7)]"
      }
      `}
      ></div>

      {/* STATUS TEXT */}
      <span
      className="
      text-white/80
      text-[15px]
      font-medium
      "
      >
        {billingStatus}
      </span>

    </div>



    {/* -------------------------
        CELL 3 — BUTTON ROW (CENTERED)
    -------------------------- */}
    <div
    className="
    rounded-xl
    p-5
    bg-[#0b0b12]
    border
    border-white/10
    flex
    items-center
    justify-center
    gap-4
    "
    >

      {/* UPGRADE BUTTON */}
      <button
      onClick={() => setShowUpgradeModal(true)}
      className="
      relative
      flex
      items-center
      justify-center
      px-[30px]
      py-[14px]
      rounded-[6px]
      text-[14px]
      font-semibold
      text-[rgb(225,254,234)]
      bg-[rgb(3,82,65)]
      shadow-[0_0_34px_rgba(3,82,65,0.45)]
      border-[5px]
      border-[rgb(3,82,65)]
      bg-clip-padding
      hover:bg-[rgb(4,100,80)]
      transition
      "
      >
        Upgrade
      </button>

      {/* CANCEL BUTTON */}
      <button
      disabled={!isCancelEnabled}
      onClick={() => setShowCancelModal(true)}
      className={`
      relative
      flex
      items-center
      justify-center
      px-[30px]
      py-[14px]
      rounded-[6px]
      text-[14px]
      font-semibold
      text-[rgb(225,254,234)]
      shadow-[0_0_34px_rgba(84,33,33,0.45)]
      border-[5px]
      bg-clip-padding
      transition
      ${
        isCancelling
          ? "bg-white/10 text-white/40 border-white/20 cursor-not-allowed"
          : "bg-[rgb(84,33,33)] border-[rgb(84,33,33)] hover:bg-[rgb(100,40,40)]"
      }
      `}
      >
        {isCancelling ? "Cancelling..." : "Cancel"}
      </button>

    </div>

  </div>

</GTCard>




{/* -------------------------
    PAYMENT METHOD CARD
-------------------------- */}
<GTCard>

{/* CENTERED TITLE (MATCHES BILLING OVERVIEW) */}
<div
className="
w-full
text-center
"
>
  <p
  className="
  text-sm
  uppercase
  tracking-[0.2em]
  text-white/45
  "
  >
    Payment Method
  </p>
</div>


  <div className="mt-13">

    <AnimatePresence mode="wait">

      {savedCard && !showPaymentForm && (
        <motion.div
          key="saved-card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className="
          space-y-5
          "
        >

          {/* CARD ON FILE BOX */}
          <div
            className="
            rounded-xl
            p-6
            bg-[#0b0b12]
            border
            border-emerald-500/20
            shadow-[0_0_20px_rgba(0,255,180,0.08)]
            "
          >
            <p
              className="
              text-xs
              uppercase
              tracking-[0.2em]
              text-white/45
              "
            >
              Card on file
            </p>

            <p
              className="
              mt-2
              text-xl
              font-medium
              capitalize
              text-white/90
              "
            >
              {savedCard.brand} •••• {savedCard.last4}
            </p>

            <p
              className="
              mt-1
              text-sm
              text-white/55
              "
            >
              Expires {savedCard.exp_month}/{savedCard.exp_year}
            </p>
          </div>

{/* CENTERED BUTTONS */}
<div
  className="
    flex
    flex-wrap
    gap-3
    justify-center
    mt-18
  "
>
  <UpdateCardButton />
  <RemoveCardButton />
</div>


        </motion.div>
      )}

      {showPaymentForm && (
        <motion.div
          key="payment-form"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className="
          mt-6
          rounded-xl
          p-5
          bg-[#0b0b12]
          border
          border-emerald-500/20
          shadow-[0_0_20px_rgba(0,255,180,0.08)]
          "
        >
          {/* CENTERED FORM HEADING */}
          <p
            className="
            text-lg
            font-medium
            text-white/90
            text-center
            "
          >
            {savedCard ? "Update Payment Method" : "Add Payment Method"}
          </p>

          <p
            className="
            mt-1
            text-sm
            text-white/55
            text-center
            "
          >
            Your card is securely stored with Stripe.
          </p>

          <div className="mt-4">
            <PaymentMethodForm />
          </div>
        </motion.div>
      )}

    </AnimatePresence>

  </div>

</GTCard>




        {/* -------------------------
           INVOICES CARD (CARD 3)
        -------------------------- */}
        <GTCard>

<div
className="
w-full
text-center
"
>
  <p
  className="
  text-sm
  uppercase
  tracking-[0.2em]
  text-white/45
  "
  >
    Invoices
  </p>
</div>


          <div className="mt-5">

            {error ? (
              <EmptyState message={error} tone="error" />

            ) : loading ? (
              <EmptyState message="Loading invoices..." />

            ) : invoices.length === 0 ? (
              <EmptyState message="No invoices yet. Completed billing activity will appear here." />

            ) : (
      
      
      
      
      
      
      
      
      
      
<div
  className="
  max-h-[290px]
  overflow-y-auto
  pr-2
  divide-y
  divide-white/10
  scrollbar-thin
  scrollbar-thumb-white/10
  scrollbar-track-transparent
  "
>
  {invoices.map((invoice) => (
    <Row
      key={invoice.id}
      primary={`$${(invoice.total / 100).toFixed(2)}`}
      secondary={invoice.status}
      meta={new Date(invoice.created * 1000).toLocaleDateString()}
      action={invoice.invoice_pdf ? (
        <a
          href={invoice.invoice_pdf}
          target="_blank"
          className="
          text-sm
          text-emerald-300
          hover:text-emerald-400
          underline
          "
        >
          PDF
        </a>
      ) : invoice.hosted_invoice_url ? (
        <a
          href={invoice.hosted_invoice_url}
          target="_blank"
          className="
          text-sm
          text-emerald-300
          hover:text-emerald-400
          underline
          "
        >
          View
        </a>
      ) : null}
    />
  ))}
</div>











            )}

          </div>

        </GTCard>


      </div>

      {/* -------------------------
         BOTTOM ROW — 2 CARDS
      -------------------------- */}
      <div
      className="
      grid
      grid-cols-1
      lg:grid-cols-2
      gap-6
      "
      >

        {/* -------------------------
           PERFORMANCE FEES CARD
        -------------------------- */}
        <GTCard>
<div
className="
w-full
text-center
"
>
  <p
  className="
  text-sm
  uppercase
  tracking-[0.2em]
  text-white/45
  "
  >
    Performance Fees

  </p>
</div>


          <div
            className="
            mt-5
            grid
            gap-4
            sm:grid-cols-2
            lg:grid-cols-1
            "
          >
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

        </GTCard>



{/* -------------------------
    FEE HISTORY CARD
-------------------------- */}
<GTCard>

<div
className="
w-full
text-center
"
>
  <p
  className="
  text-sm
  uppercase
  tracking-[0.2em]
  text-white/45
  "
  >
    Fee History
  </p>
</div>

<div
className="
mt-5
"
>

  {error ? (

    <div
    className="
    max-h-[300px]
    overflow-y-auto
    rounded-xl
    p-5
    bg-[#0b0b12]
    border
    border-white/10
    shadow-none
    "
    >
      <EmptyState message={error} tone="error" />
    </div>

  ) : loading ? (

    <div
    className="
    max-h-[300px]
    overflow-y-auto
    rounded-xl
    p-5
    bg-[#0b0b12]
    border
    border-white/10
    shadow-none
    "
    >
      <EmptyState message="Loading fee history..." />
    </div>

  ) : fees.length === 0 ? (

    <div
    className="
    max-h-[300px]
    overflow-y-auto
    rounded-xl
    p-5
    bg-[#0b0b12]
    border
    border-white/10
    shadow-none
    "
    >
      <EmptyState message="No performance fees have been charged yet." />
    </div>

  ) : (

    <div
    className="
    max-h-[300px]
    overflow-y-auto
    pr-2
    divide-y
    divide-white/10
    scrollbar-thin
    scrollbar-thumb-white/10
    scrollbar-track-transparent
    "
    >
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

</div>

</GTCard>





      </div>


      {/* end bottom row */}
      

      {/* -------------------------
         HELPER COMPONENTS
      -------------------------- */}

      {/* SUMMARY TILE */}
      <div></div>
    </div>
  );
}



/* ---------------------------------------------
   SUMMARY TILE COMPONENT
---------------------------------------------- */
function SummaryTile({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
    className="
    rounded-xl
    p-5
    bg-[#0b0b12]
    border
    border-emerald-500/20
    shadow-[0_0_20px_rgba(0,255,180,0.08)]
    "
    >
      <p
      className="
      text-xs
      uppercase
      tracking-[0.2em]
      text-white/45
      "
      >
        {label}
      </p>

      <p
      className="
      mt-2
      text-xl
      font-medium
      text-white/90
      "
      >
        {value}
      </p>
    </div>
  );
}



/* ---------------------------------------------
   ROW COMPONENT
---------------------------------------------- */
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
    <div
    className="
    flex
    items-center
    justify-between
    py-4
    "
    >
      <div>
        <p
        className="
        text-white/90
        font-medium
        "
        >
          {primary}
        </p>

        {secondary && (
          <p
          className="
          text-white/50
          text-sm
          mt-1
          "
          >
            {secondary}
          </p>
        )}

        {meta && (
          <p
          className="
          text-white/40
          text-xs
          mt-1
          "
          >
            {meta}
          </p>
        )}
      </div>

      {action && (
        <div className="ml-4">
          {action}
        </div>
      )}
    </div>
  );
}



/* ---------------------------------------------
   EMPTY STATE COMPONENT
---------------------------------------------- */
function EmptyState({
  message,
  tone = "neutral",
}: {
  message: string;
  tone?: "neutral" | "error";
}) {
  return (
    <div
    className={`
    rounded-xl
    p-5
    text-center
    ${
      tone === "error"
        ? "bg-red-500/10 border border-red-500/20 text-red-300"
        : "bg-white/5 border border-white/10 text-white/60"
    }
    `}
    >
      <p className="text-sm">
        {message}
      </p>
    </div>
  );
}



