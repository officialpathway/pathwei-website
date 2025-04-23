'use client';

import { motion, useAnimation } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Particles from '../common/Particles';
import AnimatedGraph from './AnimatedGraph';

export default function DataVizSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          controls.start({
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
          });
        } else {
          setIsVisible(false);
          controls.start({
            opacity: 0,
            y: 20,
            transition: { duration: 0 }
          });
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [controls]);

  return (
    <section ref={ref} className="relative h-screen w-full bg-white flex items-center justify-center lg:justify-start">
      <div className="absolute inset-0 z-0">
        <Particles color="#000000" />
      </div>

      <div className="container mx-auto px-6">
        <div className="flex justify-center lg:justify-start">
          {/* Content container - takes full width on mobile, half on desktop */}
          <div className="w-full lg:w-1/2 max-w-2xl">
            <motion.h2 
              className="text-4xl md:text-6xl font-bold mb-12 text-neon-pink text-center lg:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={controls}
            >
              <span className="text-neon-cyan">AI-Powered</span> Insights
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={controls}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center lg:text-left"
            >
              <p className="text-xl text-gray-800 mb-8">
                Our neural networks process productivity patterns in real-time, adapting to human behavior.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start lg:justify-start justify-center">
                  <span className="text-neon-green mr-3">▹</span>
                  <span className="text-gray-800">87% increase in task completion rates</span>
                </li>
                <li className="flex items-start lg:justify-start justify-center">
                  <span className="text-neon-green mr-3">▹</span>
                  <span className="text-gray-800">3.2x faster decision making with predictive analytics</span>
                </li>
              </ul>
            </motion.div>
            <AnimatedGraph isVisible={isVisible} />
          </div>
        </div>
      </div>
    </section>
  );
}