import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { Locale } from './localeStore';
import { getStoredLocale, setCurrentLocale, getLocaleDirection, LOCALE_STORAGE_KEY } from './localeStore';

// Eagerly load all translations
const modules = import.meta.glob('./messages/**/*.json', { eager: true });

type TranslationDict = Record<string, unknown>;

// Transform Vite's glob object into a nested dictionary: translations['en']['auth']['loginTitle']
const translations: Record<Locale, Record<string, TranslationDict>> = {
  en: {},
  np: {},
};

for (const path in modules) {
  // path looks like: './messages/en/auth.json'
  const match = path.match(/\.\/messages\/(en|np)\/([^/]+)\.json$/);
  if (match) {
    const locale = match[1] as Locale;
    const namespace = match[2];
    const moduleContent = (modules[path] as { default: TranslationDict }).default;
    translations[locale][namespace] = moduleContent;
  }
}

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, options?: Record<string, string | number> & { defaultValue?: string }) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getStoredLocale());

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    setCurrentLocale(newLocale);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
      document.documentElement.lang = newLocale;
      document.documentElement.dir = getLocaleDirection(newLocale);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = getLocaleDirection(locale);
    setCurrentLocale(locale);
  }, [locale]);

  const t = useCallback(
    (key: string, options?: Record<string, string | number> & { defaultValue?: string }): string => {
      // Key format: namespace.key (e.g., auth.loginTitle)
      const parts = key.split('.');
      const namespace = parts[0];
      const translationKey = parts.slice(1).join('.');

      const lookup = (lang: Locale) => {
        const module = translations[lang]?.[namespace];
        if (!module) return undefined;

        return translationKey.split('.').reduce<unknown>((current, segment) => {
          if (!current || typeof current !== 'object') return undefined;
          return (current as Record<string, unknown>)[segment];
        }, module);
      };

      const defaultValue = options?.defaultValue;
      const variables = options
        ? Object.fromEntries(Object.entries(options).filter(([name]) => name !== 'defaultValue'))
        : undefined;

      let text: unknown = lookup(locale);

      // Fallback to English if key is missing in Nepali
      if (!text && locale !== 'en') {
        text = lookup('en');
      }

      if (typeof text !== 'string') {
        if (typeof defaultValue === 'string') return defaultValue;
        if (import.meta.env.DEV) {
          console.warn(`[i18n] Missing translation for key: ${key}`);
        }
        return key;
      }

      let resolved = text;
      if (variables) {
        Object.entries(variables).forEach(([k, v]) => {
          resolved = resolved.replace(`{${k}}`, String(v));
        });
      }

      return resolved;
    },
    [locale]
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useTranslation() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LocaleProvider');
  }
  return context;
}
