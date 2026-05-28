import { useEffect, useState } from 'react';
import { ClipboardList, Package, Store, Ticket, Users } from 'lucide-react';
import { apiRequest } from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface CRMOverview {
  users: number;
  customers: number;
  sellers: number;
  products: number;
  orders: number;
  tickets_open: number;
  leads: number;
}

export default function AdminDashboard() {
  const { token } = useAuth();
  const [overview, setOverview] = useState<CRMOverview | null>(null);

  useEffect(() => {
    apiRequest<CRMOverview>('/crm/overview/', { token })
      .then(setOverview)
      .catch(() => setOverview(null));
  }, [token]);

  const cards = [
    { label: 'Users', value: overview?.users || 0, icon: Users },
    { label: 'Sellers', value: overview?.sellers || 0, icon: Store },
    { label: 'Products', value: overview?.products || 0, icon: Package },
    { label: 'Orders', value: overview?.orders || 0, icon: ClipboardList },
    { label: 'Open tickets', value: overview?.tickets_open || 0, icon: Ticket },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-surface p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">Platform Admin</p>
        <h1 className="mt-2 text-2xl font-black tracking-tight">Moderation and CRM overview</h1>
        <p className="mt-2 text-secondary">Manage users, sellers, products, disputes, CRM records, and platform health.</p>
      </section>

      <div className="grid gap-4 md:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-lg border border-border bg-surface p-5">
              <Icon className="h-5 w-5 text-accent" />
              <p className="mt-4 text-sm text-secondary">{card.label}</p>
              <p className="mt-1 text-2xl font-black">{card.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
