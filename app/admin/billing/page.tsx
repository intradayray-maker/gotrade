import { redirect } from "next/navigation";
import { createServerClient } from "@/utils/supabase/server";
import AdminBillingClient from "./AdminBillingClient";

export const dynamic = "force-dynamic";

const MASTER_USER_ID = process.env.MASTER_USER_ID!;

export default async function AdminBillingPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  if (user.id !== MASTER_USER_ID) {
    redirect("/dashboard");
  }

  return (
    <div className="px-6 py-6">
      <h1 className="text-2xl font-semibold mb-4">Admin Billing Dashboard</h1>
      <AdminBillingClient />
    </div>
  );
}
