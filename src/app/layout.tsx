// src/app/layout.tsx
import { ReactNode } from "react";
import { myCustomFont } from "@/lib/styles/fonts";
import StaticTranslationProvider from "@/components/locales/StaticTranslationProvider";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { Header } from "@/components/client/pathweg/Header";
import Footer from "@/components/client/pathweg/Footer";
import CookieBanner from "@/components/client/pathweg/CookieBanner";
import { Metadata } from "next";
import { SEOTags } from "@/components/seo/SEOTags";
import { headers } from "next/headers";

// Static metadata for Spanish (default)
export const metadata: Metadata = {
  title: {
    default: "Pathweg - App de Productividad Universitaria con IA",
    template: "%s | Pathweg",
  },
  description:
    "Maximiza tu productividad y motivación con Pathweg, la app gamificada que usa inteligencia artificial para ayudarte a alcanzar tus metas diarias. Descarga ahora.",
  keywords: [
    "productividad universitaria españa",
    "app estudiantes",
    "inteligencia artificial",
    "gamificación estudio",
    "gestión tiempo",
    "organización apuntes",
    "hábitos fitness",
    "motivación objetivos",
    "planificador universitario",
    "técnica pomodoro",
    "rendimiento académico",
    "estudiantes España",
  ],
  robots: "index, follow",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.pathwei.app"
  ),

  openGraph: {
    type: "website",
    url: "https://www.pathwei.app",
    title: "Pathweg - Productividad Universitaria Gamificada con IA",
    description:
      "Convierte tus metas en juegos, conéctate con amigos y deja que la IA te ayude a lograr más cada día con Pathweg.",
    siteName: "Pathweg App",
    images: [
      {
        url: "/images/pathweg/logo.png",
        width: 1000,
        height: 1000,
        alt: "Pathweg App Logo",
      },
    ],
    locale: "es_ES",
  },

  icons: {
    icon: "/icons/pathweg/favicon.ico",
    apple: "/icons/pathweg/apple-touch-icon.png",
  },

  other: {
    "theme-color": "#5E42D3",
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const headersList = headers();
  const pathname = (await headersList).get("x-pathname") || "";
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <html lang="es" className={myCustomFont.variable}>
      <head>
        {/* Favicon and icon metadata */}
        <link rel="icon" href="/icons/pathweg/favicon.ico" sizes="any" />
        <link
          rel="apple-touch-icon"
          href="/icons/pathweg/apple-touch-icon.png"
        />
        <meta property="og:image" content="/images/pathweg/logo.png" />

        {/* SEO Tags */}
        <SEOTags
          appName="Pathweg App"
          description="Maximiza tu productividad y motivación con Pathweg, la app gamificada que usa inteligencia artificial para ayudarte a alcanzar tus metas diarias."
          jsonLd={""}
        />
      </head>
      <body className="antialiased">
        <StaticTranslationProvider>
          {!isAdminRoute && <Header />}
          {children}
          {!isAdminRoute && <Footer />}
          {!isAdminRoute && <CookieBanner />}
          <SpeedInsights />
          <Analytics />
        </StaticTranslationProvider>
      </body>
    </html>
  );
}
