// app/components/providers.tsx
'use client';

import { NextIntlClientProvider } from 'next-intl';
import { PropsWithChildren } from 'react';

type Props = {
  locale: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messages: any; // Using 'any' to avoid type issues
};

export default function ClientProviders({
  children,
  locale,
  messages
}: PropsWithChildren<Props>) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}