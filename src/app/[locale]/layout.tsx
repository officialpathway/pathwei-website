// app/[locale]/layout.tsx
import type { Metadata } from "next";
import { myCustomFont } from "@/lib/styles/fonts";
import { ReactNode } from "react";
import ClientProviders from "@/components/locales/providers";
import { getMessages } from "next-intl/server";
import "./globals.css";
import { detectLocale } from "./locale-detector";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react";
import { Header } from "@/components/client/pathway/Header";
import Footer from "@/components/client/pathway/Footer";
import Script from "next/script";

// Contenido SEO estático en español - sin consultas a base de datos
const STATIC_SEO = {
  title: 'Pathway - App de Productividad Social con IA',
  description: 'Maximiza tu productividad y motivación con Pathway, la app gamificada que usa inteligencia artificial para ayudarte a alcanzar tus metas diarias. Descarga ahora.',
  keywords: 'productividad, app de productividad, gamificación, inteligencia artificial, organización, hábitos, metas, motivación, gestión del tiempo, productividad social, aprendizaje, saludable',
  allowIndexing: true,
  ogTitle: 'Pathway - Productividad Social Gamificada con IA',
  ogDescription: 'Convierte tus metas en juegos, conéctate con amigos y deja que la IA te ayude a lograr más cada día con Pathway.',
  ogImage: '/images/pathway-social-share.jpg',
  twitterCard: 'summary_large_image',
  twitterImage: '/images/pathway-twitter-card.jpg',
  twitterHandle: '@pathwayapp',
  canonicalUrl: 'https://www.mypathwayapp.com',
  alternateLanguages: {
    'en': 'https://www.mypathwayapp.com/en',
    'es': 'https://www.mypathwayapp.com/es'
  },
  favicon: '/icons/pathway/favicon.ico',
  themeColor: '#5E42D3',
  metaRobots: 'index, follow',
  twitterSite: '@pathwayapp',
  twitterCreator: '@pathwayapp',
  ogLocale: 'es_ES',
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
};

// Componente servidor para metadatos
export function generateMetadata(): Metadata {
  // Usar datos SEO estáticos - sin llamadas a base de datos
  const seoSettings = STATIC_SEO;
  
  // Convertir keywords separadas por comas a array
  const keywordsArray = seoSettings.keywords
    ? seoSettings.keywords.split(',').map((keyword: string) => keyword.trim())
    : [];
  
  // Preparar idiomas alternativos para etiquetas hreflang
  const alternates: Record<string, string> = {
    ...(seoSettings.alternateLanguages || {}),
  };
  
  // Añadir URL canónica si se especifica
  if (seoSettings.canonicalUrl) {
    alternates.canonical = seoSettings.canonicalUrl;
  }

  // Determinar directiva de robots basada en allowIndexing y metaRobots
  const robotsDirective = seoSettings.allowIndexing
    ? (seoSettings.metaRobots || 'index, follow')
    : 'noindex, nofollow';
  
  return {
    title: {
      default: seoSettings.title,
      template: `%s | ${seoSettings.ogSiteName || "Pathway"}`
    },
    description: seoSettings.description,
    keywords: keywordsArray,
    robots: robotsDirective,
    alternates: Object.keys(alternates).length > 0 ? alternates : undefined,
    
    // Establecer metadataBase con fallback a la URL de producción
    metadataBase: new URL(seoSettings.canonicalUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://mypathwayapp.com"),
    
    openGraph: {
      type: (seoSettings.ogType || "website") as "website" | "article" | "book" | "profile" | "music.song" | "music.album" | "music.playlist" | "music.radio_station" | "video.movie" | "video.episode" | "video.tv_show" | "video.other",
      url: seoSettings.canonicalUrl || "https://mypathwayapp.com",
      title: seoSettings.ogTitle || seoSettings.title,
      description: seoSettings.ogDescription || seoSettings.description,
      siteName: seoSettings.ogSiteName || "Pathway", 
      images: seoSettings.ogImage ? [
        {
          url: seoSettings.ogImage,
          width: 1200,
          height: 630,
          alt: seoSettings.ogTitle || seoSettings.title
        }
      ] : []
    },
    
    twitter: {
      card: (seoSettings.twitterCard || "summary_large_image") as "summary_large_image" | "summary" | "app" | "player",
      title: seoSettings.ogTitle || seoSettings.title,
      description: seoSettings.ogDescription || seoSettings.description,
      site: seoSettings.twitterSite || seoSettings.twitterHandle,
      creator: seoSettings.twitterCreator || seoSettings.twitterHandle,
      images: seoSettings.twitterImage ? [seoSettings.twitterImage] : (seoSettings.ogImage ? [seoSettings.ogImage] : [])
    },
    
    icons: {
      icon: seoSettings.favicon || "/icons/pathway/favicon.ico",
      apple: "/icons/pathway/apple-touch-icon.png"
    },
    
    other: {
      "theme-color": seoSettings.themeColor || "#ffffff",
    }
  };
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = await detectLocale();
  const messages = await getMessages({ locale });
  
  // Usar datos SEO estáticos - sin llamadas a base de datos
  const seoSettings = STATIC_SEO;

  return (
    <html lang={locale} className={myCustomFont.variable}>
      <head>
        {/* Etiquetas SEO estáticas - sin componentes cliente o importaciones dinámicas */}
        <meta name="application-name" content={seoSettings.ogSiteName} />
        <meta name="msapplication-tooltip" content={seoSettings.description} />
        <meta name="msapplication-starturl" content="/" />
        <meta name="msapplication-TileColor" content="#5E42D3" />
        
        {/* Favicon con diferentes tamaños para varios dispositivos */}
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/pathway/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/pathway/favicon-32x32.png" />
        
        {/* Enlaces específicos para app móvil */}
        <meta name="apple-itunes-app" content="app-id=YOUR_APP_ID" />
        <meta name="google-play-app" content="app-id=com.pathway.app" />
        
        {/* Datos estructurados JSON-LD */}
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: seoSettings.jsonLd }}
          strategy="afterInteractive"
        />
      </head>
      <body className="antialiased">
        <ClientProviders locale={locale} messages={messages}>
          <Header />
          {children}
          <Footer />
          <SpeedInsights />
          <Analytics />
        </ClientProviders>
      </body>
    </html>
  );
}