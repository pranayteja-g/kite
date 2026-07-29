import { useState, useEffect } from 'react';
import { useProfile, useUpdateProfile } from '../hooks/useProfile';
import { SUPPORTED_CURRENCIES } from '../lib/currencies';

export function Settings() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const [fullName, setFullName] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? '');
      setCurrency(profile.default_currency);
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);
    await updateProfile.mutateAsync({ full_name: fullName, default_currency: currency });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (isLoading) return <div className="p-8 text-neutral-500">Loading…</div>;

  return (
    <div className="p-8 max-w-md">
      <h1 className="mb-6 text-2xl font-semibold">Settings</h1>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-400">Full name</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-lg border border-neutral-700 bg-transparent px-3 py-2 text-sm text-neutral-100 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-400">Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {SUPPORTED_CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>{c.label}</option>
            ))}
          </select>
          <p className="mt-1 text-xs text-neutral-500">
            This sets the currency for new accounts and how amounts are displayed. Kite doesn't convert between currencies.
          </p>
        </div>

        <button
          type="submit"
          disabled={updateProfile.isPending}
          className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {updateProfile.isPending ? 'Saving…' : 'Save changes'}
        </button>
        {saved && <p className="text-sm text-emerald-400">Saved.</p>}
      </form>
    </div>
  );
}