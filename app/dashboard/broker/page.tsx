import { redirect } from "next/navigation";

import BrokerClient from "./BrokerClient";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export default async function BrokerPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <BrokerClient />;
}
