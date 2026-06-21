"use client";

export default function RemoveCardButton() {
  const handleRemove = async () => {
    const res = await fetch("/api/billing/remove-card", {
      method: "POST",
    });

    if (res.ok) {
      window.location.reload();
      return;
    }

    const contentType = res.headers.get("content-type") ?? "";
    const body = contentType.includes("application/json")
      ? ((await res.json()) as { error?: string })
      : { error: await res.text() };

    alert(body.error ?? "Failed to remove card");
  };

  return (
    <button
      onClick={handleRemove}
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

      bg-[rgb(84,33,33)]
      shadow-[0_0_34px_rgba(84,33,33,0.45)]

      border-[5px]
      border-[rgb(84,33,33)]
      bg-clip-padding

      before:absolute
      before:inset-0
      before:rounded-[6px]
      before:p-[2px]
      before:bg-gradient-to-br
      before:from-[rgba(84,33,33,0.9)]
      before:via-[rgba(120,50,50,0.9)]
      before:to-[rgba(84,33,33,0.9)]
      before:-z-10

      hover:bg-[rgb(100,40,40)]
      transition
      "
    >
      Remove Card
    </button>
  );
}
