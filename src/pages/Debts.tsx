import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDebts } from '../hooks/useDebts';
import { DebtFormModal } from '../components/DebtFormModal';
import { DebtProgressBar } from '../components/DebtProgressBar';
import { StatCard } from '../components/StatCard';
import { formatCurrency, formatDate } from '../lib/format';

export function Debts() {
  const { data: debts, isLoading, error } = useDebts();
  const [modalOpen, setModalOpen] = useState(false);
  const [tab, setTab] = useState<'owed_by_me' | 'owed_to_me'>('owed_by_me');

  const { totalIOwe, totalOwedToMe } = useMemo(() => {
    let iOwe = 0;
    let owedToMe = 0;
    for (const d of debts ?? []) {
      if (d.status === 'completed') continue;
      if (d.direction === 'owed_by_me') iOwe += Number(d.current_balance);
      else owedToMe += Number(d.current_balance);
    }
    return { totalIOwe: iOwe, totalOwedToMe: owedToMe };
  }, [debts]);

  const filtered = debts?.filter((d) => d.direction === tab) ?? [];

  return (
    <div className="p-3 sm:p-6 lg:p-8 bg-gradient-to-b from-neutral-950 to-neutral-900/50">
      <div className="mb-8 lg:mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">Debts</h1>
          <p className="text-sm text-neutral-400 mt-2 font-medium">Track money you owe and money owed to you</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 shadow-lg hover:shadow-indigo-500/20 w-full sm:w-auto whitespace-nowrap"
        >
          + New debt
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
        <StatCard label="Total I Owe" value={formatCurrency(totalIOwe)} accent="red" />
        <StatCard label="Total Owed To Me" value={formatCurrency(totalOwedToMe)} accent="green" />
      </div>

      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setTab('owed_by_me')}
          className={`rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-200 whitespace-nowrap ${
            tab === 'owed_by_me' 
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/20' 
              : 'border border-neutral-700 text-neutral-400 hover:bg-neutral-800/50'
          }`}
        >
          I Owe
        </button>
        <button
          onClick={() => setTab('owed_to_me')}
          className={`rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-200 whitespace-nowrap ${
            tab === 'owed_to_me' 
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/20' 
              : 'border border-neutral-700 text-neutral-400 hover:bg-neutral-800/50'
          }`}
        >
          Owed To Me
        </button>
      </div>

      {isLoading && <p className="text-neutral-400 text-center py-8 font-medium">Loading…</p>}
      {error && <p className="text-red-400 text-center py-8 font-medium">Failed to load debts.</p>}

      {filtered.length === 0 && !isLoading && (
        <div className="rounded-2xl border-2 border-dashed border-neutral-700 p-8 sm:p-12 text-center">
          <p className="text-neutral-400 font-medium">Nothing here yet.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((debt) => (
          <Link
            key={debt.id}
            to={`/debts/${debt.id}`}
            className="card relative group bg-gradient-to-br from-neutral-800/30 to-neutral-900/30 border-l-4 border-l-indigo-500 overflow-hidden"
          >
            <div className="relative p-5 sm:p-6 z-10">
              <div className="mb-3 flex items-center justify-between gap-2 flex-wrap">
                <span className="rounded-full px-3 py-1.5 text-xs font-bold text-neutral-100 uppercase tracking-wide bg-neutral-700/50">
                  {debt.debt_type?.name || 'Debt'}
                </span>
                {debt.status === 'completed' && (
                  <span className="rounded-full px-3 py-1.5 bg-emerald-900/50 text-xs font-bold text-emerald-300 uppercase tracking-wide">
                    Completed
                  </span>
                )}
                {debt.status === 'overdue' && (
                  <span className="rounded-full px-3 py-1.5 bg-red-900/50 text-xs font-bold text-red-300 uppercase tracking-wide">
                    Overdue
                  </span>
                )}
              </div>

              <p className="font-semibold text-neutral-100 text-lg mb-2">{debt.person_name}</p>
              <p className={`text-2xl sm:text-3xl font-bold mb-1 ${tab === 'owed_by_me' ? 'text-red-400' : 'text-emerald-400'}`}>
                {formatCurrency(debt.current_balance)}
              </p>
              <p className="text-xs text-neutral-500 mb-4 font-medium">of {formatCurrency(debt.original_amount)} total</p>

              <DebtProgressBar original={debt.original_amount} remaining={debt.current_balance} />

              {debt.due_date && (
                <p className="mt-4 text-xs text-neutral-400 font-medium">Next due: {formatDate(debt.due_date)}</p>
              )}
            </div>
          </Link>
        ))}
      </div>

      <DebtFormModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}