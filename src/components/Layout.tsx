import { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard' },
  { to: '/transactions', label: 'Transactions' },
  { to: '/accounts', label: 'Accounts' },
  { to: '/debts', label: 'Debts' },
  { to: '/budgets', label: 'Budgets' },
  { to: '/manage-types', label: 'Manage Types' },
  { to: '/settings', label: 'Settings' },
];

export function Layout() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-neutral-950 text-neutral-100">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 border-r border-neutral-800 bg-neutral-950 p-6 flex flex-col transform transition-transform duration-300 lg:static lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <Link to="/" className="mb-8 block" onClick={handleNavClick}>
          <h1 className="text-xl font-semibold tracking-tight hover:text-indigo-400">Kite</h1>
          <p className="text-xs text-neutral-500">Financial freedom and growth</p>
        </Link>

        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={handleNavClick}
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
            className="w-full rounded-lg border border-neutral-800 py-2 text-sm text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100 transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 w-full flex flex-col min-h-screen lg:ml-0">
        {/* Mobile Header */}
        <div className="sticky top-0 z-40 border-b border-neutral-800 bg-gradient-to-r from-neutral-950 to-neutral-900 px-4 py-4 flex items-center justify-between lg:hidden shadow-lg">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 hover:bg-neutral-800 active:bg-neutral-700 rounded-xl transition-all duration-200"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <Link to="/" className="flex-1 text-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">Kite</h1>
          </Link>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}