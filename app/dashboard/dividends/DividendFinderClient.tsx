"use client";

import { useState, useEffect } from "react";
import DividendList from "./DividendList";
import { runFinderSearch } from "./actions";

export default function DividendFinderClient() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);

  async function handleSearch(tickers: string[]) {
    setLoading(true);

    const data = await runFinderSearch(tickers);

    // FIX: Extract the array
    setResults(data.results ?? []);

    setLoading(false);
  }

  useEffect(() => {
    const defaultTickers = [
      "AAPL",
      "MSFT",
      "TSLA",
      "NVDA",
      "KO",
      "PEP",
      "JNJ",
      "PG",
      "XOM"
    ];

    handleSearch(defaultTickers);
  }, []);

  return (
    <div className="space-y-6">

      {loading && (
        <div className="text-slate-400 text-center py-4">
          Searching…
        </div>
      )}

      {!loading && (
        <DividendList
          allowed={true}
          selectedTicker={selectedTicker}
          onSelectTicker={(t) => setSelectedTicker(t)}
          items={results}
        />
      )}

    </div>
  );
}
