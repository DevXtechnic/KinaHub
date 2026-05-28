import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, CreditCard, Landmark, QrCode, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice, price, productImage } from '../lib/products';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../lib/api';

const paymentMethods = [
  { id: 'cod', label: 'COD', description: 'Pay on delivery', icon: Truck },
  { id: 'esewa', label: 'eSewa', description: 'Wallet payment', icon: Landmark },
  { id: 'khalti', label: 'Khalti', description: 'Mobile wallet checkout', icon: Landmark },
  { id: 'fonepay_qr', label: 'Fonepay QR', description: 'Scan and pay', icon: QrCode },
  { id: 'card', label: 'Card payments', description: 'Visa, Mastercard, and debit cards', icon: CreditCard },
  { id: 'ime_pay', label: 'IME Pay', description: 'IME Pay wallet', icon: Landmark },
];

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { token, user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [placed, setPlaced] = useState(false);
  const [error, setError] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');

  const shipping = items.length > 0 ? 150 : 0;
  const total = totalPrice + shipping;

  const selectedMethod = useMemo(
    () => paymentMethods.find((method) => method.id === paymentMethod) || paymentMethods[0],
    [paymentMethod]
  );

  async function placeOrder() {
    if (!user || !token) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    setError('');
    try {
      await apiRequest('/orders/', {
        token,
        method: 'POST',
        body: JSON.stringify({
          payment_method: paymentMethod,
          shipping_address: shippingAddress,
          items: items.map(({ product, quantity }) => ({ product_id: product.id, quantity })),
        }),
      });
      setPlaced(true);
      clearCart();
      window.setTimeout(() => navigate('/dashboard/orders'), 1800);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not place order');
    }
  }

  if (items.length === 0 && !placed) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-3xl font-black tracking-tight">Checkout</h1>
        <p className="mt-3 text-secondary">Your cart is empty.</p>
        <Link to="/products" className="mt-6 inline-flex rounded-md bg-accent px-5 py-3 font-semibold text-background">
          Browse products
        </Link>
      </div>
    );
  }

  if (placed) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-6 text-3xl font-black tracking-tight">Order placed</h1>
        <p className="mt-3 text-secondary">
          Payment method: <span className="font-semibold text-primary">{selectedMethod.label}</span>
        </p>
        <p className="mt-2 text-secondary">You will be redirected back to the catalog.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/cart" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-primary">
        <ArrowLeft className="h-4 w-4" />
        Back to cart
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        <section className="rounded-lg border border-border bg-surface p-6">
          <h1 className="text-3xl font-black tracking-tight">Checkout</h1>
          <p className="mt-2 text-sm text-secondary">Choose a payment method and place the order.</p>

          <div className="mt-8">
            <h2 className="mb-4 text-lg font-bold">Delivery address</h2>
            <textarea
              value={shippingAddress}
              onChange={(event) => setShippingAddress(event.target.value)}
              className="mb-8 min-h-24 w-full rounded-md border border-border bg-background px-3 py-3 text-sm outline-none focus:border-accent"
              placeholder="Full delivery address"
              required
            />

            <h2 className="mb-4 text-lg font-bold">Payment method</h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                const active = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`rounded-lg border p-4 text-left transition-colors ${
                      active ? 'border-accent bg-accent/5' : 'border-border bg-background hover:border-accent'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${active ? 'bg-accent text-background' : 'bg-muted text-primary'}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-semibold text-primary">{method.label}</p>
                        <p className="text-sm text-secondary">{method.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="mb-4 text-lg font-bold">Items</h2>
            <div className="space-y-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center gap-4 rounded-lg border border-border bg-background p-3">
                  <div className="h-16 w-16 overflow-hidden rounded-md bg-muted">
                    {productImage(product) ? (
                      <img src={productImage(product)} alt={product.name} className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{product.name}</p>
                    <p className="text-sm text-secondary">Qty {quantity}</p>
                  </div>
                  <p className="shrink-0 font-semibold">{formatPrice(price(product) * quantity)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <div className="rounded-lg border border-border bg-surface p-6">
            <h2 className="text-xl font-bold">Order summary</h2>
            <div className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary">Subtotal</span>
                <span className="font-medium">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Shipping</span>
                <span className="font-medium">{formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-4">
                <span className="font-bold">Total</span>
                <span className="text-lg font-black text-accent">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={placeOrder}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-accent px-5 py-4 font-bold text-background transition-colors hover:bg-orange-600"
            >
              Place order
            </button>
            {error && <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            <p className="mt-3 text-xs text-secondary">
              Selected: <span className="font-semibold text-primary">{selectedMethod.label}</span>
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
