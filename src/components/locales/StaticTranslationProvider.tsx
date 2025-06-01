// src/components/locales/StaticTranslationProvider.tsx
'use client';

import { NextIntlClientProvider } from 'next-intl';
import { PropsWithChildren } from 'react';

// Import Spanish messages directly
import esMessages from '@/messages/es.json';

const timeZone = "Europe/Amsterdam";

export default function StaticTranslationProvider({
  children
}: PropsWithChildren) {
  return (
    <NextIntlClientProvider 
      timeZone={timeZone}
      now={new Date()}
      locale="es" 
      messages={esMessages}
    >
      {children}
    </NextIntlClientProvider>
  );
}