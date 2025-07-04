// src/app/terminos/page.tsx
import { Metadata } from "next";
import TermsAndConditionsPage from "./TermsAndConditionsPage";

export const metadata: Metadata = {
  title: "Términos y Condiciones - Pathweg",
  description:
    "Términos y condiciones completos para el uso de Pathweg. Conoce tus derechos y responsabilidades al utilizar nuestra aplicación de productividad universitaria con IA.",
  keywords: [
    "términos y condiciones",
    "Pathweg",
    "legal",
    "derechos de usuario",
    "responsabilidades",
    "suscripción",
    "cancelación",
  ],
};

export default function TermsPage() {
  return (
    <main>
      <TermsAndConditionsPage />
    </main>
  );
}
