"use client";

export default function ProfileClient({
  user,
  profile,
  passwordResetError,
  passwordResetSent,
}: {
  user: any;
  profile: {
    planname: string | null;
    nextbillingdate: number | null;
    billing_status: string | null;
  } | null;
  passwordResetError: string | null;
  passwordResetSent: boolean;
}) {
  const email = user?.email ?? "unknown";
  const lastLogin = user?.last_sign_in_at
    ? new Date(user.last_sign_in_at).toLocaleString()
    : "Unknown";

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

  const statusColor =
    billingStatus === "active"
      ? "bg-green-500/20 text-green-400"
      : billingStatus === "cancelling"
      ? "bg-amber-500/20 text-amber-300"
      : billingStatus === "canceled"
      ? "bg-red-500/20 text-red-300"
      : "bg-white/10 text-white/50";

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 text-white space-y-12">

      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-white/50 mt-1">
          Manage your account, security, and subscription.
        </p>
      </div>

      {passwordResetSent && (
        <div className="rounded-2xl border border-green-500/25 bg-green-500/10 p-4 text-sm text-green-200">
          Password reset email sent. Check your inbox for the secure update link.
        </div>
      )}

      {passwordResetError && (
        <div className="rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-200">
          {passwordResetError}
        </div>
      )}

      {/* PROFILE OVERVIEW */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl space-y-8">

        <p className="text-white/40 text-sm uppercase tracking-wider">
          Profile Overview
        </p>

        <div className="flex items-center gap-6">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-semibold">
            {email[0]?.toUpperCase()}
          </div>

          <div>
            <p className="text-xl font-semibold">{email}</p>
            <p className="text-white/50 text-sm">Last login: {lastLogin}</p>
          </div>
        </div>
      </div>

      {/* SECURITY SECTION */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl space-y-8">

        <p className="text-white/40 text-sm uppercase tracking-wider">
          Security
        </p>

        <div className="space-y-6">

          {/* PASSWORD */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/90 font-medium">Password</p>
              <p className="text-white/50 text-sm">Account login password</p>
            </div>
            <form action="/auth/reset-password" method="POST">
              <button type="submit" className="px-4 py-2 bg-white/10 rounded-lg">
                Change
              </button>
            </form>
          </div>

          {/* 2FA */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/90 font-medium">Two-Factor Authentication</p>
              <p className="text-white/50 text-sm">
                Protect your account with Google Authenticator
              </p>
            </div>
            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg">
              Manage
            </button>
          </div>

          {/* DEVICES */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/90 font-medium">Logged-in Devices</p>
              <p className="text-white/50 text-sm">
                Review and manage active sessions
              </p>
            </div>
            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg">
              View
            </button>
          </div>

        </div>
      </div>

      {/* BILLING SECTION */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl space-y-8">

        <p className="text-white/40 text-sm uppercase tracking-wider">
          Billing & Subscription
        </p>

        <div className="space-y-6">

          {/* CURRENT PLAN */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/90 font-medium">Current Plan</p>
              <p className="text-white/50 text-sm">
                {profile?.planname ?? "No active plan"}
              </p>

              {/* CANCELLING LABEL */}
              {billingStatus === "cancelling" && nextBilling && (
                <p className="text-amber-300 text-sm mt-1">
                  Cancels on {nextBilling}
                </p>
              )}
            </div>

            <span
              className={`px-3 py-1 rounded-lg text-sm ${statusColor}`}
            >
              {statusLabel}
            </span>
          </div>

          {/* RENEWAL DATE */}
          {billingStatus === "active" && nextBilling && (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/90 font-medium">Next Renewal</p>
                <p className="text-white/50 text-sm">{nextBilling}</p>
              </div>
            </div>
          )}

          {billingStatus !== "active" && (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/90 font-medium">Next Renewal</p>
                <p className="text-white/50 text-sm">No upcoming renewal</p>
              </div>
            </div>
          )}

          {/* MANAGE BILLING */}
          <a
            href="/dashboard/billing"
            className="inline-block px-5 py-2 rounded-lg bg-white text-black font-semibold hover:bg-white/90 transition"
          >
            Manage Billing
          </a>
        </div>
      </div>

      {/* DANGER ZONE */}
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 backdrop-blur-xl space-y-6">

        <p className="text-red-400 text-sm uppercase tracking-wider">
          Danger Zone
        </p>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-red-300 font-medium">Close Account</p>
            <p className="text-red-400/70 text-sm">
              Closing your account is permanent and irreversible.
            </p>
          </div>

          <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
