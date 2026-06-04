"use client";

import { useState } from "react";
import Link from "next/link";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden text-white focus:outline-none"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d={
              open
                ? "M6 18L18 6M6 6l12 12"
                : "M4 6h16M4 12h16M4 18h16"
            }
          />
        </svg>
      </button>

      {/* Slide-down Mobile Menu */}
      {open && (
        <div className="absolute top-[72px] left-0 w-full bg-black/95 border-b border-white/10 backdrop-blur-md md:hidden">
          <nav className="flex flex-col px-6 py-4 text-sm text-white/80 space-y-4">
            <Link href="/dashboard" onClick={() => setOpen(false)}>
              Dashboard
            </Link>
            <Link href="/dashboard/copy-trading" onClick={() => setOpen(false)}>
              Copy‑Trading
            </Link>
            <Link href="/account-linking" onClick={() => setOpen(false)}>
              Broker Linking
            </Link>
            
<Link href="/billing" onClick={() => setOpen(false)}>
  Billing
</Link>


            <Link href="/profile" onClick={() => setOpen(false)}>
              Profile
            </Link>
            <Link href="/settings" onClick={() => setOpen(false)}>
              Settings
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
