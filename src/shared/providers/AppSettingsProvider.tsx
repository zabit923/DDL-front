import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Locale, TranslationKey } from '../i18n/translations';
import { translations } from '../i18n/translations';

type Theme = 'dark' | 'light';

interface AppSettingsContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  t: (key: TranslationKey) => string;
}

const AppSettingsContext = createContext<AppSettingsContextValue | null>(null);

const LOCALE_KEY = 'ddl_locale';
const THEME_KEY = 'ddl_theme';

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'ru';
  const saved = window.localStorage.getItem(LOCALE_KEY);
  return saved === 'en' ? 'en' : 'ru';
}

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const saved = window.localStorage.getItem(THEME_KEY);
  return saved === 'light' ? 'light' : 'dark';
}

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    window.localStorage.setItem(LOCALE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    window.localStorage.setItem(THEME_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const value = useMemo<AppSettingsContextValue>(() => {
    const dict = translations[locale];
    return {
      locale,
      setLocale,
      theme,
      setTheme,
      t: (key) => dict[key]
    };
  }, [locale, theme]);

  return <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>;
}

export function useAppSettings() {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) throw new Error('useAppSettings must be used within AppSettingsProvider');
  return ctx;
}
