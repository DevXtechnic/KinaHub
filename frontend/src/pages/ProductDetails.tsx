import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Minus, Plus, ShieldCheck, ShoppingBag, Star, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API, formatPrice, price, productImage } from '../lib/products';
import type { ProductType } from '../lib/products';
import { useCart } from '../context/CartContext';

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    if (!product) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  useEffect(() => {
    if (!slug) return;

    fetch(`${API}/items/${slug}/`)
      .then((response) => {
        if (!response.ok) throw new Error('Product not found');
        return response.json();
      })
      .then((data: ProductType) => setProduct(data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center text-secondary">
        Loading product
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <Link to="/products" className="mt-4 inline-block font-semibold text-accent hover:underline">
          Back to products
        </Link>
      </div>
    );
  }

  const image = productImage(product);
  const subtotal = price(product) * quantity;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/products" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-primary">
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_440px]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-border bg-surface p-4"
        >
          <div className="aspect-[5/4] overflow-hidden rounded-md bg-muted">
            {image ? (
              <img src={image} alt={product.name} className="h-full w-full object-cover object-center" />
            ) : (
              <div className="flex h-full items-center justify-center text-secondary">No image</div>
            )}
          </div>
        </motion.div>

        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <div className="rounded-lg border border-border bg-surface p-6">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded bg-accent/10 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
                {product.category.name}
              </span>
              {product.tag && (
                <span className="rounded bg-muted px-2 py-1 text-xs font-semibold text-secondary">{product.tag}</span>
              )}
              <span className="ml-auto flex items-center gap-1 text-sm font-semibold text-primary">
                <Star className="h-4 w-4 fill-warning text-warning" />
                {Number(product.rating).toFixed(1)}
              </span>
            </div>

            <p className="mb-2 text-sm text-secondary">{product.brand?.name || 'Dukan'}</p>
            <h1 className="text-3xl font-black tracking-tight">{product.name}</h1>
            <p className="mt-4 leading-7 text-secondary">{product.description}</p>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-black text-primary">{formatPrice(price(product))}</span>
              {product.discount_price && (
                <span className="text-sm text-secondary line-through">{formatPrice(product.price)}</span>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between rounded-md bg-background p-3">
              <span className="text-sm font-semibold">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
              <div className="flex items-center rounded-md border border-border bg-surface">
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  className="flex h-9 w-9 items-center justify-center text-secondary hover:text-primary"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-bold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.min(product.stock || 1, value + 1))}
                  className="flex h-9 w-9 items-center justify-center text-secondary hover:text-primary"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-accent px-5 py-4 font-bold text-background transition-colors hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <AnimatePresence mode="wait" initial={false}>
                {added ? (
                  <motion.span
                    key="added"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="h-5 w-5" /> Added to cart!
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="flex items-center gap-2"
                  >
                    <ShoppingBag className="h-5 w-5" />
                    {product.stock === 0 ? 'Out of stock' : `Add to cart — ${formatPrice(subtotal)}`}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            {added && (
              <button
                type="button"
                onClick={() => navigate('/cart')}
                className="mt-2 w-full rounded-md border border-accent py-3 text-sm font-semibold text-accent hover:bg-accent/10 transition-colors"
              >
                View Cart →
              </button>
            )}

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-md border border-border p-3">
                <Truck className="mb-2 h-5 w-5 text-accent" />
                <p className="text-sm font-semibold">Fast delivery</p>
                <p className="text-xs text-secondary">Local shipping options</p>
              </div>
              <div className="rounded-md border border-border p-3">
                <ShieldCheck className="mb-2 h-5 w-5 text-accent" />
                <p className="text-sm font-semibold">Protected order</p>
                <p className="text-xs text-secondary">Warranty where listed</p>
              </div>
            </div>
          </div>

          {product.specs.length > 0 && (
            <div className="mt-4 rounded-lg border border-border bg-surface p-6">
              <h2 className="mb-4 font-bold">Details</h2>
              <dl className="space-y-3">
                {product.specs.map((spec) => (
                  <div key={spec.key} className="flex gap-4 text-sm">
                    <dt className="w-28 shrink-0 font-semibold text-primary">{spec.key}</dt>
                    <dd className="text-secondary">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
