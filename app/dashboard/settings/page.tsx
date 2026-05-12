import SettingsClient from "./SettingsClient";
import { createServerClient } from "@/utils/supabase/server";

export default async function SettingsPage() {
  const supabase = await createServerClient();

  await supabase.auth.getUser();

  return <SettingsClient />;
}
