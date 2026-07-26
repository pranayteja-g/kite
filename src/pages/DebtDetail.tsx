import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDebts, useUpdateDebtStatus, useDeleteDebt } from '../hooks/useDebts';
import { useDebtPayments, useDeleteDebtPayment } from '../hooks/useDebtPayments';
import { DebtPaymentFormModal } from '../components/DebtPaymentFormModal';
import { DebtProgressBar } from '../components/DebtProgressBar';
import { formatCurrency, formatDate } from '../lib/format';

export function DebtDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: debts } = useDebts();
  const { data: payments } = useDebtPayments(id!);
  const updateStatus = useUpdateDebtStatus();
  const deleteDebt = useDeleteDebt();
  const deletePayment = useDeleteDebtPayment();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const debt = debts?.find((d) => d.id === id);

  if (!debt) {
    return (
      <div className="p-8">
        <Link to="/debts" className="text-sm text-indigo-400 hover:underline">← Back to debts</Link>
        <p className="mt-4 text-neutral-500">Loading or debt not found…</p>
      </div>
    );
  }

  const handleMarkComplete = async () => {
    await updateStatus.mutateAsync({ id: debt.id, status: 'completed' });
  };

  const handleDelete = async () => {
    if (confirm(`Delete debt with ${debt.person_name}? This removes all payment history.`)) {
      await deleteDebt.mutateAsync(debt.id);
      navigate('/debts');
    }
  };

  return (
    <div className="p-8">
      <Link to="/debts" className="text-sm text-indigo-400 hover:underline">← Back to debts</Link>

      <div className="mt-4 mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{debt.person_name}</h1>
          <p className="text-sm text-neutral-500">
            {debt.direction === 'owed_by_me' ? 'You owe them' : 'They owe you'} · {debt.debt_type.replace('_', ' ')}
          </p>
        </div>
        <div className="flex gap-2">
          {debt.status !== 'completed' && (
            <button
              onClick={handleMarkComplete}
              className="rounded-lg border border-neutral-700 px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-900"
            >
              Mark completed
            </button>
          )}
          <button
            onClick={handleDelete}
            className="rounded-lg border border-neutral-700 px-3 py-2 text-sm text-red-400 hover:bg-neutral-900"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-neutral-800 p-6">
        <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-xs text-neutral-500">Original amount</p>
            <p className="text-lg font-semibold">{formatCurrency(debt.original_amount)}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">Remaining</p>
            <p className="text-lg font-semibold">{formatCurrency(debt.current_balance)}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">Interest rate</p>
            <p className="text-lg font-semibold">{debt.interest_rate}%</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">Next due</p>
            <p className="text-lg font-semibold">{debt.due_date ? formatDate(debt.due_date) : '—'}</p>
          </div>
        </div>

        <DebtProgressBar original={debt.original_amount} remaining={debt.current_balance} />

        {debt.notes && <p className="mt-4 text-sm text-neutral-400">{debt.notes}</p>}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Payment history</h2>
        {debt.status !== 'completed' && debt.current_balance > 0 && (
          <button
            onClick={() => setPaymentModalOpen(true)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            + Record payment
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-800">
        {payments && payments.length === 0 && (
          <p className="p-5 text-sm text-neutral-500">No payments recorded yet.</p>
        )}
        {payments?.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between border-b border-neutral-800 px-5 py-3 last:border-b-0"
          >
            <div>
              <p className="text-sm font-medium text-neutral-100">{formatCurrency(p.amount)}</p>
              <p className="text-xs text-neutral-500">
                {formatDate(p.payment_date)}
                {p.notes ? ` · ${p.notes}` : ''}
              </p>
            </div>
            <button
              onClick={() => {
                if (confirm('Delete this payment? Balance will be restored.')) {
                  deletePayment.mutate({ id: p.id, debtId: debt.id });
                }
              }}
              className="text-xs text-neutral-600 hover:text-red-400"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <DebtPaymentFormModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        debtId={debt.id}
        remainingBalance={debt.current_balance}
      />
    </div>
  );
}