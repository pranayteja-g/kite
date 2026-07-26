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
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Debts</h1>
          <p className="text-sm text-neutral-500">Track money you owe and money owed to you</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          + New debt
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard label="Total I Owe" value={formatCurrency(totalIOwe)} accent="red" />
        <StatCard label="Total Owed To Me" value={formatCurrency(totalOwedToMe)} accent="green" />
      </div>

      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setTab('owed_by_me')}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            tab === 'owed_by_me' ? 'bg-indigo-600 text-white' : 'border border-neutral-700 text-neutral-400'
          }`}
        >
          I Owe
        </button>
        <button
          onClick={() => setTab('owed_to_me')}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            tab === 'owed_to_me' ? 'bg-indigo-600 text-white' : 'border border-neutral-700 text-neutral-400'
          }`}
        >
          Owed To Me
        </button>
      </div>

      {isLoading && <p className="text-neutral-500">Loading…</p>}
      {error && <p className="text-red-400">Failed to load debts.</p>}

      {filtered.length === 0 && !isLoading && (
        <div className="rounded-2xl border border-dashed border-neutral-800 p-12 text-center">
          <p className="text-neutral-500">Nothing here yet.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((debt) => (
          <Link
            key={debt.id}
            to={`/debts/${debt.id}`}
            className="rounded-2xl border border-neutral-800 p-5 hover:border-neutral-700"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="rounded-full bg-neutral-800 px-2 py-0.5 text-xs font-medium text-neutral-300">
                {debt.debt_type.replace('_', ' ')}
              </span>
              {debt.status === 'completed' && (
                <span className="rounded-full bg-emerald-900 px-2 py-0.5 text-xs font-medium text-emerald-300">
                  Completed
                </span>
              )}
              {debt.status === 'overdue' && (
                <span className="rounded-full bg-red-900 px-2 py-0.5 text-xs font-medium text-red-300">
                  Overdue
                </span>
              )}
            </div>

            <p className="font-medium text-neutral-100">{debt.person_name}</p>
            <p className="mt-1 text-xl font-semibold">{formatCurrency(debt.current_balance)}</p>
            <p className="text-xs text-neutral-500 mb-3">of {formatCurrency(debt.original_amount)} total</p>

            <DebtProgressBar original={debt.original_amount} remaining={debt.current_balance} />

            {debt.due_date && (
              <p className="mt-2 text-xs text-neutral-500">Next due: {formatDate(debt.due_date)}</p>
            )}
          </Link>
        ))}
      </div>

      <DebtFormModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}