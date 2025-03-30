// app/context/ScreenContext.tsx
'use client';

import { createContext, useState, useContext, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ParticleOverlay } from '@/app/components/common/ParticleOverlay';
import { ANIMATION_PRESETS } from '@/lib/animationPresets';

type AnimationConfig = {
  color?: string;
  opacity?: number;
  duration?: number;
  blur?: string;
  glow?: string;
};

type ScreenContextType = {
  isDarkened: boolean;
  startTransition: (config?: AnimationConfig, options?: { particles?: boolean }) => void;
  resetTransition: () => void;
};

const ScreenContext = createContext<ScreenContextType | undefined>(undefined);

export function ScreenProvider({ children }: { children: ReactNode }) {
  const [transitionState, setTransitionState] = useState({
    isActive: false,
    config: ANIMATION_PRESETS.DARKEN,
    particles: false,
  });

  const startTransition = (config: AnimationConfig = ANIMATION_PRESETS.DARKEN, options: { particles?: boolean } = {}) => {
    setTransitionState({
      isActive: true,
      config: { ...ANIMATION_PRESETS.DARKEN, ...config },
      particles: options.particles || false,
    });
  };

  const resetTransition = () => {
    setTransitionState({
      isActive: false,
      config: ANIMATION_PRESETS.DARKEN,
      particles: false,
    });
  };

  return (
    <ScreenContext.Provider
      value={{
        isDarkened: transitionState.isActive,
        startTransition,
        resetTransition,
      }}
    >
      <ParticleOverlay active={transitionState.particles} />
      <motion.div
        className="fixed inset-0 z-40 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{
          opacity: transitionState.isActive ? transitionState.config.opacity : 0,
          backgroundColor: transitionState.config.color,
          backdropFilter: transitionState.config.blur,
          boxShadow: transitionState.config.glow ? `inset ${transitionState.config.glow}` : 'none',
        }}
        transition={{ duration: transitionState.config.duration / 1000 }}
      />
      {children}
    </ScreenContext.Provider>
  );
}

// Make sure this export is present
export const useScreenContext = () => {
  const context = useContext(ScreenContext);
  if (!context) {
    throw new Error('useScreenContext must be used within a ScreenProvider');
  }
  return context;
};