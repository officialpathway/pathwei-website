// src/lib/seo/config.ts
export const BASE_URL = "https://www.mypathwayapp.com";
export const SUPPORTED_LOCALES = ['en', 'es'];

// Default SEO settings for Spanish (es) locale
export const DEFAULT_SEO = {
  title: 'Pathway - App de Productividad Universitaria con IA',
  description: 'Maximiza tu productividad y motivación con Pathway, la app gamificada que usa inteligencia artificial para ayudarte a alcanzar tus metas diarias. Descarga ahora.',
  keywords: "productividad universitaria, app estudiantes, inteligencia artificial, gamificación estudio, gestión tiempo, organización apuntes, hábitos estudio, motivación académica, planificador universitario, técnica pomodoro, rendimiento académico, estudiantes España",
  allowIndexing: true,
  ogTitle: 'Pathway - Productividad Universitaria Gamificada con IA',
  ogDescription: 'Convierte tus metas en juegos, conéctate con amigos y deja que la IA te ayude a lograr más cada día con Pathway.',
  ogImage: '/images/pathway/logo.png',
  twitterCard: 'summary_large_image',
  twitterImage: '/images/pathway/logo.png',
  twitterHandle: '@pathwayapp',
  themeColor: '#5E42D3',
  metaRobots: 'index, follow',
  twitterSite: '@pathwayapp',
  twitterCreator: '@pathwayapp',
  ogLocale: 'es_ES',
  ogType: 'website',
  ogSiteName: 'Pathway App',
};

// Locale-specific SEO settings
export const LOCALE_SEO = {
  'es': {
    ...DEFAULT_SEO,
    canonicalUrl: `${BASE_URL}/es`,
    ogLocale: 'es_ES',
    jsonLd: `{
      "@context": "https://schema.org",
      "@type": "MobileApplication",
      "name": "Pathway App",
      "applicationCategory": "ProductivityApplication",
      "operatingSystem": "iOS, ANDROID",
      "offers": {
        "@type": "Offer",
        "price": "4,99",
        "priceCurrency": "EUR"
      },
      "description": "Maximiza tu productividad y motivación con Pathway, la app gamificada que usa inteligencia artificial para ayudarte a alcanzar tus metas diarias.",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "2546"
      },
      "author": {
        "@type": "Organization",
        "name": "Pathway Inc.",
        "url": "https://www.mypathwayapp.com"
      },
      "downloadUrl": [
        "#",
        "#"
      ]
    }`
  },
  'en': {
    title: 'Pathway - Social Productivity App with AI',
    description: 'Maximize your productivity and motivation with Pathway, the gamified app that uses artificial intelligence to help you achieve your daily goals. Download now.',
    keywords: "university productivity, student app, artificial intelligence, gamification study, time management, note organization, study habits, academic motivation, university planner, pomodoro technique, academic performance, Spanish students",
    allowIndexing: true,
    ogTitle: 'Pathway - Gamified Social Productivity with AI',
    ogDescription: 'Turn your goals into games, connect with friends, and let AI help you achieve more every day with Pathway.',
    ogImage: '/images/pathway/logo.png',
    twitterCard: 'summary_large_image',
    twitterImage: '/images/pathway/logo.png',
    twitterHandle: '@pathwayapp',
    canonicalUrl: `${BASE_URL}/en`,
    themeColor: '#5E42D3',
    metaRobots: 'index, follow',
    twitterSite: '@pathwayapp',
    twitterCreator: '@pathwayapp',
    ogLocale: 'en_US',
    ogType: 'website',
    ogSiteName: 'Pathway App',
    jsonLd: `{
      "@context": "https://schema.org",
      "@type": "MobileApplication",
      "name": "Pathway App",
      "applicationCategory": "ProductivityApplication",
      "operatingSystem": "iOS, ANDROID",
      "offers": {
        "@type": "Offer",
        "price": "4.99",
        "priceCurrency": "USD"
      },
      "description": "Maximize your productivity and motivation with Pathway, the gamified app that uses artificial intelligence to help you achieve your daily goals.",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "2546"
      },
      "author": {
        "@type": "Organization",
        "name": "Pathway Inc.",
        "url": "https://www.mypathwayapp.com"
      },
      "downloadUrl": [
        "#",
        "#"
      ]
    }`
  }
};