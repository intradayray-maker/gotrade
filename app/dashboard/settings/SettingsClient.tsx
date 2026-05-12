"use client";

import Toggle from "@/components/ui/Toggle";
import TimezoneSelect from "@/components/ui/TimezoneSelect";
import { useState } from "react";

export default function SettingsClient() {
  const [timezone, setTimezone] = useState("America/New_York");
  const [emailNotifications, setEmailNotifications] = useState(true);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaving(true);
    setSaved(false);

    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 text-white space-y-10 md:space-y-12">

      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-white/50 mt-1">
          Customize your preferences and account experience.
        </p>
      </div>

      {/* GENERAL PREFERENCES */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-xl space-y-8 md:space-y-10">

        <p className="text-white/40 text-sm uppercase tracking-wider">
          General Preferences
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-60">

          {/* LEFT SIDE */}
          <div className="space-y-6">

          {/* TIMEZONE */}
          <div className="space-y-3 md:space-y-4">
            <label className="text-sm text-white/70 pl-0.5 mb-2 block">Timezone</label>            <TimezoneSelect value={timezone} onChange={setTimezone} />
          </div>


          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">

            {/* EMAIL NOTIFICATIONS */}
            <div className="flex items-center justify-between">
              <span className="text-white/90">Email Notifications</span>
              <Toggle
                defaultOn={emailNotifications}
                onChange={setEmailNotifications}
              />
            </div>

          </div>
        </div>
      </div>

      {/* BILLING / SUBSCRIPTION SECTION */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-xl space-y-8 md:space-y-10 mb-20">

        <p className="text-white/40 text-sm uppercase tracking-wider">
          Billing & Subscription
        </p>

        <div className="space-y-6">

          {/* CURRENT PLAN */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/90 font-medium">Current Plan</p>
              <p className="text-white/50 text-sm">Pro Monthly</p>
            </div>

            <span className="px-3 py-1 rounded-lg bg-green-500/20 text-green-400 text-sm">
              Active
            </span>
          </div>

          {/* RENEWAL DATE */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/90 font-medium">Next Renewal</p>
              <p className="text-white/50 text-sm">May 28, 2026</p>
            </div>
          </div>

          {/* MANAGE BILLING BUTTON */}
          <div className="pt-2">
            <form action="/api/billing-portal" method="POST">
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-white text-black font-semibold hover:bg-white/90 transition"
              >
                Manage Billing
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* STICKY SAVE BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/40 backdrop-blur-xl border-t border-white/10 p-4 flex justify-center">
        <button
          onClick={save}
          disabled={saving}
          className="px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-white/90 transition disabled:opacity-50"
        >
          {saving ? "Saving…" : saved ? "Saved ✓" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
