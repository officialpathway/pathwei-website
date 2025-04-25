'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Product {
  name: string;
  description: string;
  color: 'neon-cyan' | 'neon-pink' | 'neon-purple' | 'neon-green';
  stats: string;
  icon?: string; // Optional icon name
}

export function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  
  // Enhanced color mapping with additional properties
  const colorMap = {
    'neon-cyan': {
      border: 'border-cyan-400',
      text: 'text-cyan-500',
      bgGradient: 'from-cyan-500/10 to-cyan-900/5',
      glow: 'shadow-[0_0_25px_rgba(34,211,238,0.2)]',
      hoverGlow: 'group-hover:shadow-[0_0_30px_rgba(34,211,238,0.35)]',
      iconColor: 'text-cyan-400',
      buttonBg: 'bg-cyan-500',
      buttonHover: 'hover:bg-cyan-600',
      accentBg: 'bg-cyan-500/20'
    },
    'neon-pink': {
      border: 'border-pink-400',
      text: 'text-pink-500',
      bgGradient: 'from-pink-500/10 to-pink-900/5',
      glow: 'shadow-[0_0_25px_rgba(236,72,153,0.2)]',
      hoverGlow: 'group-hover:shadow-[0_0_30px_rgba(236,72,153,0.35)]',
      iconColor: 'text-pink-400',
      buttonBg: 'bg-pink-500',
      buttonHover: 'hover:bg-pink-600',
      accentBg: 'bg-pink-500/20'
    },
    'neon-purple': {
      border: 'border-purple-400',
      text: 'text-purple-500',
      bgGradient: 'from-purple-500/10 to-purple-900/5',
      glow: 'shadow-[0_0_25px_rgba(168,85,247,0.2)]',
      hoverGlow: 'group-hover:shadow-[0_0_30px_rgba(168,85,247,0.35)]',
      iconColor: 'text-purple-400',
      buttonBg: 'bg-purple-500',
      buttonHover: 'hover:bg-purple-600',
      accentBg: 'bg-purple-500/20'
    },
    'neon-green': {
      border: 'border-green-400',
      text: 'text-green-500',
      bgGradient: 'from-green-500/10 to-green-900/5',
      glow: 'shadow-[0_0_25px_rgba(74,222,128,0.2)]',
      hoverGlow: 'group-hover:shadow-[0_0_30px_rgba(74,222,128,0.35)]',
      iconColor: 'text-green-400',
      buttonBg: 'bg-green-500',
      buttonHover: 'hover:bg-green-600',
      accentBg: 'bg-green-500/20'
    }
  };

  const colors = colorMap[product.color];
  
  // Get base color name for gradient classes
  const baseColor = colors.border.split('-')[1];
  
  // Memoized button click handler
  const handleButtonClick = useCallback(() => {
    if (product.name === "Pathway") {
      window.location.href = "/suite/pathway";
    } else {
      setShowPopup(true);
      // Use requestAnimationFrame for smoother animation
      const timeoutId = setTimeout(() => {
        setShowPopup(false);
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [product.name]);

  // Memoized hover handlers
  const handleHoverStart = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleHoverEnd = useCallback(() => {
    setIsHovered(false);
  }, []);

  // Optimized animation variants
  const scanLineVariants = {
    hidden: { opacity: 0, y: '0%' },
    visible: { 
      y: ['0%', '100%', '0%'],
      opacity: [0, 1, 0],
      transition: { 
        duration: 2, 
        repeat: Infinity, 
        ease: "linear",
        repeatDelay: 0.5
      }
    }
  };

  const dividerVariants = {
    hidden: { scaleX: 0.3, opacity: 0.3 },
    visible: { 
      scaleX: 1, 
      opacity: 1,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    inView: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: { 
      y: -8,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 20,
        mass: 0.8
      }
    }
  };

  return (
    <motion.div
      className={`relative overflow-hidden rounded-lg bg-black/20 backdrop-blur-sm
        border ${colors.border} ${colors.glow} ${colors.hoverGlow}
        transition-shadow duration-300 h-full
        will-change-transform gpu-accelerated group`}
      initial="initial"
      whileInView="inView"
      whileHover="hover"
      variants={containerVariants}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      viewport={{ once: true, margin: "50px" }}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.bgGradient} opacity-40`}></div>
      
      {/* Corner decorations */}
      <div className={`absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 ${colors.border} opacity-80`}></div>
      <div className={`absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 ${colors.border} opacity-80`}></div>
      
      {/* Animated scan line - only render when hovered for performance */}
      {isHovered && (
        <motion.div 
          className={`absolute top-0 left-0 w-full h-1 ${colors.accentBg} will-change-transform`}
          variants={scanLineVariants}
          initial="hidden"
          animate="visible"
        />
      )}
      
      {/* Content container */}
      <div className="relative z-10 p-6 md:p-8 flex flex-col h-full">
        {/* Header area with potential icon */}
        <div className="flex items-start justify-between mb-4">
          <h3 className={`text-2xl md:text-3xl font-bold ${colors.text} group-hover:text-white transition-colors duration-300`}>
            {product.name}
          </h3>
          
          {product.icon && (
            <div className={`${colors.iconColor} text-2xl`}>
              <div className={`w-8 h-8 rounded-full ${colors.accentBg} flex items-center justify-center`}>
                <span className="text-xl">✦</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Description */}
        <p className="text-gray-400 group-hover:text-gray-200 transition-colors duration-300 mb-6 flex-grow">
          {product.description}
        </p>
        
        {/* Stats section with animated divider */}
        <div className="mt-auto pt-4">
          <div className="relative h-px w-full mb-4 overflow-hidden">
            <motion.div 
              className={`absolute inset-0 bg-gradient-to-r from-transparent via-${baseColor}-400 to-transparent will-change-transform`}
              variants={dividerVariants}
              initial="hidden"
              animate={isHovered ? "visible" : "hidden"}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <p className={`text-sm font-medium ${colors.text} group-hover:font-semibold transition-all duration-200`}>
              {product.stats}
            </p>
            
            <motion.button 
              type="button"
              onClick={handleButtonClick}
              className={`px-3 py-1 rounded text-xs font-medium text-white ${colors.buttonBg} ${colors.buttonHover} transition-colors duration-300`}
              initial={{ opacity: 0, y: 10 }}
              animate={isHovered ? 
                { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" }} : 
                { opacity: 0, y: 10, transition: { duration: 0.2, ease: "easeIn" }}
              }
              whileTap={{ scale: 0.95 }}
            >
              Explore
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Diagonal cut corner with optimized animation */}
      <div className={`absolute -bottom-[2px] -right-[2px] w-0 h-0 
        border-l-[24px] border-l-transparent 
        border-b-[24px] ${colors.border} 
        transition-all duration-200 ease-out
        group-hover:border-b-[32px]`} />
        
      {/* Popup notification with AnimatePresence for smooth enter/exit */}
      <AnimatePresence>
        {showPopup && (
          <motion.div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 
                      px-4 py-2 rounded bg-black/80 backdrop-blur-md text-white 
                      border border-gray-500 shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            Not available yet
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}