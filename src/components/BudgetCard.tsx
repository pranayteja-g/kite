import { useTransactions } from '../hooks/useTransactions';
import { useDeleteBudget } from '../hooks/useBudgets';
import { currentPeriodRange } from '../lib/budgetPeriod';
import { formatCurrency } from '../lib/format';
import type { Budget } from '../types/database';

export function BudgetCard({ budget }: { budget: Budget }) {
  const { start, end } = currentPeriodRange(budget.period);
  const deleteBudget = useDeleteBudget();

  const { data: transactions } = useTransactions({
    categoryId: budget.category_id ?? undefined,
    type: 'expense',
    startDate: start,
    endDate: end,
  });

  const spent = (transactions ?? []).reduce((sum, tx) => sum + Number(tx.amount), 0);
  const pct = budget.amount > 0 ? Math.round((spent / budget.amount) * 100) : 0;

  const barColor =
    pct >= 100 ? 'bg-red-500' : pct >= 90 ? 'bg-orange-500' : pct >= 80 ? 'bg-yellow-500' : 'bg-emerald-500';

  const statusText =
    pct >= 100 ? 'Budget exceeded' : pct >= 90 ? '90% spent' : pct >= 80 ? '80% spent' : null;

  return (
    <div className="rounded-2xl border border-neutral-800 p-4 sm:p-5 hover:border-neutral-700 transition-colors">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span
          className="rounded-full px-2 py-0.5 text-xs font-medium text-neutral-300 truncate"
          style={{ backgroundColor: `${budget.category?.color ?? '#6366f1'}22` }}
        >
          {budget.category?.name ?? 'Uncategorized'}
        </span>
        <button
          onClick={() => {
            if (confirm('Delete this budget?')) deleteBudget.mutate(budget.id);
          }}
          className="text-xs text-neutral-500 hover:text-red-400 whitespace-nowrap flex-shrink-0"
        >
          Delete
        </button>
      </div>

      <p className="text-xs text-neutral-500 capitalize mb-1">{budget.period} budget</p>
      <p className="mb-3 text-base sm:text-lg font-semibold">
        {formatCurrency(spent)} <span className="text-xs sm:text-sm font-normal text-neutral-500">of {formatCurrency(budget.amount)}</span>
      </p>

      <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-800">
        <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${Math.min(100, pct)}%` }} />
      </div>

      {statusText && (
        <p className={`mt-2 text-xs font-medium ${pct >= 100 ? 'text-red-400' : 'text-orange-400'}`}>
          {statusText}
        </p>
      )}
    </div>
  );
}