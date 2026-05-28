import { useEffect, useState } from 'react';
import { apiRequest } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import type { User } from '../context/AuthContext';
import { useTranslation } from '../i18n/LocaleContext';

interface SellerProfile {
  id: number;
  user_email: string;
  business_name: string;
  phone: string;
  status: 'pending' | 'verified' | 'suspended';
  store?: { name: string; is_active: boolean } | null;
}

function getRoleLabel(role: string, t: (key: string, options?: Record<string, string | number> & { defaultValue?: string }) => string) {
  const labels: Record<string, string> = {
    customer: t('dashboard.roleCustomer', { defaultValue: 'Customer' }),
    seller: t('dashboard.roleSeller', { defaultValue: 'Seller' }),
    admin: t('dashboard.roleAdmin', { defaultValue: 'Admin' }),
  };

  return labels[role] || role;
}

export default function AdminUsersPage() {
  const { token } = useAuth();
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [sellers, setSellers] = useState<SellerProfile[]>([]);
  const [error, setError] = useState('');

  function loadData() {
    Promise.all([
      apiRequest<User[]>('/auth/users/', { token }),
      apiRequest<SellerProfile[]>('/sellers/profiles/', { token }),
    ])
      .then(([nextUsers, nextSellers]) => {
        setUsers(nextUsers);
        setSellers(nextSellers);
      })
      .catch(() => setError(t('dashboard.couldNotLoadAdminData', { defaultValue: 'Could not load admin data' })));
  }

  useEffect(() => {
    loadData();
  }, [token]);

  async function updateSellerStatus(id: number, status: SellerProfile['status']) {
    setError('');
    try {
      await apiRequest(`/sellers/profiles/${id}/`, {
        token,
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      loadData();
    } catch (err) {
      setError(t('dashboard.couldNotUpdateSeller', { defaultValue: 'Could not update seller' }));
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-surface p-4 sm:p-6">
        <h1 className="text-2xl font-black tracking-tight">{t('dashboard.usersAndSellers', { defaultValue: 'Users and sellers' })}</h1>
        <p className="mt-2 text-secondary">{t('dashboard.manageUsers', { defaultValue: 'Moderate user accounts, seller verification, and seller status.' })}</p>
      </section>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <section className="rounded-lg border border-border bg-surface p-4 sm:p-6">
        <h2 className="text-lg font-bold">{t('dashboard.sellerVerification', { defaultValue: 'Seller verification' })}</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-secondary">
              <tr>
                <th className="py-2">{t('dashboard.business', { defaultValue: 'Business' })}</th>
                <th className="py-2">{t('dashboard.email', { defaultValue: 'Email' })}</th>
                <th className="py-2">{t('dashboard.store', { defaultValue: 'Store' })}</th>
                <th className="py-2">{t('dashboard.status', { defaultValue: 'Status' })}</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((seller) => (
                <tr key={seller.id} className="border-t border-border">
                  <td className="py-3 font-semibold">{seller.business_name}</td>
                  <td className="py-3">{seller.user_email}</td>
                  <td className="py-3">{seller.store?.name || '-'}</td>
                  <td className="py-3">
                    <select
                      value={seller.status}
                      onChange={(event) => updateSellerStatus(seller.id, event.target.value as SellerProfile['status'])}
                      className="rounded-md border border-border bg-background px-2 py-2 text-base capitalize outline-none focus:border-accent"
                    >
                      <option value="pending">{t('common.pending', { defaultValue: 'Pending' })}</option>
                      <option value="verified">{t('common.verified', { defaultValue: 'Verified' })}</option>
                      <option value="suspended">{t('common.suspended', { defaultValue: 'Suspended' })}</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-surface p-4 sm:p-6">
        <h2 className="text-lg font-bold">{t('dashboard.users', { defaultValue: 'Users' })}</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="text-secondary">
              <tr>
                <th className="py-2">{t('dashboard.email', { defaultValue: 'Email' })}</th>
                <th className="py-2">{t('auth.name', { defaultValue: 'Name' })}</th>
                <th className="py-2">{t('dashboard.role', { defaultValue: 'Role' })}</th>
                <th className="py-2">{t('common.active', { defaultValue: 'Active' })}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-border">
                  <td className="py-3 font-semibold">{user.email}</td>
                  <td className="py-3">{[user.first_name, user.last_name].filter(Boolean).join(' ') || '-'}</td>
                  <td className="py-3 capitalize">{getRoleLabel(user.effective_role, t)}</td>
                  <td className="py-3">{user.is_active ? t('common.yes', { defaultValue: 'Yes' }) : t('common.no', { defaultValue: 'No' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
