import { useState } from 'react';
import { useAccounts, useDeleteAccount } from '../hooks/useAccounts';
import { AccountFormModal } from '../components/AccountFormModal';
import { formatCurrency, isLiabilityAccount } from '../lib/format';

export function Accounts() {
  const { data: accounts, isLoading, error } = useAccounts();
  const deleteAccount = useDeleteAccount();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="p-3 sm:p-6 lg:p-8 bg-gradient-to-b from-neutral-950 to-neutral-900/50">
      <div className="mb-8 lg:mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">Accounts</h1>
          <p className="text-sm text-neutral-400 mt-2 font-medium">Manage where your money lives</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 shadow-lg hover:shadow-indigo-500/20 w-full sm:w-auto whitespace-nowrap"
        >
          + New account
        </button>
      </div>

      {isLoading && <p className="text-neutral-400 text-center py-8 font-medium">Loading…</p>}
      {error && <p className="text-red-400 text-center py-8 font-medium">Failed to load accounts.</p>}

      {accounts && accounts.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-neutral-700 p-8 sm:p-12 text-center">
          <p className="text-neutral-400 mb-4 font-medium">No accounts yet. Add your first one to get started.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {accounts?.map((acc) => {
          const liability = isLiabilityAccount(acc);
          const owed = liability && acc.current_balance < 0;

          return (
            <div key={acc.id} className="card relative group bg-gradient-to-br from-neutral-800/30 to-neutral-900/30 border-l-4 border-l-indigo-500 overflow-hidden">
              <div className="relative p-5 sm:p-6 z-10">
                <div className="mb-4 flex items-center justify-between gap-2">
                  <span
                    className="rounded-full px-3 py-1.5 text-xs font-bold text-neutral-100 truncate uppercase tracking-wide"
                    style={{ backgroundColor: `${acc.color}22`, borderLeft: `3px solid ${acc.color}` }}
                  >
                    {acc.account_type?.name || 'Account'}
                  </span>
                  <button
                    onClick={() => {
                      if (confirm(`Delete ${acc.name}? This will remove all its transactions.`)) {
                        deleteAccount.mutate(acc.id);
                      }
                    }}
                    className="text-neutral-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200 flex-shrink-0 p-1.5 hover:bg-red-500/10 rounded-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <p className="font-semibold text-neutral-100 truncate mb-3 text-lg">{acc.name}</p>

                {liability ? (
                  <>
                    <p className="text-2xl sm:text-3xl font-bold text-red-400">
                      {formatCurrency(Math.abs(acc.current_balance), acc.currency)}
                    </p>
                    <p className="text-xs text-neutral-500 mt-2 font-medium">
                      {owed ? 'Amount owed' : 'No balance owed'}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-2xl sm:text-3xl font-bold text-emerald-400">
                      {formatCurrency(acc.current_balance, acc.currency)}
                    </p>
                    <p className="text-xs text-neutral-500 mt-2 font-medium">Available balance</p>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <AccountFormModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}