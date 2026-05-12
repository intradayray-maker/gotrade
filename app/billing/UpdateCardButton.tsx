"use client";

export default function UpdateCardButton() {
  return (
    <button
      onClick={() => (window.location.href = "/dashboard/billing?update=1#payment-method")}
      className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-white/90 transition"
    >
      Update Card
    </button>
  );
}
