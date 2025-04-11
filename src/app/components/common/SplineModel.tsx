/* eslint-disable @typescript-eslint/no-explicit-any */
// components/common/SplineScene.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { Application } from '@splinetool/runtime';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SplineScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<Application | null>(null);
  const bubbleRef = useRef<any>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Spline
    const app = new Application(canvasRef.current);
    appRef.current = app;

    app.load('https://prod.spline.design/xhHnzdjddftsDiQ8/scene.splinecode')
      .then(() => {
        const bubble = app.findObjectByName('Platinum');
        if (!bubble) {
          console.error('Bubble object not found in Spline scene');
          return;
        }

        bubbleRef.current = bubble;
        setIsLoaded(true);
      })
      .catch(error => {
        console.error('Error loading Spline scene:', error);
      });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
      if (appRef.current) {
        appRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || !bubbleRef.current) return;

    // Set initial state and animations only after everything is loaded
    const initialScale = isMobile ? 0.5 : 2;
    const initialYPosition = 0;

    gsap.set(bubbleRef.current.scale, { 
      x: initialScale, 
      y: initialScale, 
      z: initialScale,
      overwrite: 'auto' // Ensure this setting overrides any existing values
    });
    
    gsap.set(bubbleRef.current.position, { 
      x: 0, 
      y: initialYPosition, 
      z: 0,
      overwrite: 'auto'
    });

    setupScrollAnimations(bubbleRef.current, isMobile);

  }, [isLoaded, isMobile]); // Re-run when loading state or mobile state changes

  const setupScrollAnimations = (bubble: any, isMobile: boolean) => {
    // Kill any existing ScrollTriggers to prevent duplicates
    ScrollTrigger.getAll().forEach(t => t.kill());

    const part1Y = isMobile ? -100 : -200;
    const part1Scale = isMobile ? 0.25 : 1;
    const part2Y = isMobile ? 25 : 50;
    const part3Y = 800;

    // PART 1 Animation
    gsap.timeline({
      scrollTrigger: {
        trigger: "#hero-section",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        markers: false // Set to true for debugging
      }
    })
    .to(bubble.position, { y: part1Y }, 0)
    .to(bubble.scale, { 
      x: part1Scale, 
      y: part1Scale, 
      z: part1Scale,
      overwrite: 'auto'
    }, 0);

    // PART 2 Animation
    gsap.timeline({
      scrollTrigger: {
        trigger: "#features-comments",
        start: "top bottom",
        end: "top 20%",
        scrub: true
      }
    })
    .to(bubble.position, { y: part2Y, overwrite: 'auto' }, 0)

    // PART 3 Animation
    gsap.timeline({
      scrollTrigger: {
        trigger: "#apps-section",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      }
    })
    .to(bubble.position, { y: part3Y, overwrite: 'auto' }, 0)
  };

  return (
      <>
        <canvas
          ref={canvasRef}
          id="robot"
          className='w-full h-full fixed top-0 left-0 z-10 pointer-events-none'
        />
      </>
  );
}