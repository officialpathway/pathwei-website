// src/lib/seo/utils.ts
import { SUPPORTED_LOCALES, BASE_URL } from './config';

// Generate alternate language URLs for all supported locales
export const generateAlternateLanguages = () => {
  const alternateLanguages: Record<string, string> = {};
  
  SUPPORTED_LOCALES.forEach(lang => {
    alternateLanguages[lang] = `${BASE_URL}/${lang}`;
  });
  
  return alternateLanguages;
};

// Convert comma-separated keywords to array
export const keywordsToArray = (keywords: string) => {
  return keywords
    ? keywords.split(',').map((keyword: string) => keyword.trim())
    : [];
};