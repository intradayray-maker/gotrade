"use client";

import { useState } from "react";

type BillingPortalButtonProps = {
  label?: string;
  className?: string;
};

export default function BillingPortalButton({
  label = "Manage Billing",
  className = "",
}: BillingPortalButtonProps) {
  const [loading, setLoading] = useState(false);

  const openPortal = async () => {
    setLoading(true);
    const res = await fetch("/api/billing/portal", { method: "POST" });
    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      setLoading(false);
      alert("Unable to open billing portal");
    }
  };

  return (
    <button
      onClick={openPortal}
      className={`
        relative flex items-center justify-center
        rounded-[6px] border-[5px] border-[rgb(3,82,65)]
        bg-[rgb(3,82,65)] bg-clip-padding px-[30px] py-[14px]
        text-[14px] font-semibold text-[rgb(225,254,234)]
        shadow-[0_0_34px_rgba(3,82,65,0.45)]
        transition hover:bg-[rgb(4,100,80)]
        ${className}
      `}
    >
      {loading ? "Loading..." : label}
    </button>
  );
}
