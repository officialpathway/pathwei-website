"use client";

import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import { useEffect, useRef } from "react";
import SplineScene from "../common/SplineModel";
import { CyberpunkHeader } from "../Header/CyberpunkHeader";
import Hero from "../Hero/Hero";
import Lenis from '@studio-freight/lenis';
import ProductGridSection from "./Grid/ProductGridSection";
import Particles from "../common/Particles";
import { FeatureComments } from "./FeatureComments";
import VisionSection from './Vision/VisionSection';
import { useWindowSize } from '@/app/hooks/useWindowSize';
import Terminal from '../Hero/Terminal';
import { TeamSection } from './Team/Team';
import { CyberpunkFooter } from "../Footer/Footer";

export default function MainSection() {
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

  // Initialize Lenis for smooth scrolling
  useEffect(() => {
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
    <main ref={containerRef} className="relative z-50 w-full">
      {/* Particles Background */}
      <div className="absolute inset-0 z-0">
        <Particles color="#ffffff" />
      </div>

      {/* Background Model - positioned absolutely behind everything */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <SplineScene />
      </div>

      {/* Header - positioned above the model */}
      <CyberpunkHeader />

      {/* Hero Section - positioned above the model but below header if needed */}
      <div 
        id="hero-section" 
        data-scroll-section
        className="relative z-20 w-full h-[140vh] flex flex-col items-center justify-center overflow-hidden"
      >
        <Hero />

        {/* Empty white div for creating space */}
        <div className="relative z-10 w-full h-[40vh]"></div>
      </div>

      {/* Empty white div for creating space */}
      <div id="empty-div" className="relative z-10 w-full h-[40vh]"></div>

      {/* Business Features */}
      <div 
        id="features-comments" 
        data-scroll-section
        className="z-0"
      >
        <FeatureComments />
      </div>

      {/* Empty white div for creating space */}
      <div id="empty-div-2" className="relative z-10 w-full h-[40vh]"></div>

      {/* Apps Section */}
      <div 
        id="apps-section" 
        data-scroll-section
        className="z-20"
      >
        <ProductGridSection />
      </div>

      <div 
        className="relative w-full h-[250vh]" 
        ref={visionTriggerRef} 
        data-scroll-section
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          <motion.div
            style={{
              WebkitMaskSize: maskSizeTemplate,
              maskSize: maskSizeTemplate,
            }}
            className="mask w-full h-full"
          >
            <motion.video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover"
              style={{
                scale: useTransform(scrollYProgress, [0, 0.6], [1.3, 1]), // Zoom from 1.3x to 1x
                transformOrigin: "center center"
              }}
            >
              <source src="/videos/aivid.mp4" type="video/mp4" />
              Your browser does not support HTML5 video.
            </motion.video>
          </motion.div>
          <motion.div 
            style={{ opacity }} 
            className="background absolute inset-0 bg-black z-10" 
          />
        </div>
      </div>
      
      {/* Vision section */}
      <VisionSection />

      {/* Team members */}
      <TeamSection />

      {/* Terminal */}
      <div className="z-30 bg-white pb-20">
        <Terminal />
      </div>

      {/* Footer - positioned at the bottom of the page */}
      <div>
        <CyberpunkFooter />
      </div>
    </main>
  );
}