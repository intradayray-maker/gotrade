"use client"

import { logout } from "@/lib/supabase/logout"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await logout()
    toast.success("Logged out successfully")
    router.push("/login")
  }

  return (
    <button
      onClick={handleLogout}
      className="text-white/70 hover:text-white transition"
    >
      Logout
    </button>
  )
}