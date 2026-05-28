import { useState } from 'react';
import type { FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Store, Mail, Lock, ArrowRight } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    try {
      const user = await login(email, password);
      const from = (location.state as { from?: string } | null)?.from;
      navigate(from || (user.effective_role === 'seller' ? '/seller' : user.effective_role === 'admin' ? '/admin' : '/dashboard'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md p-8 bg-surface border border-border rounded-lg shadow-xl"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center p-3 rounded-lg bg-accent text-background mb-6">
             <Store className="w-7 h-7" />
          </Link>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Login</h1>
          <p className="text-secondary text-sm">Track orders and manage your account.</p>
        </div>

        <form className="space-y-5" onSubmit={submit}>
          {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
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
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center pl-1 pr-1">
               <label className="text-xs font-semibold text-secondary uppercase tracking-wider">Password</label>
               <a href="#" className="text-xs text-accent hover:underline">Reset password</a>
            </div>
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

          <button 
            type="submit" 
            className="w-full bg-primary text-background font-semibold py-4 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 group mt-8"
          >
            Login <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-secondary">
            New here? <Link to="/register" className="text-accent hover:underline ml-1">Create account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
