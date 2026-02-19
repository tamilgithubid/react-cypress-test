import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Home, User, LogOut } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { to: '/home', label: 'Home', icon: Home },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav data-cy="navbar" className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <span className="text-lg font-bold" data-cy="app-logo">MyApp</span>
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                data-cy={`nav-${label.toLowerCase()}`}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  location.pathname === to
                    ? 'text-gray-900'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <span data-cy="nav-username" className="text-sm text-gray-600">
              {user?.name}
            </span>
            <Button
              data-cy="nav-logout"
              onClick={logout}
              className="flex items-center gap-1.5 text-sm"
            >
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
