// components/VirusSection.tsx
'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';

export default function VirusSection({ onRebootComplete }: { onRebootComplete: () => void }) {
  const progress = useMotionValue(0);
  const overlayRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const currentProgress = useRef(0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY * 0.5;
      currentProgress.current = Math.min(Math.max(currentProgress.current + delta, 0, 100));
      progress.set(currentProgress.current);
      
      if (currentProgress.current >= 100) {
        onRebootComplete();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      isDragging.current = true;
      startY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      
      const delta = startY.current - e.touches[0].clientY;
      currentProgress.current = Math.min(Math.max(currentProgress.current + delta, 0, 100));
      progress.set(currentProgress.current);
      startY.current = e.touches[0].clientY;

      if (currentProgress.current >= 100) {
        onRebootComplete();
      }
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <motion.div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="h-screen flex flex-col items-center justify-center text-center">
        <motion.div
          className="text-neon-red text-6xl md:text-8xl font-bold mb-8 glitch-text"
          animate={{ textShadow: ['0 0 10px #ff00ff', '0 0 20px #00ffff', '0 0 10px #ff00ff'] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          SYSTEM BREACH
        </motion.div>

        <motion.div
          className="w-80 bg-black/50 p-4 border border-neon-red rounded-lg"
          style={{ scale: progress.get() ? 0.9 + progress.get()/100 * 0.2 : 0.9 }}
        >
          <div className="h-3 bg-gray-800 mb-2 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-neon-green rounded-full"
              style={{ width: progress }}
            />
          </div>
          <motion.div
            className="text-neon-green font-mono text-sm"
            style={{ 
              opacity: useTransform(progress, (v) => v/100),
              ['--progress' as string]: useTransform(progress, (v) => Math.round(v))
            }}
          >
            REBOOTING... <motion.span>{progress}</motion.span>%
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}