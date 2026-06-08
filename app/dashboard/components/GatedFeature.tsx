"use client";

type GatedFeatureProps = {
  allowed: boolean;
  children: React.ReactNode;
  upgradeLink?: string;
};

export default function GatedFeature({
  allowed,
  children,
  upgradeLink = "/pricing"
}: GatedFeatureProps) {
  if (allowed) return <>{children}</>;

  return (
    <div className="relative">
      {/* Blurred locked content */}
      <div className="pointer-events-none blur-sm opacity-40">
        {children}
      </div>

      {/* Upsell overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="rounded-xl bg-black/80 border border-emerald-500/40 px-6 py-5 text-center space-y-3 max-w-xs">
          <p className="text-sm text-slate-200">
            This module is locked for your account.
          </p>
          <p className="text-xs text-slate-400">
            Upgrade to unlock live signals and AI insight for this asset.
          </p>
          <a
            href={upgradeLink}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-emerald-500 text-black text-sm font-semibold hover:bg-emerald-400 transition"
          >
            Upgrade plan
          </a>
        </div>
      </div>
    </div>
  );
}
