import GTCard from "@/components/ui/GTCard";
import Link from "next/link";

import { createSupabaseServerClient } from "@/utils/supabase/server";
import { requireAdminUser } from "@/utils/auth/admin";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  requireAdminUser(user);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-[13px] text-white/40">
          <Link href="/dashboard" className="transition hover:text-white/70">
            Dashboard
          </Link>
          <span className="text-white/30">/</span>
          <span className="text-white/60">Admin</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-white">Admin</h1>
        <p className="max-w-2xl text-sm text-white/55">
          A simple control center for account management, billing review, and
          sandbox tools.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <AdminCard
          title="Billing"
          description="Review the live Stripe billing experience and customer state."
          href="/dashboard/billing"
        />
        <AdminCard
          title="Sandbox"
          description="Open the experimental dashboard tools and UI playground."
          href="/dashboard/sandbox"
        />
        <AdminCard
          title="Sandbox Admin"
          description="Use the admin-only workspace for internal planning tools."
          href="/admin"
        />
      </section>

      <GTCard>
        <h2 className="text-lg font-semibold text-white">Notes</h2>
        <ul className="mt-4 space-y-3 text-sm text-white/65">
          <li>Use this page as the replacement for the old admin shell.</li>
          <li>Trading controls were intentionally removed.</li>
          <li>Auth, Supabase, and Stripe flows remain intact.</li>
        </ul>
      </GTCard>
    </div>
  );
}

function AdminCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <GTCard className="group transition hover:border-emerald-500/60">
      <Link href={href} className="block">
        <h2 className="text-xl font-semibold text-white transition group-hover:text-emerald-200">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-white/55">{description}</p>
      </Link>
    </GTCard>
  );
}
