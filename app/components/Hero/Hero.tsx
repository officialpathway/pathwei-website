'use client';

import { motion } from 'framer-motion';
import Terminal from './Terminal';

export default function Hero() {
  return (
    <section className="relative h-screen w-full flex bg-black overflow-hidden">
      {/* Grid Background */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 2 }}
      >
        <svg 
          className="w-full h-full" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <pattern 
            id="grid-pattern" 
            width="40" 
            height="40" 
            patternUnits="userSpaceOnUse"
          >
            <path 
              d="M 40 0 L 0 0 0 40" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="0.5"
              className="text-neon-cyan"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </motion.div>

      {/* Left Side - Info Block */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="relative z-10 w-1/2 h-full flex flex-col p-8 border-l border-neon-cyan/20"
      >
        {/* Main Content Area */}
        <div className="flex-1 grid grid-cols-2 gap-8 py-8 overflow-y-auto custom-scrollbar content-center">
          {/* Left Info Column */}
          <div className="space-y-8">
            {/* System Status */}
            <div className="p-6 bg-black/50 border border-neon-cyan/20 rounded-lg">
              <h3 className="text-neon-cyan text-2xl font-mono mb-4">SYSTEM_STATUS</h3>
              <div className="space-y-3 font-mono">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-neon-green rounded-full pulse-animation"></span>
                  <span className="text-neon-yellow">BOOT_SEQUENCE:</span>
                  <span className="text-neon-green">COMPLETE</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-neon-purple rounded-full pulse-animation"></span>
                  <span className="text-neon-yellow">SECURITY:</span>
                  <span className="text-neon-pink">LEVEL_5_ENCRYPTED</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-neon-blue rounded-full"></span>
                  <span className="text-neon-yellow">MEMORY_ALLOC:</span>
                  <span className="text-neon-cyan">87.4%</span>
                </div>
              </div>
            </div>

            {/* Neural Interface */}
            <div className="p-6 bg-black/50 border border-neon-purple/20 rounded-lg">
              <h3 className="text-neon-purple text-2xl font-mono mb-4">NEURAL_INTERFACE</h3>
              <p className="text-neon-blue font-mono leading-relaxed">
                <span className="text-neon-green">{`>>`}</span> Direct neural connection established. Cognitive load within safe parameters.
              </p>
              <div className="mt-4 h-2 bg-neon-cyan/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-neon-cyan rounded-full" 
                  style={{ width: '65%' }}
                ></div>
              </div>
              <p className="mt-2 text-neon-cyan/80 font-mono text-sm">SYNC_COMPLETION: 65%</p>
            </div>
          </div>

          {/* Right Info Column */}
          <div className="space-y-8">
            {/* Access Control */}
            <div className="p-6 bg-black/50 border border-neon-green/20 rounded-lg">
              <h3 className="text-neon-green text-2xl font-mono mb-4">ACCESS_CONTROL</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-neon-yellow font-mono">USER:</span>
                  <span className="text-neon-pink font-mono">ADMIN_OVERRIDE</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neon-yellow font-mono">PRIVILEGES:</span>
                  <span className="text-neon-cyan font-mono">ROOT_ACCESS</span>
                </div>
                <button className="w-full mt-6 px-6 py-3 bg-neon-cyan/10 border-2 border-neon-cyan text-neon-cyan font-mono text-lg hover:bg-neon-cyan/20 hover:shadow-glow-cyan transition-all duration-300 flex items-center justify-center gap-2">
                  <span>REQUEST_ELEVATION</span>
                  <span className="text-xl">↑</span>
                </button>
              </div>
            </div>

            {/* System Diagnostics */}
            <div className="p-6 bg-black/50 border border-neon-blue/20 rounded-lg">
              <h3 className="text-neon-blue text-2xl font-mono mb-4">DIAGNOSTICS</h3>
              <div className="font-mono text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-neon-yellow">CPU_LOAD:</span>
                  <span className="text-neon-green">42.7%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neon-yellow">NETWORK:</span>
                  <span className="text-neon-cyan">SECURE_CHANNEL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neon-yellow">LAST_UPDATE:</span>
                  <span className="text-neon-purple">2024-06-15 23:42:18</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Terminal */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="relative z-10 w-1/2 h-full flex items-center justify-center p-8 border-r border-neon-cyan/20"
      >
        <Terminal />
      </motion.div>
    </section>
  );
}