"use client";

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { CyberpunkLoader } from './components/Loader';
import { SoundToggle } from './components/SoundToggle';

export default function CyberpunkCity() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Simulate loading with progress
  useEffect(() => {
    const loadInterval = setInterval(() => {
      setLoadProgress(prev => {
        const increment = 5 + Math.random() * 15;
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          clearInterval(loadInterval);
          return 100;
        }
        return newProgress;
      });
    }, 300);

    return () => clearInterval(loadInterval);
  }, []);

  // Handle scroll effects
  useEffect(() => {
    if (isLoading) return;

    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollY = scrollContainerRef.current.scrollTop;
        const maxScroll = scrollContainerRef.current.scrollHeight - window.innerHeight;
        setScrollProgress(scrollY / maxScroll);
      }
    };

    const container = scrollContainerRef.current;
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, [isLoading]);

  // When loading completes
  useEffect(() => {
    if (loadProgress === 100) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        if (videoRef.current) {
          videoRef.current.play().catch(e => console.log("Autoplay prevented:", e));
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [loadProgress]);

  // Calculate parallax values based on scroll
  const getParallaxOffset = (intensity: number) => {
    return scrollProgress * intensity * 100;
  };

  return (
    <>
      <Head>
        <title>AI Haven Labs | Cyberpunk Future</title>
        <meta name="description" content="Welcome to AI Haven Labs" />
      </Head>

      {isLoading ? (
        <CyberpunkLoader progress={loadProgress} />
      ) : (
        <div 
          ref={scrollContainerRef}
          className="relative w-full h-screen overflow-y-auto overflow-x-hidden bg-black"
        >
          {/* Fixed Background */}
          <div className="fixed inset-0 overflow-hidden -z-10">
            <video
              ref={videoRef}
              className="w-full h-full object-cover opacity-80"
              muted
              loop
              playsInline
              preload="auto"
            >
              <source src="/videos/cyberpunk-city.webm" type="video/webm" />
              <source src="/videos/cyberpunk-city.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
          </div>

          {/* Scrollable Content */}
          <div className="relative z-10 pt-[100vh]">
            {/* Hero Section */}
            <section className="min-h-screen flex items-center justify-center">
              <div className="text-center max-w-4xl px-8">
                <h1 
                  className="text-[var(--neon-cyan)] font-mono text-5xl md:text-7xl mb-8 tracking-widest"
                  style={{ transform: `translateY(${getParallaxOffset(0.5)}px)` }}
                >
                  WELCOME_TO_<span className="text-[var(--neon-pink)]">AI_HAVEN</span>
                </h1>
                <p 
                  className="text-[var(--neon-green)] text-xl md:text-2xl mb-12"
                  style={{ transform: `translateX(${getParallaxOffset(0.3)}px)` }}
                >
                  BUILDING THE FUTURE OF HUMAN-AI SYMBIOSIS
                </p>
                <div className="animate-float">
                  <div className="w-16 h-16 mx-auto bg-[var(--neon-purple)] rounded-full opacity-70 blur-[20px]" />
                </div>
              </div>
            </section>

            {/* Floating Neon Signs Section */}
            <section className="min-h-screen relative">
              <div className="sticky top-1/2 transform -translate-y-1/2">
                <div 
                  className="absolute left-10 top-0 text-[var(--neon-blue)] font-mono text-3xl border border-[var(--neon-blue)] p-4"
                  style={{ transform: `translateX(${getParallaxOffset(1)}px)` }}
                >
                  AI_APPS
                </div>
                <div 
                  className="absolute right-10 top-1/3 text-[var(--neon-pink)] font-mono text-3xl border border-[var(--neon-pink)] p-4"
                  style={{ transform: `translateX(${getParallaxOffset(-0.8)}px)` }}
                >
                  NEURAL_CORES
                </div>
                <div 
                  className="absolute left-1/4 bottom-1/4 text-[var(--neon-yellow)] font-mono text-3xl border border-[var(--neon-yellow)] p-4"
                  style={{ transform: `translateY(${getParallaxOffset(1.2)}px)` }}
                >
                  QUANTUM_DB
                </div>
              </div>
            </section>

            {/* Product Showcase */}
            <section className="min-h-screen flex items-center justify-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl px-8">
                {['NEURAL LINK', 'SYNTH MIND', 'QUANTUM CORE'].map((product, i) => (
                  <div 
                    key={product}
                    className="border border-[var(--neon-purple)] p-8 backdrop-blur-sm bg-black bg-opacity-40 hover:bg-opacity-70 transition-all duration-500"
                    style={{
                      transform: `translateY(${getParallaxOffset(0.2 * (i + 1))}px)`,
                      borderImage: 'linear-gradient(45deg, var(--neon-pink), var(--neon-blue)) 1'
                    }}
                  >
                    <h3 className="text-[var(--neon-cyan)] text-2xl mb-4">{product}</h3>
                    <p className="text-gray-300">Revolutionary AI technology for next-gen integration</p>
                    <div className="mt-6 h-1 bg-gradient-to-r from-[var(--neon-pink)] to-[var(--neon-blue)]" />
                  </div>
                ))}
              </div>
            </section>

            {/* Glitch Terminal Section */}
            <section className="min-h-screen flex items-center justify-center relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-[var(--neon-green)] font-mono text-xs md:text-sm whitespace-pre">
                  {`> SYSTEM DIAGNOSTICS RUNNING...\n> NEURAL NETWORKS: ACTIVE\n> QUANTUM CONNECTIONS: STABLE\n> USER AUTHORIZATION: GRANTED\n> WELCOME TO THE FUTURE`}
                </div>
              </div>
              <div 
                className="absolute inset-0 bg-[url('/grid-pattern.png')] opacity-20"
                style={{ transform: `scale(${1 + scrollProgress * 0.5})` }}
              />
            </section>
          </div>

          {/* Persistent UI Elements */}
          <div className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center z-50 pointer-events-none">
            <h1 className="text-[var(--neon-pink)] font-mono text-2xl tracking-widest">
              AI_HAVEN_LABS<span className="text-[var(--neon-cyan)] animate-pulse">_</span>
            </h1>
            <div className="text-[var(--neon-green)] font-mono text-sm">
              SCROLL: {Math.round(scrollProgress * 100)}%
            </div>
          </div>

          <div className="fixed bottom-6 left-6 text-[var(--neon-purple)] font-mono text-xs z-50 pointer-events-none">
            <div>{`// SYSTEM_ACTIVE`}</div>
            <div>{`// ${new Date().toLocaleTimeString()}`}</div>
          </div>

          <SoundToggle />
        </div>
      )}

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}