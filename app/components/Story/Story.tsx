'use client';

import { motion } from 'framer-motion';
import { useScreenContext } from '@/app/context/ScreenContext';
import { useEffect, useRef } from 'react';
import ProblemSection from './Problem/Problem';
import AboutSection from './About';
import VisionSection from './Vision/VisionSection';
import ProductGridSection from './Grid/ProductGridSection';
import DataVizSection from './Graphs/DataVizSection';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function StorySection() {
  const { resetTransition } = useScreenContext();
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const locomotiveScrollRef = useRef<any>(null);

  useEffect(() => {
    const initScroll = async () => {
      const LocomotiveScroll = (await import('locomotive-scroll')).default;
      
      locomotiveScrollRef.current = new LocomotiveScroll({
        el: containerRef.current!,
        smooth: true,
        smartphone: { smooth: true },
        tablet: { smooth: true, breakpoint: 1024 },
        lerp: 0.1
      });

      // Initialize GSAP ScrollTrigger after Locomotive Scroll
      gsap.registerPlugin(ScrollTrigger);
      
      // Refresh ScrollTrigger when everything is loaded
      locomotiveScrollRef.current.on('scroll', () => {
        ScrollTrigger.update();
      });
      
      ScrollTrigger.refresh();

      return () => {
        if (locomotiveScrollRef.current) {
          locomotiveScrollRef.current.destroy();
        }
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    };

    initScroll();
  }, []);

  return (
    <motion.div 
      className="fixed inset-0 z-50 bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button 
        onClick={resetTransition}
        className="fixed top-4 right-4 text-neon-pink hover:text-neon-cyan z-[100]"
      >
        [CLOSE]
      </button>

      <div ref={containerRef} data-scroll-container>
        <div data-scroll-section>
          <AboutSection />
        </div>

        <div id="problem-section" data-scroll-section>
          <ProblemSection />
        </div>

        <div id="vision-section" data-scroll-section>
          <VisionSection />
        </div>

        <div data-scroll-section>
          <DataVizSection />
        </div>

        <div data-scroll-section>
          <ProductGridSection />
        </div>
      </div>
    </motion.div>
  );
}