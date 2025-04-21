// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async ({ locale }) => {
  // Fallback to cookie if locale is undefined
  const cookieLocale = (await cookies()).get('NEXT_LOCALE')?.value;
  const effectiveLocale = locale || cookieLocale || 'en';
  
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
    
    // Fallback to en if there's an error
    if (effectiveLocale !== 'en') {
      const fallbackMessages = (await import('../messages/en.json')).default;
      
      return {
        locale: 'en',
        messages: fallbackMessages,
        now: new Date(),
        timeZone: 'Europe/Amsterdam',
      };
    }
    throw error;
  }
});