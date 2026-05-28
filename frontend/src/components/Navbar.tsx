import { useState, useEffect, useRef } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, ShoppingBag, Store, Tag, User, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { API } from '../lib/products';
import { useTranslation } from '../i18n/LocaleContext';
import { categoryDescription, categoryName } from '../lib/categoryText';

interface SearchSuggestionCategory {
  id: number;
  slug: string;
  name: string;
  description: string;
  href: string;
}

interface SearchSuggestionBrand {
  id: number;
  slug: string;
  name: string;
  href: string;
}

interface SearchSuggestionProduct {
  id: number;
  slug: string;
  name: string;
  category: string;
  brand: string;
  image: string;
  href: string;
}

interface SearchSuggestionsResponse {
  categories: SearchSuggestionCategory[];
  brands: SearchSuggestionBrand[];
  products: SearchSuggestionProduct[];
}

function SearchBar({ mobile = false, onSearch }: { mobile?: boolean; onSearch?: () => void }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestionsResponse | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (search.trim().length > 1) {
        fetch(`${API}/suggestions/?q=${encodeURIComponent(search.trim())}`)
          .then((res) => res.json())
          .then((data: SearchSuggestionsResponse) => {
            setSuggestions(data);
            setIsOpen(Boolean(data.categories.length || data.brands.length || data.products.length));
          })
          .catch(() => setSuggestions(null));
      } else {
        setSuggestions(null);
        setIsOpen(false);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        if (mobile) setMobileExpanded(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!search.trim()) return;
    navigate(`/products?q=${encodeURIComponent(search.trim())}`);
    setIsOpen(false);
    if (mobile) setMobileExpanded(false);
    if (onSearch) onSearch();
  }

  if (mobile) {
    return (
      <div ref={containerRef} className="pb-2 md:hidden">
        {!mobileExpanded ? (
          <button
            type="button"
            onClick={() => setMobileExpanded(true)}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-secondary hover:text-primary"
            aria-label={t('nav.searchProducts', { defaultValue: 'Search products' })}
          >
            <Search className="h-5 w-5" />
          </button>
        ) : (
          <div className="relative">
            <form onSubmit={submitSearch}>
              <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3">
                <Search className="h-4 w-4 shrink-0 text-secondary" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  onFocus={() => {
                    if (suggestions && (suggestions.categories.length > 0 || suggestions.brands.length > 0 || suggestions.products.length > 0)) {
                      setIsOpen(true);
                    }
                  }}
                  className="h-10 min-w-0 flex-1 bg-transparent text-base outline-none"
                  placeholder={t('nav.searchProducts', { defaultValue: 'Search products' })}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setSuggestions(null);
                    setIsOpen(false);
                    setMobileExpanded(false);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-secondary hover:text-primary"
                  aria-label={t('nav.closeMenu', { defaultValue: 'Close search' })}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </form>

            {isOpen && suggestions && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-md border border-border bg-surface shadow-xl">
                <div className="max-h-[60vh] overflow-y-auto py-2">
                  {suggestions.categories.length > 0 && (
                    <div className="border-b border-border pb-2">
                      <p className="px-4 pb-2 text-[11px] font-bold uppercase tracking-wide text-secondary">{t('nav.categories', { defaultValue: 'Categories' })}</p>
                      <ul className="space-y-1">
                        {suggestions.categories.map((category) => (
                          <li key={`category-${category.id}`}>
                            <Link
                              to={category.href}
                              onClick={() => {
                                setIsOpen(false);
                                setMobileExpanded(false);
                                if (onSearch) onSearch();
                              }}
                              className="flex items-center gap-3 px-4 py-2 hover:bg-accent/5 transition-colors"
                            >
                              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted text-accent">
                                <Tag className="h-4 w-4" />
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-primary">{categoryName(t, category.slug, category.name)}</p>
                                <p className="truncate text-xs text-secondary">{categoryDescription(t, category.slug, category.description)}</p>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {suggestions.brands.length > 0 && (
                    <div className="border-b border-border pb-2 pt-2">
                      <p className="px-4 pb-2 text-[11px] font-bold uppercase tracking-wide text-secondary">{t('nav.brands', { defaultValue: 'Brands' })}</p>
                      <ul className="space-y-1">
                        {suggestions.brands.map((brand) => (
                          <li key={`brand-${brand.id}`}>
                            <Link
                              to={brand.href}
                              onClick={() => {
                                setIsOpen(false);
                                setMobileExpanded(false);
                                if (onSearch) onSearch();
                              }}
                              className="flex items-center gap-3 px-4 py-2 hover:bg-accent/5 transition-colors"
                            >
                              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted text-accent">
                                <Store className="h-4 w-4" />
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-primary">{brand.name}</p>
                                <p className="truncate text-xs text-secondary">{t('nav.brand', { defaultValue: 'Brand' })}</p>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {suggestions.products.length > 0 && (
                    <div className="pt-2">
                      <p className="px-4 pb-2 text-[11px] font-bold uppercase tracking-wide text-secondary">{t('nav.products', { defaultValue: 'Products' })}</p>
                      <ul className="space-y-1">
                        {suggestions.products.map((product) => (
                          <li key={`product-${product.id}`}>
                            <Link
                              to={product.href}
                              onClick={() => {
                                setIsOpen(false);
                                setMobileExpanded(false);
                                if (onSearch) onSearch();
                              }}
                              className="flex items-center gap-3 px-4 py-2 hover:bg-accent/5 transition-colors"
                            >
                              <div className="h-10 w-10 shrink-0 overflow-hidden rounded bg-muted">
                                {product.image ? <img src={product.image} alt={product.name} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-secondary"><ShoppingBag className="h-4 w-4" /></div>}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-primary">{product.name}</p>
                                <p className="truncate text-xs text-secondary">
                                  {product.category}
                                  {product.brand ? ` · ${product.brand}` : ''}
                                </p>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative hidden min-w-0 flex-1 md:block">
      <form onSubmit={submitSearch}>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onFocus={() => {
              if (suggestions && (suggestions.categories.length > 0 || suggestions.brands.length > 0 || suggestions.products.length > 0)) {
                setIsOpen(true);
              }
            }}
            className={`${mobile ? 'h-10' : 'h-11'} w-full rounded-md border border-border bg-background pl-10 pr-3 text-base outline-none transition-colors focus:border-accent`}
            placeholder={t('nav.searchProducts', { defaultValue: 'Search products' })}
          />
        </div>
      </form>

      {isOpen && suggestions && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-md border border-border bg-surface shadow-xl">
          <div className="max-h-[70vh] overflow-y-auto py-2">
            {suggestions.categories.length > 0 && (
              <div className="border-b border-border pb-2">
                <p className="px-4 pb-2 text-[11px] font-bold uppercase tracking-wide text-secondary">{t('nav.categories', { defaultValue: 'Categories' })}</p>
                <ul className="space-y-1">
                  {suggestions.categories.map((category) => (
                    <li key={`category-${category.id}`}>
                      <Link
                        to={category.href}
                        onClick={() => {
                          setIsOpen(false);
                          if (onSearch) onSearch();
                        }}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-accent/5 transition-colors"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted text-accent">
                          <Tag className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-primary">{categoryName(t, category.slug, category.name)}</p>
                          <p className="truncate text-xs text-secondary">{categoryDescription(t, category.slug, category.description)}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {suggestions.brands.length > 0 && (
              <div className="border-b border-border pb-2 pt-2">
                <p className="px-4 pb-2 text-[11px] font-bold uppercase tracking-wide text-secondary">{t('nav.brands', { defaultValue: 'Brands' })}</p>
                <ul className="space-y-1">
                  {suggestions.brands.map((brand) => (
                    <li key={`brand-${brand.id}`}>
                      <Link
                        to={brand.href}
                        onClick={() => {
                          setIsOpen(false);
                          if (onSearch) onSearch();
                        }}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-accent/5 transition-colors"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted text-accent">
                          <Store className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-primary">{brand.name}</p>
                          <p className="truncate text-xs text-secondary">{t('nav.brand', { defaultValue: 'Brand' })}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {suggestions.products.length > 0 && (
              <div className="pt-2">
                <p className="px-4 pb-2 text-[11px] font-bold uppercase tracking-wide text-secondary">{t('nav.products', { defaultValue: 'Products' })}</p>
                <ul className="space-y-1">
                  {suggestions.products.map((product) => (
                    <li key={`product-${product.id}`}>
                      <Link
                        to={product.href}
                        onClick={() => {
                          setIsOpen(false);
                          if (onSearch) onSearch();
                        }}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-accent/5 transition-colors"
                      >
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded bg-muted">
                          {product.image ? <img src={product.image} alt={product.name} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-secondary"><ShoppingBag className="h-4 w-4" /></div>}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-primary">{product.name}</p>
                          <p className="truncate text-xs text-secondary">
                            {product.category}
                            {product.brand ? ` · ${product.brand}` : ''}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalCount } = useCart();
  const { user } = useAuth();
  const { t, locale, setLocale } = useTranslation();

  function closeMenu() {
    setMenuOpen(false);
  }

  function toggleLanguage() {
    setLocale(locale === 'en' ? 'np' : 'en');
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center gap-3 md:h-16 md:gap-4">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <img src="/logo.png" alt="Dukan Logo" className="h-10 w-auto object-contain md:h-11" />
          </Link>

          <SearchBar />

          <div className="ml-auto hidden items-center gap-5 md:flex">
            <button onClick={toggleLanguage} className="text-xs font-bold text-secondary hover:text-primary transition-colors">
              {locale === 'en' ? 'EN | NP' : 'NP | EN'}
            </button>
            <Link to="/products" className="text-sm font-semibold text-secondary hover:text-primary">
              {t('nav.products', { defaultValue: 'Products' })}
            </Link>
            <ThemeToggle />
            <Link to={user ? '/dashboard' : '/login'} className="text-secondary hover:text-primary">
              <User className="h-5 w-5" />
            </Link>
            <Link to="/cart" className="relative text-secondary hover:text-primary">
              <ShoppingBag className="h-5 w-5" />
              {totalCount > 0 && (
                <span className="absolute -right-2 -top-2 rounded-full bg-accent px-1.5 text-[10px] font-bold text-background">
                  {totalCount}
                </span>
              )}
            </Link>
          </div>

          <div className="ml-auto flex items-center gap-2 md:hidden">
            <button onClick={toggleLanguage} className="text-xs font-bold text-secondary hover:text-primary transition-colors px-2">
              {locale.toUpperCase()}
            </button>
            <SearchBar mobile />
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-secondary hover:text-primary"
              aria-label={menuOpen ? t('nav.closeMenu', { defaultValue: 'Close menu' }) : t('nav.openMenu', { defaultValue: 'Open menu' })}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-border py-3 md:hidden">
            <div className="grid grid-cols-2 gap-2 text-sm font-semibold">
              <Link onClick={closeMenu} to="/products" className="rounded-md bg-background px-3 py-3 text-secondary hover:text-primary">
                {t('nav.products', { defaultValue: 'Products' })}
              </Link>
              <Link onClick={closeMenu} to="/" className="rounded-md bg-background px-3 py-3 text-secondary hover:text-primary">
                {t('nav.home', { defaultValue: 'Home' })}
              </Link>
              <Link onClick={closeMenu} to="/cart" className="rounded-md bg-background px-3 py-3 text-secondary hover:text-primary">
                {t('nav.cart', { defaultValue: 'Cart' })} {totalCount > 0 ? `(${totalCount})` : ''}
              </Link>
              <Link onClick={closeMenu} to={user ? '/dashboard' : '/login'} className="rounded-md bg-background px-3 py-3 text-secondary hover:text-primary">
                {user ? t('nav.dashboard', { defaultValue: 'Dashboard' }) : t('nav.login', { defaultValue: 'Login' })}
              </Link>
              <Link onClick={closeMenu} to="/register" className="rounded-md bg-background px-3 py-3 text-secondary hover:text-primary">
                {t('nav.register', { defaultValue: 'Register' })}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
