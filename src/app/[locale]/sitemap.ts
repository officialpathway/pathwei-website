// src/app/sitemap.ts
import { MetadataRoute } from 'next/dist/lib/metadata/types/metadata-interface'
import pathwaySitemap from './suite/pathway/sitemap'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const basePages = [
    {
      url: 'https://aihavenlabs.com',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: 'https://aihavenlabs.com/suite',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8, // Important (product showcase)
    },
    {
      url: 'https://aihavenlabs.com/team',
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5, // Lower (static page)
    },
    {
      url: 'https://aihavenlabs.com/privacy',
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3, // Lowest (legal page)
    },
  ];

  return [...basePages, ...pathwaySitemap()];
}