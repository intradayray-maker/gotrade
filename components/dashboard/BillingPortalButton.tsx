"use client";

import { useState } from "react";

export default function BillingPortalButton() {
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
      className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition border border-white/10"
    >
      {loading ? "Loading..." : "Manage Billing"}
    </button>
  );
}
