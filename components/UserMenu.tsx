// components/UserMenu.tsx

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
import { logoutAction } from "@/app/(dashboard)/logout/actions";

export interface UserMenuProps {
  user: User | null;
  isAdmin: boolean;
}

export default function UserMenu({ user, isAdmin }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const [profileFirstName, setProfileFirstName] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;

      try {
        const res = await fetch(`/api/user-alias/get/${user.id}`, {
          cache: "no-store",
        });
        const data = await res.json();

        const first = (data?.first_name ?? "").trim();
        if (first.length > 0) {
          setProfileFirstName(first);
        }
      } catch (err) {
        console.error("Failed to load profile name", err);
      }
    }

    loadProfile();
  }, [user]);

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
  const fallbackName = email?.split("@")[0] || "User";
  const firstNameOnly = profileFirstName || fallbackName;
  const initial = firstNameOnly.charAt(0).toUpperCase();

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
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-sm font-semibold text-white shadow-[0_0_10px_rgba(99,102,241,0.45)]">
            {initial}
          </div>

          <span className="hidden max-w-48 truncate text-sm text-slate-200 sm:block">
            Hi, {firstNameOnly}
          </span>

          <ChevronDownIcon
            className={`h-4 w-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div className="absolute right-0 top-[100%] z-50 w-60 animate-fadeIn rounded-2xl border border-white/10 bg-[#0b0b12] p-2 shadow-2xl shadow-black/40">
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

            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-200 transition hover:bg-white/5"
              >
                <ShieldCheckIcon className="h-5 w-5 text-slate-400" />
                Admin Tools
              </Link>
            )}

            {/* ✅ FIXED: REAL LOGOUT ACTION */}
            <form action={logoutAction} className="mt-1">
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
