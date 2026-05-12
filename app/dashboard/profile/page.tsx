import { createServerClient } from "@/utils/supabase/server";
import ProfileClient from "./ProfileClient";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div className="text-white p-6">Not logged in</div>;
  }

  // Fetch profile fields safely
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("planname, nextbillingdate, billing_status")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <ProfileClient
      user={user}
      profile={profile}
      passwordResetError={null}
      passwordResetSent={false}
    />
  );
}
