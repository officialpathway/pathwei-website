// src/lib/seo/metadata.ts
import type { Metadata } from "next";
import { LOCALE_SEO, BASE_URL } from './config';
import { generateAlternateLanguages, keywordsToArray } from './utils';

export type MetadataParams = {
  params: Promise<{ locale: string }>;
};

export async function generateSiteMetadata({ params }: MetadataParams): Promise<Metadata> {
  // Await the entire params object
  const { locale } = await params;
  
  // Get SEO settings for the current locale or default to Spanish
  const seoSettings = LOCALE_SEO[locale as keyof typeof LOCALE_SEO] || LOCALE_SEO['es'];
  
  // Generate alternate language URLs
  const alternateLanguages = generateAlternateLanguages();
  
  // Convert comma-separated keywords to array
  const keywordsArray = keywordsToArray(seoSettings.keywords);
  
  // Prepare alternate languages for hreflang tags
  const alternates: Record<string, string> = {
    ...alternateLanguages,
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
      template: `%s | ${seoSettings.ogSiteName || "Pathway"}`
    },
    description: seoSettings.description,
    keywords: keywordsArray,
    robots: robotsDirective,
    alternates: Object.keys(alternates).length > 0 ? alternates : undefined,
    
    // Set metadataBase with fallback to production URL
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || BASE_URL),
    
    openGraph: {
      type: (seoSettings.ogType || "website") as "website" | "article" | "book" | "profile" | "music.song" | "music.album" | "music.playlist" | "music.radio_station" | "video.movie" | "video.episode" | "video.tv_show" | "video.other",
      url: seoSettings.canonicalUrl || BASE_URL,
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
      ] : [],
      locale: seoSettings.ogLocale
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
      icon: "/icons/pathway/favicon.ico",
      apple: "/icons/pathway/apple-touch-icon.png"
    },
    
    other: {
      "theme-color": seoSettings.themeColor || "#ffffff",
    }
  };
}