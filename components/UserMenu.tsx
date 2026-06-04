"use client";

import type { User } from "@supabase/supabase-js";
import {
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getBrokerApiBase } from "@/lib/brokers/getBrokerApiBase";

export interface UserMenuProps {
  user: User | null;
  brokerConnected: boolean;
}

const ADMIN_EMAIL = "intradayray@gmail.com";

export default function UserMenu({ user, brokerConnected }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const [liveBrokerStatus, setLiveBrokerStatus] = useState(brokerConnected);

  // Name source matches the profile page's alias endpoints.
  const [profileFirstName, setProfileFirstName] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;

      try {
        const res = await fetch(`/api/user-alias/get/${user.id}`, {
          cache: "no-store",
        });
        const data = await res.json();

        if (data) {
          const first = (data.first_name ?? "").trim();
          if (first.length > 0) {
            setProfileFirstName(first);
          }
        }
      } catch (err) {
        console.error("Failed to load profile name", err);
      }
    }

    loadProfile();
  }, [user]);

  useEffect(() => {
    async function refreshStatus() {
      try {
        const base = getBrokerApiBase();
        const res = await fetch(`${base}/status`, { cache: "no-store" });
        const data = await res.json();
        setLiveBrokerStatus(data.status === "connected");
      } catch {
        setLiveBrokerStatus(false);
      }
    }

    refreshStatus();

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

  // Username fallback if profile alias has not been set.
  const fallbackName = email?.split("@")[0] || "User";
  const firstNameOnly = profileFirstName || fallbackName;

  const initial = firstNameOnly.charAt(0).toUpperCase();
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
          className="
            flex items-center gap-3
            rounded-full
            border border-white/10
            bg-white/5
            px-2 py-1.5
            text-left
            transition
            hover:border-white/20
          "
        >
          <div className="relative">
            <div
              className="
                flex h-9 w-9
                items-center justify-center
                rounded-full
                bg-gradient-to-br
                from-blue-500 via-indigo-500 to-purple-600
                text-sm font-semibold text-white
                shadow-[0_0_10px_rgba(99,102,241,0.45)]
              "
            >
              {initial}
            </div>

            <span
              className={`
                absolute -bottom-0.5 -right-0.5
                h-3 w-3 rounded-full border border-black
                ${
                  liveBrokerStatus
                    ? "bg-green-400 shadow-[0_0_6px_rgba(34,197,94,0.8)]"
                    : "bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.8)]"
                }
              `}
            />
          </div>

          <span className="hidden max-w-48 truncate text-sm text-slate-200 sm:block">
            Hi, {firstNameOnly}
          </span>

          <ChevronDownIcon
            className={`
              h-4 w-4 text-slate-400 transition-transform
              ${open ? "rotate-180" : ""}
            `}
          />
        </button>

        {open && (
          <div
            className="
              absolute
              right-0
              z-50
              top-[100%]
              w-60
              animate-fadeIn
              rounded-2xl
              border border-white/10
              bg-[#0b0b12]
              p-2
              shadow-2xl shadow-black/40
            "
          >
            <div className="border-b border-white/10 px-3 py-2 text-xs uppercase tracking-[0.2em] text-slate-500">
              Signed in as
            </div>

            <div className="px-3 py-2 text-sm text-slate-300">{email}</div>

            <Link
              href="/dashboard/profile"
              className="
                flex items-center gap-2
                rounded-xl
                px-3 py-2
                text-sm text-slate-200
                transition
                hover:bg-white/5
              "
            >
              <UserCircleIcon className="h-5 w-5 text-slate-400" />
              Profile
            </Link>

            <Link
              href="/dashboard/settings"
              className="
                flex items-center gap-2
                rounded-xl
                px-3 py-2
                text-sm text-slate-200
                transition
                hover:bg-white/5
              "
            >
              <Cog6ToothIcon className="h-5 w-5 text-slate-400" />
              Settings
            </Link>

            {showAdminLink && (
              <Link
                href="/dashboard/follower-status"
                className="
                  flex items-center gap-2
                  rounded-xl
                  px-3 py-2
                  text-sm text-slate-200
                  transition
                  hover:bg-white/5
                "
              >
                <ShieldCheckIcon className="h-5 w-5 text-slate-400" />
                Follower Status
              </Link>
            )}

            {showAdminLink && (
              <Link
                href="/dashboard/trading-admin"
                className="
                  flex items-center gap-2
                  rounded-xl
                  px-3 py-2
                  text-sm text-slate-200
                  transition
                  hover:bg-white/5
                "
              >
                <ShieldCheckIcon className="h-5 w-5 text-slate-400" />
                Admin Panel
              </Link>
            )}

            {showAdminLink && (
              <Link
                href="/sandbox/admin-tools"
                className="
                  flex items-center gap-2
                  rounded-xl
                  px-3 py-2
                  text-sm text-slate-200
                  transition
                  hover:bg-white/5
                "
              >
                <ShieldCheckIcon className="h-5 w-5 text-slate-400" />
                Admin Tools
              </Link>
            )}

            <form action="/auth/logout" method="post" className="mt-1">
              <button
                type="submit"
                className="
                  flex w-full items-center gap-2
                  rounded-xl
                  px-3 py-2
                  text-left text-sm
                  text-red-400
                  transition
                  hover:bg-white/5
                "
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
