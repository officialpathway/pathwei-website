'use client';

import { motion, useAnimation } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

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

  const getAreaPath = () => {
    if (width === 0) return '';
    const path = getPath();
    return `${path} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`;
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

        {/* Area fill below graph */}
        <motion.path
          d={getAreaPath()}
          fill="#00f0ff20"
          initial={{ opacity: 0 }}
          animate={isVisible ? { 
            opacity: 1,
            transition: { duration: 1 }
          } : { opacity: 0 }}
        />

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

export default AnimatedGraph;