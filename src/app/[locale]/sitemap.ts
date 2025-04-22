// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import pathwaySitemap from './suite/pathway/sitemap';

const locales = ['en', 'es']; // Supported locales
const baseUrl = 'https://aihavenlabs.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const basePages = [
    { url: '/', changefreq: 'weekly', priority: 1.0 },
    { url: '/suite', changefreq: 'monthly', priority: 0.8 },
    { url: '/team', changefreq: 'yearly', priority: 0.5 },
    { url: '/privacy', changefreq: 'yearly', priority: 0.3 },
  ];

  // Generate localized URLs
  const localizedUrls = basePages.flatMap((page) => 
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${page.url}`,
      lastModified: new Date(),
      changefreq: page.changefreq,
      priority: page.priority,
    }))
  );

  return [...localizedUrls, ...pathwaySitemap()];
}