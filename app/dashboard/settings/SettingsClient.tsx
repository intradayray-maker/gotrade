"use client";

import TimezoneSelect from "@/components/ui/TimezoneSelect";
import Link from "next/link";
import { useEffect, useState } from "react";
import GTCard from "@/components/ui/GTCard";
import { getBrowserSupabase } from "@/lib/supabase/browserClient";

export default function SettingsClient() {
  const supabase = getBrowserSupabase();

  const [timezone, setTimezone] = useState("America/New_York");
  const [emailNotifications, setEmailNotifications] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  /* -------------------------
     LOAD USER PROFILE
  -------------------------- */
  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*, timezone, email_notifications")
        .eq("id", user.id)
        .single();

      if (profile) {
        setTimezone(profile.timezone || "America/New_York");
        setEmailNotifications(
          profile.email_notifications ?? true
        );
      }

      setLoading(false);
    };

    loadProfile();
  }, [supabase]);

  /* -------------------------
     SAVE USER PROFILE
  -------------------------- */
  const save = async () => {
    setSaving(true);
    setSaved(false);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
      .from("profiles")
      .update({
        timezone,
        email_notifications: emailNotifications,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    setSaving(false);
    setSaved(true);

    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) {
    return (
      <div className="text-white/60 text-center py-10">
        Loading settings…
      </div>
    );
  }

  return (
    <div
      className="
        w-full
        max-w-xl
        mx-auto
        px-4
        md:px-6
        lg:px-8
        space-y-10
        text-white
      "
    >
      {/* -------------------------
         TF PAGE HEADER (UNIVERSAL)
      -------------------------- */}
      <div
        className="
          w-full
          px-1
          md:px-6
          lg:px-2
          space-y-4
          max-w-5xl
          mx-none
        "
      >
        <div
          className="
            flex
            items-center
            gap-2
            text-[13px]
            text-white/40
            pt-3
            animate-fadeIn
          "
        >
          <Link
            href="/dashboard"
            className="
              hover:text-white/70
              transition-colors
              cursor-pointer
            "
          >
            Dashboard
          </Link>

          <span className="text-white/30">/</span>

          <span className="text-white/60">Settings</span>
        </div>

        <div className="animate-fadeIn [animation-duration:0.6s]">
          <div className="flex items-center gap-3">
            <svg
              className="
                w-7
                h-7
                text-emerald-400
                drop-shadow-[0_0_6px_rgba(0,255,180,0.35)]
              "
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.02a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.02a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.02a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>

            <h1
              className="
                text-3xl
                font-bold
                tracking-tight
                text-white/90
                drop-shadow-[0_0_10px_rgba(0,255,180,0.25)]
              "
            >
              Settings
            </h1>
          </div>

          <p
            className="
              text-white/50
              text-sm
              mt-2
              tracking-wide
              max-w-md
            "
          >
            Customize your preferences and account experience.
          </p>

          <div
            className="
              mt-5
              h-[2px]
              w-24
              bg-gradient-to-r
              from-emerald-400/80
              to-emerald-700/80
              rounded-full
              shadow-[0_0_12px_rgba(0,255,180,0.35)]
              animate-fadeIn
              [animation-delay:0.2s]
            "
          ></div>
        </div>
      </div>

      {/* -------------------------
         TF SETTINGS CARD (UNIFIED)
      -------------------------- */}
      <GTCard className="flex flex-col items-center space-y-10">

        {/* HEADER WITH BADGE ICON */}
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-emerald-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 12l2 2 4-4" />
            <circle cx="12" cy="12" r="10" />
          </svg>

          <span
            className="
              text-white/40
              text-sm
              uppercase
              tracking-wider
            "
          >
            General Preferences
          </span>
        </div>

        {/* -------------------------
           3 VERTICAL GRID CELLS
        -------------------------- */}
        <div className="grid grid-cols-1 gap-8 w-full">

          {/* CELL 1 — TIMEZONE */}
          <div
            className="
              flex flex-col items-center space-y-3
              rounded-xl border border-white/4
              bg-white/0 p-6
            "
          >
            <span className="text-white/50 text-sm mb-5">⌚ Timezone</span>

            <div className="w-[320px]">
              <TimezoneSelect value={timezone} onChange={setTimezone} />
            </div>
          </div>

          {/* CELL 2 — EMAIL NOTIFICATIONS */}
          <div
            className="
              flex flex-col items-center space-y-3
              rounded-xl border border-white/4
              bg-white/0 p-6
            "
          >
            <span className="text-white/50 text-sm mb-5">📩 Email Notifications</span>

            <div
              onClick={() => setEmailNotifications(!emailNotifications)}
              className={`
                relative w-32 h-9 rounded-full cursor-pointer
                transition-all duration-300
                ${
                  emailNotifications
                    ? "bg-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.6)]"
                    : "bg-zinc-600/60 shadow-[0_0_12px_rgba(113,113,122,0.6)]"
                }
              `}
            >
              <div
                className={`
                  absolute top-1 left-1 h-7 w-7 rounded-full bg-white shadow-md
                  transition-all duration-300
                  ${
                    emailNotifications
                      ? "translate-x-20 shadow-[0_0_12px_rgba(16,185,129,0.6)]"
                      : "shadow-[0_0_12px_rgba(113,113,122,0.6)]"
                  }
                `}
              ></div>
            </div>
          </div>

          {/* CELL 3 — SAVE BUTTON */}
          <div
            className="
              flex flex-col items-center space-y-3
              rounded-xl border border-white/4
              bg-white/0 p-6
            "
          >
            <button
              onClick={save}
              disabled={saving}
              className="
                relative flex items-center justify-center
                w-[150px] px-[15px] py-[15px]
                rounded-[6px] text-[14px] font-semibold
                text-[rgb(225,254,234)]
                bg-[rgb(3,82,65)]
                shadow-[0_0_34px_rgba(3,82,65,0.45)]
                border-[5px] border-[rgb(3,82,65)]
                bg-clip-padding
                hover:bg-[rgb(4,100,80)]
                transition disabled:opacity-50
              "
            >
              {saving ? "Saving…" : saved ? "Saved ✓" : "Save Changes"}
            </button>
          </div>

        </div>
      </GTCard>
    </div>
  );
}
