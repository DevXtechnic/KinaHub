import { useEffect, useState } from 'react';
import { apiRequest } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import type { User } from '../context/AuthContext';

interface SellerProfile {
  id: number;
  user_email: string;
  business_name: string;
  phone: string;
  status: 'pending' | 'verified' | 'suspended';
  store?: { name: string; is_active: boolean } | null;
}

export default function AdminUsersPage() {
  const { token } = useAuth();
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
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load admin data'));
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
      setError(err instanceof Error ? err.message : 'Could not update seller');
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-surface p-6">
        <h1 className="text-2xl font-black tracking-tight">Users and sellers</h1>
        <p className="mt-2 text-secondary">Moderate user accounts, seller verification, and seller status.</p>
      </section>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <section className="rounded-lg border border-border bg-surface p-6">
        <h2 className="text-lg font-bold">Seller verification</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-secondary">
              <tr>
                <th className="py-2">Business</th>
                <th className="py-2">Email</th>
                <th className="py-2">Store</th>
                <th className="py-2">Status</th>
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
                      className="rounded-md border border-border bg-background px-2 py-2 text-sm capitalize outline-none focus:border-accent"
                    >
                      <option value="pending">pending</option>
                      <option value="verified">verified</option>
                      <option value="suspended">suspended</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-surface p-6">
        <h2 className="text-lg font-bold">Users</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="text-secondary">
              <tr>
                <th className="py-2">Email</th>
                <th className="py-2">Name</th>
                <th className="py-2">Role</th>
                <th className="py-2">Active</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-border">
                  <td className="py-3 font-semibold">{user.email}</td>
                  <td className="py-3">{[user.first_name, user.last_name].filter(Boolean).join(' ') || '-'}</td>
                  <td className="py-3 capitalize">{user.effective_role}</td>
                  <td className="py-3">{user.is_active ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
