// components/Particles.tsx
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
      particle.style.width = `${Math.random() * 5 + 2}px`;
      particle.style.height = particle.style.width;
      particle.style.backgroundColor = color;
      particle.style.borderRadius = '50%';
      particle.style.opacity = `${Math.random() * 0.6 + 0.1}`;
      
      // Random position
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      // Animation
      gsap.to(particle, {
        x: `${(Math.random() - 0.5) * 100}px`,
        y: `${(Math.random() - 0.5) * 100}px`,
        duration: Math.random() * 10 + 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      container.appendChild(particle);
    }

    return () => {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, [color, quantity]);

  return <div ref={containerRef} className={className} />;
}