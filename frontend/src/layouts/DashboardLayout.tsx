import { Link, NavLink, Outlet } from 'react-router-dom';
import { BarChart3, Bell, ClipboardList, LayoutDashboard, Package, Settings, Store, Ticket, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

const roleNav = {
  customer: [
    { to: '/dashboard', label: 'Account', icon: LayoutDashboard },
    { to: '/dashboard/orders', label: 'Orders', icon: ClipboardList },
    { to: '/dashboard/tickets', label: 'Support', icon: Ticket },
  ],
  seller: [
    { to: '/seller', label: 'Dashboard', icon: BarChart3 },
    { to: '/seller/products', label: 'Products', icon: Package },
    { to: '/seller/orders', label: 'Orders', icon: ClipboardList },
    { to: '/seller/customers', label: 'Customers', icon: Users },
  ],
  admin: [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/orders', label: 'Orders', icon: ClipboardList },
    { to: '/admin/crm', label: 'CRM', icon: Bell },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ],
};

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const role = user?.effective_role || 'customer';
  const nav = roleNav[role];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-surface">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 font-black">
            <img src="/logo.png" alt="Dukan" className="h-9 w-auto" />
            CRM
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-secondary sm:inline">{user?.email}</span>
            <ThemeToggle />
            <button type="button" onClick={logout} className="font-semibold text-accent">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
        <aside className="rounded-lg border border-border bg-surface p-3 lg:sticky lg:top-20 lg:h-fit">
          <div className="mb-3 flex items-center gap-2 px-3 py-2 text-sm font-bold uppercase text-secondary">
            <Store className="h-4 w-4" />
            {role}
          </div>
          <nav className="grid gap-1">
            {nav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                      isActive ? 'bg-accent text-background' : 'text-secondary hover:bg-background hover:text-primary'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
