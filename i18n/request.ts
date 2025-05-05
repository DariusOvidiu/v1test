import {getRequestConfig} from 'next-intl/server';

const locales = ['en', 'es', 'de', 'fr'];

export default getRequestConfig(async ({locale}) => {
  if (!locales.includes(locale)) {
    return {
      messages: (await import(`../messages/en.json`)).default,
      timeZone: 'Europe/Bucharest',
      now: new Date(),
      locale: 'en'
    };
  }

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone: 'Europe/Bucharest',
    now: new Date(),
    locale
  };
}); 