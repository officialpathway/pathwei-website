// src/app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/suite',
          '/suite/pathway',
          '/suite/pathway/terms',
          '/suite/pathway/privacy',
          '/team',
          '/privacy'
        ],
        disallow: [
          '/admin',               // No /pages/ needed in App Router
          '/api',                 // API routes
          '/_next/',              // Next.js internals
          '/node_modules/',
          '/src/',                // Source code protection
          '/.git/'                // Version control
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
    sitemap: 'https://aihavenlabs.com/sitemap.xml'
  }
}