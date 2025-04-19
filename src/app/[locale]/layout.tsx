// src/app/[locale]/layout.tsx
import type { Metadata } from "next";
import { myCustomFont } from "@/src/lib/styles/fonts";
import { AnimatePresence } from "framer-motion";
import { globalKeywords } from "../../lib/seo/keywords";
import { Locale, NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import "./globals.css";
import { ReactNode } from "react";
import { getMessages, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
    return {
    title: {
      default: "AI Haven Labs | AI-Powered Productivity Suite",
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
  }
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Validate locale first
  const { locale } = await params;

  // Must call setRequestLocale FIRST
  setRequestLocale(locale);
  
  // Then get messages
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${myCustomFont.variable} antialiased`}>
        <NextIntlClientProvider
          locale={locale}
          messages={messages}
          now={new Date()}
          timeZone="UTC"
        >
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export const generateStaticParams = () => {
  return [{ locale: 'en' }, { locale: 'es' }];
};