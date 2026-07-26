import { useState } from 'react';
import { useBudgets } from '../hooks/useBudgets';
import { BudgetFormModal } from '../components/BudgetFormModal';
import { BudgetCard } from '../components/BudgetCard';

export function Budgets() {
  const { data: budgets, isLoading, error } = useBudgets();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="p-3 sm:p-6 lg:p-8 bg-gradient-to-b from-neutral-950 to-neutral-900/50">
      <div className="mb-8 lg:mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">Budgets</h1>
          <p className="text-sm text-neutral-400 mt-2 font-medium">Set spending limits per category</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 shadow-lg hover:shadow-indigo-500/20 w-full sm:w-auto whitespace-nowrap"
        >
          + New budget
        </button>
      </div>

      {isLoading && <p className="text-neutral-400 text-center py-8 font-medium">Loading…</p>}
      {error && <p className="text-red-400 text-center py-8 font-medium">Failed to load budgets.</p>}

      {budgets && budgets.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-neutral-700 p-8 sm:p-12 text-center">
          <p className="text-neutral-400 font-medium">No budgets yet. Set one for a category you want to watch.</p>
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