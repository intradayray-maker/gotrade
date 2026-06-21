export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { createClient } from "@supabase/supabase-js"

// -----------------------------
// AUTH SESSION
// -----------------------------
async function getSession() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set() {},
        remove() {}
      }
    }
  )

  const { data } = await supabase.auth.getUser()
  return data.user
}

// -----------------------------
// PROFILE
// -----------------------------
async function getProfile(userId: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data } = await supabase
    .from("profiles")
    .select("*, is_admin")
    .eq("id", userId)
    .single()

  return data
}

// -----------------------------
// PREORDERS
// -----------------------------
async function getPreorders() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data } = await supabase
    .from("gotrade_preorders")
    .select("*")
    .order("created_at", { ascending: false })

  return data || []
}

// -----------------------------
// FORMAT HELPERS
// -----------------------------
function fmtCapital(v: number | null) {
  if (!v) return "—"
  if (v >= 1000) return `$${(v / 1000).toFixed(1)}k`
  return `$${v}`
}

function fmtDate(d: string) {
  const date = new Date(d)
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
  })
}

function fmtTime(d: string) {
  const date = new Date(d)
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit"
  })
}

// -----------------------------
// PAGE
// -----------------------------
export default async function AdminPreorders({ searchParams }: any) {
  const user = await getSession()
  const profile = user ? await getProfile(user.id) : null

  if (!user) redirect("/")
  if (!profile?.is_admin) redirect("/")

  const sort = searchParams.sort
  const filter = searchParams.filter
  const query = (searchParams.q || "").toLowerCase()

  let preorders = await getPreorders()

  // -----------------------------
  // SEARCH
  // -----------------------------
  if (query) {
    preorders = preorders.filter((p: any) =>
      (p.name || "").toLowerCase().includes(query) ||
      (p.email || "").toLowerCase().includes(query)
    )
  }

  // -----------------------------
  // FILTERING
  // -----------------------------
  if (filter === "has-capital") {
    preorders = preorders.filter((p: any) => p.capital && p.capital > 0)
  }

  if (filter === "no-capital") {
    preorders = preorders.filter((p: any) => !p.capital || p.capital === 0)
  }

  // -----------------------------
  // SORTING
  // -----------------------------
  if (sort === "oldest") {
    preorders = [...preorders].sort(
      (a: any, b: any) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
  }

  if (sort === "capital-high") {
    preorders = [...preorders].sort(
      (a: any, b: any) => (b.capital || 0) - (a.capital || 0)
    )
  }

  if (sort === "capital-low") {
    preorders = [...preorders].sort(
      (a: any, b: any) => (a.capital || 0) - (b.capital || 0)
    )
  }

  // -----------------------------
  // ACTIVE BUTTON HELPER
  // -----------------------------
  function active(param: string, value: string) {
    return searchParams[param] === value
  }

  return (
<div className="py-20 max-w-6xl mx-auto px-6 text-white">




      {/* HEADER */}
<h1 className="
  text-2xl font-bold mb-6
  bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent
  drop-shadow-[0_0_12px_rgba(0,255,180,0.35)]
">
  GoTrade Pre‑Orders (Admin View)
</h1>

      {/* TOTAL SIGNUPS */}
      <div className="
        inline-block mb-10 px-6 py-3 rounded-lg
        bg-[rgb(3,82,65)] text-[rgb(225,254,234)]
        border border-[rgb(3,82,65)]
        shadow-[0_0_22px_rgba(3,82,65,0.55)]
        text-xl font-semibold
      ">
        🎉 Total Pre-Orders: {preorders.length}
      </div>

      {/* SEARCH BAR */}
      <form className="mb-8 flex justify-center">
        <input
          name="q"
          defaultValue={searchParams.q || ""}
          placeholder="Search name or email..."
          className="
            w-full max-w-md px-4 py-2 rounded-lg
            bg-[#0f0f17] border border-slate-800/40
            text-white/80 text-sm
            focus:outline-none focus:border-emerald-400/40
          "
        />
      </form>

      {/* FILTER BUTTONS */}
<div className="overflow-x-auto bg-transparent border-none">

        <div className="rounded-xl bg-[#0b0b12] p-4 flex flex-wrap justify-center gap-3">

          {[
            { label: "Newest first", href: "?sort=newest", color: "emerald", param: "sort", value: "newest" },
            { label: "Oldest first", href: "?sort=oldest", color: "emerald", param: "sort", value: "oldest" },
            { label: "Highest capital", href: "?sort=capital-high", color: "blue", param: "sort", value: "capital-high" },
            { label: "Lowest capital", href: "?sort=capital-low", color: "blue", param: "sort", value: "capital-low" },
            { label: "Only with capital", href: "?filter=has-capital", color: "yellow", param: "filter", value: "has-capital" },
            { label: "Only no capital", href: "?filter=no-capital", color: "yellow", param: "filter", value: "no-capital" },
          ].map((btn, i) => (
            <a
              key={i}
              href={btn.href}
              className={`
                px-4 py-1.5 rounded-[6px] text-sm font-medium
                transition duration-150 cursor-pointer border
                ${
                  btn.color === "emerald"
                    ? active(btn.param, btn.value)
                      ? "text-black bg-emerald-300 border-emerald-300 shadow-[0_0_14px_rgba(16,185,129,0.55)]"
                      : "text-emerald-300 border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 hover:shadow-[0_0_12px_rgba(16,185,129,0.45)]"
                    : btn.color === "blue"
                    ? active(btn.param, btn.value)
                      ? "text-black bg-blue-300 border-blue-300 shadow-[0_0_14px_rgba(59,130,246,0.55)]"
                      : "text-blue-300 border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 hover:shadow-[0_0_12px_rgba(59,130,246,0.45)]"
                    : active(btn.param, btn.value)
                      ? "text-black bg-yellow-300 border-yellow-300 shadow-[0_0_14px_rgba(234,179,8,0.55)]"
                      : "text-yellow-300 border-yellow-500/30 bg-yellow-500/10 hover:bg-yellow-500/20 hover:shadow-[0_0_12px_rgba(234,179,8,0.45)]"
                }
              `}
            >
              {btn.label}
            </a>
          ))}
        </div>
      </div>

      {/* TABLE */}
<div className="overflow-x-auto bg-transparent border-none">

        <div className="rounded-xl bg-[#0b0b12]">
          <table className="w-full text-left text-white/80">
            <thead className="bg-[#0f0f17] border-b border-slate-800/40">
              <tr>
                <th className="p-4 text-sm font-semibold text-white/60">Name</th>
                <th className="p-4 text-sm font-semibold text-white/60">Email</th>
                <th className="p-4 text-sm font-semibold text-white/60">Capital</th>
                <th className="p-4 text-sm font-semibold text-white/60">Date</th>
                <th className="p-4 text-sm font-semibold text-white/60">Time</th>
              </tr>
            </thead>

            <tbody className="text-[20px]">
              {preorders.map((p: any) => (
                <tr
                  key={p.id}
                  className="border-b border-slate-800/40 hover:bg-white/5 transition"
                >
                  <td className="p-4 font-medium text-white/90">{p.name || "—"}</td>
                  <td className="p-4 font-medium text-blue-300">{p.email}</td>
                  <td className="p-4 font-semibold text-emerald-300">{fmtCapital(p.capital)}</td>
                  <td className="p-4 text-white/80">{fmtDate(p.created_at)}</td>
                  <td className="p-4 text-white/80">{fmtTime(p.created_at)}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  )
}
