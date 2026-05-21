import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, ShoppingBag, Store, User } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!search.trim()) return;
    navigate(`/products?q=${encodeURIComponent(search.trim())}`);
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-4">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-background">
              <Store className="h-5 w-5" />
            </span>
            <span className="text-xl font-black tracking-tight text-primary">Kina</span>
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
            <Link to="/login" className="text-secondary hover:text-primary">
              <User className="h-5 w-5" />
            </Link>
            <Link to="/cart" className="relative text-secondary hover:text-primary">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -right-2 -top-2 rounded-full bg-accent px-1.5 text-[10px] font-bold text-background">0</span>
            </Link>
          </div>

          <button className="ml-auto text-secondary hover:text-primary md:hidden">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}
