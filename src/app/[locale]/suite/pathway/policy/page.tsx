// app/[locale]/privacy/page.tsx

import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import PrivacyPolicyPage from './PrivacyPolicyPage';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Pathway.Privacy' });
  
  return {
    title: t('page-title'),
    description: t('intro-paragraph'),
  };
}

export default function PrivacyPage() {
  return <PrivacyPolicyPage />;
}