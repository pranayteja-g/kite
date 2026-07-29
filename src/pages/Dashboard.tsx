import { useMemo } from 'react';
import { useAccounts } from '../hooks/useAccounts';
import { useTransactions } from '../hooks/useTransactions';
import { StatCard } from '../components/StatCard';
import { useDebts } from '../hooks/useDebts';
import { formatDate, isLiabilityAccount } from '../lib/format';
import { useCurrency } from '../context/CurrencyContext';

function startOfMonthISO(): string {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}

export function Dashboard() {
  const { data: accounts } = useAccounts();
  const { data: monthTransactions } = useTransactions({ startDate: startOfMonthISO() });
  const { data: recentTransactions } = useTransactions();
  const { formatCurrency } = useCurrency();

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
    <div className="p-3 sm:p-6 lg:p-8 bg-gradient-to-b from-neutral-950 to-neutral-900/50">
      <div className="mb-8 lg:mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">Dashboard</h1>
        <p className="text-sm text-neutral-400 mt-2 font-medium">Your financial snapshot for this month</p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Assets" value={formatCurrency(totalAssets)} accent="green" />
        <StatCard label="Total Liabilities" value={formatCurrency(totalLiabilities)} accent="red" />
        <StatCard
          label="Net Worth"
          value={formatCurrency(netWorth)}
          accent={netWorth >= 0 ? 'green' : 'red'}
        />
      </div>

      <div className="mb-8 lg:mb-10 grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Monthly Income" value={formatCurrency(monthlyIncome)} accent="green" />
        <StatCard label="Monthly Expense" value={formatCurrency(monthlyExpense)} accent="red" />
        <StatCard
          label="Net Cash Flow"
          value={formatCurrency(netCashFlow)}
          accent={netCashFlow >= 0 ? 'green' : 'red'}
        />
        <StatCard label="Savings Rate" value={`${savingsRate}%`} />
      </div>

      <div className="card">
        <div className="border-b border-neutral-800 px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-bold text-neutral-100 uppercase tracking-wide">Recent Transactions</h2>
          <span className="text-xs text-neutral-500 font-medium">{recentTransactions?.length ?? 0} total</span>
        </div>
        {recentTransactions && recentTransactions.length === 0 && (
          <p className="p-6 text-sm text-neutral-400 text-center font-medium">No transactions yet. Start recording your spending!</p>
        )}
        <div className="divide-y divide-neutral-800">
          {recentTransactions?.slice(0, 8).map((tx) => (
            <div
              key={tx.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-5 sm:px-6 py-4 hover:bg-neutral-800/30 transition-all duration-200"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm sm:text-base font-semibold text-neutral-100 truncate">
                  {tx.merchant || tx.category?.name || 'Transaction'}
                </p>
                <p className="text-xs text-neutral-500 mt-1 font-medium">{formatDate(tx.occurred_at)}</p>
              </div>
              <p
                className={`text-sm sm:text-base font-bold whitespace-nowrap ${
                  tx.type === 'income'
                    ? 'text-emerald-400'
                    : tx.type === 'expense'
                    ? 'text-red-400'
                    : 'text-neutral-100'
                }`}
              >
                {tx.type === 'expense' ? '−' : tx.type === 'income' ? '+' : ''}
                {formatCurrency(tx.amount)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 card">
        <div className="border-b border-neutral-800 px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-bold text-neutral-100 uppercase tracking-wide">Upcoming Installments</h2>
          <span className="text-xs text-neutral-500 font-medium">{upcomingDebts.length} due</span>
        </div>
        {upcomingDebts.length === 0 && (
          <p className="p-6 text-sm text-neutral-400 text-center font-medium">Nothing due soon. Great job!</p>
        )}
        <div className="divide-y divide-neutral-800">
          {upcomingDebts.map((debt) => (
            <div
              key={debt.id}
              className="flex items-center justify-between px-5 sm:px-6 py-4 hover:bg-neutral-800/30 transition-all duration-200"
            >
              <div>
                <p className="text-sm sm:text-base font-semibold text-neutral-100">{debt.person_name}</p>
                <p className="text-xs text-neutral-500 mt-1 font-medium">Due {formatDate(debt.due_date!)}</p>
              </div>
              <p className="text-sm sm:text-base font-bold text-indigo-400 whitespace-nowrap">
                {formatCurrency(debt.monthly_installment ?? debt.current_balance)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}