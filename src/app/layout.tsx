// src/app/layout.tsx

import type { Metadata } from "next";
import { myCustomFont } from "@/src/lib/styles/fonts";
import { AnimatePresence } from "framer-motion";
import { globalKeywords } from "../lib/seo/keywords";
import "./globals.css";
//import BackgroundShader from "./components/common/Shader";

export const metadata: Metadata = {
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${myCustomFont.variable} antialiased`}>
        {/*<BackgroundShader key="backgroundShader"/>*/}
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </body>
    </html>
  );
}