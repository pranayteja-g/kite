import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) setError(error);
    else navigate('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-sm space-y-6 rounded-2xl border border-neutral-800 p-8 shadow-sm">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-100">Kite</h1>
          <p className="text-sm text-neutral-400">Financial freedom and growth</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-neutral-700 bg-transparent px-4 py-2.5 text-neutral-100 placeholder:text-neutral-500 outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-neutral-700 bg-transparent px-4 py-2.5 text-neutral-100 placeholder:text-neutral-500 outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-indigo-600 py-2.5 font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <button
          onClick={signInWithGoogle}
          className="w-full rounded-lg border border-neutral-700 py-2.5 font-medium text-neutral-100 hover:bg-neutral-900"
        >
          Continue with Google
        </button>

        <p className="text-center text-sm text-neutral-400">
          No account? <Link to="/signup" className="text-indigo-400 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}