// src/app/aviso-legal/page.tsx
import { Metadata } from "next";
import LegalNoticeContent from "./LegalNoticePage";

export const metadata: Metadata = {
  title: "Aviso Legal - Pathway",
  description:
    "Aviso legal de Pathway. Información sobre términos de uso, propiedad intelectual y condiciones generales.",
};

export default function LegalNoticePage() {
  return (
    <main>
      <LegalNoticeContent />
    </main>
  );
}
