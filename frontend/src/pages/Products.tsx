import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Filter, Search, Shuffle } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { API } from '../lib/products';
import type { CategoryType, ProductType } from '../lib/products';

export default function Products() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');

  const categoryFilter = searchParams.get('category');
  const query = searchParams.get('q');
  const refresh = searchParams.get('refresh');

  const categoryTitle = useMemo(() => {
    if (!categoryFilter) return 'All products';
    return categories.find((category) => category.slug === categoryFilter)?.name || 'Products';
  }, [categories, categoryFilter]);

  useEffect(() => {
    const params = new URLSearchParams({ random: 'true' });
    if (categoryFilter) params.set('category', categoryFilter);
    if (query) params.set('q', query);

    fetch(`${API}/items/?${params.toString()}`)
      .then((response) => response.json())
      .then(setProducts)
      .catch(() => setProducts([]));
  }, [categoryFilter, query, refresh]);

  useEffect(() => {
    fetch(`${API}/categories/`)
      .then((response) => response.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  useEffect(() => {
    setSearch(query || '');
  }, [query]);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (search.trim()) next.set('q', search.trim());
    else next.delete('q');
    setSearchParams(next);
  }

  function randomize() {
    const next = new URLSearchParams(searchParams);
    next.set('refresh', Date.now().toString());
    setSearchParams(next);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 rounded-lg border border-border bg-surface p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight">{categoryTitle}</h1>
            <p className="mt-1 text-sm text-secondary">{products.length} products showing in random order</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <form onSubmit={submitSearch} className="relative min-w-0 sm:w-80">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products"
                className="h-11 w-full rounded-md border border-border bg-background pl-10 pr-3 text-sm text-primary outline-none transition-colors focus:border-accent"
              />
            </form>
            <button
              type="button"
              onClick={randomize}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-semibold text-primary transition-colors hover:border-accent"
            >
              <Shuffle className="h-4 w-4" />
              Shuffle
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <div className="rounded-lg border border-border bg-surface p-4">
            <h2 className="mb-3 lg:mb-4 flex items-center gap-2 font-bold">
              <Filter className="h-4 w-4 text-accent" />
              Categories
            </h2>
            <div className="flex flex-row overflow-x-auto pb-2 gap-2 lg:grid lg:grid-cols-1 lg:overflow-visible lg:pb-0 scrollbar-hide">
              <Link
                to={query ? `/products?q=${encodeURIComponent(query)}` : '/products'}
                className={`shrink-0 rounded-md px-3 py-1.5 lg:py-2 text-sm font-medium transition-colors ${!categoryFilter ? 'bg-accent text-background' : 'bg-background border border-border lg:border-transparent text-secondary hover:text-primary'}`}
              >
                All
              </Link>
              {categories.map((category) => {
                const params = new URLSearchParams();
                params.set('category', category.slug);
                if (query) params.set('q', query);

                return (
                  <Link
                    key={category.id}
                    to={`/products?${params.toString()}`}
                    className={`shrink-0 rounded-md px-3 py-1.5 lg:py-2 text-sm font-medium transition-colors ${categoryFilter === category.slug ? 'bg-accent text-background' : 'bg-background border border-border lg:border-transparent text-secondary hover:text-primary'}`}
                  >
                    {category.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>

        <section>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-surface p-10 text-center">
              <h2 className="text-xl font-bold">No products found</h2>
              <p className="mt-2 text-sm text-secondary">Try another category or search.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
