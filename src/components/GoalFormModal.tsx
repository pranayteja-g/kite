import { useState } from 'react';
import { Modal } from './Modal';
import { useCreateGoal } from '../hooks/useGoals';
import type { GoalPriority } from '../types/database';

export function GoalFormModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const createGoal = useCreateGoal();
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<GoalPriority>('medium');
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setName('');
    setTargetAmount('');
    setDeadline('');
    setPriority('medium');
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
      await createGoal.mutateAsync({
        name,
        target_amount: Number(targetAmount),
        deadline: deadline || undefined,
        priority,
      });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create goal');
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="New goal">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-400">Goal name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. Emergency Fund, Vacation"
            className="w-full rounded-lg border border-neutral-700 bg-transparent px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-400">Target amount</label>
          <input
            type="number"
            step="0.01"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            required
            className="w-full rounded-lg border border-neutral-700 bg-transparent px-3 py-2 text-sm text-neutral-100 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-400">Deadline (optional)</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full rounded-lg border border-neutral-700 bg-transparent px-3 py-2 text-sm text-neutral-100 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-400">Priority</label>
          <div className="flex gap-2">
            {(['low', 'medium', 'high'] as GoalPriority[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`flex-1 rounded-lg py-2 text-sm font-medium capitalize ${
                  priority === p
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
          disabled={createGoal.isPending}
          className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {createGoal.isPending ? 'Creating…' : 'Create goal'}
        </button>
      </form>
    </Modal>
  );
}