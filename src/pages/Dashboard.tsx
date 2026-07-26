import { useMemo } from 'react';
import { useAccounts } from '../hooks/useAccounts';
import { useTransactions } from '../hooks/useTransactions';
import { StatCard } from '../components/StatCard';
import { formatCurrency, formatDate } from '../lib/format';

function startOfMonthISO(): string {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}

export function Dashboard() {
  const { data: accounts } = useAccounts();
  const { data: monthTransactions } = useTransactions({ startDate: startOfMonthISO() });
  const { data: recentTransactions } = useTransactions();

  const totalBalance = useMemo(
    () => accounts?.reduce((sum, a) => sum + Number(a.current_balance), 0) ?? 0,
    [accounts]
  );

  const { monthlyIncome, monthlyExpense } = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const tx of monthTransactions ?? []) {
      if (tx.type === 'income') income += Number(tx.amount);
      if (tx.type === 'expense') expense += Number(tx.amount);
    }
    return { monthlyIncome: income, monthlyExpense: expense };
  }, [monthTransactions]);

  const netCashFlow = monthlyIncome - monthlyExpense;
  const savingsRate = monthlyIncome > 0 ? Math.round((netCashFlow / monthlyIncome) * 100) : 0;

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-neutral-500">Your financial snapshot for this month</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Current Balance" value={formatCurrency(totalBalance)} />
        <StatCard label="Monthly Income" value={formatCurrency(monthlyIncome)} accent="green" />
        <StatCard label="Monthly Expense" value={formatCurrency(monthlyExpense)} accent="red" />
        <StatCard
          label="Net Cash Flow"
          value={formatCurrency(netCashFlow)}
          accent={netCashFlow >= 0 ? 'green' : 'red'}
        />
        <StatCard label="Savings Rate" value={`${savingsRate}%`} />
        <StatCard label="Accounts" value={String(accounts?.length ?? 0)} />
      </div>

      <div className="rounded-2xl border border-neutral-800">
        <div className="border-b border-neutral-800 px-5 py-4">
          <h2 className="text-sm font-semibold text-neutral-100">Recent Transactions</h2>
        </div>
        {recentTransactions && recentTransactions.length === 0 && (
          <p className="p-5 text-sm text-neutral-500">No transactions yet.</p>
        )}
        {recentTransactions?.slice(0, 8).map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between border-b border-neutral-800 px-5 py-3 last:border-b-0"
          >
            <div>
              <p className="text-sm font-medium text-neutral-100">
                {tx.merchant || tx.category?.name || 'Transaction'}
              </p>
              <p className="text-xs text-neutral-500">{formatDate(tx.occurred_at)}</p>
            </div>
            <p
              className={`text-sm font-semibold ${
                tx.type === 'income'
                  ? 'text-emerald-400'
                  : tx.type === 'expense'
                  ? 'text-red-400'
                  : 'text-neutral-100'
              }`}
            >
              {tx.type === 'expense' ? '-' : tx.type === 'income' ? '+' : ''}
              {formatCurrency(tx.amount)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}