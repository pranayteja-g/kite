import { useState } from 'react';
import { Modal } from './Modal';
import { useAccounts } from '../hooks/useAccounts';
import { useCategories } from '../hooks/useCategories';
import { useCreateTransaction } from '../hooks/useTransactions';
import type { TransactionType } from '../types/database';


export function TransactionFormModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data: accounts } = useAccounts();
  const { data: categories } = useCategories();
  const createTransaction = useCreateTransaction();
  const [tagsInput, setTagsInput] = useState('');

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [merchant, setMerchant] = useState('');
  const [occurredAt, setOccurredAt] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState<string | null>(null);

  const relevantCategories = categories?.filter((c) => c.kind === type) ?? [];
  const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);

  const reset = () => {
    setType('expense');
    setAmount('');
    setAccountId('');
    setToAccountId('');
    setCategoryId('');
    setMerchant('');
    setOccurredAt(new Date().toISOString().slice(0, 10));
    setError(null);
    setTagsInput('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (type === 'transfer' && (!toAccountId || toAccountId === accountId)) {
      setError('Choose a different destination account for the transfer.');
      return;
    }

    try {
      await createTransaction.mutateAsync({
        type,
        amount: Number(amount),
        account_id: accountId,
        to_account_id: type === 'transfer' ? toAccountId : null,
        category_id: type === 'transfer' ? null : categoryId || null,
        merchant: merchant || undefined,
        tags,
        occurred_at: occurredAt,
      });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create transaction');
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="New transaction">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          {(['expense', 'income', 'transfer'] as TransactionType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`flex-1 rounded-lg py-2 text-sm font-medium capitalize ${type === t
                ? 'bg-indigo-600 text-white'
                : 'border border-neutral-700 text-neutral-400 hover:bg-neutral-900'
                }`}
            >
              {t}
            </button>
          ))}
        </div>

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
          <label className="mb-1 block text-xs font-medium text-neutral-400">
            {type === 'transfer' ? 'From account' : 'Account'}
          </label>
          <select
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            required
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select account</option>
            {accounts?.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        {type === 'transfer' && (
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-400">To account</label>
            <select
              value={toAccountId}
              onChange={(e) => setToAccountId(e.target.value)}
              required
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select account</option>
              {accounts?.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
        )}

        {type !== 'transfer' && (
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-400">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Uncategorized</option>
              {relevantCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}

        {type !== 'transfer' && (
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-400">Merchant / description</label>
            <input
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              placeholder="e.g. Swiggy, Landlord, Amazon"
              className="w-full rounded-lg border border-neutral-700 bg-transparent px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}
        {type !== 'transfer' && (
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-400">Tags (comma separated)</label>
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. travel, tax-deductible"
              className="w-full rounded-lg border border-neutral-700 bg-transparent px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}

        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-400">Date</label>
          <input
            type="date"
            value={occurredAt}
            onChange={(e) => setOccurredAt(e.target.value)}
            required
            className="w-full rounded-lg border border-neutral-700 bg-transparent px-3 py-2 text-sm text-neutral-100 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={createTransaction.isPending}
          className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {createTransaction.isPending ? 'Saving…' : 'Save transaction'}
        </button>
      </form>
    </Modal>
  );
}