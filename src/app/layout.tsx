// src/app/layout.tsx
import { ReactNode } from "react";
import { myCustomFont } from "@/lib/styles/fonts";
import StaticTranslationProvider from "@/components/locales/StaticTranslationProvider";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react";
import { Header } from "@/components/client/pathway/Header";
import Footer from "@/components/client/pathway/Footer";
import { Metadata } from "next";
import { SEOTags } from "@/components/seo/SEOTags";

// Static metadata for Spanish (default)
export const metadata: Metadata = {
  title: {
    default: "Pathway - App de Productividad Universitaria con IA",
    template: "%s | Pathway"
  },
  description: "Maximiza tu productividad y motivación con Pathway, la app gamificada que usa inteligencia artificial para ayudarte a alcanzar tus metas diarias. Descarga ahora.",
  keywords: ["productividad universitaria españa", "app estudiantes", "inteligencia artificial", "gamificación estudio", "gestión tiempo", "organización apuntes", "hábitos fitness", "motivación objetivos", "planificador universitario", "técnica pomodoro", "rendimiento académico", "estudiantes España"],
  robots: "index, follow",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.mypathwayapp.com"),
  
  openGraph: {
    type: "website",
    url: "https://www.mypathwayapp.com",
    title: "Pathway - Productividad Universitaria Gamificada con IA",
    description: "Convierte tus metas en juegos, conéctate con amigos y deja que la IA te ayude a lograr más cada día con Pathway.",
    siteName: "Pathway App",
    images: [
      {
        url: "/images/pathway/logo.png",
        width: 1000,
        height: 1000,
        alt: "Pathway App Logo"
      }
    ],
    locale: "es_ES"
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Pathway - Productividad Universitaria Gamificada con IA",
    description: "Convierte tus metas en juegos, conéctate con amigos y deja que la IA te ayude a lograr más cada día con Pathway.",
    site: "@pathwayapp",
    creator: "@pathwayapp",
    images: ["/images/pathway/logo.png"]
  },
  
  icons: {
    icon: "/icons/pathway/favicon.ico",
    apple: "/icons/pathway/apple-touch-icon.png"
  },
  
  other: {
    "theme-color": "#5E42D3",
  }
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="es" className={myCustomFont.variable}>
      <head>
        {/* Favicon and icon metadata */}
        <link rel="icon" href="/icons/pathway/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icons/pathway/apple-touch-icon.png" />
        <meta property="og:image" content="/images/pathway/logo.png" />
        
        {/* SEO Tags */}
        <SEOTags 
          appName="Pathway App"
          description="Maximiza tu productividad y motivación con Pathway, la app gamificada que usa inteligencia artificial para ayudarte a alcanzar tus metas diarias."
          jsonLd={`{
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
          }`}
        />
      </head>
      <body className="antialiased">
        <StaticTranslationProvider>
          <Header />
          {children}
          <Footer />
          <SpeedInsights />
          <Analytics />
        </StaticTranslationProvider>
      </body>
    </html>
  );
}