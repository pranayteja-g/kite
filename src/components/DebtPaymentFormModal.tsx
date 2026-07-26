import { useState } from 'react';
import { Modal } from './Modal';
import { useCreateDebtPayment } from '../hooks/useDebtPayments';

export function DebtPaymentFormModal({
  open,
  onClose,
  debtId,
  remainingBalance,
}: {
  open: boolean;
  onClose: () => void;
  debtId: string;
  remainingBalance: number;
}) {
  const createPayment = useCreateDebtPayment();
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setAmount('');
    setPaymentDate(new Date().toISOString().slice(0, 10));
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
    const amt = Number(amount);
    if (amt > remainingBalance) {
      setError(`Amount exceeds remaining balance (${remainingBalance}).`);
      return;
    }
    try {
      await createPayment.mutateAsync({
        debt_id: debtId,
        amount: amt,
        payment_date: paymentDate,
        notes: notes || undefined,
      });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record payment');
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Record payment">
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
          <p className="mt-1 text-xs text-neutral-500">Remaining balance: {remainingBalance}</p>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-400">Date</label>
          <input
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            required
            className="w-full rounded-lg border border-neutral-700 bg-transparent px-3 py-2 text-sm text-neutral-100 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-400">Notes</label>
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-lg border border-neutral-700 bg-transparent px-3 py-2 text-sm text-neutral-100 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={createPayment.isPending}
          className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {createPayment.isPending ? 'Saving…' : 'Record payment'}
        </button>
      </form>
    </Modal>
  );
}