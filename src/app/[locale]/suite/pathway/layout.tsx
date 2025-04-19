// src/app/suite/pathway/layout.tsx

import type { Metadata } from "next";
import "./styles/globals.css";
import { ReactNode } from "react";
import { myCustomFont } from "@/src/lib/styles";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { pathwayKeywords } from "@/src/lib/seo/keywords";

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
    card: "app",
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
      {children}
    </section>
  );
}