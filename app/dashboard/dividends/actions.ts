"use server";

export async function runFinderSearch(tickers: string[]) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/dividends/finder`, {
      method: "POST",
      body: JSON.stringify({ tickers }),
      headers: {
        "Content-Type": "application/json"
      },
      cache: "no-store"
    });

    if (!res.ok) {
      console.error("Finder API returned non-OK:", res.status);
      return [];
    }

    const data = await res.json();
    return data?.results ?? [];
  } catch (err) {
    console.error("runFinderSearch error:", err);
    return [];
  }
}
