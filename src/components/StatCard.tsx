export function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: 'green' | 'red' | 'default';
}) {
  const accentClass =
    accent === 'green' ? 'text-emerald-400' : accent === 'red' ? 'text-red-400' : 'text-neutral-100';

  return (
    <div className="rounded-2xl border border-neutral-800 p-5">
      <p className="text-xs font-medium text-neutral-500">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${accentClass}`}>{value}</p>
    </div>
  );
}