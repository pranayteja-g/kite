import { useState } from 'react';
import { useGoals, useDeleteGoal } from '../hooks/useGoals';
import { GoalFormModal } from '../components/GoalFormModal';
import { GoalContributionFormModal } from '../components/GoalContributionFormModal';
import { useCurrency } from '../context/CurrencyContext';
import { formatDate } from '../lib/format';

export function Goals() {
  const { data: goals, isLoading, error } = useGoals();
  const deleteGoal = useDeleteGoal();
  const { formatCurrency } = useCurrency();
  const [modalOpen, setModalOpen] = useState(false);
  const [contributingTo, setContributingTo] = useState<string | null>(null);

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Goals</h1>
          <p className="text-sm text-neutral-500">Save toward what matters</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          + New goal
        </button>
      </div>

      {isLoading && <p className="text-neutral-500">Loading…</p>}
      {error && <p className="text-red-400">Failed to load goals.</p>}

      {goals && goals.length === 0 && (
        <div className="rounded-2xl border border-dashed border-neutral-800 p-12 text-center">
          <p className="text-neutral-500">No goals yet. Start one — even a small target helps.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {goals?.map((goal) => {
          const pct = goal.target_amount > 0
            ? Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100))
            : 0;
          return (
            <div key={goal.id} className="rounded-2xl border border-neutral-800 p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  goal.priority === 'high' ? 'bg-red-900 text-red-300'
                  : goal.priority === 'medium' ? 'bg-orange-900 text-orange-300'
                  : 'bg-neutral-800 text-neutral-400'
                }`}>
                  {goal.priority} priority
                </span>
                <button
                  onClick={() => {
                    if (confirm(`Delete goal "${goal.name}"?`)) deleteGoal.mutate(goal.id);
                  }}
                  className="text-xs text-neutral-500 hover:text-red-400"
                >
                  Delete
                </button>
              </div>

              <p className="font-medium text-neutral-100">{goal.name}</p>
              <p className="mt-1 text-lg font-semibold">
                {formatCurrency(goal.current_amount)}{' '}
                <span className="text-sm font-normal text-neutral-500">of {formatCurrency(goal.target_amount)}</span>
              </p>

              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-800">
                <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-1 text-xs text-neutral-500">{pct}% complete</p>

              {goal.deadline && (
                <p className="mt-2 text-xs text-neutral-500">Target date: {formatDate(goal.deadline)}</p>
              )}

              <button
                onClick={() => setContributingTo(goal.id)}
                className="mt-3 w-full rounded-lg border border-neutral-700 py-2 text-sm text-neutral-300 hover:bg-neutral-900"
              >
                + Add contribution
              </button>
            </div>
          );
        })}
      </div>

      <GoalFormModal open={modalOpen} onClose={() => setModalOpen(false)} />
      {contributingTo && (
        <GoalContributionFormModal
          open={!!contributingTo}
          onClose={() => setContributingTo(null)}
          goalId={contributingTo}
        />
      )}
    </div>
  );
}