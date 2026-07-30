import type { Transaction } from '../types/database';

export interface MonthSummary {
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  topCategories: { name: string; amount: number }[];
  topMerchants: { name: string; amount: number }[];
  largestExpense: Transaction | null;
}

export function computeMonthSummary(transactions: Transaction[]): MonthSummary {
  let totalIncome = 0;
  let totalExpense = 0;
  let largestExpense: Transaction | null = null;
  const categoryTotals = new Map<string, number>();
  const merchantTotals = new Map<string, number>();

  for (const tx of transactions) {
    if (tx.type === 'income') totalIncome += Number(tx.amount);
    if (tx.type === 'expense') {
      totalExpense += Number(tx.amount);
      const catName = tx.category?.name ?? 'Uncategorized';
      categoryTotals.set(catName, (categoryTotals.get(catName) ?? 0) + Number(tx.amount));
      if (tx.merchant) {
        merchantTotals.set(tx.merchant, (merchantTotals.get(tx.merchant) ?? 0) + Number(tx.amount));
      }
      if (!largestExpense || Number(tx.amount) > Number(largestExpense.amount)) {
        largestExpense = tx;
      }
    }
  }

  const topCategories = [...categoryTotals.entries()]
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const topMerchants = [...merchantTotals.entries()]
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  return {
    totalIncome,
    totalExpense,
    netSavings: totalIncome - totalExpense,
    topCategories,
    topMerchants,
    largestExpense,
  };
}

export function monthOptions(count = 12): { value: string; label: string }[] {
  const options = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    options.push({ value, label });
  }
  return options;
}

export function monthRange(monthValue: string): { start: string; end: string } {
  const [year, month] = monthValue.split('-').map(Number);
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);
  return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) };
}