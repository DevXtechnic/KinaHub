import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n/LocaleContext';
import type { Role } from '../context/AuthContext';

export default function DashboardHome() {
  const { user } = useAuth();

  if (user?.effective_role === 'seller') return <Navigate to="/seller" replace />;
  if (user?.effective_role === 'admin') return <Navigate to="/admin" replace />;
  return <CustomerDashboard />;
}

function CustomerDashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const roleKey = ((user?.effective_role || 'customer').charAt(0).toUpperCase() + (user?.effective_role || 'customer').slice(1)) as Capitalize<Role>;

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-surface p-4 sm:p-6">
        <h1 className="text-2xl font-black tracking-tight">{t('dashboard.customerAccount', { defaultValue: 'Customer account' })}</h1>
        <p className="mt-2 text-secondary">{t('dashboard.customerDescription', { defaultValue: 'Profile, orders, saved addresses, wishlist, and support live here.' })}</p>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-surface p-4 sm:p-5">
          <p className="text-sm text-secondary">{t('dashboard.email', { defaultValue: 'Email' })}</p>
          <p className="mt-2 font-bold">{user?.email}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4 sm:p-5">
          <p className="text-sm text-secondary">{t('dashboard.role', { defaultValue: 'Role' })}</p>
          <p className="mt-2 font-bold capitalize">{t(`dashboard.role${roleKey}`, { defaultValue: user?.effective_role || 'customer' })}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4 sm:p-5">
          <p className="text-sm text-secondary">{t('dashboard.orders', { defaultValue: 'Orders' })}</p>
          <p className="mt-2 font-bold">{t('dashboard.ordersConnected', { defaultValue: 'Orders sync automatically.' })}</p>
        </div>
      </div>
    </div>
  );
}
