// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useScreenContext, ScreenProvider } from './context/ScreenContext';
import { CyberpunkLoader } from './components/Loader/Loader';
import Hero from './components/Hero/Hero';
import SystemUI from './components/common/SystemUI';

export default function CyberpunkCity() {
  const [isLoading, setIsLoading] = useState(true);
  const [isPageVisible, setIsPageVisible] = useState(false);
  const { isTransitioning } = useScreenContext();

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setIsPageVisible(true);
  };

  useEffect(() => {
    if (isTransitioning) {
      document.body.classList.add('transitioning');
      setTimeout(() => {
        setIsPageVisible(false);
      }, 1000); // Adjust the timeout to match the transition duration
    }
  }, [isTransitioning]);

  return (
    <ScreenProvider>
      <Head>
        <title>AI Haven Labs | Cyberpunk Future</title>
        <meta name="description" content="Welcome to AI Haven Labs - Pioneering the cyberpunk future" />
      </Head>

      {isLoading && <CyberpunkLoader onLoadingComplete={handleLoadingComplete} />}

      <main className={`relative w-full bg-black transition-opacity duration-1000 ${isPageVisible ? 'opacity-100' : 'opacity-0'}`}>
        <Hero />

        {/* Persistent UI Elements */}
        <SystemUI />
      </main>
    </ScreenProvider>
  );
}