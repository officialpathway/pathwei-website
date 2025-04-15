import type { Metadata } from "next";
import "./styles/globals.css";
import { ReactNode } from "react";
import { myCustomFont } from "@/src/lib/styles";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const metadata: Metadata = {
  title: "Pathway - Your Progress Partner",
  description: "Track and achieve your goals with Pathway, the productivity app and social web designed to empower your journey.",
  keywords: ["productivity", "goals", "progress", "Pathway", "track", "organize", "improve", "achieve", "social web"],
  authors: [{ name: "Pathway Team", url: "https://aihavenlabs.com/suite/pathway" }],
  manifest: "/pathway-manifest.webmanifest",
  icons: {
    icon: "/icons/favicon.png",
    apple: "/icons/apple-touch-icon.png",
    shortcut: "/icons/pathway/favicon-32px.png",
    other: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/icons/pathway/favicon-16px.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/icons/pathway/favicon-32px.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        url: "/icons/pathway/apple-touch-icon.png",
      },
      {
        rel: "mask-icon",
        url: "/icons/pathway/safari-pinned-tab.svg",
        color: "#4CAF50",
      },
    ],
  },
};

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