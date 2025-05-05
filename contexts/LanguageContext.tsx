'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'es' | 'de' | 'fr';
type Country = 'us' | 'uk' | 'ca' | 'au';

interface LanguageContextType {
  language: Language;
  country: Country;
  setLanguage: (lang: Language) => void;
  setCountry: (country: Country) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  return (localStorage.getItem('language') as Language) || 'en';
}

function getInitialCountry(): Country {
  if (typeof window === 'undefined') return 'us';
  return (localStorage.getItem('country') as Country) || 'us';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const [country, setCountry] = useState<Country>(getInitialCountry);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('language', language);
      localStorage.setItem('country', country);
    }
  }, [language, country, mounted]);

  const value = {
    language,
    country,
    setLanguage,
    setCountry
  };

  if (!mounted) {
    return null;
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 