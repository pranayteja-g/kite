import { useState } from 'react';
import { useAccounts, useDeleteAccount } from '../hooks/useAccounts';
import { AccountFormModal } from '../components/AccountFormModal';
import { formatCurrency, isLiabilityAccount } from '../lib/format';

export function Accounts() {
  const { data: accounts, isLoading, error } = useAccounts();
  const deleteAccount = useDeleteAccount();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold">Accounts</h1>
          <p className="text-sm text-neutral-500">Manage where your money lives</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition-colors w-full sm:w-auto"
        >
          + New account
        </button>
      </div>

      {isLoading && <p className="text-neutral-500">Loading…</p>}
      {error && <p className="text-red-400">Failed to load accounts.</p>}

      {accounts && accounts.length === 0 && (
        <div className="rounded-2xl border border-dashed border-neutral-800 p-8 sm:p-12 text-center">
          <p className="text-neutral-500">No accounts yet. Add your first one to get started.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {accounts?.map((acc) => {
          const liability = isLiabilityAccount(acc);
          const owed = liability && acc.current_balance < 0;

          return (
            <div key={acc.id} className="rounded-2xl border border-neutral-800 p-5 hover:border-neutral-700 transition-colors">
              <div className="mb-3 flex items-center justify-between gap-2">
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-medium text-neutral-300 truncate"
                  style={{ backgroundColor: `${acc.color}22` }}
                >
                  {acc.account_type?.name || 'Account'}
                </span>
                <button
                  onClick={() => {
                    if (confirm(`Delete ${acc.name}? This will remove all its transactions.`)) {
                      deleteAccount.mutate(acc.id);
                    }
                  }}
                  className="text-xs text-neutral-500 hover:text-red-400 whitespace-nowrap flex-shrink-0"
                >
                  Delete
                </button>
              </div>
              <p className="font-medium text-neutral-100 truncate">{acc.name}</p>

              {liability ? (
                <>
                  <p className="mt-2 text-xl sm:text-2xl font-semibold text-red-400">
                    {formatCurrency(Math.abs(acc.current_balance), acc.currency)}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {owed ? 'Amount owed' : 'No balance owed'}
                  </p>
                </>
              ) : (
                <p className="mt-2 text-xl sm:text-2xl font-semibold text-neutral-100">
                  {formatCurrency(acc.current_balance, acc.currency)}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <AccountFormModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}