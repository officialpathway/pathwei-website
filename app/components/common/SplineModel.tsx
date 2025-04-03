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
  const robotRef = useRef<any>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Spline
    const app = new Application(canvasRef.current);
    appRef.current = app;

    app.load('https://prod.spline.design/weA7FtueQOJrQKK7/scene.splinecode')
      .then(() => {
        // Find your robot object - adjust name as needed
        const robot = app.findObjectByName('Bot'); // Spline's object name
        if (!robot) {
          console.error('Robot object not found in Spline scene');
          return;
        }

        robotRef.current = robot;

        // Initial setup
        gsap.set(robot.scale, { x: 1, y: 1, z: 1 });
        gsap.set(robot.position, { x: 1000, y: 0 }); // Adjust initial position as needed

        // Setup scroll animations
        setupScrollAnimations(robot);
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

  const setupScrollAnimations = (robot: any) => {
    // PART 1 Animation
    gsap.timeline({
      scrollTrigger: {
        trigger: "#part1",
        start: "top 60%",
        end: "bottom bottom",
        markers: true,
        scrub: true
      }
    })
    .to(robot.position, { x: 300, y: -100 }, 0)
    .to(robot.scale, { x: 1.5, y: 1.5, z: 1.5 }, 0);

    // PART 2 Animation
    gsap.timeline({
      scrollTrigger: {
        trigger: "#part2",
        start: "top bottom",
        end: "center bottom",
        markers: true,
        scrub: true
      }
    })
    .to(robot.position, { x: -400, y: -250 }, 0)
    .to(robot.rotation, { y: 1.2 }, 0)
    .to(robot.scale, { x: 1.9, y: 1.9, z: 1.9 }, 0);

    // PART 3 Animation
    gsap.timeline({
      scrollTrigger: {
        trigger: "#part3",
        start: "top bottom",
        end: "bottom bottom",
        markers: true,
        scrub: true
      }
    })
    .to(robot.position, { x: 0, y: 0 }, 0)
    .to(robot.rotation, { y: 0 }, 0)
    .to(robot.scale, {x: 0.7, y: 0.7, z: 0.7}, 0);
  };

  return (
    <canvas
      ref={canvasRef}
      id="robot" // Added ID as requested
      className='w-full h-full fixed top-0 left-0 z-10'
    />
  );
}