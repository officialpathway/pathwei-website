// src/app/suite/pathway/sitemap.ts
import { MetadataRoute } from 'next'

const locales = ['en', 'es']; // Supported locales
const baseUrl = 'https://aihavenlabs.com';

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${baseUrl}/${locale}/suite/pathway`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));
}