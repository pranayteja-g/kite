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
    <div className="card bg-gradient-to-br from-neutral-800/30 to-neutral-900/30 p-5 sm:p-6 border-l-4 border-l-indigo-500">
      <div className="mb-4 flex items-center justify-between gap-2">
        <span
          className="rounded-full px-3 py-1.5 text-xs font-bold text-neutral-100 truncate uppercase tracking-wide"
          style={{ backgroundColor: `${budget.category?.color ?? '#6366f1'}22`, borderLeft: `3px solid ${budget.category?.color ?? '#6366f1'}` }}
        >
          {budget.category?.name ?? 'Uncategorized'}
        </span>
        <button
          onClick={() => {
            if (confirm('Delete this budget?')) deleteBudget.mutate(budget.id);
          }}
          className="text-xs text-neutral-500 hover:text-red-400 whitespace-nowrap flex-shrink-0 px-2 py-1 hover:bg-red-500/10 rounded transition-all"
        >
          Delete
        </button>
      </div>

      <p className="text-xs text-neutral-400 capitalize mb-2 font-semibold tracking-wider">{budget.period.toUpperCase()} budget</p>
      <p className="mb-4 text-lg sm:text-2xl font-bold">
        {formatCurrency(spent)} <span className="text-xs sm:text-sm font-normal text-neutral-500">/ {formatCurrency(budget.amount)}</span>
      </p>

      <div className="h-2.5 w-full overflow-hidden rounded-full bg-neutral-700/50 mb-3">
        <div className={`h-full rounded-full transition-all duration-500 shadow-lg ${barColor}`} style={{ width: `${Math.min(100, pct)}%` }} />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-neutral-500 font-medium">{pct}% spent</p>
        {statusText && (
          <p className={`text-xs font-bold ${pct >= 100 ? 'text-red-400' : 'text-orange-400'}`}>
            {statusText}
          </p>
        )}
      </div>
    </div>
  );
}