"use client";

import { ReactNode, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export interface ContentSectionProps {
  title: string;
  descriptions: string[];
  visual: ReactNode;
  textSide?: 'left' | 'right';
  bgGradient?: string;
  additionalContent?: ReactNode;
  animationVariant?: 'fade' | 'slide' | 'scale' | 'stagger';
  once?: boolean;
  amount?: number;
  delay?: number;
}

const ContentSection: React.FC<ContentSectionProps> = ({ 
  title,
  descriptions,
  visual,
  textSide = 'left',
  bgGradient = 'from-indigo-50 to-purple-50',
  additionalContent,
  animationVariant = 'fade',
  once = true,
  amount = 0.3,
  delay = 0,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once, amount });
  
  // Animation variants
  const getAnimationProps = () => {
    switch(animationVariant) {
      case 'slide':
        return {
          initial: { opacity: 0, y: 30 },
          animate: isInView ? { opacity: 1, y: 0 } : {},
          transition: { duration: 0.6, delay }
        };
      case 'scale':
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: isInView ? { opacity: 1, scale: 1 } : {},
          transition: { duration: 0.5, delay }
        };
      case 'stagger':
        return {
          initial: { opacity: 0 },
          animate: isInView ? { opacity: 1 } : {},
          transition: { duration: 0.6, delay, staggerChildren: 0.1 }
        };
      case 'fade':
      default:
        return {
          initial: { opacity: 0 },
          animate: isInView ? { opacity: 1 } : {},
          transition: { duration: 0.6, delay }
        };
    }
  };

  // Child animation for stagger effect
  const childAnimation = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  };
  
  return (
    <div ref={sectionRef} className="max-w-4xl mx-auto mb-24">
      <motion.div
        {...getAnimationProps()}
        className={`flex flex-col ${textSide === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8`}
      >
        {/* Visual content */}
        <div className="w-full md:w-1/2 mb-6 md:mb-0 bg-gradient-to-br rounded-2xl p-6" style={{ backgroundImage: `var(--tw-gradient-${bgGradient})` }}>
          <div className="relative">
            {visual}
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-purple-500/20 z-0" />
            <div className="absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-indigo-500/20 z-0" />
          </div>
        </div>
        
        {/* Text content */}
        <div className="w-full md:w-1/2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: delay + 0.3 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
            
            {descriptions.map((description, i) => (
              <p key={i} className="text-gray-700 mb-4 last:mb-0">
                {description}
              </p>
            ))}
            
            {additionalContent && (
              <motion.div
                initial={animationVariant === 'stagger' ? childAnimation.initial : undefined}
                animate={isInView && animationVariant === 'stagger' ? childAnimation.animate : undefined}
                transition={animationVariant === 'stagger' ? childAnimation.transition : undefined}
                className="mt-6"
              >
                {additionalContent}
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContentSection;