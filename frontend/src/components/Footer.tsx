import { Mail, MapPin, Phone, Store } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <Link to="/" className="mb-4 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-background">
                <Store className="h-5 w-5" />
              </span>
              <span className="text-xl font-black tracking-tight">Kina</span>
            </Link>
            <p className="text-sm leading-6 text-secondary">Products, deals, delivery, checkout.</p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide">Shop</h3>
            <ul className="space-y-2 text-sm text-secondary">
              <li><Link to="/products" className="hover:text-primary">All products</Link></li>
              <li><Link to="/products?category=mobiles" className="hover:text-primary">Mobiles</Link></li>
              <li><Link to="/products?category=fashion" className="hover:text-primary">Fashion</Link></li>
              <li><Link to="/products?category=groceries" className="hover:text-primary">Groceries</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide">Orders</h3>
            <ul className="space-y-2 text-sm text-secondary">
              <li><Link to="/cart" className="hover:text-primary">Cart</Link></li>
              <li><Link to="/login" className="hover:text-primary">Login</Link></li>
              <li><Link to="/register" className="hover:text-primary">Register</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide">Contact</h3>
            <ul className="space-y-3 text-sm text-secondary">
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-accent" /> Kathmandu, Nepal</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-accent" /> 01-0000000</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-accent" /> hello@kina.local</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-sm text-secondary">
          &copy; {new Date().getFullYear()} Kina.
        </div>
      </div>
    </footer>
  );
}
