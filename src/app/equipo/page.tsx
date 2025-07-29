// src/app/equipo/page.tsx
import React from "react";
import TeamSection from "@/components/client/pathway/TeamSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nuestro Equipo - Pathway",
  description:
    "Conoce al equipo detrás de Pathway, la app de productividad universitaria con IA.",
};

export default function TeamPage() {
  return (
    <main>
      <TeamSection />
    </main>
  );
}
