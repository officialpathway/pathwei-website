// app/page.tsx
'use client';

import { useState } from 'react';
import Head from 'next/head';
import { ScreenProvider, useScreenContext } from './context/ScreenContext';
import { CyberpunkLoader } from './components/Loader/Loader';
import Hero from './components/Hero/Hero';
import SystemUI from './components/common/SystemUI';
import StorySection from './components/Story/Story';

function MainContent() {
  const [isLoading, setIsLoading] = useState(true);
  const { currentContent, showContent } = useScreenContext();

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <CyberpunkLoader onLoadingComplete={handleLoadingComplete} />}

      <main className="relative w-full bg-black">
        <Hero />
        <SystemUI />
        {showContent && currentContent === 'about' && <StorySection />}
      </main>
    </>
  );
}

export default function CyberpunkCity() {
  return (
    <ScreenProvider>
      <Head>
        <title>AI Haven Labs | Cyberpunk Future</title>
        <meta name="description" content="Welcome to AI Haven Labs - Pioneering the cyberpunk future" />
      </Head>
      <MainContent />
    </ScreenProvider>
  );
}