"use client";

import { useEffect, useState } from "react";

type OverviewResponse = {
  total_revenue: number;
  total_fees: number;
  fees: any[];
};

type FollowersResponse = {
  followers: any[];
};

export default function AdminBillingClient() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<OverviewResponse | null>(null);
  const [followers, setFollowers] = useState<FollowersResponse | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const o = await fetch("/api/admin/billing/overview");
        const overviewJson = (await o.json()) as OverviewResponse;
        setOverview(overviewJson);

        const f = await fetch("/api/admin/billing/followers");
        const followersJson = (await f.json()) as FollowersResponse;
        setFollowers(followersJson);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading || !overview || !followers) {
    return <div className="text-sm text-muted-foreground">Loading admin billing…</div>;
  }

  const { total_revenue, total_fees, fees } = overview;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          label="Total Revenue"
          value={`$${total_revenue.toFixed(2)}`}
        />
        <SummaryCard label="Total Fees Charged" value={total_fees.toString()} />
        <SummaryCard
          label="Followers"
          value={followers.followers.length.toString()}
        />
      </section>

      {/* Revenue Table */}
      <Card>
        <CardHeader title="Recent Performance Fees" />
        <div className="divide-y">
          {fees.length === 0 && (
            <EmptyRow message="No performance fees recorded yet." />
          )}
          {fees.map((fee: any) => (
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
      </Card>

      {/* Followers Profitability */}
      <Card>
        <CardHeader title="Follower Profitability" />
        <div className="divide-y">
          {followers.followers.length === 0 && (
            <EmptyRow message="No followers found." />
          )}
          {followers.followers.map((f: any) => (
            <Row
              key={f.user_id}
              primary={`User: ${f.user_id}`}
              secondary={`Fee Rate: ${(f.performance_fee_rate * 100).toFixed(
                2
              )}%`}
              meta={`Enabled: ${f.enabled ? "Yes" : "No"}`}
            />
          ))}
        </div>
      </Card>

      {/* Admin Controls */}
      <Card>
        <CardHeader title="Admin Controls" />
        <div className="space-y-4">
          <button
            onClick={async () => {
              await fetch("/api/admin/billing/manual-crystallize", {
                method: "POST",
              });
              alert("Crystallization triggered");
            }}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-700"
          >
            Run Crystallization Now
          </button>

          <FeeRateOverride followers={followers.followers} />
        </div>
      </Card>
    </div>
  );
}

function FeeRateOverride({ followers }: { followers: any[] }) {
  const [selected, setSelected] = useState<string>("");
  const [rate, setRate] = useState<string>("");

  const submit = async () => {
    if (!selected || !rate) return;

    await fetch("/api/admin/billing/fee-rate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: selected,
        fee_rate: parseFloat(rate),
      }),
    });

    alert("Fee rate updated");
  };

  return (
    <div className="rounded-lg border border-white/10 p-4">
      <div className="text-sm font-medium mb-2">Override Fee Rate</div>

      <select
        className="w-full rounded bg-black/40 border border-white/10 p-2 text-sm"
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
      >
        <option value="">Select follower</option>
        {followers.map((f) => (
          <option key={f.user_id} value={f.user_id}>
            {f.user_id}
          </option>
        ))}
      </select>

      <input
        type="number"
        step="0.01"
        placeholder="Fee rate (0.20 = 20%)"
        className="mt-2 w-full rounded bg-black/40 border border-white/10 p-2 text-sm"
        value={rate}
        onChange={(e) => setRate(e.target.value)}
      />

      <button
        onClick={submit}
        className="mt-3 rounded bg-green-600 px-4 py-2 text-sm font-medium hover:bg-green-700"
      >
        Update Fee Rate
      </button>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/40 p-4">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 text-xl font-semibold">{value}</div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/40 p-4">
      {children}
    </div>
  );
}

function CardHeader({ title }: { title: string }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-sm font-medium">{title}</h2>
    </div>
  );
}

function Row({
  primary,
  secondary,
  meta,
}: {
  primary: string;
  secondary?: string;
  meta?: string;
}) {
  return (
    <div className="flex items-center justify-between py-2 text-sm">
      <div>
        <div className="font-medium">{primary}</div>
        {secondary && (
          <div className="text-xs text-muted-foreground">{secondary}</div>
        )}
      </div>
      {meta && <div className="text-xs text-muted-foreground">{meta}</div>}
    </div>
  );
}

function EmptyRow({ message }: { message: string }) {
  return (
    <div className="py-6 text-xs text-muted-foreground text-center">
      {message}
    </div>
  );
}
