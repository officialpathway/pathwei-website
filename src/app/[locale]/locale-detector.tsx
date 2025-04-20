// src/lib/locale-detector.ts
import { cookies, headers } from 'next/headers';

const SUPPORTED_LOCALES = ['en-US', 'es-ES'] as const;
type SupportedLocale = typeof SUPPORTED_LOCALES[number];
const DEFAULT_LOCALE: SupportedLocale = 'en-US';

/**
 * Detects the user's preferred locale using multiple fallback methods
 * 1. Checks URL path first (most specific)
 * 2. Checks NEXT_LOCALE cookie (user preference)
 * 3. Checks Accept-Language header (browser setting)
 * 4. Falls back to default locale
 */
export async function detectLocale(): Promise<SupportedLocale> {
  // 1. Check URL path first (most specific)
  const pathLocale = await getPathLocale();
  if (pathLocale && isValidLocale(pathLocale)) {
    return pathLocale;
  }

  // 2. Check cookie (user preference)
  const cookieLocale = (await cookies()).get('NEXT_LOCALE')?.value;
  if (cookieLocale && isValidLocale(cookieLocale)) {
    return cookieLocale;
  }

  // 3. Check Accept-Language header
  const headerLocale = await getHeaderLocale();
  if (headerLocale) {
    return headerLocale;
  }

  // 4. Default fallback
  return DEFAULT_LOCALE;
}

// Helper to extract locale from URL path
async function getPathLocale(): Promise<string | null> {
  const pathname = (await headers()).get('x-next-pathname') || '';
  const potentialLocale = pathname.split('/')[1];
  return potentialLocale || null;
}

// Helper to parse Accept-Language header
async function getHeaderLocale(): Promise<SupportedLocale | null> {
  const acceptLanguage = (await headers()).get('Accept-Language');
  if (!acceptLanguage) return null;

  // Parse header and find first supported locale
  const languages = acceptLanguage.split(',').map(lang => {
    const [locale] = lang.trim().split(';');
    return locale.toLowerCase();
  });

  for (const lang of languages) {
    // Check exact match first
    if (isValidLocale(lang)) {
      return lang as SupportedLocale;
    }

    // Check language-only match (e.g., 'es' for 'es-ES')
    const languageOnly = lang.split('-')[0];
    const matchedLocale = SUPPORTED_LOCALES.find(locale => 
      locale.toLowerCase().startsWith(languageOnly)
    );
    if (matchedLocale) {
      return matchedLocale;
    }
  }

  return null;
}

// Type guard for supported locales
function isValidLocale(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}