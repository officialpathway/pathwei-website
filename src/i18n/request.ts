// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async ({ locale }) => {
  // Fallback to cookie if locale is undefined
  const cookieLocale = (await cookies()).get('NEXT_LOCALE')?.value;
  const effectiveLocale = locale || cookieLocale || 'es';
  
  try {
    const messages = (await import(`../messages/${effectiveLocale}.json`)).default;
    
    return {
      locale: effectiveLocale,
      messages,
      now: new Date(),
      timeZone: 'Europe/Amsterdam',
    };
  } catch (error) {
    console.error(`Error loading messages for ${effectiveLocale}:`, error);
    
    // Fallback to es if there's an error
    if (effectiveLocale !== 'es') {
      const fallbackMessages = (await import('../messages/es.json')).default;
      
      return {
        locale: 'es',
        messages: fallbackMessages,
        now: new Date(),
        timeZone: 'Europe/Amsterdam',
      };
    }
    throw error;
  }
});