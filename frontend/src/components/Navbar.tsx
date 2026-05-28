import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalCount } = useCart();
  const { user } = useAuth();

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!search.trim()) return;
    navigate(`/products?q=${encodeURIComponent(search.trim())}`);
    setMenuOpen(false);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center gap-3 md:h-16 md:gap-4">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <img src="/logo.png" alt="Dukan Logo" className="h-9 w-auto object-contain md:h-10" />
            <span className="text-lg font-black tracking-tight text-primary md:text-xl">Dukan</span>
          </Link>

          <form onSubmit={submitSearch} className="hidden min-w-0 flex-1 md:block">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-11 w-full rounded-md border border-border bg-background pl-10 pr-3 text-sm outline-none transition-colors focus:border-accent"
                placeholder="Search products"
              />
            </div>
          </form>

          <div className="ml-auto hidden items-center gap-5 md:flex">
            <Link to="/products" className="text-sm font-semibold text-secondary hover:text-primary">
              Products
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
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-secondary hover:text-primary"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <form onSubmit={submitSearch} className="pb-3 md:hidden">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-10 w-full rounded-md border border-border bg-background pl-10 pr-3 text-sm outline-none transition-colors focus:border-accent"
              placeholder="Search products"
            />
          </div>
        </form>

        {menuOpen && (
          <div className="border-t border-border py-3 md:hidden">
            <div className="grid grid-cols-2 gap-2 text-sm font-semibold">
              <Link onClick={closeMenu} to="/products" className="rounded-md bg-background px-3 py-3 text-secondary hover:text-primary">
                Products
              </Link>
              <Link onClick={closeMenu} to="/cart" className="rounded-md bg-background px-3 py-3 text-secondary hover:text-primary">
                Cart {totalCount > 0 ? `(${totalCount})` : ''}
              </Link>
              <Link onClick={closeMenu} to={user ? '/dashboard' : '/login'} className="rounded-md bg-background px-3 py-3 text-secondary hover:text-primary">
                {user ? 'Dashboard' : 'Login'}
              </Link>
              <Link onClick={closeMenu} to="/register" className="rounded-md bg-background px-3 py-3 text-secondary hover:text-primary">
                Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
