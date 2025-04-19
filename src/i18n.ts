// src/i18n.ts
import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }: { locale?: string | undefined }) => {
  // Validate the locale
  if (!locale || !['en', 'es'].includes(locale)) notFound();

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});