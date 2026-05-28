import { useState } from 'react';
import type { FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Store, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'seller'>('customer');
  const [businessName, setBusinessName] = useState('');
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    try {
      const user = await register({
        name,
        email,
        password,
        role,
        business_name: role === 'seller' ? businessName : undefined,
      });
      navigate(user.effective_role === 'seller' ? '/seller' : '/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md p-8 bg-surface border border-border rounded-lg shadow-xl"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center p-3 rounded-lg bg-accent text-background mb-6">
             <Store className="w-7 h-7" />
          </Link>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Create account</h1>
          <p className="text-secondary text-sm">Save addresses and track orders.</p>
        </div>

        <form className="space-y-5" onSubmit={submit}>
          {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <div className="grid grid-cols-2 gap-2 rounded-lg bg-background p-1">
            {(['customer', 'seller'] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setRole(item)}
                className={`rounded-md px-3 py-2 text-sm font-semibold capitalize ${role === item ? 'bg-accent text-background' : 'text-secondary'}`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-secondary uppercase tracking-wider pl-1">Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-secondary" />
              </div>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-300 text-sm"
                placeholder="Ram Shah"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-secondary uppercase tracking-wider pl-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-secondary" />
              </div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-300 text-sm"
                placeholder="ram.shah@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-secondary uppercase tracking-wider pl-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-secondary" />
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-300 text-sm"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {role === 'seller' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-secondary uppercase tracking-wider pl-1">Business name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Store className="h-5 w-5 text-secondary" />
                </div>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-300 text-sm"
                  placeholder="Your Store Pvt. Ltd."
                  required
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-primary text-background font-semibold py-4 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 group mt-8 relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">Create account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-secondary">
            Already have an account? <Link to="/login" className="text-accent hover:underline ml-1">Login</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
