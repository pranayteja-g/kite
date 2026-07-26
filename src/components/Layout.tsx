import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard' },
  { to: '/transactions', label: 'Transactions' },
  { to: '/accounts', label: 'Accounts' },
  { to: '/debts', label: 'Debts' },
  { to: '/budgets', label: 'Budgets' },
  { to: '/manage-types', label: 'Manage Types' },
];

export function Layout() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-neutral-950 text-neutral-100">
      <aside className="w-60 shrink-0 border-r border-neutral-800 p-6 flex flex-col">
        <Link to="/" className="mb-8 block">
          <h1 className="text-xl font-semibold tracking-tight hover:text-indigo-400">Kite</h1>
          <p className="text-xs text-neutral-500">Financial freedom and growth</p>
        </Link>

        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-neutral-800 pt-4">
          <p className="truncate text-xs text-neutral-500 mb-2">{user?.email}</p>
          <button
            onClick={handleSignOut}
            className="w-full rounded-lg border border-neutral-800 py-2 text-sm text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}