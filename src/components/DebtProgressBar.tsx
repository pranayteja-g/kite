export function DebtProgressBar({ original, remaining }: { original: number; remaining: number }) {
  const paidPct = original > 0 ? Math.min(100, Math.round(((original - remaining) / original) * 100)) : 0;

  return (
    <div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-800">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all"
          style={{ width: `${paidPct}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-neutral-500">{paidPct}% paid</p>
    </div>
  );
}