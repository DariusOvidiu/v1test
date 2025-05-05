'use client';

import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

type Translations = {
  [key: string]: any;
};

type TranslationParams = {
  [key: string]: string | number;
};

export function useTranslation() {
  const { language } = useLanguage();
  const [translations, setTranslations] = useState<Translations>({});

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const module = await import(`@/messages/${language}.json`);
        setTranslations(module.default);
      } catch (error) {
        console.error(`Failed to load translations for ${language}:`, error);
        // Încărcăm traducerile în engleză ca fallback
        const fallback = await import('@/messages/en.json');
        setTranslations(fallback.default);
      }
    };

    loadTranslations();
  }, [language]);

  const t = (key: string, params?: TranslationParams): string => {
    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Returnăm cheia dacă nu găsim traducerea
      }
    }

    let result = value || key;

    // Înlocuim parametrii în text
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        result = result.replace(`{${key}}`, String(value));
      });
    }

    return result;
  };

  return { t };
} 