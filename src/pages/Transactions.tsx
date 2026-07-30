import { useState } from 'react';
import { useTransactions, useDeleteTransaction, useDuplicateTransaction } from '../hooks/useTransactions';
import { TransactionFormModal } from '../components/TransactionFormModal';
import { formatDate } from '../lib/format';
import type { Transaction, TransactionType } from '../types/database';
import { useCurrency } from '../context/CurrencyContext';
import { transactionsToCsv, downloadCsv } from '../lib/csvExport';

export function Transactions() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TransactionType | ''>('');
  const [modalOpen, setModalOpen] = useState(false);

  const { data: transactions, isLoading, error } = useTransactions({
    search: search || undefined,
    type: typeFilter || undefined,
  });
  const deleteTransaction = useDeleteTransaction();
  const duplicateTransaction = useDuplicateTransaction();
  const { formatCurrency } = useCurrency();

  const handleDuplicate = (tx: Transaction) => {
    duplicateTransaction.mutate({
      type: tx.type,
      amount: tx.amount,
      account_id: tx.account_id,
      to_account_id: tx.to_account_id,
      category_id: tx.category_id,
      merchant: tx.merchant ?? undefined,
      tags: tx.tags,
      occurred_at: new Date().toISOString().slice(0, 10),
    });
  };

  const handleExport = () => {
    if (!transactions || transactions.length === 0) return;
    const csv = transactionsToCsv(transactions);
    downloadCsv(csv, `kite-transactions-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  return (
    <div className="p-3 sm:p-6 lg:p-8 bg-gradient-to-b from-neutral-950 to-neutral-900/50">
      <div className="mb-8 lg:mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">Transactions</h1>
          <p className="text-sm text-neutral-400 mt-2 font-medium">Every money movement in one place</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={handleExport}
            className="rounded-lg border border-neutral-700 px-4 py-2.5 text-sm font-medium text-neutral-300 hover:bg-neutral-900 whitespace-nowrap"
          >
            Export CSV
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 shadow-lg hover:shadow-indigo-500/20 whitespace-nowrap"
          >
            + New transaction
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search merchant, description…"
          className="flex-1 rounded-xl border border-neutral-700 bg-neutral-900/50 px-4 py-3 text-sm text-neutral-100 placeholder:text-neutral-500 outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as TransactionType | '')}
          className="rounded-xl border border-neutral-700 bg-neutral-900/50 px-4 py-3 text-sm text-neutral-100 outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:w-44"
        >
          <option value="">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
          <option value="transfer">Transfer</option>
        </select>
      </div>

      {isLoading && <p className="text-neutral-400 text-center py-8 font-medium">Loading…</p>}
      {error && <p className="text-red-400 text-center py-8 font-medium">Failed to load transactions.</p>}

      {transactions && transactions.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-neutral-700 p-8 sm:p-12 text-center">
          <p className="text-neutral-400 font-medium">No transactions found.</p>
        </div>
      )}

      <div className="space-y-2 sm:overflow-hidden sm:rounded-2xl sm:border sm:border-neutral-800">
        {transactions?.map((tx) => (
          <div
            key={tx.id}
            className="rounded-xl sm:rounded-none border border-neutral-800 sm:border-b sm:border-x-0 sm:border-t-0 px-4 sm:px-6 py-4 sm:py-4 last:sm:border-b-0 hover:bg-neutral-800/30 transition-all duration-200 group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <span
                  className={`h-3 w-3 rounded-full flex-shrink-0 mt-0.5 shadow-lg ${
                    tx.type === 'income'
                      ? 'bg-emerald-400'
                      : tx.type === 'expense'
                      ? 'bg-red-400'
                      : 'bg-blue-400'
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm sm:text-base font-semibold text-neutral-100 truncate">
                    {tx.merchant || tx.category?.name || (tx.type === 'transfer' ? 'Transfer' : 'Uncategorized')}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1.5 font-medium">
                    {formatDate(tx.occurred_at)} • {tx.account?.name}
                    {tx.type === 'transfer' && tx.to_account ? ` → ${tx.to_account.name}` : ''}
                  </p>
                  {tx.tags && tx.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {tx.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-neutral-800 px-2 py-0.5 text-[10px] text-neutral-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4 flex-shrink-0">
                <p
                  className={`text-base sm:text-lg font-bold whitespace-nowrap ${
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
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDuplicate(tx)}
                    className="text-xs text-neutral-600 hover:text-indigo-400 whitespace-nowrap"
                  >
                    Duplicate
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this transaction?')) deleteTransaction.mutate(tx.id);
                    }}
                    className="text-xs text-neutral-600 hover:text-red-400 whitespace-nowrap"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <TransactionFormModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}