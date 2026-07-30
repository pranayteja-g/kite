import { useState, useMemo } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { StatCard } from '../components/StatCard';
import { useCurrency } from '../context/CurrencyContext';
import { computeMonthSummary, monthOptions, monthRange } from '../lib/monthSummary';

export function MonthlySummary() {
  const options = useMemo(() => monthOptions(12), []);
  const [selectedMonth, setSelectedMonth] = useState(options[0].value);
  const { start, end } = monthRange(selectedMonth);
  const { formatCurrency } = useCurrency();

  const { data: transactions, isLoading } = useTransactions({ startDate: start, endDate: end });

  const summary = useMemo(() => computeMonthSummary(transactions ?? []), [transactions]);
  const savingsRate = summary.totalIncome > 0
    ? Math.round((summary.netSavings / summary.totalIncome) * 100)
    : 0;

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Monthly Summary</h1>
          <p className="text-sm text-neutral-500">A closing snapshot for the month</p>
        </div>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {isLoading && <p className="text-neutral-500">Loading…</p>}

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Income" value={formatCurrency(summary.totalIncome)} accent="green" />
        <StatCard label="Total Expense" value={formatCurrency(summary.totalExpense)} accent="red" />
        <StatCard
          label="Net Savings"
          value={formatCurrency(summary.netSavings)}
          accent={summary.netSavings >= 0 ? 'green' : 'red'}
        />
        <StatCard label="Savings Rate" value={`${savingsRate}%`} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-neutral-800">
          <div className="border-b border-neutral-800 px-5 py-4">
            <h2 className="text-sm font-semibold text-neutral-100">Top Spending Categories</h2>
          </div>
          {summary.topCategories.length === 0 && (
            <p className="p-5 text-sm text-neutral-500">No expenses this month.</p>
          )}
          {summary.topCategories.map((c) => (
            <div key={c.name} className="flex items-center justify-between border-b border-neutral-800 px-5 py-3 last:border-b-0">
              <p className="text-sm text-neutral-100">{c.name}</p>
              <p className="text-sm font-semibold text-red-400">{formatCurrency(c.amount)}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-neutral-800">
          <div className="border-b border-neutral-800 px-5 py-4">
            <h2 className="text-sm font-semibold text-neutral-100">Top Merchants</h2>
          </div>
          {summary.topMerchants.length === 0 && (
            <p className="p-5 text-sm text-neutral-500">No merchant data this month.</p>
          )}
          {summary.topMerchants.map((m) => (
            <div key={m.name} className="flex items-center justify-between border-b border-neutral-800 px-5 py-3 last:border-b-0">
              <p className="text-sm text-neutral-100">{m.name}</p>
              <p className="text-sm font-semibold text-red-400">{formatCurrency(m.amount)}</p>
            </div>
          ))}
        </div>
      </div>

      {summary.largestExpense && (
        <div className="mt-6 rounded-2xl border border-neutral-800 p-5">
          <h2 className="mb-2 text-sm font-semibold text-neutral-100">Largest Expense</h2>
          <p className="text-sm text-neutral-300">
            {summary.largestExpense.merchant || summary.largestExpense.category?.name || 'Transaction'} —{' '}
            <span className="font-semibold text-red-400">{formatCurrency(summary.largestExpense.amount)}</span>
          </p>
        </div>
      )}
    </div>
  );
}