'use client';

import { motion } from 'framer-motion';

export function ParticleOverlay({ active }: { active: boolean }) {
  return (
    <motion.div 
      className="fixed inset-0 z-30 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: active ? 1 : 0 }}
    >
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-neon-cyan"
          style={{
            width: Math.random() * 5 + 2,
            height: Math.random() * 5 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, (Math.random() - 0.5) * 50],
            y: [0, (Math.random() - 0.5) * 50],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: Math.random() * 5 + 3,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      ))}
    </motion.div>
  );
}