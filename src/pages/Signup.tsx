import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Signup() {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error } = await signUp(email, password, fullName);
    setSubmitting(false);
    if (error) setError(error);
    else setDone(true);
  };

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <p className="text-neutral-600 dark:text-neutral-300">
          Check your email to confirm your account before signing in.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-4">
      <div className="w-full max-w-sm space-y-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 shadow-sm">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Kite</h1>
          <p className="text-sm text-neutral-500">Financial freedom and growth</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-indigo-600 py-2.5 font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {submitting ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <p className="text-center text-sm text-neutral-500">
          Already have an account? <Link to="/login" className="text-indigo-500 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}