import { useState } from 'react';
import { Modal } from './Modal';
import { useCreateAccount } from '../hooks/useAccounts';
import type { AccountType } from '../types/database';

const ACCOUNT_TYPES: AccountType[] = [
  'cash', 'checking', 'savings', 'credit_card', 'upi', 'wallet', 'investment', 'crypto', 'other',
];

export function AccountFormModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const createAccount = useCreateAccount();
  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('cash');
  const [openingBalance, setOpeningBalance] = useState('0');
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setName('');
    setType('cash');
    setOpeningBalance('0');
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
      await createAccount.mutateAsync({
        name,
        type,
        currency: 'INR',
        opening_balance: Number(openingBalance) || 0,
        color: '#6366f1',
      });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="New account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-400">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. HDFC Checking"
            className="w-full rounded-lg border border-neutral-700 bg-transparent px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-400">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as AccountType)}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {ACCOUNT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-400">Opening balance</label>
          <input
            type="number"
            step="0.01"
            value={openingBalance}
            onChange={(e) => setOpeningBalance(e.target.value)}
            className="w-full rounded-lg border border-neutral-700 bg-transparent px-3 py-2 text-sm text-neutral-100 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={createAccount.isPending}
          className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {createAccount.isPending ? 'Creating…' : 'Create account'}
        </button>
      </form>
    </Modal>
  );
}