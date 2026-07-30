import { useState } from 'react';
import { Modal } from './Modal';
import { useCreateGoalContribution } from '../hooks/useGoalContributions';

export function GoalContributionFormModal({
  open,
  onClose,
  goalId,
}: {
  open: boolean;
  onClose: () => void;
  goalId: string;
}) {
  const createContribution = useCreateGoalContribution();
  const [amount, setAmount] = useState('');
  const [contributedAt, setContributedAt] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setAmount('');
    setContributedAt(new Date().toISOString().slice(0, 10));
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
      await createContribution.mutateAsync({
        goal_id: goalId,
        amount: Number(amount),
        contributed_at: contributedAt,
      });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add contribution');
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Add contribution">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-400">Amount</label>
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
          <label className="mb-1 block text-xs font-medium text-neutral-400">Date</label>
          <input
            type="date"
            value={contributedAt}
            onChange={(e) => setContributedAt(e.target.value)}
            required
            className="w-full rounded-lg border border-neutral-700 bg-transparent px-3 py-2 text-sm text-neutral-100 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={createContribution.isPending}
          className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {createContribution.isPending ? 'Saving…' : 'Add contribution'}
        </button>
      </form>
    </Modal>
  );
}