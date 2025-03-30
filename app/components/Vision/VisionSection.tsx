// components/VisionSection.tsx
'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function VisionSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);

  return (
    <section ref={ref} className="relative min-h-screen bg-white">
      <motion.div 
        className="h-screen flex items-center justify-center text-center px-4"
        style={{ opacity, scale }}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-7xl md:text-9xl font-bold mb-8 text-black">
            NEW DAWN RISING
          </h2>
          <p className="text-xl md:text-3xl text-gray-800 mb-12">
            Reborn from digital ashes - stronger, smarter, and more human-centric
          </p>
          <div className="border-t-2 border-black pt-8">
            <p className="text-2xl md:text-4xl font-light italic">
              &quot;True innovation survives all catastrophes&quot;
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}