// app/page.tsx
'use client';

//import { useState } from 'react';
import Head from 'next/head';
import { ScreenProvider } from './context/ScreenContext';
//import { CyberpunkLoader } from './components/Loader/Loader';

import MainSection from './components/Story/Main';

function Main() {
  //const [isLoading, setIsLoading] = useState(true);

  /*const handleLoadingComplete = () => {
    setIsLoading(false);
  };*/

  return (
    <>
      {/*isLoading && <CyberpunkLoader onLoadingComplete={handleLoadingComplete} />*/}

      <main className="relative w-full bg-black">
        <MainSection />
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
      <Main />
    </ScreenProvider>
  );
}