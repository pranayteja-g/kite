import { useState } from 'react';
import { Modal } from './Modal';
import { useCreateDebt } from '../hooks/useDebts';
import type { DebtDirection } from '../types/database';
import { useDebtTypes } from '../hooks/useDebtTypes';



export function DebtFormModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const createDebt = useCreateDebt();
  const { data: debtTypes } = useDebtTypes();

  const [personName, setPersonName] = useState('');
  const [direction, setDirection] = useState<DebtDirection>('owed_by_me');
  const [debtTypeId, setDebtTypeId] = useState('');
  const [originalAmount, setOriginalAmount] = useState('');
  const [interestRate, setInterestRate] = useState('0');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState('');
  const [monthlyInstallment, setMonthlyInstallment] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setPersonName('');
    setDirection('owed_by_me');
    setDebtTypeId('');
    setOriginalAmount('');
    setInterestRate('0');
    setStartDate(new Date().toISOString().slice(0, 10));
    setDueDate('');
    setMonthlyInstallment('');
    setNotes('');
    setError(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!debtTypeId) {
      setError('Please select a debt type.');
      return;
    }
    try {
      await createDebt.mutateAsync({
        person_name: personName,
        direction,
        debt_type_id: debtTypeId,
        original_amount: Number(originalAmount),
        interest_rate: Number(interestRate) || 0,
        start_date: startDate,
        due_date: dueDate || undefined,
        monthly_installment: monthlyInstallment
          ? Number(monthlyInstallment)
          : undefined,
        notes: notes || undefined,
      });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create debt');
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="New debt">
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setDirection('owed_by_me')}
            className={`flex-1 rounded-lg py-2 text-sm font-medium ${direction === 'owed_by_me'
              ? 'bg-red-600 text-white'
              : 'border border-neutral-700 text-neutral-400 hover:bg-neutral-900'
              }`}
          >
            I owe them
          </button>
          <button
            type="button"
            onClick={() => setDirection('owed_to_me')}
            className={`flex-1 rounded-lg py-2 text-sm font-medium ${direction === 'owed_to_me'
              ? 'bg-emerald-600 text-white'
              : 'border border-neutral-700 text-neutral-400 hover:bg-neutral-900'
              }`}
          >
            They owe me
          </button>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-400">Person / institution name</label>
          <input
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            required
            placeholder="e.g. Rahul, HDFC Bank"
            className="w-full rounded-lg border border-neutral-700 bg-transparent px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-400">Type</label>
          <select
            value={debtTypeId}
            onChange={(e) => setDebtTypeId(e.target.value)}
            required
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select type</option>

            {debtTypes?.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-400">Total amount</label>
            <input
              type="number"
              step="0.01"
              value={originalAmount}
              onChange={(e) => setOriginalAmount(e.target.value)}
              required
              className="w-full rounded-lg border border-neutral-700 bg-transparent px-3 py-2 text-sm text-neutral-100 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-400">Interest rate %</label>
            <input
              type="number"
              step="0.01"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="w-full rounded-lg border border-neutral-700 bg-transparent px-3 py-2 text-sm text-neutral-100 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-400">Start date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="w-full rounded-lg border border-neutral-700 bg-transparent px-3 py-2 text-sm text-neutral-100 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-400">Next due date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-lg border border-neutral-700 bg-transparent px-3 py-2 text-sm text-neutral-100 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-400">Monthly installment (optional)</label>
          <input
            type="number"
            step="0.01"
            value={monthlyInstallment}
            onChange={(e) => setMonthlyInstallment(e.target.value)}
            className="w-full rounded-lg border border-neutral-700 bg-transparent px-3 py-2 text-sm text-neutral-100 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-400">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-neutral-700 bg-transparent px-3 py-2 text-sm text-neutral-100 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={createDebt.isPending}
          className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {createDebt.isPending ? 'Creating…' : 'Create debt'}
        </button>
      </form>
    </Modal>
  );
}