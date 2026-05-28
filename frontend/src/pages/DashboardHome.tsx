import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardHome() {
  const { user } = useAuth();

  if (user?.effective_role === 'seller') return <Navigate to="/seller" replace />;
  if (user?.effective_role === 'admin') return <Navigate to="/admin" replace />;
  return <CustomerDashboard />;
}

function CustomerDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-surface p-6">
        <h1 className="text-2xl font-black tracking-tight">Customer account</h1>
        <p className="mt-2 text-secondary">Profile, orders, saved addresses, wishlist, and support live here.</p>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-surface p-5">
          <p className="text-sm text-secondary">Email</p>
          <p className="mt-2 font-bold">{user?.email}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-5">
          <p className="text-sm text-secondary">Role</p>
          <p className="mt-2 font-bold capitalize">{user?.effective_role}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-5">
          <p className="text-sm text-secondary">Orders</p>
          <p className="mt-2 font-bold">Connected to order API</p>
        </div>
      </div>
    </div>
  );
}
