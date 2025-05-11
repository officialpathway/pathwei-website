// types/seo.ts

export type SEOData = {
  title: string;
  description: string;
  keywords: string;
  allowIndexing: boolean;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: string;
  twitterImage: string;
  twitterHandle: string;
  sitemapLastGenerated: string;
  sitemapStatus: string;
  sitemapFrequency: string;
  sitemapPriority: string;
  robotsTxt: string;
  jsonLd: string;
  canonicalUrl: string;
  alternateLanguages: Record<string, string>;
  favicon: string;
  themeColor: string;
  metaRobots: string;
  twitterSite: string;
  twitterCreator: string;
  fbAppId: string;
  ogLocale: string;
  ogType: string;
  ogSiteName: string;
};