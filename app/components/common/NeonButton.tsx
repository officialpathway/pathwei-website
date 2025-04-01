// components/common/NeonButton.tsx
'use client';

import { motion } from 'framer-motion';

export const NeonButton = ({
  children,
  onClick,
  className = "",
  glowColor = "cyan",
  fullWidth = false
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  glowColor?: "cyan" | "green" | "purple" | "pink";
  fullWidth?: boolean;
}) => {
  const colorMap = {
    cyan: '#22d3ee',
    green: '#4ade80',
    purple: '#a78bfa',
    pink: '#f472b6'
  };

  return (
    <motion.button
      onClick={onClick}
      className={`relative ${fullWidth ? 'w-full' : 'w-auto min-w-[120px]'} h-12 px-6 overflow-hidden font-mono text-sm border-2 flex items-center justify-center ${className}`}
      style={{ borderColor: colorMap[glowColor], color: colorMap[glowColor] }}
      whileHover={{ boxShadow: `0 0 12px ${colorMap[glowColor]}` }}
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 opacity-10"
        initial={{ backgroundPosition: '0% 50%' }}
        animate={{ backgroundPosition: '100% 50%' }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear'
        }}
        style={{
          background: `linear-gradient(90deg, transparent, ${colorMap[glowColor]}, transparent)`,
          backgroundSize: '300% 100%'
        }}
      />
      
      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};