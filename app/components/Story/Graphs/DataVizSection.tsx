// components/DataVizSection.tsx
'use client';

import { motion, useAnimation } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Particles from '@/app/components/common/Particles';

const AnimatedGraph = ({ isVisible }: { isVisible: boolean }) => {
  const [width, setWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const dataPoints = [20, 45, 60, 35, 80, 55, 90];
  const maxValue = Math.max(...dataPoints);
  const height = 300;
  const padding = 30;

  useEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.offsetWidth);
    }
    
    const handleResize = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isVisible) {
      controls.start({
        pathLength: 1,
        transition: { duration: 1.5, ease: "easeInOut" }
      });
    } else {
      controls.start({
        pathLength: 0,
        transition: { duration: 0 }
      });
    }
  }, [isVisible, controls]);

  const getPath = () => {
    if (width === 0) return '';
    
    let path = `M ${padding} ${height - padding - ((dataPoints[0] / maxValue) * (height - padding * 2))}`;
    
    dataPoints.forEach((point, i) => {
      if (i === 0) return;
      const x = padding + (i * (width - padding * 2)) / (dataPoints.length - 1);
      const y = height - padding - ((point / maxValue) * (height - padding * 2));
      path += ` L ${x} ${y}`;
    });

    return path;
  };

  return (
    <div ref={containerRef} className="w-full h-full">
      <svg 
        width="100%" 
        height={height} 
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((tick, i) => (
          <line
            key={`grid-y-${i}`}
            x1={padding}
            y1={height - padding - (tick * (height - padding * 2))}
            x2={width - padding}
            y2={height - padding - (tick * (height - padding * 2))}
            stroke="#00f0ff20"
            strokeWidth="1"
          />
        ))}

        {/* Graph line */}
        <motion.path
          d={getPath()}
          stroke="#00f0ff"
          strokeWidth="3"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={controls}
        />

        {/* Data points */}
        {dataPoints.map((point, i) => {
          const x = padding + (i * (width - padding * 2)) / (dataPoints.length - 1);
          const y = height - padding - ((point / maxValue) * (height - padding * 2));
          
          return (
            <motion.circle
              key={`point-${i}`}
              cx={x}
              cy={y}
              r={5}
              fill="#ff00f0"
              initial={{ opacity: 0, scale: 0 }}
              animate={isVisible ? { 
                opacity: 1, 
                scale: 1,
                transition: { 
                  delay: 0.5 + (i * 0.15),
                  type: "spring",
                  stiffness: 100
                } 
              } : { opacity: 0, scale: 0 }}
            />
          );
        })}

        {/* Axes */}
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#00f0ff"
          strokeWidth="2"
        />
        <line
          x1={padding}
          y1={height - padding}
          x2={padding}
          y2={padding}
          stroke="#00f0ff"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};

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
            x: 0,
            transition: { duration: 0.6 }
          });
        } else {
          setIsVisible(false);
          controls.start({
            opacity: 0,
            y: 20,
            x: 20,
            transition: { duration: 0 }
          });
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(ref.current);
      }
    };
  }, [controls]);

  return (
    <section ref={ref} className="relative h-screen w-full bg-white flex items-center">

      <div className="container mx-auto px-6">

        {/* Particles Background */}
        <div className="absolute inset-0 z-0">
          <Particles color="#000000" />
        </div>

        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-4xl md:text-6xl font-bold mb-12 text-neon-pink"
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
          >
            <span className="text-neon-cyan">AI-Powered</span> Insights
          </motion.h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={controls}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-xl text-gray-800 mb-8">
                Our neural networks process productivity patterns in real-time, adapting to human behavior.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-neon-green mr-3">▹</span>
                  <span className="text-gray-800">87% increase in task completion rates</span>
                </li>
                <li className="flex items-start">
                  <span className="text-neon-green mr-3">▹</span>
                  <span className="text-gray-800">3.2x faster decision making with predictive analytics</span>
                </li>
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={controls}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-black/10 p-6 border-2 border-neon-purple rounded-lg"
            >
              <AnimatedGraph isVisible={isVisible} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}