// app/page.tsx
'use client';

import { useState } from 'react';
import Head from 'next/head';
import { ScreenProvider, useScreenContext } from './context/ScreenContext';
import { CyberpunkLoader } from './components/Loader/Loader';
import Hero from './components/Hero/Hero';
import StorySection from './components/Story/Story';

function MainContent() {
  const [isLoading, setIsLoading] = useState(true);
  const { currentContent } = useScreenContext();

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <CyberpunkLoader onLoadingComplete={handleLoadingComplete} />}

      <main className="relative w-full bg-black">
        {currentContent === 'about' ? <StorySection /> : <Hero />}
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