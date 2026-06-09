"use client";

import { useEffect, useState } from "react";
import GTCard from "@/components/ui/GTCard";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import {
  UserCircleIcon,
  KeyIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  ClipboardIcon,
  CheckIcon,
  IdentificationIcon,
} from "@heroicons/react/24/solid";

type ProfileProps = {
  user: User | null;
  profile: {
    id: string;
    planname: string | null;
    nextbillingdate: number | null;
    billing_status: string | null;
  } | null;
  passwordResetError: string | null;
  passwordResetSent: boolean;
};

export default function ProfileClient({
  user,
  profile,
  passwordResetError,
  passwordResetSent,
}: ProfileProps) {
  const lastLoginRaw = user?.last_sign_in_at;
  const email = user?.email ?? "unknown";
  const [aliasSaved, setAliasSaved] = useState(false);
  const lastLoginDate = user?.last_sign_in_at
    ? new Date(user.last_sign_in_at).toLocaleDateString()
    : "Unknown";
  const lastLoginTime = user?.last_sign_in_at
    ? new Date(user.last_sign_in_at).toLocaleTimeString()
    : "";
  const joinedOn = user?.created_at
    ? new Date(user.created_at).toLocaleDateString()
    : "Unknown";
  const userId = profile?.id ?? "unknown";
  const [copied, setCopied] = useState(false);

  const copyUUID = () => {
    navigator.clipboard.writeText(userId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const billingStatus = profile?.billing_status ?? "inactive";
  const nextBilling =
    profile?.nextbillingdate &&
    new Date(profile.nextbillingdate * 1000).toLocaleDateString();
  const statusLabel =
    billingStatus === "active"
      ? "Active"
      : billingStatus === "cancelling"
      ? "Cancelling"
      : billingStatus === "canceled"
      ? "Canceled"
      : "Inactive";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [aliasLoading, setAliasLoading] = useState(true);
  const [aliasSaving, setAliasSaving] = useState(false);

  useEffect(() => {
    async function loadAlias() {
      try {
        const res = await fetch(`/api/user-alias/get/${userId}`);
        if (!res.ok) throw new Error(`Alias fetch failed: ${res.status}`);

        const contentType = res.headers.get("content-type") ?? "";
        if (!contentType.includes("application/json")) {
          throw new Error("Alias endpoint did not return JSON");
        }

        const data = await res.json();
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
      } catch (err) {
        console.error("Failed to load alias", err);
      } finally {
        setAliasLoading(false);
      }
    }

    if (userId && userId !== "unknown") {
      loadAlias();
    }
  }, [userId]);

  async function saveAlias() {
    setAliasSaving(true);
    setAliasSaved(true);
    setTimeout(() => setAliasSaved(false), 1500);

    try {
      const res = await fetch(`/api/user-alias/update/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
        }),
      });
      if (!res.ok) throw new Error(`Alias save failed: ${res.status}`);
    } catch (err) {
      console.error("Failed to save alias", err);
    } finally {
      setAliasSaving(false);
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-6 lg:px-8 space-y-8 text-white">
      <div className="w-full px-1 md:px-6 lg:px-2 space-y-4 max-w-5xl">
        <div className="flex items-center gap-2 text-[13px] text-white/40 pt-3 animate-fadeIn">
          <Link
            href="/dashboard"
            className="hover:text-white/70 transition-colors cursor-pointer"
          >
            Dashboard
          </Link>
          <span className="text-white/30">/</span>
          <span className="text-white/60">Profile</span>
        </div>

        <div className="animate-fadeIn [animation-duration:0.6s]">
          <div className="flex items-center gap-3">
            <svg
              className="w-7 h-7 text-emerald-400 drop-shadow-[0_0_6px_rgba(0,255,180,0.35)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 12c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5z" />
              <path d="M3 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
            </svg>

            <h1 className="text-3xl font-bold tracking-tight text-white/90 drop-shadow-[0_0_10px_rgba(0,255,180,0.25)]">
              Profile
            </h1>
          </div>

          <p className="text-white/50 text-sm mt-2 tracking-wide max-w-md">
            Manage your account and subscription.
          </p>

          <div className="mt-5 h-[2px] w-24 bg-gradient-to-r from-emerald-400/80 to-emerald-700/80 rounded-full shadow-[0_0_12px_rgba(0,255,180,0.35)] animate-fadeIn [animation-delay:0.2s]" />
        </div>
      </div>

      {passwordResetSent && (
        <GTCard className="!p-4">
          <div className="text-sm text-green-200">
            Password reset email sent. Check your inbox.
          </div>
        </GTCard>
      )}

      {passwordResetError && (
        <GTCard className="!p-4">
          <div className="text-sm text-red-200">{passwordResetError}</div>
        </GTCard>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <GTCard className="space-y-4">
          <div className="flex items-center gap-2 justify-center">
            <UserCircleIcon className="w-5 h-5 text-white/50" />
            <p className="text-white/40 text-[14px] uppercase tracking-wider">
              Profile
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 w-full">
            <GTCard className="!p-4 text-center border-[1px] border-emerald-900/15">
              <p className="text-white/90 text-[17px] font-semibold">
                {firstName || lastName
                  ? `${firstName} ${lastName}`.trim()
                  : "No display name set"}
              </p>
              <p className="text-white/30 text-[15px] font-semibold">{email}</p>
            </GTCard>

            <GTCard className="!p-4 text-center border-[1px] border-emerald-900/15">
              <p className="text-white/60 text-[13px]">Joined: {joinedOn}</p>
            </GTCard>

            <GTCard className="!p-4 text-center border-[1px] border-emerald-900/15">
              <p className="text-white/60 text-[13px]">Last Login</p>
              <p className="text-white/90 text-[15px] font-semibold">
                {lastLoginRaw
                  ? new Date(lastLoginRaw).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "—"}
              </p>
              <p className="text-white/40 text-[12px]">{lastLoginTime}</p>
              <p className="text-white/30 text-[12px]">{lastLoginDate}</p>
            </GTCard>

            <GTCard className="!p-4 text-center border-[1px] border-emerald-900/15">
              <p className="text-white/60 text-[13px]">User ID (UUID)</p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-white/50 text-[13px] break-all text-center w-[220px]">
                  {userId}
                </p>
                <button
                  onClick={copyUUID}
                  className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 transition"
                  title="Click to copy"
                >
                  {copied ? (
                    <CheckIcon className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <ClipboardIcon className="w-4 h-4 text-white/60" />
                  )}
                </button>
              </div>
            </GTCard>
          </div>
        </GTCard>

        <GTCard className="space-y-4">
          <div className="flex flex-col items-center gap-2 justify-center">
            <div className="flex items-center gap-2 justify-center">
              <IdentificationIcon className="w-5 h-5 text-white/50" />
              <p className="text-white/40 text-[14px] uppercase tracking-wider">
                Update Your Name Here
              </p>
            </div>

            <p className="text-white text-[20px] font-semibold tracking-wide mt-1">
              {firstName || lastName ? `${firstName} ${lastName}`.trim() : "—"}
            </p>

            {aliasSaved && (
              <div className="flex items-center justify-center mt-1 animate-fade-in">
                <span className="text-emerald-400 text-[14px] font-semibold flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Saved!
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 w-full">
            <div className="grid grid-cols-2 gap-4 w-full">
              <GTCard className="!p-4 text-center border-emerald-900/15">
                <p className="text-white/90 text-[17px] font-semibold text-center">
                  First Name
                </p>
              </GTCard>
              <GTCard className="!p-4 text-center border-emerald-900/15">
                <p className="text-white/90 text-[17px] font-semibold text-center">
                  Last Name
                </p>
              </GTCard>
            </div>

            <GTCard className="!p-4 text-center border-[1px] border-emerald-900/15">
              {aliasLoading ? (
                <p className="text-white/50 text-[14px]">Loading...</p>
              ) : (
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  className="w-full bg-[rgb(5,5,5)] border border-white/10 rounded-md px-3 py-2 text-white text-[14px]"
                />
              )}
            </GTCard>

            <GTCard className="!p-4 text-center border-emerald-900/15">
              {aliasLoading ? (
                <p className="text-white/50 text-[14px]">Loading...</p>
              ) : (
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  className="w-full bg-[rgb(5,5,5)] border border-white/10 rounded-md px-3 py-2 text-white text-[14px]"
                />
              )}
            </GTCard>

            <GTCard className="!p-4 flex items-center justify-center text-center border-emerald-900/15">
              <button
                onClick={saveAlias}
                disabled={aliasSaving}
                className="relative flex items-center justify-center w-[130px] px-[12px] py-[12px] rounded-[6px] text-[14px] font-semibold text-[rgb(225,254,234)] bg-[rgb(3,82,65)] shadow-[0_0_34px_rgba(3,82,65,0.45)] border-[5px] border-[rgb(3,82,65)] bg-clip-padding before:absolute before:inset-0 before:rounded-[6px] before:p-[2px] before:bg-gradient-to-br before:from-emerald-300/60 before:to-emerald-700/60 before:-z-10 hover:bg-[rgb(4,100,80)] transition disabled:opacity-50"
              >
                {aliasSaving ? "Saving..." : "UPDATE"}
              </button>
            </GTCard>
          </div>
        </GTCard>

        <GTCard className="space-y-4 ">
          <div className="flex items-center gap-2 justify-center">
            <KeyIcon className="w-5 h-5 text-white/50" />
            <p className="text-white/40 text-[14px] uppercase tracking-wider">
              Password
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 w-full">
            <div className="grid grid-cols-2 gap-4 w-full">
              <GTCard className="!p-4 text-center border-[1px] border-emerald-900/15">
                <p className="text-white/90 text-[17px] font-semibold text-center">
                  Change Password
                </p>
              </GTCard>
              <GTCard className="!p-4 text-center border-[1px] border-emerald-900/15">
                <p className="text-white/60 text-[24px]">🔒</p>
              </GTCard>
            </div>

            <GTCard className="!p-4 text-center border-[1px] border-emerald-900/15">
              <p className="text-white/40 text-[12px] tracking-wide">
                Password Requirements
              </p>
              <p className="text-white/70 text-[14px] text-center leading-relaxed">
                Must contain at least 8 characters
              </p>
            </GTCard>

            <GTCard className="!p-4 text-center border-[1px] border-emerald-900/15">
              <p className="text-white/40 text-[12px] tracking-wide">
                Security Tip
              </p>
              <p className="text-white/70 text-[14px] text-center leading-relaxed">
                Avoid reusing old passwords
              </p>
            </GTCard>

            <GTCard className="!p-4 flex items-center justify-center text-center border-[1px] border-emerald-900/15">
              <form action="/reset-password" method="POST">
                <button className="relative flex items-center justify-center w-[130px] px-[12px] py-[12px] rounded-[6px] text-[14px] font-semibold text-[rgb(225,254,234)] bg-[rgb(84,33,33)] shadow-[0_0_34px_rgba(84,33,33,0.45)] border-[5px] border-[rgb(84,33,33)] bg-clip-padding before:absolute before:inset-0 before:rounded-[6px] before:p-[2px] before:bg-gradient-to-br before:from-red-300/60 before:to-red-700/60 before:-z-10 hover:bg-[rgb(110,45,45)] transition">
                  CHANGE IT
                </button>
              </form>
            </GTCard>
          </div>
        </GTCard>

        <GTCard className="space-y-4 ">
          <div className="flex items-center gap-2 justify-center">
            <CreditCardIcon className="w-5 h-5 text-white/50 " />
            <p className="text-white/40 text-[14px] uppercase tracking-wider">
              Billing
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 w-full">
            <div className="grid grid-cols-2 gap-4 w-full">
              <GTCard className="!p-4 text-center border-emerald-900/15">
                <p className="text-white/90 text-[17px] font-semibold">
                  Current Plan
                </p>
                <p className="text-white/60 text-[14px] ">
                  {profile?.planname ?? "No active plan"}
                </p>
              </GTCard>

              <GTCard className="!p-4 text-center border-emerald-900/15">
                <div className="flex items-center justify-center gap-2">
                  {billingStatus === "active" && (
                    <div className="h-3.5 w-3.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(0,255,180,0.9)]" />
                  )}
                  <span className="text-[16px] text-white/80">
                    {statusLabel}
                  </span>
                </div>
              </GTCard>
            </div>

            <GTCard className="!p-4 text-center border-emerald-900/15">
              <p className="text-white/40 text-[12px] tracking-wide">
                Billing Overview
              </p>
              <p className="text-white/70 text-[14px] text-center leading-relaxed">
                Your subscription renews automatically
              </p>
            </GTCard>

            <GTCard className="!p-4 text-center border-emerald-900/15">
              <p className="text-white/40 text-[12px] tracking-wide">
                Renewal Details
              </p>
              {billingStatus === "active" && nextBilling && (
                <p className="text-white/70 text-[14px] text-center leading-relaxed">
                  Next renewal on {nextBilling}
                </p>
              )}
              {billingStatus !== "active" && (
                <p className="text-red-400/70 text-[14px] text-center leading-relaxed">
                  Subscription inactive
                </p>
              )}
            </GTCard>

            <GTCard className="!p-4 flex items-center justify-center text-center border-emerald-900/15">
              <a
                href="/dashboard/billing"
                className="relative flex items-center justify-center w-[130px] px-[12px] py-[12px] rounded-[6px] text-[14px] font-semibold text-[rgb(225,254,234)] bg-[rgb(3,82,65)] shadow-[0_0_34px_rgba(3,82,65,0.45)] border-[5px] border-[rgb(3,82,65)] bg-clip-padding before:absolute before:inset-0 before:rounded-[6px] before:p-[2px] before:bg-gradient-to-br before:from-emerald-300/60 before:to-emerald-700/60 before:-z-10 hover:bg-[rgb(4,100,80)] transition"
              >
                MANAGE
              </a>
            </GTCard>
          </div>
        </GTCard>

        <GTCard className="space-y-4">
          <div className="flex items-center gap-2 justify-center">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-300" />
            <p className="text-red-400 text-[14px] uppercase tracking-wider">
              Danger Zone
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 w-full">
            <GTCard className="!p-4 text-center border-[1px] border-red-500/15">
              <p className="text-red-300 text-[15px] font-semibold">
                High-Risk Actions
              </p>
              <p className="text-red-400/70 text-[13px] text-center leading-relaxed">
                Changes here are permanent.
              </p>
            </GTCard>

            <GTCard className="!p-4 text-center border-[1px] border-red-500/15">
              <p className="text-red-300 text-[14px] font-medium">
                Data Removal
              </p>
              <p className="text-red-400/70 text-[13px] text-center leading-relaxed">
                Closing account deletes all trading data.
              </p>
            </GTCard>

            <GTCard className="!p-4 text-center border-[1px] border-red-500/15">
              <p className="text-red-300 text-[14px] font-medium">
                Final Notice
              </p>
              <p className="text-red-400/70 text-[13px] text-center leading-relaxed">
                You will lose access to all features.
              </p>
            </GTCard>

            <GTCard className="!p-4 flex items-center justify-center text-center border-[1px] border-red-500/15">
              <button
                type="button"
                onClick={() =>
                  alert("To close your account, please email us at support@gotrade.com")
                }
                className="relative flex items-center justify-center w-[160px] px-[12px] py-[12px] rounded-[6px] text-[14px] font-semibold text-[rgb(255,230,230)] bg-[rgb(84,33,33)] shadow-[0_0_34px_rgba(84,33,33,0.45)] border-[5px] border-[rgb(84,33,33)] bg-clip-padding before:absolute before:inset-0 before:rounded-[6px] before:p-[2px] before:bg-gradient-to-br before:from-red-300/60 before:to-red-700/60 before:-z-10 hover:bg-[rgb(110,45,45)] hover:shadow-[0_0_44px_rgba(84,33,33,0.75)] transition"
              >
                CLOSE ACCOUNT
              </button>
            </GTCard>
          </div>
        </GTCard>
      </div>
    </div>
  );
}
