// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  
  // Since we know the locale should be available, we'll use the URL path as fallback
  // This is a workaround for the undefined locale issue
  const effectiveLocale = locale || process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'en-US';
  
  try {
    // Import the messages for the current locale
    const messages = (await import(`../messages/${effectiveLocale}.json`)).default;
    
    return {
      locale: effectiveLocale,
      messages,
      now: new Date(),
      timeZone: 'Europe/Amsterdam',
    };
  } catch (error) {
    console.error(`Error loading messages for ${effectiveLocale}:`, error);
    
    // Fallback to en-US if there's an error loading the messages
    if (effectiveLocale !== 'en-US') {
      const fallbackMessages = (await import('../messages/en-US.json')).default;
      
      return {
        locale: 'en-US',
        messages: fallbackMessages,
        now: new Date(),
        timeZone: 'Europe/Amsterdam',
      };
    }
    throw error;
  }
});