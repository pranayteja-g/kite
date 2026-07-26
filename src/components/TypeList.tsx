import { useState } from 'react';

interface Item {
  id: string;
  name: string;
  user_id: string | null;
}

export function TypeList<T extends Item>({
  items,
  kindOptions,
  onAdd,
  onDelete,
  isDeleting,
}: {
  items: T[];
  kindOptions?: { value: string; label: string }[];
  onAdd: (name: string, kind?: string) => Promise<void>;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}) {
  const [name, setName] = useState('');
  const [kind, setKind] = useState(kindOptions?.[0]?.value ?? '');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await onAdd(name.trim(), kindOptions ? kind : undefined);
      setName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New name"
          className="flex-1 rounded-lg border border-neutral-700 bg-transparent px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {kindOptions && (
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value)}
            className="rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {kindOptions.map((k) => (
              <option key={k.value} value={k.value}>{k.label}</option>
            ))}
          </select>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          Add
        </button>
      </form>
      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="divide-y divide-neutral-800 rounded-lg border border-neutral-800">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between px-4 py-2.5">
            <span className="text-sm text-neutral-100">{item.name}</span>
            {item.user_id ? (
              <button
                disabled={isDeleting}
                onClick={() => onDelete(item.id)}
                className="text-xs text-neutral-500 hover:text-red-400"
              >
                Delete
              </button>
            ) : (
              <span className="text-xs text-neutral-600">default</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}