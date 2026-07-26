import { useMemo } from 'react';
import { useAccounts } from '../hooks/useAccounts';
import { useTransactions } from '../hooks/useTransactions';
import { StatCard } from '../components/StatCard';
import { useDebts } from '../hooks/useDebts';
import { formatCurrency, formatDate, isLiabilityAccount } from '../lib/format';

function startOfMonthISO(): string {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}

export function Dashboard() {
  const { data: accounts } = useAccounts();
  const { data: monthTransactions } = useTransactions({ startDate: startOfMonthISO() });
  const { data: recentTransactions } = useTransactions();

  const { totalAssets, totalLiabilities, netWorth } = useMemo(() => {
    let assets = 0;
    let liabilities = 0;
    for (const acc of accounts ?? []) {
      if (isLiabilityAccount(acc)) {
        // liability balances are stored negative (money owed); track as a positive owed amount
        liabilities += Math.max(0, -Number(acc.current_balance));
      } else {
        assets += Number(acc.current_balance);
      }
    }
    return { totalAssets: assets, totalLiabilities: liabilities, netWorth: assets - liabilities };
  }, [accounts]);

  const { monthlyIncome, monthlyExpense } = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const tx of monthTransactions ?? []) {
      if (tx.type === 'income') income += Number(tx.amount);
      if (tx.type === 'expense') expense += Number(tx.amount);
    }
    return { monthlyIncome: income, monthlyExpense: expense };
  }, [monthTransactions]);

  const { data: debts } = useDebts();

  const upcomingDebts = useMemo(() => {
    return (debts ?? [])
      .filter((d) => d.status === 'active' && d.due_date)
      .sort((a, b) => (a.due_date! < b.due_date! ? -1 : 1))
      .slice(0, 5);
  }, [debts]);

  const netCashFlow = monthlyIncome - monthlyExpense;
  const savingsRate = monthlyIncome > 0 ? Math.round((netCashFlow / monthlyIncome) * 100) : 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold">Dashboard</h1>
        <p className="text-sm text-neutral-500">Your financial snapshot for this month</p>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Assets" value={formatCurrency(totalAssets)} accent="green" />
        <StatCard label="Total Liabilities" value={formatCurrency(totalLiabilities)} accent="red" />
        <StatCard
          label="Net Worth"
          value={formatCurrency(netWorth)}
          accent={netWorth >= 0 ? 'green' : 'red'}
        />
      </div>

      <div className="mb-6 lg:mb-8 grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Monthly Income" value={formatCurrency(monthlyIncome)} accent="green" />
        <StatCard label="Monthly Expense" value={formatCurrency(monthlyExpense)} accent="red" />
        <StatCard
          label="Net Cash Flow"
          value={formatCurrency(netCashFlow)}
          accent={netCashFlow >= 0 ? 'green' : 'red'}
        />
        <StatCard label="Savings Rate" value={`${savingsRate}%`} />
      </div>

      <div className="rounded-2xl border border-neutral-800 overflow-hidden">
        <div className="border-b border-neutral-800 px-4 sm:px-5 py-4">
          <h2 className="text-sm font-semibold text-neutral-100">Recent Transactions</h2>
        </div>
        {recentTransactions && recentTransactions.length === 0 && (
          <p className="p-4 sm:p-5 text-sm text-neutral-500">No transactions yet.</p>
        )}
        <div className="divide-y divide-neutral-800">
          {recentTransactions?.slice(0, 8).map((tx) => (
            <div
              key={tx.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 sm:px-5 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-neutral-100 truncate">
                  {tx.merchant || tx.category?.name || 'Transaction'}
                </p>
                <p className="text-xs text-neutral-500 mt-1">{formatDate(tx.occurred_at)}</p>
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

      <div className="mt-6 rounded-2xl border border-neutral-800">
        <div className="border-b border-neutral-800 px-5 py-4">
          <h2 className="text-sm font-semibold text-neutral-100">Upcoming Installments</h2>
        </div>
        {upcomingDebts.length === 0 && (
          <p className="p-5 text-sm text-neutral-500">Nothing due soon.</p>
        )}
        {upcomingDebts.map((debt) => (
          <div
            key={debt.id}
            className="flex items-center justify-between border-b border-neutral-800 px-5 py-3 last:border-b-0"
          >
            <div>
              <p className="text-sm font-medium text-neutral-100">{debt.person_name}</p>
              <p className="text-xs text-neutral-500">Due {formatDate(debt.due_date!)}</p>
            </div>
            <p className="text-sm font-semibold text-neutral-100">
              {formatCurrency(debt.monthly_installment ?? debt.current_balance)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}