"use client";

interface DividendFinderProps {
  onSearch: (tickers: string[]) => void;
}

export default function DividendFinder({ onSearch }: DividendFinderProps) {
  return (
    <div className="space-y-4">

      <input
        type="text"
        placeholder="Search tickers…"
        className="w-full px-3 py-2 rounded-md bg-slate-800 text-slate-200"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const tickers = e.currentTarget.value
              .split(",")
              .map((t) => t.trim().toUpperCase());
            onSearch(tickers);
          }
        }}
      />

    </div>
  );
}
