import SettingsClient from "./SettingsClient";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export default async function SettingsPage() {
  const supabase = await createSupabaseServerClient();

  await supabase.auth.getUser();

  return <SettingsClient />;
}
