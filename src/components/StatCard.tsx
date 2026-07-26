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
  
  const bgGradient = 
    accent === 'green' ? 'from-emerald-900/10 to-emerald-900/5' : 
    accent === 'red' ? 'from-red-900/10 to-red-900/5' : 
    'from-indigo-900/10 to-indigo-900/5';

  return (
    <div className={`card bg-gradient-to-br ${bgGradient} p-4 sm:p-5 border-l-4 ${accent === 'green' ? 'border-l-emerald-500' : accent === 'red' ? 'border-l-red-500' : 'border-l-indigo-500'}`}>
      <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">{label}</p>
      <p className={`mt-3 text-2xl sm:text-3xl font-bold ${accentClass}`}>{value}</p>
    </div>
  );
}