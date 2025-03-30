// components/Loader/CyberpunkLoader.tsx
'use client';

import { useState, useEffect } from 'react';
import '@/app/styles/Loader.css';

export const CyberpunkLoader = ({ onLoadingComplete }: { onLoadingComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [showGlitch, setShowGlitch] = useState(false);

  // System messages with random errors
  const systemMessages = [
    "> INITIALIZING NEURAL NETWORK...",
    "> LOADING CORE MODULES...",
    "> CONNECTING TO DATABANK... [ERROR: 0x7F3A21]",
    "> RETRYING CONNECTION...",
    "> AUTHENTICATING USER...",
    "> VERIFYING SECURITY PROTOCOLS... [WARNING: INTRUSION DETECTED]",
    "> ACTIVATING AI SUBSYSTEMS...",
    "> CALIBRATING BIO-INTERFACE... [ERROR: 0x4D2F09]",
    "> SYSTEM CHECK COMPLETE"
  ];

  useEffect(() => {
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      if (messageIndex < systemMessages.length) {
        setTerminalLines(prev => [...prev, systemMessages[messageIndex]]);
        messageIndex++;
        
        // Random glitch effect
        if (Math.random() > 0.7) {
          setShowGlitch(true);
          setTimeout(() => setShowGlitch(false), 200);
        }
      }
    }, 800);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        
        // Simulate occasional progress drops (errors)
        if (newProgress > 30 && newProgress < 80 && Math.random() > 0.9) {
          return Math.max(0, prev - 5);
        }
        
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          clearInterval(messageInterval);
          setIsFading(true);
          setTimeout(() => onLoadingComplete(), 1000);
          return 100;
        }
        return newProgress;
      });
    }, 200);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onLoadingComplete]);

  return (
    <div className={`fixed inset-0 bg-black z-50 flex flex-col items-center justify-center transition-opacity duration-1000 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
      {/* Grid background */}
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

      {/* Main terminal container */}
      <div className={`relative w-full max-w-2xl h-96 border-2 border-neon-cyan bg-black/90 p-4 overflow-hidden ${showGlitch ? 'glitch-effect' : ''}`}>
        {/* Terminal header */}
        <div className="flex items-center mb-4">
          <div className="flex space-x-2 mr-4">
            <div className="w-3 h-3 bg-neon-red rounded-full"></div>
            <div className="w-3 h-3 bg-neon-yellow rounded-full"></div>
            <div className="w-3 h-3 bg-neon-green rounded-full"></div>
          </div>
          <div className="text-neon-green font-mono text-sm">SYSTEM_BOOT_SEQUENCE</div>
        </div>

        {/* Terminal content */}
        <div className="font-mono text-neon-green text-sm h-64 overflow-y-auto terminal-scroll">
          {terminalLines.map((line, index) => (
            <div 
              key={index} 
              className={`mb-1 ${line.includes('ERROR') ? 'text-neon-red' : line.includes('WARNING') ? 'text-neon-yellow' : ''}`}
            >
              {line}
            </div>
          ))}
          <div className="flex items-center">
            <span className="mr-2">{">"}</span>
            <span className="animate-pulse">▋</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="relative w-full h-6 border border-neon-pink overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-neon-pink transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-neon-cyan font-mono text-xs tracking-widest">
                SYSTEM BOOTING... {Math.min(progress, 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Status lights */}
      <div className="mt-6 grid grid-cols-8 gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div 
            key={i}
            className="w-3 h-3 rounded-full opacity-0"
            style={{
              backgroundColor: i % 3 === 0 ? '#ff00e6' : i % 2 === 0 ? '#00f0ff' : '#00ff88',
              animation: `blink 1s infinite ${i * 0.1}s`,
              animationFillMode: 'forwards'
            }}
          />
        ))}
      </div>
    </div>
  );
};