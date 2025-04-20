// src/app/[locale]/layout.tsx
import type { Metadata } from "next";
import { myCustomFont } from "@/src/lib/styles/fonts";
import { AnimatePresence } from "framer-motion";
import { globalKeywords } from "../../lib/seo/keywords";
import { ReactNode } from "react";
import ClientProviders from "@/src/components/providers";
import { CyberpunkFooter } from "./components/Footer/Footer";
import { getMessages, setRequestLocale } from "next-intl/server";
import "./globals.css";

// Proper typing for params that might be a Promise
type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }> | { locale: string };
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  // Safely resolve params if it's a Promise
  const resolvedParams = await Promise.resolve(params);
  const locale = resolvedParams.locale;
  
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
  params
}: Props) {
  // Safely resolve params if it's a Promise
  const resolvedParams = await Promise.resolve(params);
  const locale = resolvedParams.locale;

  setRequestLocale(locale);
  
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${myCustomFont.variable} antialiased`}>
        <ClientProviders locale={locale} messages={messages}>
          <AnimatePresence mode="wait">
            {children}
          </AnimatePresence>
          <CyberpunkFooter />
        </ClientProviders>
      </body>
    </html>
  );
}
