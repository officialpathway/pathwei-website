// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { SUPPORTED_LOCALES, BASE_URL } from '@/lib/seo/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const basePages = [
    { url: '/', changefreq: 'weekly', priority: 1.0 },
    { url: '/team', changefreq: 'monthly', priority: 0.5 },
    { url: '/privacy', changefreq: 'yearly', priority: 0.3 },
    { url: '/terms', changefreq: 'yearly', priority: 0.3 },
  ];

  // Generate localized URLs
  const localizedUrls = basePages.flatMap((page) => 
    SUPPORTED_LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}${page.url}`,
      lastModified: new Date(),
      changefreq: page.changefreq,
      priority: page.priority,
    }))
  );

  return [...localizedUrls];
}