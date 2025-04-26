// components/BigTitle.tsx
'use client';

import { motion } from 'framer-motion';

interface BigTitleProps {
  text: string;
  subtitle?: string;
  highlightWords?: string[];
  highlightColor?: 'neon-pink' | 'neon-blue' | 'neon-green' | 'neon-cyan' | 'neon-yellow';
  className?: string;
}

export function BigTitle({
  text,
  subtitle,
  highlightWords = [],
  highlightColor = 'neon-pink',
  className = ''
}: BigTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className={`${className} w-full text-center`} // Ensure width is applied
    >
      <div className="inline-block">
        <h1 className="text-5xl sm:text-6xl md:text-9xl font-bold leading-none">
          {text.split(' ').map((word, i) => (
            <span 
              key={i}
              className={highlightWords.includes(word) ? 
                `text-${highlightColor} animate-pulse` : 
                'text-white'
              }
            >
              {word}{' '}
            </span>
          ))}
        </h1>
        <h3 className='text-2xl pt-12 text-neon-yellow'>{subtitle}</h3>
      </div>
    </motion.div>
  );
}