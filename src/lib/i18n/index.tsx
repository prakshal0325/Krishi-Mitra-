// Krishi Mitra — Internationalization System
'use client';

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Language } from '@/lib/types';
import { hi } from './translations/hi';
import { pa } from './translations/pa';
import { te } from './translations/te';
import { en } from './translations/en';

export type TranslationKeys = typeof en;

const translations: Record<Language, TranslationKeys> = { hi, pa, te, en };

export const languageMeta: Record<Language, { name: string; nativeName: string; script: string }> = {
  hi: { name: 'Hindi', nativeName: 'हिन्दी', script: 'Devanagari' },
  pa: { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', script: 'Gurmukhi' },
  te: { name: 'Telugu', nativeName: 'తెలుగు', script: 'Telugu' },
  en: { name: 'English', nativeName: 'English', script: 'Latin' },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKeys;
  dir: 'ltr' | 'rtl';
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('hi');

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('krishi-lang', lang);
      document.documentElement.lang = lang;
    }
  }, []);

  React.useEffect(() => {
    const saved = localStorage.getItem('krishi-lang') as Language | null;
    if (saved && translations[saved]) {
      setLanguageState(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  const value: I18nContextType = {
    language,
    setLanguage,
    t: translations[language],
    dir: 'ltr',
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
