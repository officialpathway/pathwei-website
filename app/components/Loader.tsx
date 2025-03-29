"use client";

import { useState, useEffect } from 'react';

export const CyberpunkLoader = ({ onLoadingComplete }: { onLoadingComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsFading(true);
          setTimeout(() => {
            onLoadingComplete();
          }, 1000); // Wait for fade animation to complete
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div className={`fixed inset-0 bg-black z-50 flex flex-col items-center justify-center transition-opacity duration-1000 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
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
      <div className="relative w-80 h-6 border-2 border-neon-pink overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-neon-pink transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-neon-cyan font-mono text-sm tracking-widest">
            SYSTEM BOOTING... {Math.min(progress, 100).toFixed(0)}%
          </span>
        </div>
      </div>
      <div className="mt-8 text-neon-purple font-mono text-xs tracking-widest animate-pulse">
        AI HAVEN LABS INITIALIZING...
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div 
            key={i}
            className="w-2 h-2 bg-neon-blue opacity-0"
            style={{
              animation: `blink 1s infinite ${i * 0.1}s`,
              animationFillMode: 'forwards'
            }}
          />
        ))}
      </div>
      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};