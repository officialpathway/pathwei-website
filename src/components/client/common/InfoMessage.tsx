// components/client/common/InfoMessage.tsx
'use client';

import { motion } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';

interface InfoMessageProps {
  message: string;
  subMessage?: string;
  borderColor?: string;
  linkText?: string;
  linkUrl?: string;
}

export const InfoMessage = ({
  message,
  subMessage,
  borderColor = 'border-blue-500',
  linkText,
  linkUrl
}: InfoMessageProps) => {
  
  // Extract the base color from the borderColor class (e.g., 'blue' from 'border-blue-500')
  const baseColor = borderColor.split('-')[1];
  
  // Dynamic classes based on the border color
  const highlightClass = `text-${baseColor}-500`;
  const bgGradientClass = `from-${baseColor}-500/10 to-${baseColor}-900/5`;
  const glowClass = `shadow-[0_0_15px_rgba(var(--${baseColor}-rgb),0.2)]`;
    
  return (
    <div
      className={`
        relative max-w-xs backdrop-blur-md bg-black/60
        rounded-lg overflow-hidden ${borderColor} border
        ${glowClass} text-white shadow-lg
      `}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${bgGradientClass} opacity-40`}></div>
      
      {/* Animated line at top */}
      <motion.div
        className={`h-0.5 bg-${baseColor}-500`}
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
      
      <div className="relative z-10">
        {/* Message header with close button */}
        <div className="flex items-center justify-between p-3 border-b border-gray-700/50">
          <h3 className={`font-medium ${highlightClass}`}>
            {message}
          </h3>
          <button 
            type='button'
            title='close'
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        </div>
        
        {/* Message body */}
        {subMessage && (
          <div className="p-3 text-sm text-gray-300">
            {subMessage}
          </div>
        )}
        
        {/* Call to action */}
        {linkText && linkUrl && (
          <div className="px-3 pb-3">
            <a 
              href={linkUrl}
              className={`
                flex items-center justify-center w-full py-1.5 
                bg-${baseColor}-500/20 hover:bg-${baseColor}-500/30
                rounded text-sm text-${baseColor}-400 font-medium
                transition-colors duration-200
              `}
            >
              {linkText}
              <ArrowRight size={14} className="ml-2" />
            </a>
          </div>
        )}
        
        {/* Animated corner accent */}
        <div 
          className={`
            absolute -bottom-[2px] -right-[2px] w-0 h-0
            border-l-[12px] border-l-transparent
            border-b-[12px] ${borderColor}
          `} 
        />
      </div>
    </div>
  );
}