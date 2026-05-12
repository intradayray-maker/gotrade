import { redirect } from "next/navigation";

import BrokerClient from "./BrokerClient";
import { createServerClient } from "@/utils/supabase/server";

export default async function BrokerPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <BrokerClient />;
}
