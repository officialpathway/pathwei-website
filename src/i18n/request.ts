// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale = 'en' }) => {
  console.log(locale)
  return {
    locale: locale as string,
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone: 'Europe/Amsterdam',
  };
});