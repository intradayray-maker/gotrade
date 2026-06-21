import { createSupabaseServerClient } from "@/utils/supabase/server"
import ProfileClient from "./ProfileClient"
import type { User } from "@supabase/supabase-js"
import GTCard from "@/components/ui/GTCard"

export const dynamic = "force-dynamic"

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <GTCard className="text-white">
        Not logged in
      </GTCard>
    )
  }

  // Fetch profile INCLUDING id
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*, id, planname, nextbillingdate, billing_status")
    .eq("id", user.id)
    .maybeSingle()

  return (
    <ProfileClient
      user={user as User}
      profile={profile}
      passwordResetError={null}
      passwordResetSent={false}
    />
  )
}
