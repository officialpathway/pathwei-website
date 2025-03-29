'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TerminalButton from './TerminalButton';

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Auto-play video when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log("Autoplay prevented:", e));
    }

    // Glitch effect on title
    const glitchInterval = setInterval(() => {
      if (titleRef.current) {
        titleRef.current.style.textShadow = `0 0 10px rgba(${
          Math.floor(Math.random() * 255)
        }, ${
          Math.floor(Math.random() * 255)
        }, ${
          Math.floor(Math.random() * 255)
        }, 1)`;
        
        setTimeout(() => {
          if (titleRef.current) {
            titleRef.current.style.textShadow = '0 0 20px #0ff, 0 0 40px #0ff';
          }
        }, 100);
      }
    }, 3000);

    // Scanline effect
    gsap.to(overlayRef.current, {
      backgroundPosition: '0 100%',
      duration: 5,
      repeat: -1,
      ease: 'none'
    });

    // Fade out on scroll
    ScrollTrigger.create({
      trigger: videoRef.current,
      start: 'top top',
      end: 'bottom top',
      onLeave: () => {
        gsap.to(videoRef.current, { opacity: 0, duration: 1 });
      },
      onEnterBack: () => {
        gsap.to(videoRef.current, { opacity: 1, duration: 1 });
      }
    });

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/cyberpunk-city-loop.mp4" type="video/mp4" />
        {/* Fallback image */}
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Scanlines Overlay */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(
            rgba(0, 255, 255, 0.1) 1px, 
            transparent 1px
          )`,
          backgroundSize: '100% 3px',
          mixBlendMode: 'overlay'
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
        <h1 
          ref={titleRef}
          className="text-6xl md:text-8xl font-bold mb-4 text-neon-cyan tracking-tighter"
          style={{
            textShadow: '0 0 20px #0ff, 0 0 40px #0ff',
            fontFamily: "'Rajdhani', sans-serif"
          }}
        >
          AI HAVEN LABS
        </h1>
        
        <p 
          ref={subtitleRef}
          className="text-xl md:text-3xl text-neon-pink mb-8 typewriter"
        >
          {`>_ SYSTEM INITIALIZED`}
        </p>
        
        <TerminalButton />
      </div>

      {/* Scrolling Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce w-6 h-10 border-2 border-neon-green rounded-full flex justify-center">
          <div className="w-1 h-2 bg-neon-green rounded-full mt-2" />
        </div>
      </div>
    </section>
  );
}