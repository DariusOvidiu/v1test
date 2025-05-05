export const defaultLocale = 'en';
export const locales = ['en', 'ro'] as const;

export type Locale = (typeof locales)[number]; 