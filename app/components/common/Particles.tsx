'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function Particles({ 
  color = "#ffffff", 
  quantity = 50,
  className = "" 
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create particles
    for (let i = 0; i < quantity; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.width = `${Math.random() * 8 + 2}px`;
      particle.style.height = particle.style.width;
      particle.style.backgroundColor = color;
      particle.style.borderRadius = '50%';
      particle.style.opacity = `${Math.random() * 0.8 + 0.2}`;
      
      // Random starting position
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      particle.style.left = `${startX}%`;
      particle.style.top = `${startY}%`;
      
      // Random movement parameters
      const moveX = (Math.random() - 0.5) * 200;
      const moveY = (Math.random() - 0.5) * 200;
      const duration = Math.random() * 15 + 10;
      const delay = Math.random() * 5;
      const scaleVariation = Math.random() * 0.5 + 0.8;
      const opacityVariation = Math.random() * 0.3;

      // Animation timeline
      const tl = gsap.timeline({ 
        repeat: -1,
        yoyo: true,
        delay: delay
      });

      // Complex movement path
      tl.to(particle, {
        x: `${moveX}px`,
        y: `${moveY}px`,
        duration: duration,
        ease: "sine.inOut"
      })
      .to(particle, {
        x: `${moveX * 0.7}px`,
        y: `${moveY * 1.3}px`,
        duration: duration * 0.7,
        ease: "power1.inOut"
      }, 0)
      .to(particle, {
        scale: scaleVariation,
        opacity: `+=${opacityVariation}`,
        duration: duration * 0.5,
        yoyo: true,
        repeat: 1,
        ease: "sine.inOut"
      }, 0);

      // Random flickering effect
      if (Math.random() > 0.7) {
        gsap.to(particle, {
          opacity: Math.random() * 0.5 + 0.3,
          duration: Math.random() * 2 + 1,
          repeat: -1,
          yoyo: true,
          ease: "rough({ template: none.out, strength: 1, points: 20, taper: 'none', randomize: true, clamp: false})"
        });
      }

      container.appendChild(particle);
    }

    return () => {
      if (container) {
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
      }
    };
  }, [color, quantity]);

  return <div ref={containerRef} className={className} />;
}