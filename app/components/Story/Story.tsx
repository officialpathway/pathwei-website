'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useScreenContext } from '@/app/context/ScreenContext';
import { useRef } from 'react';
import ProblemSection from './Problem/Problem';
import AboutSection from './About';
import VisionSection from './Vision/VisionSection';
import ProductGridSection from './Grid/ProductGridSection';
import DataVizSection from './Graphs/DataVizSection';

export default function StorySection() {
  const { resetTransition } = useScreenContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const problemContainerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress through the problem section
  const { scrollYProgress } = useScroll({
    target: problemContainerRef,
    offset: ['start end', 'end end']
  });

  // Animation values
  const problemY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const problemOpacity = useTransform(scrollYProgress, [0.7, 1], [1, 0]);

  return (
    <motion.div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      ref={containerRef}
    >
      {/* Close button */}
      <button 
        type="button"
        onClick={resetTransition}
        className="fixed top-4 right-4 text-neon-pink hover:text-neon-cyan transition-colors z-[100]"
      >
        [CLOSE]
      </button>

      <div className="w-full">
        {/* About Section */}
        <div className="w-full min-h-screen">
          <AboutSection />
        </div>

        {/* Problem Section Container - 3x screen height for scroll effect */}
        <div 
          ref={problemContainerRef} 
          className="relative w-full"
          style={{ height: '300vh' }}
        >
          {/* Sticky Problem Section */}
          <motion.div
            className="w-full min-h-screen sticky top-0 left-0"
            style={{
              y: problemY,
              opacity: problemOpacity
            }}
          >
            <ProblemSection />
          </motion.div>
        </div>

        {/* Vision Section */}
        <div className="w-full min-h-screen">
          <VisionSection />
        </div>

        {/* Data Visualization Section */}
        <div className="w-full min-h-screen">
          <DataVizSection />
        </div>

        {/* Product Grid Section */}
        <div className="w-full min-h-screen">
          <ProductGridSection />
        </div>
      </div>
    </motion.div>
  );
}