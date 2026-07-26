export function DebtProgressBar({ original, remaining }: { original: number; remaining: number }) {
  const paidPct = original > 0 ? Math.min(100, Math.round(((original - remaining) / original) * 100)) : 0;

  return (
    <div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-neutral-700/50">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500 shadow-lg shadow-emerald-500/20"
          style={{ width: `${paidPct}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs text-neutral-500 font-medium">{paidPct}% paid</p>
        <p className="text-xs text-neutral-400 font-medium">{100 - paidPct}% remaining</p>
      </div>
    </div>
  );
}