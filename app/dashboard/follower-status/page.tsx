import Link from "next/link";
import GTCard from "@/components/ui/GTCard";
import FollowerStatusCard from "@/components/dashboard/FollowerStatusCard";

export default function FollowerStatusPage() {

return (

<div
className="
w-full
max-w-5xl
mx-auto
pt-10
px-4
"
>

  {/* -------------------------
      TF PAGE HEADER
  -------------------------- */}
  <div
  className="
  w-full
  px-1
  md:px-6
  lg:px-2
  space-y-4
  animate-fadeIn
  "
  >

    {/* Breadcrumb */}
    <div
    className="
    flex
    items-center
    gap-2
    text-[13px]
    text-white/40
    pt-3
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
        Follower Status
      </span>
    </div>

    {/* Title + Icon */}
    <div
    className="
    flex
    items-center
    gap-3
    "
    >

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
        <path d="M3 3h18v4H3z" />
        <path d="M3 9h18v12H3z" />
        <path d="M7 13h2" />
        <path d="M11 13h4" />
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
        Follower Status
      </h1>

    </div>

    {/* Description */}
    <p
    className="
    text-white/50
    text-sm
    mt-2
    tracking-wide
    max-w-md
    "
    >
      View real‑time follower allocation, status, and last‑trade activity.
    </p>

    {/* Underline */}
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
    "
    ></div>

  </div>

  {/* -------------------------
      CONTENT
  -------------------------- */}
  <div
  className="
  mt-10
  "
  >
    <GTCard>
      <FollowerStatusCard />
    </GTCard>
  </div>

</div>

);

}

