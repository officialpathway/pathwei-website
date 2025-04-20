
import MainSection from './landing/Main';
import { setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }> | { locale: string };
};

export default async function Home({ params }: Props) {

  const resolvedParams = await Promise.resolve(params);
  const locale = resolvedParams.locale;

  setRequestLocale(locale);
  
  return (
    <main className="relative w-full">
      <MainSection />
    </main>
  );
}
