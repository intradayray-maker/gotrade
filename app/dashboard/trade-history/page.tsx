// app/dashboard/trade-history/page.tsx

import Link from "next/link"
import TradeHistoryClient from "./TradeHistoryClient"

export default function TradeHistoryPage() {
return (

<div className="w-full px-4 md:px-6 lg:px-8 space-y-10 max-w-5xl mx-auto">

  {/* BREADCRUMB */}
  <div
    className="
    flex
    items-center
    gap-2
    text-[13px]
    text-white/40
    pt-6
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

    <span className="text-white/60">
      Trade History
    </span>
  </div>

  {/* HEADING BLOCK */}
  <div
    className="
    animate-fadeIn
    [animation-duration:0.6s]
    "
  >

    {/* TF ICON + TITLE */}
    <div className="flex items-center gap-3">

      {/* TF ICON */}
<svg
className="w-7 h-7 text-emerald-400 drop-shadow-[0_0_6px_rgba(0,255,180,0.35)]"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
strokeWidth="1.6"
strokeLinecap="round"
strokeLinejoin="round"
>
  <path d="M6 3v18" />
  <rect x="4" y="7" width="4" height="6" rx="1" />
  <path d="M12 3v18" />
  <rect x="10" y="11" width="4" height="6" rx="1" />
  <path d="M18 3v18" />
  <rect x="16" y="5" width="4" height="6" rx="1" />
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
        Trade History
      </h1>

    </div>

    {/* SUBHEADING */}
    <p
      className="
      text-white/50
      text-sm
      mt-2
      tracking-wide
      max-w-md
      "
    >
      Review your executed trades, positions, and transaction details.
    </p>

    {/* FLOATING EMERALD UNDERLINE */}
    <div
      className="
      mt-4
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
    />

  </div>

  <TradeHistoryClient />

</div>

)
}



