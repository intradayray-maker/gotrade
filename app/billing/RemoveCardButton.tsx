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
      className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition"
    >
      Remove Card
    </button>
  );
}
