"use client";

import { useState, useEffect } from 'react';

export const CyberpunkLoader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
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
      `}</style>
    </div>
  );
};