// app/[locale]/privacy/page.tsx

import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import PrivacyPolicyPage from './PrivacyPolicyPage';
import { detectLocale } from '../locale-detector';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await detectLocale();
  const t = await getTranslations({ locale, namespace: 'Pathway.legal.privacy' });
  
  return {
    title: t('page_title'),
    description: t('intro_paragraph'),
  };
}

export default function PrivacyPage() {
  return (
    <main>
      <PrivacyPolicyPage />
    </main>
  );
}