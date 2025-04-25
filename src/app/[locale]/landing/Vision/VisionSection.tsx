'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function VisionSection() {
  const t = useTranslations('aihavenlabs.landingPage.visionSection');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    const section = document.getElementById('vision-section');
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  // Animation variants
  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const subtitleVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.8, 
        delay: 0.3,
        ease: "easeOut"
      }
    }
  };

  const quoteVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.9, 
        delay: 0.6,
        ease: "easeOut"
      }
    }
  };

  const lineVariants = {
    hidden: { width: "0%" },
    visible: { 
      width: "100%",
      transition: { 
        duration: 1.2, 
        delay: 0.4,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <section 
      id="vision-section"
      className="relative min-h-screen w-full bg-gradient-to-b from-white to-gray-50 overflow-hidden py-16"
    >

      {/* Content */}
      <div className="relative z-10 h-full w-full flex items-center justify-center text-center px-4 py-16">
        <div className="max-w-6xl mx-auto p-6 md:p-12">
          <motion.div
            className="space-y-16"
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
          >
            {/* Main title with reveal animation */}
            <motion.h2 
              className="text-6xl sm:text-7xl md:text-8xl font-bold mb-6 text-black tracking-tight leading-none"
              variants={titleVariants}
            >
              {t('title')}
            </motion.h2>
            
            {/* Subtitle with fade animation */}
            <motion.p 
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-800 mb-16 max-w-4xl mx-auto"
              variants={subtitleVariants}
            >
              {t('subtitle')}
            </motion.p>
            
            {/* Animated divider line */}
            <div className="relative h-px w-full max-w-4xl mx-auto mb-16">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-black to-transparent"
                variants={lineVariants}
              />
            </div>
            
            {/* Quote with scale animation */}
            <motion.div 
              className="pt-8 max-w-4xl mx-auto"
              variants={quoteVariants}
            >
              <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light italic text-gray-900 leading-relaxed">
                &quot;{t('quote')}&quot;
              </p>
              <p className="mt-6 text-lg text-gray-700">
                {t('quoteAuthor')}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}