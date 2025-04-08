import type { Metadata } from "next";
import "./styles/globals.css";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Pathway - Your Progress Partner",
  description: "Track and achieve your goals with Pathway, the productivity app and social web designed to empower your journey.",
  keywords: ["productivity", "goals", "progress", "Pathway", "track", "organize", "improve", "achieve", "sotial web"],
  authors: [{ name: "Pathway Team", url: "https://aihavenlabs.com/suite/pathway" }],
  icons: {
    icon: "/icons/favicon.png",
    apple: "/icons/apple-touch-icon.png",
    shortcut: "/icons/favicon-32px.png",
    other: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/icons/favicon-16px.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/icons/favicon-32px.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        url: "/icons/apple-touch-icon.png",
      },
      {
        rel: "mask-icon",
        url: "/icons/safari-pinned-tab.svg",
        color: "#4CAF50",
      },
    ],
  },
  manifest: "./manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="es">
      <head >
        {/* Viewport for responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Favicons */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32px.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16px.png" />
        <link rel="shortcut icon" href="/icons/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />

        {/* Safari Pinned Tab Icon */}
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#4CAF50" />

        {/* Theme Color - Fix */}
        <meta name="theme-color" content="#4CAF50" />

        {/* Microsoft Tile Color */}
        <meta name="msapplication-TileColor" content="#4CAF50" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
      </head>
      <body className="bg-gray-100 antialiased">
        {children}
      </body>
    </html>
  );
}
