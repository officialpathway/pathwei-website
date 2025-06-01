// src/app/robots.ts
import { MetadataRoute } from 'next'

const BASE_URL = 'https://www.mypathwayapp.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/equipo',
          '/privacidad',
          '/terminos',
        ],
        disallow: [
          '/admin',
          '/api',
          '/_next/',
          '/node_modules/',
          '/src/',
          '/.git/',
          '/_locale_inactive/', // Prevent indexing of inactive locale files
        ]
      },
      {
        userAgent: 'Googlebot-Image',
        allow: [
          '/screenshots/',
          '/og-images/',
          '/images/',
          '/icons/',
        ],
        disallow: [
          '/private-images/'
        ]
      }
    ],
    sitemap: `${BASE_URL}/sitemap.xml`
  }
}