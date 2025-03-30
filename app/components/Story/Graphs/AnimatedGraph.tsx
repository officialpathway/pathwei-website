// components/AnimatedGraph.tsx
'use client';

import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';

export default function AnimatedGraph() {
  const controls = useAnimation();

  useEffect(() => {
    const animateGraph = async () => {
      await controls.start({
        pathLength: 1,
        transition: { duration: 2, ease: "easeInOut" }
      });
    };
    animateGraph();
  }, [controls]);

  // Sample data points for the graph
  const dataPoints = [20, 45, 60, 35, 80, 55, 90];
  const maxValue = Math.max(...dataPoints);
  const width = 500;
  const height = 300;
  const padding = 30;

  // Calculate SVG path
  const getPath = () => {
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
    <div className="w-full h-full">
      <svg 
        width="100%" 
        height="100%" 
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
              animate={{ 
                opacity: 1, 
                scale: 1,
                transition: { delay: i * 0.2 } 
              }}
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
}