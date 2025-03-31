// components/Loader/MinimalFuturisticLoader.tsx
'use client';

import { useState, useEffect } from 'react';
import '@/app/styles/Loader.css';

export const CyberpunkLoader = ({ onLoadingComplete }: { onLoadingComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 5;
        
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setIsFading(true);
          setTimeout(() => onLoadingComplete(), 800);
          return 100;
        }
        return newProgress;
      });
    }, 100);

    return () => {
      clearInterval(progressInterval);
    };
  }, [onLoadingComplete]);

  return (
    <div className={`fixed inset-0 bg-black z-50 flex flex-col items-center justify-center transition-opacity duration-800 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
      {/* Corner grid lines */}
      <div className="absolute top-2 left-2 w-32 h-32 border-t-2 border-l-2 border-white opacity-30"></div>
      <div className="absolute top-2 right-2 w-32 h-32 border-t-2 border-r-2 border-white opacity-30"></div>
      <div className="absolute bottom-2 left-2 w-32 h-32 border-b-2 border-l-2 border-white opacity-30"></div>
      <div className="absolute bottom-2 right-2 w-32 h-32 border-b-2 border-r-2 border-white opacity-30"></div>

      {/* Large percentage display */}
      <div className="text-white text-8xl font-mono font-bold mb-8 relative z-10">
        {Math.min(progress, 100).toFixed(0)}%
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xl relative z-10 group">
        <div className="h-1.5 bg-white bg-opacity-10 mb-4 overflow-hidden rounded-full">
          <div 
            className="h-full bg-white transition-all duration-300 relative"
            style={{ width: `${Math.min(progress, 100)}%` }}
          >
            <div className="absolute right-0 top-0 h-full w-0.5 bg-white animate-pulse"></div>
          </div>
        </div>
        <div className="text-xs text-white text-opacity-50 font-mono text-right -mt-3 transition-opacity group-hover:opacity-100 opacity-0">
          {Math.min(progress, 100).toFixed(1)}% LOADED
        </div>
      </div>
    </div>
  );
};