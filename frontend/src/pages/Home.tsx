import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgePercent, Truck, ShieldCheck, RefreshCw, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { API, formatPrice, price, productImage } from '../lib/products';
import type { CategoryType, ProductType } from '../lib/products';

const quickLinks = ['Mobiles', 'Fashion', 'Groceries', 'Gaming', 'Appliances', 'Books'];
const trustBadges = [
  { Icon: Truck, title: 'Fast local delivery', copy: 'COD, eSewa, Khalti' },
  { Icon: BadgePercent, title: 'Daily deals', copy: 'Different picks every load' },
  { Icon: ShieldCheck, title: 'Checked products', copy: 'Warranty where available' },
];

export default function Home() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);

  useEffect(() => {
    fetch(`${API}/items/?random=true`)
      .then((response) => response.json())
      .then((data: ProductType[]) => setProducts(data.slice(0, 12)))
      .catch(() => {});

    fetch(`${API}/categories/`)
      .then((response) => response.json())
      .then((data: CategoryType[]) => setCategories(data))
      .catch(() => {});
  }, []);

  const heroProduct = products[0];
  const flashDeals = products.slice(1, 5);
  const dailyPicks = products.slice(5, 12);

  return (
    <div className="min-h-screen">
      <section className="bg-background border-b border-border">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-border bg-surface p-5 text-primary shadow-sm sm:p-6"
          >
            <div className="mb-6 flex flex-wrap gap-2">
              {quickLinks.map((label) => (
                <Link
                  key={label}
                  to={`/products?category=${label.toLowerCase().replaceAll(' ', '-')}`}
                  className="rounded-full border border-border bg-muted px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:border-accent hover:bg-accent hover:text-background"
                >
                  {label}
                </Link>
              ))}
            </div>

            <p className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-accent">
              <Flame className="h-4 w-4" />
              Flash picks
            </p>
            <h1 className="max-w-2xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Deals first. Products everywhere.
            </h1>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 font-semibold text-background transition-colors hover:bg-orange-600"
              >
                Shop now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/products?random=true"
                className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 font-semibold text-primary transition-colors hover:border-accent hover:bg-surface"
              >
                Random feed <RefreshCw className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          <div className="rounded-lg border border-border bg-surface p-4 shadow-sm">
            {heroProduct ? (
              <Link to={`/product/${heroProduct.slug}`} className="group block">
                <div className="aspect-[5/4] overflow-hidden rounded-md bg-muted">
                  <img
                    src={productImage(heroProduct)}
                    alt={heroProduct.name}
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="pt-4">
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                    <span className="font-semibold text-accent">{heroProduct.tag || heroProduct.category.name}</span>
                    <span className="text-secondary">{heroProduct.stock} left</span>
                  </div>
                  <h2 className="line-clamp-1 text-2xl font-bold">{heroProduct.name}</h2>
                  <div className="mt-2 flex items-baseline gap-3">
                    <span className="text-2xl font-black text-primary">{formatPrice(price(heroProduct))}</span>
                    {heroProduct.discount_price && (
                      <span className="text-sm text-secondary line-through">{formatPrice(heroProduct.price)}</span>
                    )}
                  </div>
                </div>
              </Link>
            ) : (
              <div className="flex aspect-[5/4] items-center justify-center rounded-md bg-muted text-secondary">Loading products</div>
            )}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-muted/40">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-border px-4 sm:px-6 md:grid-cols-3 md:divide-x md:divide-y-0 lg:px-8">
          {trustBadges.map(({ Icon, title, copy }) => (
            <div key={title} className="flex items-center gap-4 py-5 md:px-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-accent/10 text-accent">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-primary">{title}</p>
                <p className="text-sm text-secondary">{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Shop by category</h2>
            <p className="text-sm text-secondary">All product types in one place.</p>
          </div>
          <Link to="/products" className="hidden text-sm font-semibold text-accent hover:underline sm:block">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.slug}`}
              className="rounded-lg border border-border bg-surface p-4 transition-colors hover:border-accent hover:bg-muted"
            >
              <p className="font-semibold text-primary">{category.name}</p>
              <p className="mt-1 line-clamp-2 text-xs text-secondary">{category.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {flashDeals.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-black tracking-tight">Flash deals</h2>
            <Link to="/products" className="text-sm font-semibold text-accent hover:underline">
              More deals
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {flashDeals.map((product) => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </div>
        </section>
      )}

      {dailyPicks.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-black tracking-tight">Just for today</h2>
            <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-secondary">Randomized from DB</span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {dailyPicks.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
