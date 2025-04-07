// components/SystemUI.tsx
'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function SystemUI() {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format time with leading zeros
  const formatTimeSegment = (num: number) => num.toString().padStart(2, '0');
  const hours = formatTimeSegment(currentTime.getHours());
  const minutes = formatTimeSegment(currentTime.getMinutes());
  const seconds = formatTimeSegment(currentTime.getSeconds());
  const timeString = `${hours}:${minutes}:${seconds}`;

  return (
    <>
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center bg-black/80 backdrop-blur-sm border-b border-neon-cyan/20">
        <motion.h1 
          className="text-neon-pink font-mono text-2xl md:text-3xl tracking-widest"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          AI_HAVEN_LABS<span className="text-neon-cyan animate-pulse">_</span>
        </motion.h1>
        
        <motion.div 
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="hidden md:block text-neon-green font-mono text-sm md:text-base">
            SYSTEM_STATUS: <span className="text-neon-blue">ONLINE</span>
          </div>
          <div className="text-neon-purple font-mono text-sm md:text-base">
            {timeString}
          </div>
        </motion.div>
      </div>

      {/* Bottom Left Panel */}
      <motion.div 
        className="fixed bottom-6 left-6 p-4 bg-black/80 backdrop-blur-sm rounded-lg border border-neon-purple/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <div className="text-neon-purple font-mono text-sm md:text-base space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            <div>{`ACCESS_GRANTED`}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-cyan" />
            <div>{`USER: GUEST`}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-pink animate-pulse" />
            <div>{`TERMINAL_READY`}</div>
          </div>
        </div>
      </motion.div>

      {/* Bottom Right Panel */}
      <motion.div 
        className="fixed bottom-6 right-6 p-4 bg-black/80 backdrop-blur-sm rounded-lg border border-neon-cyan/30 text-right"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <div className="text-neon-yellow font-mono text-sm md:text-base space-y-1">
          <div className="flex items-center justify-end gap-2">
            <div>{`NAVIGATION_ACTIVE`}</div>
            <div className="w-2 h-2 rounded-full bg-neon-green" />
          </div>
          <div>{`// CLICK_TO_ACCESS`}</div>
          <div className="text-neon-blue">
            {`// ${currentTime.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            })}`}
          </div>
        </div>
      </motion.div>
    </>
  );
}