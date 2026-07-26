import { useState } from 'react';
import { useTransactions, useDeleteTransaction } from '../hooks/useTransactions';
import { TransactionFormModal } from '../components/TransactionFormModal';
import { formatCurrency, formatDate } from '../lib/format';
import type { TransactionType } from '../types/database';

export function Transactions() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TransactionType | ''>('');
  const [modalOpen, setModalOpen] = useState(false);

  const { data: transactions, isLoading, error } = useTransactions({
    search: search || undefined,
    type: typeFilter || undefined,
  });
  const deleteTransaction = useDeleteTransaction();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold">Transactions</h1>
          <p className="text-sm text-neutral-500">Every money movement in one place</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition-colors w-full sm:w-auto"
        >
          + New transaction
        </button>
      </div>

      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search merchant, description, notes…"
          className="flex-1 rounded-lg border border-neutral-700 bg-transparent px-3 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as TransactionType | '')}
          className="rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-neutral-100 outline-none focus:ring-2 focus:ring-indigo-500 sm:w-40"
        >
          <option value="">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
          <option value="transfer">Transfer</option>
        </select>
      </div>

      {isLoading && <p className="text-neutral-500">Loading…</p>}
      {error && <p className="text-red-400">Failed to load transactions.</p>}

      {transactions && transactions.length === 0 && (
        <div className="rounded-2xl border border-dashed border-neutral-800 p-8 sm:p-12 text-center">
          <p className="text-neutral-500">No transactions found.</p>
        </div>
      )}

      <div className="space-y-2 sm:overflow-hidden sm:rounded-2xl sm:border sm:border-neutral-800">
        {transactions?.map((tx) => (
          <div
            key={tx.id}
            className="rounded-xl sm:rounded-none border border-neutral-800 sm:border-b sm:border-x-0 sm:border-t-0 px-4 sm:px-5 py-4 sm:py-3 last:sm:border-b-0 hover:bg-neutral-900/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <span
                  className={`h-2 w-2 rounded-full flex-shrink-0 mt-1 ${
                    tx.type === 'income'
                      ? 'bg-emerald-400'
                      : tx.type === 'expense'
                      ? 'bg-red-400'
                      : 'bg-blue-400'
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-neutral-100 truncate">
                    {tx.merchant || tx.category?.name || (tx.type === 'transfer' ? 'Transfer' : 'Uncategorized')}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    {formatDate(tx.occurred_at)} · {tx.account?.name}
                    {tx.type === 'transfer' && tx.to_account ? ` → ${tx.to_account.name}` : ''}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4 flex-shrink-0">
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
        ))}
      </div>

      <TransactionFormModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}