// src/app/terminos/page.tsx
import { Metadata } from 'next';
import TermsAndConditionsPage from './TermsAndConditionsPage';

export const metadata: Metadata = {
  title: 'Términos y Condiciones - Pathway',
  description: 'Términos y condiciones de uso de Pathway. Lee nuestras condiciones de servicio.',
};

export default function TermsPage() {
  return (
    <main>
      <TermsAndConditionsPage />
    </main>
  );
}