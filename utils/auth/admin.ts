import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

const DEFAULT_ADMIN_EMAIL = "relertech@gmail.com";

export function getAdminEmail() {
  return (
    process.env.ADMIN_EMAIL ??
    process.env.NEXT_PUBLIC_ADMIN_EMAIL ??
    DEFAULT_ADMIN_EMAIL
  ).toLowerCase();
}

export function isAdminEmail(email: string | null | undefined) {
  return (email ?? "").toLowerCase() === getAdminEmail();
}

export function isAdminUser(user: Pick<User, "email"> | null | undefined) {
  return isAdminEmail(user?.email);
}

export function requireAdminUser(user: Pick<User, "email"> | null | undefined) {
  if (!user) {
    redirect("/login");
  }

  if (!isAdminUser(user)) {
    redirect("/dashboard");
  }

  return user;
}
