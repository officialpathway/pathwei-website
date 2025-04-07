/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { motion, useScroll, useTransform, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useEffect, useRef } from "react";
import Lenis from '@studio-freight/lenis';
import { useWindowSize } from '@/app/hooks/useWindowSize';

// Components
import SplineScene from "../common/SplineModel";
import { CyberpunkHeader } from "../Header/CyberpunkHeader";
import Hero from "../Hero/Hero";
import ProductGridSection from "./Grid/ProductGridSection";
import { FeatureComments } from "./FeatureComments";
import VisionSection from './Vision/VisionSection';
import { CyberpunkFooter } from "../Footer/Footer";

/**
 * MainSection - The primary scrolling container for the entire page
 * Features:
 * - Smooth scrolling with Lenis
 * - Interactive 3D tilt effect on video section
 * - Dynamic mask animation on scroll
 * - Mouse tracking for tilt effects
 */
export default function MainSection() {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const videoTriggerRef = useRef<HTMLDivElement>(null);
  
  // Window dimensions
  const { height: windowHeight, width: windowWidth } = useWindowSize();

  // Animation constants
  const TILT_INTENSITY = 20; // Max degrees of tilt from cursor movement
  const INITIAL_Y_ROTATION = 15; // Base rotation on Y axis (degrees)
  const INITIAL_X_ROTATION = 10; // Base rotation on X axis (degrees)

  /* ========== MOUSE TRACKING ========== */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  /* ========== SCROLL ANIMATIONS ========== */
  // Scroll progress for video section (0 at start, 1 at 250vh)
  const { scrollYProgress } = useScroll({
    target: videoTriggerRef,
    offset: ["start -10%", "250vh start"],
  });

  // Mask size animation - grows from small circle to full viewport
  const maskSize = useTransform(
    scrollYProgress,
    [0, 0.6], // Animation range
    [
      // Start size (responsive)
      windowWidth > 800 ? 0.66 * windowHeight : 0.3 * windowHeight,
      // End size (larger than viewport)
      1.5 * windowWidth + 1.5 * windowHeight
    ]
  );
  const maskSizeTemplate = useMotionTemplate`${maskSize}px`;
  
  // Controls when tilt effect should be active (1 = active, 0 = disabled)
  const shouldTilt = useTransform(
    scrollYProgress,
    [0, 0.3], // Range where tilt is active
    [1, 0],   // Output values
    { clamp: true } // Prevent values outside 0-1
  );

  /* ========== TILT ANIMATIONS ========== */
  // Base rotations from cursor position
  const baseRotateY = useTransform(
    mouseX, 
    [0, windowWidth], 
    [-TILT_INTENSITY, TILT_INTENSITY]
  );
  const baseRotateX = useTransform(
    mouseY, 
    [0, windowHeight], 
    [TILT_INTENSITY, -TILT_INTENSITY]
  );

  // Combined rotations (initial + cursor) that respect shouldTilt
  const rotateY = useTransform(
    [baseRotateY, shouldTilt],
    ([rot, tilt]) => (INITIAL_Y_ROTATION * tilt) + (rot * tilt)
  );
  const rotateX = useTransform(
    [baseRotateX, shouldTilt],
    ([rot, tilt]) => (INITIAL_X_ROTATION * tilt) + (rot * tilt)
  );

  // Background overlay opacity
  const opacity = useTransform(scrollYProgress, [0.6, 1], [0, 0.75]);

  /* ========== EFFECTS ========== */
  // Track mouse movement for tilt effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Initialize smooth scrolling with Lenis
  useEffect(() => {
    const lenis = new Lenis();
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  /* ========== RENDER ========== */
  return (
    <main ref={containerRef} className="relative z-50 w-full">
      {/* Spline model */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <SplineScene />
      </div>

      {/* Header */}
      <CyberpunkHeader />

      {/* Hero Section */}
      <div 
        id="hero-section" 
        data-scroll-section
        className="relative z-20 w-full h-[140vh] flex flex-col items-center justify-center overflow-hidden"
      >
        <Hero />
        <div className="relative z-10 w-full h-[40vh]"></div>
      </div>

      {/* Business Features */}
      <div id="features-comments" data-scroll-section className="z-0">
        <FeatureComments />
      </div>
      <div id="empty-div-2" className="relative z-10 w-full h-[40vh]"></div>

      {/* Products Section */}
      <div id="apps-section" data-scroll-section className="z-20">
        <ProductGridSection />
      </div>

      {/* Video Section with Mask Animation */}
      <div className="relative z-30 w-full h-[250vh]" ref={videoTriggerRef} data-scroll-section>
        <h2 className='text-white text-6xl text-center mt-40'>
          The assistant that <span className='text-neon-cyan'>never sleeps</span>.
          <br />
          <span className='text-neon-pink'>Always ready to assist you.</span>
        </h2>

        

        <div className="sticky top-0 h-screen overflow-hidden m-0 p-0">
          <div  style={{ perspective: "1000px" }}>
            <h3 className='text-white text-6xl text-center absolute top-220 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
              The future we envision.
            </h3>
            <motion.div
            style={{
              WebkitMaskSize: maskSizeTemplate,
              maskSize: maskSizeTemplate,
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              transform: "translateZ(0)",
              rotateX,
              rotateY,
              transformOrigin: "center center",
              position: 'relative',
            }}
            className="mask w-full h-full"
          >
            <motion.video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover border-2"
              style={{
                scale: useTransform(scrollYProgress, [0, 0.6], [1.3, 1]),
              }}
            >
              <source src="/videos/aivid.mp4" type="video/mp4" />
            </motion.video>
          </motion.div>
          </div>
          <motion.div 
            style={{ opacity }} 
            className="background absolute inset-0 bg-black z-10" 
          />
        </div>
      </div>
      
      {/* Vision Section */}
      <div id='vision-section' className='z-30 vision-section'>
        <VisionSection />
      </div>

      {/* Footer */}
      <div className='z-30'>
        <CyberpunkFooter />
      </div>
    </main>
  );
}