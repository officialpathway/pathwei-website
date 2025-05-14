// app/[locale]/terms/page.tsx

import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import TermsAndConditionsPage from './TermsAndConditionsPage';
import { detectLocale } from '../locale-detector';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await detectLocale();
  const t = await getTranslations({ locale, namespace: 'Pathway.legal.terms' });
  
  return {
    title: t('page_title'),
    description: t('intro_paragraph'),
  };
}

export default function TermsPage() {
  return (
    <main>
      <TermsAndConditionsPage />
    </main>
  );
}