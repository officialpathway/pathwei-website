// src/app/robots.ts
import { MetadataRoute } from 'next'
import { BASE_URL } from '@/lib/seo/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/*/terms',
          '/*/privacy',
          '/*/team',
        ],
        disallow: [
          '/admin',
          '/api',
          '/_next/',
          '/node_modules/',
          '/src/',
          '/.git/'
        ]
      },
      {
        userAgent: 'Googlebot-Image',
        allow: [
          '/screenshots/',
          '/og-images/'
        ],
        disallow: [
          '/private-images/'
        ]
      }
    ],
    sitemap: `${BASE_URL}/sitemap.xml`
  }
}