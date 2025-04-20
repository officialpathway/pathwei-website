// src/components/providers.tsx
'use client';

import { NextIntlClientProvider } from 'next-intl';
import { PropsWithChildren } from 'react';
import { AbstractIntlMessages } from 'next-intl';

type Props = {
  locale: string;
  messages: AbstractIntlMessages;
};

const timeZone = "Europe/Amsterdam";

export default function ClientProviders({
  children,
  locale,
  messages
}: PropsWithChildren<Props>) {
  return (
    <NextIntlClientProvider 
      timeZone={timeZone}
      now={new Date()}
      locale={locale} 
      messages={messages}
    >
      {children}
    </NextIntlClientProvider>
  );
}