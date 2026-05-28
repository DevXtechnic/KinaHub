import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpDown, Filter, Search, Shuffle } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { API } from '../lib/products';
import { getCategoryIcon } from '../lib/categoryIcons';
import { categoryName } from '../lib/categoryText';
import type { CategoryType, ProductType } from '../lib/products';
import { useTranslation } from '../i18n/LocaleContext';

export default function Products() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');

  const categoryFilter = searchParams.get('category');
  const query = searchParams.get('q');
  const refresh = searchParams.get('refresh');
  const sort = searchParams.get('sort') || '';

  const categoryTitle = useMemo(() => {
    if (!categoryFilter) return t('products.allProducts', { defaultValue: 'All products' });
    const category = categories.find((item) => item.slug === categoryFilter);
    return category ? categoryName(t, category.slug, category.name) : t('products.title', { defaultValue: 'Products' });
  }, [categories, categoryFilter, t]);

  const currentSortLabel = useMemo(
    () => sortOptions(t).find((option) => option.value === sort)?.label || t('products.sortBy', { defaultValue: 'Sort by' }),
    [sort, t]
  );

  useEffect(() => {
    const params = new URLSearchParams();
    if (categoryFilter) params.set('category', categoryFilter);
    if (query) params.set('q', query);
    if (sort) params.set('sort', sort);
    else if (refresh) params.set('random', 'true');
    else if (!query && !categoryFilter) params.set('sort', 'featured');

    fetch(`${API}/items/?${params.toString()}`)
      .then((response) => response.json())
      .then(setProducts)
      .catch(() => setProducts([]));
  }, [categoryFilter, query, sort, refresh]);

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
    next.delete('sort');
    next.set('random', 'true');
    setSearchParams(next);
  }

  function setSort(value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set('sort', value);
    else next.delete('sort');
    next.delete('refresh');
    next.delete('random');
    setSearchParams(next);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-4 rounded-lg border border-border bg-surface p-4 sm:mb-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">{categoryTitle}</h1>
            <p className="mt-1 text-sm text-secondary">{products.length} {t('products.showingRandom', { defaultValue: 'products showing in random order' })}</p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_220px_auto]">
            <form onSubmit={submitSearch} className="relative min-w-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t('products.searchPlaceholder', { defaultValue: 'Search products' })}
                className="h-11 w-full rounded-md border border-border bg-background pl-10 pr-3 text-base text-primary outline-none transition-colors focus:border-accent"
              />
            </form>
            <label className="relative block">
              <span className="sr-only">{t('products.sortAria', { defaultValue: 'Sort products' })}</span>
              <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="h-11 w-full appearance-none rounded-md border border-border bg-background pl-10 pr-9 text-sm font-semibold text-primary outline-none transition-colors focus:border-accent"
                aria-label={t('products.sortAria', { defaultValue: 'Sort products' })}
              >
                {sortOptions(t).map((option) => (
                  <option key={option.value || 'default'} value={option.value}>
                    {option.value ? t(`products.sort_${option.value}`, { defaultValue: option.label }) : t('products.sortBy', { defaultValue: 'Sort by' })}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={randomize}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-semibold text-primary transition-colors hover:border-accent sm:w-auto"
            >
              <Shuffle className="h-4 w-4" />
              {t('products.shuffle', { defaultValue: 'Shuffle' })}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[240px_1fr] lg:gap-6">
        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <div className="rounded-lg border border-border bg-surface p-4">
            <h2 className="mb-3 lg:mb-4 flex items-center gap-2 font-bold">
              <Filter className="h-4 w-4 text-accent" />
              {t('products.categoriesTitle', { defaultValue: 'Categories' })}
            </h2>
            <div className="flex flex-row overflow-x-auto pb-2 gap-2 lg:grid lg:grid-cols-1 lg:overflow-visible lg:pb-0 scrollbar-hide">
              <Link
                to={query ? `/products?q=${encodeURIComponent(query)}` : '/products'}
                className={`flex shrink-0 items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors lg:py-2 ${!categoryFilter ? 'bg-accent text-background' : 'bg-background border border-border lg:border-transparent text-secondary hover:text-primary'}`}
              >
                <span className={`flex h-6 w-6 items-center justify-center rounded-md ${!categoryFilter ? 'bg-background/15 text-background' : 'bg-muted text-accent'}`}>
                  {(() => {
                    const Icon = getCategoryIcon('all');
                    return <Icon className="h-3.5 w-3.5" aria-hidden="true" />;
                  })()}
                </span>
                {t('products.allCategory', { defaultValue: 'All' })}
              </Link>
              {categories.map((category) => {
                const params = new URLSearchParams();
                params.set('category', category.slug);
                if (query) params.set('q', query);
                const Icon = getCategoryIcon(category.slug);

                return (
                  <Link
                    key={category.id}
                    to={`/products?${params.toString()}`}
                    className={`flex shrink-0 items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors lg:py-2 ${categoryFilter === category.slug ? 'bg-accent text-background' : 'bg-background border border-border lg:border-transparent text-secondary hover:text-primary'}`}
                  >
                    <span className={`flex h-6 w-6 items-center justify-center rounded-md ${categoryFilter === category.slug ? 'bg-background/15 text-background' : 'bg-muted text-accent'}`}>
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    {categoryName(t, category.slug, category.name)}
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>

        <section>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm text-secondary">
            <p>
              {t('products.showing', { defaultValue: 'Showing' })} <span className="font-semibold text-primary">{products.length}</span> {t('products.productsWord', { defaultValue: 'products' })}
              {sort && (
                <>
                  {' '}
                  {t('products.sortedBy', { defaultValue: 'sorted by' })} <span className="font-semibold text-primary">{currentSortLabel}</span>
                </>
              )}
            </p>
            <button
              type="button"
              onClick={() => setSort('')}
              className="font-semibold text-accent hover:underline"
            >
              {t('products.clearSort', { defaultValue: 'Clear sort' })}
            </button>
          </div>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-surface p-10 text-center">
              <h2 className="text-xl font-bold">{t('products.noProducts', { defaultValue: 'No products found' })}</h2>
              <p className="mt-2 text-sm text-secondary">{t('products.tryAnother', { defaultValue: 'Try another category or search.' })}</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function sortOptions(t: (key: string, options?: Record<string, string | number> & { defaultValue?: string }) => string) {
  return [
    { value: '', label: t('products.sortBy', { defaultValue: 'Sort by' }) },
    { value: 'featured', label: t('products.sort_featured', { defaultValue: 'Featured first' }) },
    { value: 'price_low', label: t('products.sort_price_low', { defaultValue: 'Price: Low to high' }) },
    { value: 'price_high', label: t('products.sort_price_high', { defaultValue: 'Price: High to low' }) },
    { value: 'rating_high', label: t('products.sort_rating_high', { defaultValue: 'Rating: High to low' }) },
    { value: 'rating_low', label: t('products.sort_rating_low', { defaultValue: 'Rating: Low to high' }) },
    { value: 'newest', label: t('products.sort_newest', { defaultValue: 'Newest' }) },
    { value: 'oldest', label: t('products.sort_oldest', { defaultValue: 'Oldest' }) },
    { value: 'name_az', label: t('products.sort_name_az', { defaultValue: 'Name: A to Z' }) },
    { value: 'name_za', label: t('products.sort_name_za', { defaultValue: 'Name: Z to A' }) },
  ];
}
