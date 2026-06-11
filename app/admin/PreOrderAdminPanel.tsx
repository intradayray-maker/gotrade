"use client";

import { useEffect, useState } from "react";

type PreOrder = {
  id: string;
  name?: string | null;
  email?: string | null;
  capital?: number | null;
  created_at: string;
};

const sortOptions = [
  { label: "Newest", value: "newest", color: "emerald" },
  { label: "Oldest", value: "oldest", color: "emerald" },
  { label: "Highest capital", value: "capital-high", color: "blue" },
  { label: "Lowest capital", value: "capital-low", color: "blue" }
];

const filterOptions = [
  { label: "All signups", value: "all", color: "emerald" },
  { label: "Only with capital", value: "has-capital", color: "yellow" },
  { label: "Only no capital", value: "no-capital", color: "yellow" }
];

function fmtCapital(v: number | null | undefined) {
  if (!v) return "—";
  if (v >= 1000) return `$${(v / 1000).toFixed(1)}k`;
  return `$${v}`;
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
  });
}

function fmtTime(d: string) {
  return new Date(d).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit"
  });
}

export default function PreOrderAdminPanel() {
  const [preorders, setPreorders] = useState<PreOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");

  const [sort, setSort] = useState("newest");
  const [filter, setFilter] = useState("all");

  async function loadPreorders() {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set("sort", sort);
      params.set("filter", filter);

      if (query.trim()) {
        params.set("q", query.trim());
      }

      const res = await fetch(`/api/gotrade/preorder?${params.toString()}`, {
        cache: "no-store"
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body?.error || res.statusText);
      }

      const data: PreOrder[] = await res.json();
      setPreorders(data || []);
    } catch (err: any) {
      setError(err?.message || "Failed to load pre-orders.");
      setPreorders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPreorders();
  }, [sort, filter, query]);

  return (
    <div className="rounded-3xl border border-slate-800/60 bg-[#07080f]/95 p-6 shadow-[0_0_30px_rgba(0,0,0,0.45)]">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white/90">
            Pre-Order Admin Panel
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Live preorder data pulled through a secure admin API.
          </p>
        </div>

        {/* LIVE SEARCH INPUT */}
        <div className="flex w-full max-w-sm items-center">
          <input
            value={search}
            onChange={(event) => {
              const v = event.target.value;
              setSearch(v);
              setQuery(v); // live search

              if (v.trim() === "") {
                setQuery(""); // reset to full list
              }
            }}
            placeholder="Search name or email"
            className="
              w-full
              rounded-2xl
              border border-slate-700
              bg-slate-950/90
              px-4
              py-2
              text-sm
              text-white/90
              focus:border-emerald-400
              focus:outline-none
            "
          />
        </div>
      </div>

      <div className="mb-6 grid gap-3 md:grid-cols-[1fr_auto]">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-800/60 bg-slate-950/80 p-4">
            <p className="text-sm text-slate-400">Sort</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSort(option.value)}
                  className={`
                    rounded-full
                    px-3
                    py-1.5
                    text-sm
                    font-medium
                    transition
                    ${
                      sort === option.value
                        ? "bg-white text-slate-950"
                        : "bg-slate-900/80 text-slate-300 hover:bg-slate-800"
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800/60 bg-slate-950/80 p-4">
            <p className="text-sm text-slate-400">Filter</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFilter(option.value)}
                  className={`
                    rounded-full
                    px-3
                    py-1.5
                    text-sm
                    font-medium
                    transition
                    ${
                      filter === option.value
                        ? "bg-white text-slate-950"
                        : "bg-slate-900/80 text-slate-300 hover:bg-slate-800"
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {/* -------------------------------------------------- */}
      {/*                 GOTRADE PREMIUM TABLE              */}
      {/* -------------------------------------------------- */}

      <div
        className="
          overflow-x-auto
          rounded-3xl
          border
          border-emerald-500/20
          bg-[#05060c]/95
          shadow-[0_0_25px_rgba(16,185,129,0.15)]
          backdrop-blur-xl
        "
      >
        <table className="min-w-full text-left text-base text-white/90">
          <thead
            className="
              bg-[#0b0d14]/90
              text-sm
              uppercase
              tracking-[0.15em]
              text-emerald-400/70
              border-b border-emerald-500/10
            "
          >
            <tr>
              <th className="px-5 py-4">Name</th>
              <th className="px-5 py-4">Email</th>
              <th className="px-5 py-4">Capital</th>
              <th className="px-5 py-4">Date</th>
              <th className="px-5 py-4">Time</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-10 text-center text-slate-400 text-base"
                >
                  Loading preorders...
                </td>
              </tr>
            ) : preorders.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-10 text-center text-slate-400 text-base"
                >
                  No preorders found.
                </td>
              </tr>
            ) : (
              preorders.map((order) => (
                <tr
                  key={order.id}
                  className="
                    border-t border-slate-800/40
                    hover:bg-emerald-500/5
                    transition
                  "
                >
                  <td className="px-5 py-4 font-semibold text-white/95">
                    {order.name || "—"}
                  </td>

                  <td className="px-5 py-4 text-slate-300">
                    {order.email || "—"}
                  </td>

                  <td className="px-5 py-4 text-emerald-300 font-medium">
                    {fmtCapital(order.capital)}
                  </td>

                  <td className="px-5 py-4 text-slate-400">
                    {fmtDate(order.created_at)}
                  </td>

                  <td className="px-5 py-4 text-slate-400">
                    {fmtTime(order.created_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
