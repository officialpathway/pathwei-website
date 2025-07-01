// src/app/cookies/page.tsx
import { Metadata } from 'next';
import CookiePolicyPage from './CookiePolicyPage';

export const metadata: Metadata = {
  title: 'Política de Cookies - Pathwei',
  description: 'Política de cookies de Pathwei. Conoce cómo utilizamos las cookies en nuestro sitio web.',
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen relative z-10">
      <CookiePolicyPage />
    </main>
  );
}