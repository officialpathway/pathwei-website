// src/app/suite/pathway/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://aihavenlabs.com/suite/pathway',
      lastModified: new Date(),
      changeFrequency: 'monthly', // Landing pages change less often
      priority: 0.7 // Lower than main product pages
    },
    /* Add localized versions if needed:
    {
      url: 'https://aihavenlabs.com/es/suite/pathway',
      alternates: {
        languages: {
          es: 'https://aihavenlabs.com/es/suite/pathway',
          en: 'https://aihavenlabs.com/suite/pathway',
        }
      }
    } */
  ]
}