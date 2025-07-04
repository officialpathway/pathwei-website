// src/app/privacidad/page.tsx
import { Metadata } from "next";
import PrivacyPolicyPage from "./PrivacyPolicyPage";

export const metadata: Metadata = {
  title: "Política de Privacidad - Pathweg",
  description:
    "Política de privacidad de Pathweg. Conoce cómo protegemos y utilizamos tu información.",
};

export default function PolicyPage() {
  return (
    <main>
      <PrivacyPolicyPage />
    </main>
  );
}
