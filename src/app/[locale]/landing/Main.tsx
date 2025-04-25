/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { motion, useScroll, useTransform, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useEffect, useRef, useState } from "react";
import Lenis from 'lenis';
import { useWindowSize } from '@/hooks/client/useWindowSize';

// Components
import SplineScene from "@/components/client/common/SplineModel";
import { CyberpunkHeader } from "@/components/client/aihavenlabs/CyberpunkHeader";
import Hero from "./Hero/Hero";
import ProductGridSection from "./Grid/ProductGridSection";
import { FeatureComments } from "./FeatureComments";
import VisionSection from './Vision/VisionSection';
import { CyberpunkFooter } from "@/components/client/aihavenlabs/Footer";

/**
 * MainSection - The primary scrolling container for the entire page
 * Features:
 * - Smooth scrolling with Lenis
 * - Interactive 3D tilt effect on video section (desktop only)
 * - Dynamic mask animation on scroll
 * - Mouse tracking for tilt effects (desktop only)
 */
export default function MainSection() {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const videoTriggerRef = useRef<HTMLDivElement>(null);
  
  // Window dimensions
  const { height: windowHeight, width: windowWidth } = useWindowSize();
  
  // Check if device is desktop (screen width > 1024px)
  const [isDesktop, setIsDesktop] = useState(false);
  
  useEffect(() => {
    setIsDesktop(windowWidth > 1024);
  }, [windowWidth]);

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
    [isDesktop ? 1 : 0, 0],   // Only enable tilt on desktop
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
    (latest: number[]) => (INITIAL_Y_ROTATION * latest[1]) + (latest[0] * latest[1])
  );
  const rotateX = useTransform(
    [baseRotateX, shouldTilt],
    (latest: number[]) => (INITIAL_X_ROTATION * latest[1]) + (latest[0] * latest[1])
  );

  // Background overlay opacity
  const opacity = useTransform(scrollYProgress, [0.6, 1], [0, 0.75]);

  /* ========== EFFECTS ========== */
  // Track mouse movement for tilt effect - only on desktop
  useEffect(() => {
    // Only add mouse tracking on desktop devices
    if (!isDesktop) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isDesktop]);

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
    <main ref={containerRef} className="relative w-full bg-black/95">
      {/* Spline model - now properly behind everything */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <SplineScene />
      </div>

      {/* Content with proper z-index hierarchy */}
      <div className="relative z-10">
        {/* Header */}
        <CyberpunkHeader />

        {/* Hero Section */}
        <div 
          id="hero-section" 
          data-scroll-section
          className="relative w-full h-[100dvh] md:h-[140vh] flex flex-col items-center justify-center overflow-hidden"
        >
          <Hero />
          <div className="relative w-full h-[20vh] md:h-[40vh]"></div>
        </div>

        {/* Business Features */}
        <div id="features-comments" data-scroll-section className="py-10 md:py-20">
          <FeatureComments />
        </div>

        {/* Products Section */}
        <div id="apps-section" data-scroll-section className="py-10 md:py-20">
          <ProductGridSection />
        </div>

        <h2 className='text-white text-6xl text-center mt-40'>
          The assistant that <span className='text-neon-cyan'>never sleeps</span>.
          <br />
          <span className='text-neon-pink'>Always ready to assist you.</span>
        </h2>

        {/* Video Section with Mask Animation */}
      <div className="relative z-30 w-full h-[250vh]" ref={videoTriggerRef} data-scroll-section>
        <div 
          className="sticky top-0 h-screen overflow-hidden m-0 p-0"
          style={{ perspective: isDesktop ? "1000px" : "none" }}
        >
          <motion.div
            style={{
              WebkitMaskSize: maskSizeTemplate,
              maskSize: maskSizeTemplate,
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              transform: "translateZ(0)",
              rotateX: isDesktop ? rotateX : 0,
              rotateY: isDesktop ? rotateY : 0,
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
        
        {/* Vision Section */}
        <div id='vision-section' className='vision-section'>
          <VisionSection />
        </div>

        {/* Footer */}
        <div>
          <CyberpunkFooter />
        </div>
      </div>
    </main>
  );
}