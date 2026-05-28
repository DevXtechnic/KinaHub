import { useEffect, useState } from 'react';
import { apiRequest } from '../lib/api';
import { formatPrice } from '../lib/products';
import { deliveryLabel, orderStatusLabel, orderStatuses, paymentLabel } from '../lib/orders';
import type { OrderType } from '../lib/orders';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n/LocaleContext';

interface OrdersPageProps {
  mode: 'customer' | 'seller' | 'admin';
}

export default function OrdersPage({ mode }: OrdersPageProps) {
  const { token } = useAuth();
  const { t } = useTranslation();
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [error, setError] = useState('');

  function loadOrders() {
    apiRequest<OrderType[]>('/orders/', { token })
      .then(setOrders)
      .catch(() => setError(t('common.errorRequest', { defaultValue: 'Request failed' })));
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
      setError(t('common.errorRequest', { defaultValue: 'Request failed' }));
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-surface p-4 sm:p-6">
        <h1 className="text-2xl font-black tracking-tight">
          {mode === 'customer' ? t('dashboard.orderHistory', { defaultValue: 'Order history' }) : mode === 'seller' ? t('dashboard.orderFulfillment', { defaultValue: 'Order fulfillment' }) : t('dashboard.platformOrders', { defaultValue: 'Platform orders' })}
        </h1>
        <p className="mt-2 text-secondary">
          {mode === 'customer'
            ? t('dashboard.orderHistoryDescription', { defaultValue: 'Track purchases and payment status.' })
            : t('dashboard.orderFulfillmentDescription', { defaultValue: 'Review orders, payment method, fulfillment status, and customer contact.' })}
        </p>
      </section>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <section className="rounded-lg border border-border bg-surface p-4 sm:p-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] text-left text-sm">
            <thead className="text-secondary">
              <tr>
                <th className="py-2">{t('dashboard.order', { defaultValue: 'Order' })}</th>
                <th className="py-2">{t('dashboard.customer', { defaultValue: 'Customer' })}</th>
                <th className="py-2">{t('dashboard.items', { defaultValue: 'Items' })}</th>
                <th className="py-2">{t('dashboard.payment', { defaultValue: 'Payment' })}</th>
                <th className="py-2">{t('dashboard.delivery', { defaultValue: 'Delivery' })}</th>
                <th className="py-2">{t('dashboard.promo', { defaultValue: 'Promo' })}</th>
                <th className="py-2">{t('dashboard.total', { defaultValue: 'Total' })}</th>
                <th className="py-2">{t('dashboard.status', { defaultValue: 'Status' })}</th>
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
                  <td className="py-3">{deliveryLabel(order.delivery_method)}</td>
                  <td className="py-3">
                    {order.promo_code ? (
                      <div>
                        <p className="font-semibold uppercase">{order.promo_code}</p>
                        <p className="text-xs text-secondary">- {formatPrice(order.discount_amount)}</p>
                      </div>
                    ) : (
                      <span className="text-secondary">{t('common.none', { defaultValue: 'None' })}</span>
                    )}
                  </td>
                  <td className="py-3 font-semibold">{formatPrice(order.total_price)}</td>
                  <td className="py-3">
                    {mode === 'customer' ? (
                      <span className="rounded-full bg-muted px-2 py-1 text-xs font-semibold capitalize">{orderStatusLabel(order.status)}</span>
                    ) : (
                      <select
                        value={order.status}
                        onChange={(event) => updateStatus(order.id, event.target.value)}
                        className="rounded-md border border-border bg-background px-2 py-2 text-base capitalize outline-none focus:border-accent"
                      >
                        {orderStatuses.map((status) => (
                          <option key={status} value={status}>{orderStatusLabel(status)}</option>
                        ))}
                      </select>
                    )}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr className="border-t border-border">
                  <td className="py-6 text-secondary" colSpan={8}>{t('dashboard.noOrders', { defaultValue: 'No orders yet.' })}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
