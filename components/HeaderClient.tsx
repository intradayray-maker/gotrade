"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import UserMenu from "@/components/UserMenu";
import { useState, useEffect } from "react";
import NotificationsBell from "@/app/components/NotificationsBell";

import {
  Squares2X2Icon,
  ChartBarIcon,
  LinkIcon,
  UserIcon,
  Cog6ToothIcon,
  Bars3Icon,
  ClockIcon,
  ShieldCheckIcon, // admin icon
} from "@heroicons/react/24/outline";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function HeaderClient({
  user,
  variant,
  homeHref,
}: {
  user: any;
  variant: "public" | "dashboard";
  homeHref: string;
}) {
  const [brokerConnected, setBrokerConnected] = useState(false);
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    async function loadStatus() {
      try {
        const res = await fetch("/api/alpaca/status", {
          method: "GET",
          cache: "no-store",
        });
        const data = await res.json();
        setBrokerConnected(data.status === "connected");
      } catch (err) {
        console.error("Failed to fetch broker status:", err);
        setBrokerConnected(false);
      }
    }
    loadStatus();
  }, []);

  if (!pathname) return null;

  const closeMobile = () => setMobileOpen(false);

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";

  // Admin email (you)
  const ADMIN_EMAIL = "relertech@gmail.com";

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black">
      <div className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between px-4 sm:px-6">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-3">
          {variant === "dashboard" && user && (
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-white/80 hover:text-white transition"
            >
              <Bars3Icon className="h-7 w-7" />
            </button>
          )}

          {/* LOGO */}
          <Link href={homeHref} className="flex items-center gap-3 text-white">
            <img src="/logo/flowtrade.png" alt="FlowTrade" className="h-8 w-auto" />
            <span className="text-lg font-semibold tracking-tight">FlowTrade</span>
          </Link>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex items-center gap-4">

          {/* PUBLIC NAV */}
          {!user && (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-white/70 hover:text-white transition">
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* AUTH NAV */}
          {user && (
            <>
              {/* Dashboard */}
              <Link
                href="/dashboard"
                title="Dashboard"
                className={`flex items-center justify-center h-9 w-9 rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10
                  ${pathname === "/dashboard" ? "text-white shadow-[0_0_12px_rgba(255,255,255,0.45)]" : "text-white/60"}`}
              >
                <Squares2X2Icon className="h-5 w-5" />
              </Link>

              {/* Copy Trading */}
              <Link
                href="/dashboard/copy-trading"
                title="Copy‑Trading"
                className={`flex items-center justify-center h-9 w-9 rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10
                  ${pathname.startsWith("/dashboard/copy-trading") ? "text-white shadow-[0_0_12px_rgba(255,255,255,0.45)]" : "text-white/60"}`}
              >
                <ChartBarIcon className="h-5 w-5" />
              </Link>

              {/* Broker Linking */}
              <Link
                href="/dashboard/account-linking"
                title="Broker Linking"
                className={`flex items-center justify-center h-9 w-9 rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10
                  ${pathname.startsWith("/dashboard/account-linking") ? "text-white shadow-[0_0_12px_rgba(255,255,255,0.45)]" : "text-white/60"}`}
              >
                <LinkIcon className="h-5 w-5" />
              </Link>

              {/* Trade History */}
              <Link
                href="/dashboard/trade-history"
                title="Trade History"
                className={`flex items-center justify-center h-9 w-9 rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10
                  ${pathname.startsWith("/dashboard/trade-history") ? "text-white shadow-[0_0_12px_rgba(255,255,255,0.45)]" : "text-white/60"}`}
              >
                <ClockIcon className="h-5 w-5" />
              </Link>

              {/* Profile */}
              <Link
                href="/dashboard/profile"
                title="Profile"
                className={`flex items-center justify-center h-9 w-9 rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10
                  ${pathname.startsWith("/dashboard/profile") ? "text-white shadow-[0_0_12px_rgba(255,255,255,0.45)]" : "text-white/60"}`}
              >
                <UserIcon className="h-5 w-5" />
              </Link>

              {/* Settings */}
              <Link
                href="/dashboard/settings"
                title="Settings"
                className={`flex items-center justify-center h-9 w-9 rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10
                  ${pathname.startsWith("/dashboard/settings") ? "text-white shadow-[0_0_12px_rgba(255,255,255,0.45)]" : "text-white/60"}`}
              >
                <Cog6ToothIcon className="h-5 w-5" />
              </Link>

              {/* ADMIN PANEL — ONLY FOR YOU */}
              {user?.email === ADMIN_EMAIL && (
                <Link
                  href="/dashboard/trading-admin"
                  title="Admin Panel"
                  className={`relative flex items-center justify-center h-9 w-9 rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10
                    ${pathname.startsWith("/dashboard/trading-admin") ? "text-white shadow-[0_0_12px_rgba(255,255,255,0.45)]" : "text-white/60"}`}
                >
                  <ShieldCheckIcon className="h-5 w-5" />

                  {/* Error badge */}
                  {typeof window !== "undefined" &&
                    (window.__flowtrade_errors ?? 0) > 0 && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 shadow-[0_0_6px_rgba(255,0,0,0.8)]"></span>
                    )}
                </Link>
              )}

              {/* Notifications */}
              <NotificationsBell />

              {/* USER MENU */}
              <div className="ml-2">
                <UserMenu user={user} brokerConnected={brokerConnected} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* MOBILE NAV */}
      {user && mobileOpen && (
        <div className="absolute top-[72px] left-0 w-full flex justify-center md:hidden animate-slideDown">
          <div className="max-w-sm w-full mx-auto bg-black rounded-2xl p-4">

            {/* Dashboard */}
            <Link
              href="/dashboard"
              onClick={closeMobile}
              className="flex items-center gap-3 py-3 text-white/90 hover:text-white transition"
            >
              <Squares2X2Icon className="h-6 w-6" />
              <span className="text-base">Dashboard</span>
            </Link>
            <div className="h-px bg-white/10 my-2" />

            {/* Copy Trading */}
            <Link
              href="/dashboard/copy-trading"
              onClick={closeMobile}
              className="flex items-center gap-3 py-3 text-white/90 hover:text-white transition"
            >
              <ChartBarIcon className="h-6 w-6" />
              <span className="text-base">Copy‑Trading</span>
            </Link>
            <div className="h-px bg-white/10 my-2" />

            {/* Broker Linking */}
            <Link
              href="/dashboard/account-linking"
              onClick={closeMobile}
              className="flex items-center gap-3 py-3 text-white/90 hover:text-white transition"
            >
              <LinkIcon className="h-6 w-6" />
              <span className="text-base">Broker Linking</span>
            </Link>
            <div className="h-px bg-white/10 my-2" />

            {/* Trade History */}
            <Link
              href="/dashboard/trade-history"
              onClick={closeMobile}
              className="flex items-center gap-3 py-3 text-white/90 hover:text-white transition"
            >
              <ClockIcon className="h-6 w-6" />
              <span className="text-base">Trade History</span>
            </Link>
            <div className="h-px bg-white/10 my-2" />

            {/* Profile */}
            <Link
              href="/dashboard/profile"
              onClick={closeMobile}
              className="flex items-center gap-3 py-3 text-white/90 hover:text-white transition"
            >
              <UserIcon className="h-6 w-6" />
              <span className="text-base">Profile</span>
            </Link>
            <div className="h-px bg-white/10 my-2" />

            {/* Settings */}
            <Link
              href="/dashboard/settings"
              onClick={closeMobile}
              className="flex items-center gap-3 py-3 text-white/90 hover:text-white transition"
            >
              <Cog6ToothIcon className="h-6 w-6" />
              <span className="text-base">Settings</span>
            </Link>

            {/* ADMIN PANEL — MOBILE */}
            {user?.email === ADMIN_EMAIL && (
              <Link
                href="/dashboard/trading-admin"
                onClick={closeMobile}
                className="flex items-center gap-3 py-3 text-white/90 hover:text-white transition"
              >
                <ShieldCheckIcon className="h-6 w-6" />
                <span className="text-base">Admin Panel</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
