'use client';

import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import { useScreenContext } from '@/app/context/ScreenContext';
import { useEffect, useRef } from 'react';
import ProblemSection from './Problem/Problem';
import VisionSection from './Vision/VisionSection';
import ProductGridSection from './Grid/ProductGridSection';
import DataVizSection from './Graphs/DataVizSection';
import { useWindowSize } from '@/app/hooks/useWindowSize';
import Lenis from '@studio-freight/lenis';
import { TeamSection } from './Team/Team';
import SplineScene from '../common/SplineModel';

export default function StorySection() {
  const { resetTransition } = useScreenContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const visionTriggerRef = useRef<HTMLDivElement>(null);
  const { height: windowHeight, width: windowWidth } = useWindowSize();

  // Scroll animation for the mask transition
  const { scrollYProgress } = useScroll({
    target: visionTriggerRef,
    offset: ["start start", "250vh start"] // Changed to match working example
  });

  const maskSize = useTransform(
    scrollYProgress,
    [0, 0.6], // Reverted to original working values
    [
      windowWidth > 800 ? 0.66 * windowHeight : 0.3 * windowHeight,
      1.5 * windowWidth + 1.5 * windowHeight
    ]
  );
  const maskSizeTemplate = useMotionTemplate`${maskSize}px`;
  
  const opacity = useTransform(scrollYProgress, [0.6, 1], [0, 0.75]);

  useEffect(() => {
    // Replace Locomotive Scroll with Lenis (from working example)
    const lenis = new Lenis();
    
    let rafId: number;

    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <motion.div 
      className="relative z-50 bg-black w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        type='button' 
        onClick={resetTransition}
        className="fixed top-4 right-4 text-neon-pink hover:text-neon-cyan z-[100]"
      >
        [CLOSE]
      </button>
  
      {/* Spline Model */}
      <SplineScene />

      <div ref={containerRef} className="relative">
  
        {/* Rest remains exactly the same */}
        <div id="problem-section" data-scroll-section>
          <ProblemSection />
        </div>
  
        <div 
          className="relative w-full h-[250vh]" 
          ref={visionTriggerRef} 
          data-scroll-section
        >
          <div className="sticky">
            <motion.div
              style={{
                WebkitMaskSize: maskSizeTemplate,
                maskSize: maskSizeTemplate,
              }}
              className="mask"
            >
              <VisionSection />
            </motion.div>
            <motion.div style={{ opacity }} className="ackground absolute inset-0 bg-black z-10" />
          </div>
        </div>
  
        <div id='part1' data-scroll-section>
          <DataVizSection />
        </div>
  
        <div id='part2' data-scroll-section>
          <ProductGridSection />
        </div>

        <div id='part3' data-scroll-section>
          <TeamSection />
        </div>
      </div>
    </motion.div>
  );
}