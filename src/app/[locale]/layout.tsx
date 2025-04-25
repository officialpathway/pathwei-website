// src/app/[locale]/layout.tsx
import type { Metadata } from "next";
import { myCustomFont } from "@/lib/styles/fonts";
import { AnimatePresence } from "framer-motion";
import { ReactNode } from "react";
import ClientProviders from "@/components/locales/providers";
import { getMessages } from "next-intl/server";
import "./globals.css";
import { detectLocale } from './locale-detector';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react";
import { getSEOSettings } from "@/lib/db/db";

// Server component for metadata
export async function generateMetadata(): Promise<Metadata> {
  // Fetch SEO settings from database/blob storage
  const seoSettings = await getSEOSettings();
  
  // Convert comma-separated keywords string to array
  const keywordsArray = seoSettings.keywords.split(',').map(keyword => keyword.trim());
  
  // Prepare alternate languages for hreflang tags
  const alternates: Record<string, string> = {
    ...(seoSettings.alternateLanguages || {}),
  };
  
  // Add canonical URL if specified
  if (seoSettings.canonicalUrl) {
    alternates.canonical = seoSettings.canonicalUrl;
  }

  // Determine robots directive based on allowIndexing and metaRobots
  const robotsDirective = seoSettings.allowIndexing
    ? (seoSettings.metaRobots || 'index, follow')
    : 'noindex, nofollow';
  
  return {
    title: {
      default: seoSettings.title,
      template: "%s | " + (seoSettings.ogSiteName || "AI Haven Labs")
    },
    description: seoSettings.description,
    keywords: keywordsArray,
    robots: robotsDirective,
    alternates: Object.keys(alternates).length > 0 ? alternates : undefined,
    
    // Always set metadataBase with a fallback to your production URL
    metadataBase: new URL(seoSettings.canonicalUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://aihavenlabs.com"),
    
    openGraph: {
      type: (seoSettings.ogType || "website") as "website" | "article" | "book" | "profile" | "music.song" | "music.album" | "music.playlist" | "music.radio_station" | "video.movie" | "video.episode" | "video.tv_show" | "video.other",
      url: seoSettings.canonicalUrl || "https://aihavenlabs.com",
      title: seoSettings.ogTitle || seoSettings.title,
      description: seoSettings.ogDescription || seoSettings.description,
      siteName: seoSettings.ogSiteName || "AI Haven Labs", 
      images: [
        {
          url: seoSettings.ogImage,
          width: 1200,
          height: 630,
          alt: seoSettings.ogTitle || seoSettings.title
        }
      ]
    },
    
    twitter: {
      card: seoSettings.twitterCard as "summary_large_image",
      title: seoSettings.ogTitle || seoSettings.title,
      description: seoSettings.ogDescription || seoSettings.description,
      site: seoSettings.twitterSite || seoSettings.twitterHandle,
      creator: seoSettings.twitterCreator || seoSettings.twitterHandle,
      images: seoSettings.twitterImage ? [seoSettings.twitterImage] : [seoSettings.ogImage]
    },
    
    icons: {
      icon: seoSettings.favicon || "/icons/pathway/favicon.ico",
      apple: "/icons/pathway/apple-touch-icon.png"
    }
  };
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = await detectLocale(); // Custom locale detection
  const messages = await getMessages({ locale });
  const seoSettings = await getSEOSettings();

  return (
    <html lang={locale} className={myCustomFont.variable}>
      <head>
        {/* Custom meta tags for browser favorites/bookmarks */}
        <meta name="application-name" content={seoSettings.ogSiteName || "AI Haven Labs"} />
        <meta name="msapplication-tooltip" content={seoSettings.description} />
        <meta name="msapplication-starturl" content="/" />
        <meta name="msapplication-TileImage" content={seoSettings.favicon || "/icons/pathway/favicon.ico"} />
        <meta name="msapplication-TileColor" content="#2b5797" />
        
        {/* Safari pinned tab icon */}
        <link rel="mask-icon" href="/icons/pathway/safari-pinned-tab.svg" color="#5bbad5" />
        
        {/* Favicon with different sizes for various devices */}
        {/*<link rel="icon" type="image/png" sizes="16x16" href="/icons/pathway/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/pathway/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/pathway/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icons/pathway/android-chrome-512x512.png" />*/}
      </head>
      <body className="antialiased">
        <ClientProviders locale={locale} messages={messages}>
          <AnimatePresence mode="wait">
            {children}
          </AnimatePresence>
          <SpeedInsights />
          <Analytics />
        </ClientProviders>
      </body>
    </html>
  );
}