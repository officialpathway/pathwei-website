// src/components/seo/SEOTags.tsx
"use client";
import Script from "next/script";

type SEOTagsProps = {
  appName: string;
  description: string;
  jsonLd: string;
};

export function SEOTags({ appName, description, jsonLd }: SEOTagsProps) {
  return (
    <>
      {/* Static SEO tags - no client components or dynamic imports */}
      <meta name="application-name" content={appName} />
      <meta name="msapplication-tooltip" content={description} />
      <meta name="msapplication-starturl" content="/" />
      <meta name="msapplication-TileColor" content="#5E42D3" />

      {/* Favicon with different sizes for various devices */}
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/icons/pathweg/favicon-16x16.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/icons/pathweg/favicon-32x32.png"
      />

      {/* Mobile app specific links */}
      <meta name="apple-itunes-app" content="app-id=YOUR_APP_ID" />
      <meta name="google-play-app" content="app-id=com.pathwei.app" />

      {/* Structured data JSON-LD */}
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
        strategy="afterInteractive"
      />
    </>
  );
}
