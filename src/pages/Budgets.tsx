import { useState } from 'react';
import { useBudgets } from '../hooks/useBudgets';
import { BudgetFormModal } from '../components/BudgetFormModal';
import { BudgetCard } from '../components/BudgetCard';

export function Budgets() {
  const { data: budgets, isLoading, error } = useBudgets();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold">Budgets</h1>
          <p className="text-sm text-neutral-500">Set spending limits per category</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition-colors w-full sm:w-auto"
        >
          + New budget
        </button>
      </div>

      {isLoading && <p className="text-neutral-500">Loading…</p>}
      {error && <p className="text-red-400">Failed to load budgets.</p>}

      {budgets && budgets.length === 0 && (
        <div className="rounded-2xl border border-dashed border-neutral-800 p-8 sm:p-12 text-center">
          <p className="text-neutral-500">No budgets yet. Set one for a category you want to watch.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {budgets?.map((b) => (
          <BudgetCard key={b.id} budget={b} />
        ))}
      </div>

      <BudgetFormModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}