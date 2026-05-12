"use client";

import type { User } from "@supabase/supabase-js";
import {
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState } from "react";

export interface UserMenuProps {
  user: User | null;
  brokerConnected: boolean;
}

const ADMIN_EMAIL = "relertech@gmail.com";

export default function UserMenu({ user, brokerConnected }: UserMenuProps) {
  const [open, setOpen] = useState(false);

  // ⭐ Live broker status (fixes stale red/green dot)
  const [liveBrokerStatus, setLiveBrokerStatus] = useState(brokerConnected);

  // ⭐ Re-fetch broker status on mount + window focus
  useEffect(() => {
    async function refreshStatus() {
      try {
        const res = await fetch("/api/alpaca/status", { cache: "no-store" });
        const data = await res.json();
        setLiveBrokerStatus(data.status === "connected");
      } catch {
        setLiveBrokerStatus(false);
      }
    }

    refreshStatus(); // run once on mount

    window.addEventListener("focus", refreshStatus);
    return () => window.removeEventListener("focus", refreshStatus);
  }, []);

  if (!user) {
    return (
      <nav className="flex items-center gap-3 text-sm font-medium">
        <Link
          href="/login"
          className="rounded-full border border-white/10 px-4 py-2 text-slate-300 transition hover:border-white/20 hover:text-white"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="rounded-full bg-white px-4 py-2 text-black transition hover:bg-slate-200"
        >
          Sign Up
        </Link>
      </nav>
    );
  }

  const email = user.email;
  const displayName =
    user.user_metadata?.full_name || email?.split("@")[0] || "User";
  const initial = displayName.charAt(0).toUpperCase();
  const showAdminLink = user.email === ADMIN_EMAIL;

  return (
    <div className="flex items-center gap-3">
      <div
        className="relative"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <button
          type="button"
          aria-expanded={open}
          className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-2 py-1.5 text-left transition hover:border-white/20"
        >
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-sm font-semibold text-white shadow-[0_0_10px_rgba(99,102,241,0.45)]">
              {initial}
            </div>

            {/* ⭐ LIVE STATUS DOT */}
            <span
              className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border border-black ${
                liveBrokerStatus
                  ? "bg-green-400 shadow-[0_0_6px_rgba(34,197,94,0.8)]"
                  : "bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.8)]"
              }`}
            />
          </div>

          <span className="hidden max-w-48 truncate text-sm text-slate-200 sm:block">
            {displayName}
          </span>

          <ChevronDownIcon
            className={`h-4 w-4 text-slate-400 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open && (
          <div className="absolute right-0 z-50 mt-0 w-60 -translate-y-px animate-fadeIn rounded-2xl border border-white/10 bg-[#0b0b12] p-2 shadow-2xl shadow-black/40">
            <div className="border-b border-white/10 px-3 py-2 text-xs uppercase tracking-[0.2em] text-slate-500">
              Signed in as
            </div>
            <div className="px-3 py-2 text-sm text-slate-300">{email}</div>

            <Link
              href="/dashboard/profile"
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-200 transition hover:bg-white/5"
            >
              <UserCircleIcon className="h-5 w-5 text-slate-400" />
              Profile
            </Link>

            <Link
              href="/dashboard/settings"
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-200 transition hover:bg-white/5"
            >
              <Cog6ToothIcon className="h-5 w-5 text-slate-400" />
              Settings
            </Link>

            <Link
              href="/dashboard/billing"
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-200 transition hover:bg-white/5"
            >
              <CreditCardIcon className="h-5 w-5 text-slate-400" />
              Billing
            </Link>

            {showAdminLink && (
              <Link
                href="/dashboard/trading-admin"
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-200 transition hover:bg-white/5"
              >
                <ShieldCheckIcon className="h-5 w-5 text-slate-400" />
                Admin Panel
              </Link>
            )}

            {/* { ⭐ Disconnect Broker
            <button
              onClick={async () => {
                await fetch("/api/alpaca/disconnect", {
                  method: "DELETE",
                  cache: "no-store",
                });

                // Instantly update dot
                setLiveBrokerStatus(false);
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-red-400 transition hover:bg-white/5"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 text-red-400" />
              Disconnect Broker
            </button> } */}

            {/* Logout */}
            <form action="/auth/logout" method="post" className="mt-1">
              <button
                type="submit"
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-red-400 transition hover:bg-white/5"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 text-red-400" />
                Logout
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
