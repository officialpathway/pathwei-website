'use client';

import { useParams } from 'next/navigation';
import MainSection from './landing/Main';
import { setRequestLocale } from 'next-intl/server';

export default function Home() {
  const { locale } = useParams() as { locale: string };
  setRequestLocale(locale);

  return (
    <main className="relative w-full">
      <MainSection />
    </main>
  );
}