// app/[locale]/terms/page.tsx

import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import TermsAndConditionsPage from './TermsAndConditionsPage';
import { detectLocale } from '../../../locale-detector';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await detectLocale();
  const t = await getTranslations({ locale, namespace: 'Pathway.Terms' });
  
  return {
    title: t('page-title'),
    description: t('intro-paragraph'),
  };
}

export default function TermsPage() {
  return <TermsAndConditionsPage />;
}