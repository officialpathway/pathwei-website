"use client";

import { useState } from 'react';
import Head from 'next/head';
import { CyberpunkLoader } from './components/Loader';

export default function CyberpunkCity() {
  const [isLoading, setIsLoading] = useState(true);
  const [isPageVisible, setIsPageVisible] = useState(false);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setIsPageVisible(true);
  };

  return (
    <>
      <Head>
        <title>AI Haven Labs | Cyberpunk Future</title>
        <meta name="description" content="Welcome to AI Haven Labs - Pioneering the cyberpunk future" />
      </Head>

      {isLoading && <CyberpunkLoader onLoadingComplete={handleLoadingComplete} />}

      <main className={`relative w-full h-screen overflow-hidden bg-black transition-opacity duration-1000 ${isPageVisible ? 'opacity-100' : 'opacity-0'}`}>
        {/* This will be replaced with your 3D scene */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900 to-black opacity-50">
          <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
            {Array.from({ length: 100 }).map((_, i) => (
              <div 
                key={i}
                className="border border-gray-800 opacity-20"
                style={{
                  animation: `pulse ${5 + Math.random() * 10}s infinite`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              />
            ))}
          </div>
        </div>

        {/* 3D Scene placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-neon-pink font-mono text-xl tracking-widest">
            3D CYBERPUNK CITYSCAPE WILL BE HERE
          </div>
        </div>

        {/* UI Elements */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
          <h1 className="text-neon-pink font-mono text-2xl tracking-widest">
            AI_HAVEN_LABS<span className="text-neon-cyan animate-pulse">_</span>
          </h1>
          <div className="text-neon-green font-mono text-sm">
            SYSTEM_STATUS: <span className="text-neon-blue">ONLINE</span>
          </div>
        </div>

        <div className="absolute bottom-6 left-6 text-neon-purple font-mono text-xs">
          <div>{`// ACCESS_GRANTED`}</div>
          <div>{`// USER: GUEST`}</div>
          <div>{`// TERMINAL_READY`}</div>
        </div>

        <div className="absolute bottom-6 right-6 text-neon-yellow font-mono text-xs text-right">
          <div>{`// NAVIGATION_NODES_ACTIVE`}</div>
          <div>{`// CLICK_TO_ACCESS`}</div>
          <div>{`// SERVER_TIME: ${new Date().toLocaleTimeString()}`}</div>
        </div>
      </main>

      <style jsx global>{`
        :root {
          --neon-pink: #ff2a6d;
          --neon-blue: #05d9e8;
          --neon-purple: #d300c5;
          --neon-cyan: #00f1ff;
          --neon-green: #00ff85;
          --neon-yellow: #f9f002;
        }
        
        .text-neon-pink { color: var(--neon-pink); text-shadow: 0 0 5px var(--neon-pink); }
        .text-neon-blue { color: var(--neon-blue); text-shadow: 0 0 5px var(--neon-blue); }
        .text-neon-purple { color: var(--neon-purple); text-shadow: 0 0 5px var(--neon-purple); }
        .text-neon-cyan { color: var(--neon-cyan); text-shadow: 0 0 5px var(--neon-cyan); }
        .text-neon-green { color: var(--neon-green); text-shadow: 0 0 5px var(--neon-green); }
        .text-neon-yellow { color: var(--neon-yellow); text-shadow: 0 0 5px var(--neon-yellow); }
        
        .bg-neon-pink { background-color: var(--neon-pink); }
        .bg-neon-blue { background-color: var(--neon-blue); }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }
        
        body {
          background-color: #000;
          color: #fff;
          font-family: 'Courier New', monospace;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}