"use client";

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function TradeHistoryPagination({
  page,
  totalPages,
  onPageChange,
}: Props) {
  if (totalPages <= 1) return null;

  function goTo(p: number) {
    if (p < 1 || p > totalPages) return;
    onPageChange(p);
  }

  return (
    <div className="flex items-center justify-center gap-3 text-xs text-white/70">
      <button
        type="button"
        onClick={() => goTo(page - 1)}
        disabled={page === 1}
        className="rounded-full border border-white/15 bg-black/60 px-3 py-1 disabled:opacity-40 hover:bg-white/10 transition-colors"
      >
        Prev
      </button>
      <span className="text-white/60">
        Page <span className="text-white">{page}</span> of{" "}
        <span className="text-white">{totalPages}</span>
      </span>
      <button
        type="button"
        onClick={() => goTo(page + 1)}
        disabled={page === totalPages}
        className="rounded-full border border-white/15 bg-black/60 px-3 py-1 disabled:opacity-40 hover:bg-white/10 transition-colors"
      >
        Next
      </button>
    </div>
  );
}
