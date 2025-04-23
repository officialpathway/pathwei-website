// app/[locale]/privacy/page.tsx

import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import PrivacyPolicyPage from './PrivacyPolicyPage';
import { detectLocale } from '../../../locale-detector';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await detectLocale();
  const t = await getTranslations({ locale, namespace: 'Pathway.Privacy' });
  
  return {
    title: t('page-title'),
    description: t('intro-paragraph'),
  };
}

export default function PrivacyPage() {
  return <PrivacyPolicyPage />;
}