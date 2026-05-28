import { useEffect, useState } from 'react';
import { apiRequest } from '../lib/api';
import { formatPrice } from '../lib/products';
import { orderStatuses, paymentLabel } from '../lib/orders';
import type { OrderType } from '../lib/orders';
import { useAuth } from '../context/AuthContext';

interface OrdersPageProps {
  mode: 'customer' | 'seller' | 'admin';
}

export default function OrdersPage({ mode }: OrdersPageProps) {
  const { token } = useAuth();
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [error, setError] = useState('');

  function loadOrders() {
    apiRequest<OrderType[]>('/orders/', { token })
      .then(setOrders)
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load orders'));
  }

  useEffect(() => {
    loadOrders();
  }, [token]);

  async function updateStatus(orderId: number, status: string) {
    setError('');
    try {
      await apiRequest<OrderType>(`/orders/${orderId}/status/`, {
        token,
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      loadOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update order');
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-surface p-6">
        <h1 className="text-2xl font-black tracking-tight">
          {mode === 'customer' ? 'Order history' : mode === 'seller' ? 'Order fulfillment' : 'Platform orders'}
        </h1>
        <p className="mt-2 text-secondary">
          {mode === 'customer'
            ? 'Track purchases and payment status.'
            : 'Review orders, payment method, fulfillment status, and customer contact.'}
        </p>
      </section>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <section className="rounded-lg border border-border bg-surface p-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="text-secondary">
              <tr>
                <th className="py-2">Order</th>
                <th className="py-2">Customer</th>
                <th className="py-2">Items</th>
                <th className="py-2">Payment</th>
                <th className="py-2">Total</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-border align-top">
                  <td className="py-3 font-semibold">#{order.id}</td>
                  <td className="py-3">{order.customer_email}</td>
                  <td className="py-3">
                    <div className="space-y-1">
                      {order.items.map((item) => (
                        <p key={item.id}>{item.product.name} x{item.quantity}</p>
                      ))}
                    </div>
                  </td>
                  <td className="py-3">{paymentLabel(order.payment_method)}</td>
                  <td className="py-3 font-semibold">{formatPrice(order.total_price)}</td>
                  <td className="py-3">
                    {mode === 'customer' ? (
                      <span className="rounded-full bg-muted px-2 py-1 text-xs font-semibold capitalize">{order.status}</span>
                    ) : (
                      <select
                        value={order.status}
                        onChange={(event) => updateStatus(order.id, event.target.value)}
                        className="rounded-md border border-border bg-background px-2 py-2 text-sm capitalize outline-none focus:border-accent"
                      >
                        {orderStatuses.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    )}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr className="border-t border-border">
                  <td className="py-6 text-secondary" colSpan={6}>No orders yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
