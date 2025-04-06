// components/InfoMessage.tsx
'use client';

import { motion } from 'framer-motion';

export const InfoMessage = ({ 
  message,
  subMessage,
  icon = "ⓘ",
  borderColor = "cyan"
}: {
  message: string;
  subMessage?: string;
  icon?: string;
  borderColor?: "cyan" | "green" | "purple" | "pink";
}) => {
  const borderColors = {
    cyan: "border-neon-cyan/20",
    green: "border-neon-green/20",
    purple: "border-neon-purple/20",
    pink: "border-neon-pink/20"
  };

  return (
    <motion.div
      className={`mb-4 p-3 bg-black/40 border ${borderColors[borderColor]} max-w-[400px] rounded-lg`}
      animate={{ 
        borderColor: [
          `rgba(34, 211, 238, ${borderColor === 'cyan' ? 0.2 : 0.1})`,
          `rgba(34, 211, 238, ${borderColor === 'cyan' ? 0.5 : 0.3})`,
          `rgba(34, 211, 238, ${borderColor === 'cyan' ? 0.2 : 0.1})`
        ],
      }}
      transition={{ 
        duration: 3,
        repeat: Infinity,
      }}
    >
      <div className="flex items-start gap-2">
        <span className={`text-neon-${borderColor} text-lg`}>{icon}</span>
        <div>
          <p className="text-white text-sm mb-1">{message}</p>
          {subMessage && (
            <p className="text-white/70 text-xs">{subMessage}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};