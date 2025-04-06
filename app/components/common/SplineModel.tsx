// components/common/SplineScene.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useRef } from 'react';
import { Application } from '@splinetool/runtime';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SplineScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<Application | null>(null);
  const bubbleRef = useRef<any>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Spline
    const app = new Application(canvasRef.current);
    appRef.current = app;

    app.load('https://prod.spline.design/xhHnzdjddftsDiQ8/scene.splinecode')
      .then(() => {
        // Find your bubble object - adjust name as needed
        const bubble = app.findObjectByName('Platinum'); // Spline's object name
        if (!bubble) {
          console.error('Bubble object not found in Spline scene');
          return;
        }

        bubbleRef.current = bubble;

        // Initial setup
        gsap.set(bubble.scale, { x: 2, y: 2, z: 2 });
        gsap.set(bubble.position, { x: 0, y: 0, z: 0 }); // Adjust initial position as needed

        // Setup scroll animations
        setupScrollAnimations(bubble);
      })
      .catch(error => {
        console.error('Error loading Spline scene:', error);
      });

    return () => {
      // Cleanup
      ScrollTrigger.getAll().forEach(t => t.kill());
      if (appRef.current) {
        appRef.current = null;
      }
    };
  }, []);

  const setupScrollAnimations = (bubble: any) => {
    // PART 1 Animation
    gsap.timeline({
      scrollTrigger: {
        trigger: "#hero-section",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      }
    })
    .to(bubble.position, { y: -200, }, 0)
    .to(bubble.scale, { x: 1.5, y: 1.5, z: 1.5 }, 0);

    // PART 2 Animation
    gsap.timeline({
      scrollTrigger: {
        trigger: "#empty-div",
        start: "top bottom",
        end: "bottom bottom",
        scrub: true
      }
    })
    .to(bubble.position, { y: 50 }, 0)

    // PART 2 Animation
    gsap.timeline({
      scrollTrigger: {
        trigger: "#empty-div-2",
        start: "top center",
        end: "bottom top",
        scrub: true,
      }
    })
    .to(bubble.position, { y: 900 }, 0)
  };

  return (
    <canvas
      ref={canvasRef}
      id="robot" // Added ID as requested
      className='w-full h-full fixed top-0 left-0 z-10'
    />
  );
}