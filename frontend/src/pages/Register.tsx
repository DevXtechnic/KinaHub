import { useState } from 'react';
import type { FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Store, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n/LocaleContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { t } = useTranslation();
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
      setError(t('auth.registerFailed', { defaultValue: 'Registration failed' }));
    }
  }

  return (
    <div className="min-h-screen flex items-start justify-center px-4 py-6 relative overflow-hidden bg-background sm:items-center sm:py-10">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md p-6 bg-surface border border-border rounded-lg shadow-xl sm:p-8"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center p-3 rounded-lg bg-accent text-background mb-6">
             <Store className="w-7 h-7" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight mb-2 sm:text-3xl">{t('auth.registerTitle', { defaultValue: 'Create account' })}</h1>
          <p className="text-secondary text-sm">{t('auth.registerCopy', { defaultValue: 'Save addresses and track orders.' })}</p>
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
                {t(`auth.role${item === 'customer' ? 'Customer' : 'Seller'}`, { defaultValue: item })}
              </button>
            ))}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-secondary uppercase tracking-wider pl-1">{t('auth.name', { defaultValue: 'Name' })}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-secondary" />
              </div>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-300 text-base"
                placeholder={t('auth.namePlaceholder', { defaultValue: 'Ram Shah' })}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-secondary uppercase tracking-wider pl-1">{t('auth.email', { defaultValue: 'Email' })}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-secondary" />
              </div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-300 text-base"
                placeholder={t('auth.emailPlaceholder', { defaultValue: 'ram.shah@example.com' })}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-secondary uppercase tracking-wider pl-1">{t('auth.password', { defaultValue: 'Password' })}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-secondary" />
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-300 text-base"
                placeholder={t('auth.passwordPlaceholder', { defaultValue: '••••••••' })}
                required
              />
            </div>
          </div>

          {role === 'seller' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-secondary uppercase tracking-wider pl-1">{t('auth.businessName', { defaultValue: 'Business name' })}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Store className="h-5 w-5 text-secondary" />
                </div>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-300 text-base"
                  placeholder={t('auth.businessNamePlaceholder', { defaultValue: 'Your Store Pvt. Ltd.' })}
                  required
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-primary text-background font-semibold py-4 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 group mt-8 relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">{t('auth.signup', { defaultValue: 'Create account' })} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-secondary">
            {t('auth.haveAccount', { defaultValue: 'Already have an account?' })} <Link to="/login" className="text-accent hover:underline ml-1">{t('auth.switchToLogin', { defaultValue: 'Login' })}</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
