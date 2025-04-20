// src/app/[locale]/layout.tsx
import type { Metadata } from "next";
import { myCustomFont } from "@/src/lib/styles/fonts";
import { AnimatePresence } from "framer-motion";
import { globalKeywords } from "@/src/lib/seo/keywords";
import { ReactNode } from "react";
import ClientProviders from "@/src/components/providers";
import { getMessages } from "next-intl/server";
import "./globals.css";
import { detectLocale } from './locale-detector';

// Server component for metadata
export async function generateMetadata(): Promise<Metadata> {
  const locale = detectLocale(); // Custom locale detection
  
  return {
    title: {
      default: `AI Haven Labs / ${locale} | AI-Powered Productivity Suite`,
      template: "%s | AI Haven Labs"
    },
    description: "Building AI tools to enhance human potential through technology. Explore our suite of productivity applications.",
    keywords: globalKeywords,
    openGraph: {
      type: "website",
      url: "https://aihavenlabs.com",
      title: "AI Haven Labs",
      description: "Next-generation AI tools for personal and professional growth",
      siteName: "AI Haven Labs",
      images: [
        {
          url: "https://aihavenlabs.com/og-aihl.jpg",
          width: 1200,
          height: 630,
          alt: "AI Haven Labs Dashboard"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: "AI Haven Labs",
      description: "Transforming productivity with AI",
      images: ["https://aihavenlabs.com/twitter-aihl.jpg"]
    },
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png"
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

  return (
    <html lang={locale} className={myCustomFont.variable}>
      <body className="antialiased">
        <ClientProviders locale={locale} messages={messages}>
          <AnimatePresence mode="wait">
            {children}
          </AnimatePresence>
        </ClientProviders>
      </body>
    </html>
  );
}