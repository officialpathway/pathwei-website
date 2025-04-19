// src/app/suite/pathway/components/PathwaySchema.tsx
import Script from 'next/script';

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  "name": "Pathway",
  "description": "Aplicación móvil de productividad con IA y gamificación. Suscripción por 4,99€/mes",
  "applicationCategory": "ProductivityApplication",
  "operatingSystem": "iOS, Android",
  "offers": {
    "@type": "Offer",
    "price": "4.99",
    "priceCurrency": "EUR",
    "priceValidUntil": "2025-12-31",
    "url": "https://aihavenlabs.com/suite/pathway/download"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "215"
  }
};

export default function PathwaySchema() {
  return (
    <Script
      id="pathway-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}