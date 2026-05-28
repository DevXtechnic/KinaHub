import { useEffect, useState } from 'react';
import { Package, ShoppingBag, TrendingUp, Warehouse } from 'lucide-react';
import { apiRequest } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../lib/products';

interface SellerSummary {
  store: { name: string } | null;
  products: number;
  active_products: number;
  orders: number;
  units_sold: number;
  revenue: string;
  top_products: Array<{ id: number; name: string; stock: number; order_count: number }>;
}

export default function SellerDashboard() {
  const { token } = useAuth();
  const [summary, setSummary] = useState<SellerSummary | null>(null);

  useEffect(() => {
    apiRequest<SellerSummary>('/sellers/profiles/dashboard/', { token })
      .then(setSummary)
      .catch(() => setSummary(null));
  }, [token]);

  const cards = [
    { label: 'Products', value: summary?.products || 0, icon: Package },
    { label: 'Active products', value: summary?.active_products || 0, icon: Warehouse },
    { label: 'Orders', value: summary?.orders || 0, icon: ShoppingBag },
    { label: 'Revenue', value: formatPrice(summary?.revenue || 0), icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-surface p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">Seller CRM</p>
        <h1 className="mt-2 text-2xl font-black tracking-tight">{summary?.store?.name || 'Store dashboard'}</h1>
        <p className="mt-2 text-secondary">Manage catalog, inventory, orders, customer records, and sales performance.</p>
      </section>

      <div className="grid gap-4 md:grid-cols-4">
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

      <section className="rounded-lg border border-border bg-surface p-6">
        <h2 className="text-lg font-bold">Top products</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="text-secondary">
              <tr>
                <th className="py-2">Product</th>
                <th className="py-2">Stock</th>
                <th className="py-2">Orders</th>
              </tr>
            </thead>
            <tbody>
              {(summary?.top_products || []).map((product) => (
                <tr key={product.id} className="border-t border-border">
                  <td className="py-3 font-semibold">{product.name}</td>
                  <td className="py-3">{product.stock}</td>
                  <td className="py-3">{product.order_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
