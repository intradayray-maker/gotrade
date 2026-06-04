"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Bars3Icon,
  Cog6ToothIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  Squares2X2Icon,
  UserIcon,
} from "@heroicons/react/24/outline";

import NotificationsBell from "@/app/components/NotificationsBell";
import UserMenu from "@/components/UserMenu";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function HeaderClient({
  user,
  isAdmin,
  variant,
  homeHref,
}: {
  user: any;
  isAdmin: boolean;
  variant: "public" | "dashboard";
  homeHref: string;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!pathname) return null;

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black">
      <div className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          {variant === "dashboard" && user && (
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-white/80 transition hover:text-white md:hidden"
            >
              <Bars3Icon className="h-7 w-7" />
            </button>
          )}

          <Link href={homeHref} className="flex items-center gap-3 text-white">
            <img src="/logo/gotrade.png" alt="GoTrade" className="h-8 w-auto" />
            <span className="text-lg font-semibold tracking-tight">GoTrade</span>
          </Link>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          {!user && (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-white/70 transition hover:text-white">
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-white px-4 py-2 text-black transition hover:bg-white/90"
              >
                Sign Up
              </Link>
            </div>
          )}

          {user && (
            <>
              <Link
                href="/dashboard"
                title="Dashboard"
                className={`flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10 ${
                  pathname === "/dashboard"
                    ? "text-white shadow-[0_0_12px_rgba(255,255,255,0.45)]"
                    : "text-white/60"
                }`}
              >
                <Squares2X2Icon className="h-5 w-5" />
              </Link>

              <Link
                href="/dashboard/billing"
                title="Billing"
                className={`flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10 ${
                  pathname.startsWith("/dashboard/billing")
                    ? "text-white shadow-[0_0_12px_rgba(255,255,255,0.45)]"
                    : "text-white/60"
                }`}
              >
                <CreditCardIcon className="h-5 w-5" />
              </Link>

              <Link
                href="/dashboard/profile"
                title="Profile"
                className={`flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10 ${
                  pathname.startsWith("/dashboard/profile")
                    ? "text-white shadow-[0_0_12px_rgba(255,255,255,0.45)]"
                    : "text-white/60"
                }`}
              >
                <UserIcon className="h-5 w-5" />
              </Link>

              <Link
                href="/dashboard/settings"
                title="Settings"
                className={`flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10 ${
                  pathname.startsWith("/dashboard/settings")
                    ? "text-white shadow-[0_0_12px_rgba(255,255,255,0.45)]"
                    : "text-white/60"
                }`}
              >
                <Cog6ToothIcon className="h-5 w-5" />
              </Link>

              {isAdmin && (
                <Link
                  href="/dashboard/admin"
                  title="Admin Panel"
                  className={`relative flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10 ${
                    pathname.startsWith("/dashboard/admin")
                      ? "text-white shadow-[0_0_12px_rgba(255,255,255,0.45)]"
                      : "text-white/60"
                  }`}
                >
                  <ShieldCheckIcon className="h-5 w-5" />
                  {typeof window !== "undefined" && (window.__gotrade_errors ?? 0) > 0 && (
                    <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-500 shadow-[0_0_6px_rgba(255,0,0,0.8)]" />
                  )}
                </Link>
              )}

              <NotificationsBell />

              <div className="ml-2">
                <UserMenu user={user} isAdmin={isAdmin} />
              </div>
            </>
          )}
        </div>
      </div>

      {user && mobileOpen && (
        <div className="absolute left-0 top-[72px] flex w-full justify-center md:hidden animate-slideDown">
          <div className="mx-auto w-full max-w-sm rounded-2xl bg-black p-4">
            <Link
              href="/dashboard"
              onClick={closeMobile}
              className="flex items-center gap-3 py-3 text-white/90 transition hover:text-white"
            >
              <Squares2X2Icon className="h-6 w-6" />
              <span className="text-base">Dashboard</span>
            </Link>
            <div className="my-2 h-px bg-white/10" />

            <Link
              href="/dashboard/billing"
              onClick={closeMobile}
              className="flex items-center gap-3 py-3 text-white/90 transition hover:text-white"
            >
              <CreditCardIcon className="h-6 w-6" />
              <span className="text-base">Billing</span>
            </Link>
            <div className="my-2 h-px bg-white/10" />

            <Link
              href="/dashboard/profile"
              onClick={closeMobile}
              className="flex items-center gap-3 py-3 text-white/90 transition hover:text-white"
            >
              <UserIcon className="h-6 w-6" />
              <span className="text-base">Profile</span>
            </Link>
            <div className="my-2 h-px bg-white/10" />

            <Link
              href="/dashboard/settings"
              onClick={closeMobile}
              className="flex items-center gap-3 py-3 text-white/90 transition hover:text-white"
            >
              <Cog6ToothIcon className="h-6 w-6" />
              <span className="text-base">Settings</span>
            </Link>

            {isAdmin && (
              <>
                <div className="my-2 h-px bg-white/10" />
                <Link
                  href="/dashboard/admin"
                  onClick={closeMobile}
                  className="flex items-center gap-3 py-3 text-white/90 transition hover:text-white"
                >
                  <ShieldCheckIcon className="h-6 w-6" />
                  <span className="text-base">Admin Panel</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
