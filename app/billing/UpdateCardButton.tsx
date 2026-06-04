"use client";

export default function UpdateCardButton() {
  return (
    <button
      onClick={() => (window.location.href = "/dashboard/billing?update=1#payment-method")}
      className="
      relative
      flex
      items-center
      justify-center

      px-[15px]
      py-[15px]
      rounded-[6px]

      text-[14px]
      font-semibold
      text-[rgb(225,254,234)]

      bg-[rgb(44,85,125)]
      shadow-[0_0_34px_rgba(44,85,125,0.45)]

      border-[5px]
      border-[rgb(44,85,125)]
      bg-clip-padding

      before:absolute
      before:inset-0
      before:rounded-[6px]
      before:p-[2px]
      before:bg-gradient-to-br
      before:from-[rgba(44,85,125,0.9)]
      before:via-[rgba(70,120,170,0.9)]
      before:to-[rgba(44,85,125,0.9)]
      before:-z-10

      hover:bg-[rgb(55,105,150)]
      transition
      "
    >
      Update Card
    </button>
  );
}
