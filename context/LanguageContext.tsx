'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS, LanguageCode, LanguageOptions } from '../lib/i18n';

interface LanguageContextType {
  lang: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'HI',
  setLanguage: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<LanguageCode>('HI');

  useEffect(() => {
    const saved = localStorage.getItem('tvk_lang') as LanguageCode;
    if (saved && LanguageOptions.some((l) => l.code === saved)) {
      setLang(saved);
      document.documentElement.setAttribute('data-lang', saved);
    }
  }, []);

  const setLanguage = (code: LanguageCode) => {
    setLang(code);
    localStorage.setItem('tvk_lang', code);
    document.documentElement.setAttribute('data-lang', code);
  };

  const t = (key: string): string => {
    const dictionary = TRANSLATIONS[lang] || TRANSLATIONS['HI'];
    return dictionary[key] || TRANSLATIONS['HI'][key] || TRANSLATIONS['EN'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
