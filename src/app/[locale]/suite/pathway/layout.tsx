// src/app/[locale]/suite/pathway/layout.tsx

import type { Metadata } from "next";
import { ReactNode } from "react";
import { myCustomFont } from "@/lib/styles";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { pathwayKeywords } from "@/lib/seo/keywords";
import "./globals.css";
import { Header } from "./components/Header";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "Pathway | AI-Powered Productivity Tracker",
  description: "Achieve your goals with AI-guided tracking and gamified motivation. Part of the AI Haven Labs suite.",
  keywords: pathwayKeywords,
  alternates: {
    canonical: "https://aihavenlabs.com/suite/pathway"
  },
  openGraph: {
    title: "Pathway by AI Haven Labs",
    description: "Your AI-powered progress companion",
    url: "https://aihavenlabs.com/suite/pathway",
    type: "website",
    images: [
      {
        url: "https://aihavenlabs.com/suite/pathway/og-pathway.jpg",
        width: 1200,
        height: 630,
        alt: "Pathway App Interface"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Pathway",
    description: "Gamified productivity with AI",
    images: {
      url: "https://aihavenlabs.com/suite/pathway/twitter-pathway.jpg",
      alt: "Pathway Mobile App"
    }
  },
  appLinks: {
    web: {
      url: "https://aihavenlabs.com/suite/pathway",
      should_fallback: true
    }
  }
}

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <section className={`${myCustomFont.variable} antialiased`}>
      <Header />
      {children}
      <Footer />
    </section>
  );
}