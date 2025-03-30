// components/ProblemSection.tsx
'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

export default function ProblemSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scaleImages = useTransform(scrollYProgress, [0, 0.8], [1, 1.2]);

  return (
    <section 
      ref={ref}
      className="relative h-[300vh] bg-black overflow-hidden"
    >
      {/* Animated Background */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y: yBg }}
      >
        <Image
          src="/images/cyberpunk-street.jpg"
          alt="Overwhelming digital world"
          fill
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black/30" />
      </motion.div>

      {/* Sticky Content */}
      <div className="sticky top-0 h-screen flex items-center">
        <div className="container mx-auto px-8 relative z-10">
          {/* Problem 1: Content Overload */}
          <motion.div 
            className="mb-32 max-w-3xl"
            style={{ opacity: opacityText }}
          >
            <h2 className="text-neon-pink text-5xl md:text-7xl font-bold mb-6 glitch-text">
              CONTENT OVERLOAD
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              The algorithm demands <span className="text-neon-cyan">constant creation</span> while 
              drowning you in endless inspiration. You&apos;re stuck between 
              <span className="text-neon-purple"> producing and consuming</span>.
            </p>
          </motion.div>

          {/* Problem 2: Digital Exhaustion */}
          <motion.div 
            className="flex flex-col md:flex-row gap-12 items-center"
            style={{ scale: scaleImages }}
          >
            <div className="relative w-full md:w-1/2 h-96 border-2 border-neon-cyan/50 glow-cyan">
              <Image
                src="/images/notification-hell.jpg"
                alt="Notification overload"
                fill
                className="object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-black px-4 py-2 border border-neon-pink">
                <span className="text-neon-pink font-mono">SYSTEM ALERT: 127 unread</span>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <h3 className="text-neon-green text-3xl mb-4 typewriter">
                {`> DIGITAL EXHAUSTION`}
              </h3>
              <p className="text-gray-400">
                Your tools should <span className="text-neon-yellow">empower</span> you, 
                not drain you. Yet every app fights for attention with 
                <span className="text-neon-red"> endless notifications</span> and 
                <span className="text-neon-red"> context switches</span>.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating "error" elements */}
      <div className="absolute top-1/4 left-10 w-32 h-32 border border-neon-red/50 animate-float">
        <div className="absolute inset-0 bg-neon-red/10 pulse-red" />
        <span className="absolute bottom-full left-0 text-xs text-neon-red font-mono">
          ERROR: 0x7F3A21
        </span>
      </div>
    </section>
  );
}