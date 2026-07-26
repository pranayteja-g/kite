import { useState } from 'react';
import { Modal } from './Modal';
import { useCategories } from '../hooks/useCategories';
import { useCreateBudget } from '../hooks/useBudgets';
import type { BudgetPeriod } from '../types/database';

export function BudgetFormModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data: categories } = useCategories();
  const createBudget = useCreateBudget();

  const expenseCategories = categories?.filter((c) => c.kind === 'expense') ?? [];

  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState<BudgetPeriod>('monthly');
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setCategoryId('');
    setAmount('');
    setPeriod('monthly');
    setError(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await createBudget.mutateAsync({
        category_id: categoryId,
        amount: Number(amount),
        period,
        start_date: new Date().toISOString().slice(0, 10),
      });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create budget');
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="New budget">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-400">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select category</option>
            {expenseCategories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-400">Budget amount</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="w-full rounded-lg border border-neutral-700 bg-transparent px-3 py-2 text-sm text-neutral-100 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-400">Period</label>
          <div className="flex gap-2">
            {(['weekly', 'monthly', 'yearly'] as BudgetPeriod[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`flex-1 rounded-lg py-2 text-sm font-medium capitalize ${
                  period === p
                    ? 'bg-indigo-600 text-white'
                    : 'border border-neutral-700 text-neutral-400 hover:bg-neutral-900'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={createBudget.isPending}
          className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {createBudget.isPending ? 'Creating…' : 'Create budget'}
        </button>
      </form>
    </Modal>
  );
}