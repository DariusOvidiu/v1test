import { notFound } from "next/navigation"
import { NextIntlClientProvider } from "next-intl"
import { getTranslations } from 'next-intl/server';
import { locales } from "@/i18n.config"
import { AuthProvider } from "@/contexts/AuthContext"

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function LocaleLayout({
  children,
  params
}: LocaleLayoutProps) {
  // Verificăm dacă locale-ul este valid
  if (!params || !params.locale || !locales.includes(params.locale as any)) {
    notFound();
  }

  let messages;
  try {
    messages = (await import(`../../messages/${params.locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={params.locale} messages={messages}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </NextIntlClientProvider>
  )
} 