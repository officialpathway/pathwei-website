// src/app/[locale]/layout.tsx
import { ReactNode } from "react";
import { myCustomFont } from "@/lib/styles/fonts";
import ClientProviders from "@/components/locales/providers";
import { getMessages } from "next-intl/server";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react";
import { Header } from "@/components/client/pathway/Header";
import Footer from "@/components/client/pathway/Footer";
import { generateSiteMetadata } from "@/lib/seo/metadata";
import { LOCALE_SEO } from "@/lib/seo/config";
import { SEOTags } from "@/components/seo/SEOTags";

// Metadata generator
export const generateMetadata = generateSiteMetadata;

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Await the entire params object
  const { locale } = await params;
  
  // Get messages for internationalization
  const messages = await getMessages({ locale });
  
  // Get SEO settings for the current locale
  const seoSettings = LOCALE_SEO[locale as keyof typeof LOCALE_SEO] || LOCALE_SEO['es'];

  return (
    <html lang={locale} className={myCustomFont.variable}>
      <head>
        <SEOTags 
          appName={seoSettings.ogSiteName}
          description={seoSettings.description}
          jsonLd={seoSettings.jsonLd}
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