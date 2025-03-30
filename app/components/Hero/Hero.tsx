// components/Hero/Hero.tsx
'use client';

import { motion } from 'framer-motion';
import Terminal from './Terminal';

export default function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center bg-black overflow-hidden">
      {/* Improved SVG Background */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 2 }}
      >
        <svg 
          className="w-full h-full" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <pattern 
            id="grid-pattern" 
            width="40" 
            height="40" 
            patternUnits="userSpaceOnUse"
          >
            <path 
              d="M 40 0 L 0 0 0 40" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="0.5"
              className="text-neon-cyan"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </motion.div>

      {/* Rest of your Hero content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="relative z-10 w-full px-4"
      >
        <Terminal />
      </motion.div>
    </section>
  );
}