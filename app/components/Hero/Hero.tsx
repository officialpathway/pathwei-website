'use client';

import { motion } from 'framer-motion';
import Terminal from './Terminal';
import { NeonButton } from '../common/NeonButton';
import { Sparkline } from '../common/Sparkline';
import { InfoMessage } from '../common/InfoMessage';

export default function Hero() {
  return (
    <section className="relative min-h-screen lg:h-screen w-full bg-black p-2 sm:p-4">
      {/* Grid Background */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 2 }}
      >
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-neon-cyan"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </motion.div>

      {/* Corner grid lines - responsive sizes */}
      <div className="absolute top-2 left-2 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 border-t-2 border-l-2 border-white opacity-30"></div>
      <div className="absolute top-2 right-2 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 border-t-2 border-r-2 border-white opacity-30"></div>
      <div className="absolute bottom-2 left-2 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 border-b-2 border-l-2 border-white opacity-30"></div>
      <div className="absolute bottom-2 right-2 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 border-b-2 border-r-2 border-white opacity-30"></div>

      {/* Responsive Grid - 4x1 on mobile, 2x2 on desktop */}
      <div className="relative z-10 h-full w-full grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-2 sm:gap-4 auto-rows-fr">
        
        {/* Module 1: Welcome Message with Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-black/70 border border-neon-cyan/20 rounded-lg p-4 sm:p-5 flex flex-col items-center justify-center text-center"
        >
          {/* Pulsing Logo Indicator */}
          <div className="flex flex-col items-center mb-4">
            <div className="w-3 h-3 bg-neon-cyan rounded-full pulse-animation mb-2"></div>
            <h3 className="text-neon-cyan text-xl sm:text-4xl font-mono tracking-wider">AI HAVEN LABS</h3>
          </div>

          {/* Centered Mission Statement */}
          <p className="text-white/90 text-sm mb-5 max-w-[240px]">
            Augmenting human potential through ethical AI tools
          </p>

          {/* Stats Grid - Centered */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-xs">
            {/* Stat 1 */}
            <div className="bg-black/40 border border-neon-green/20 rounded p-2">
              <p className="text-neon-green text-xl mb-1">500+</p>
              <p className="text-white/80 text-xxs uppercase tracking-wider">Creators</p>
            </div>
            
            {/* Stat 2 */}
            <div className="bg-black/40 border border-neon-purple/20 rounded p-2">
              <p className="text-neon-purple text-xl mb-1">2</p>
              <p className="text-white/80 text-xxs uppercase tracking-wider">AI Models</p>
            </div>
            
            {/* Stat 3 */}
            <div className="bg-black/40 border border-neon-cyan/20 rounded p-2">
              <p className="text-neon-cyan text-xl mb-1">2025</p>
              <p className="text-white/80 text-xxs uppercase tracking-wider">Founded</p>
            </div>
            
            {/* Stat 4 */}
            <div className="bg-black/40 border border-neon-yellow/20 rounded p-2">
              <p className="text-neon-yellow text-xl mb-1">24 / 7</p>
              <p className="text-white/80 text-xxs uppercase tracking-wider">Support</p>
            </div>
          </div>

          {/* Deployment Badge */}
          <div className="mt-4 px-3 py-1 bg-neon-cyan/10 border border-neon-cyan/30 rounded-full">
            <p className="text-neon-cyan text-xxs font-mono tracking-wider">
              v3.2.1 • LIVE
            </p>
          </div>
        </motion.div>

        {/* Module 2: Performance Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-black/70 border border-neon-blue/20 rounded-lg p-4 flex flex-col"
        >
          {/* Header with Live Indicator */}
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-neon-blue text-lg font-mono">SYSTEM PERFORMANCE</h3>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-neon-green rounded-full pulse-animation"></span>
              <span className="text-neon-green text-xxs font-mono">LIVE</span>
            </div>
          </div>

          {/* Graph Grid */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            {/* User Growth Sparkline */}
            <div className="col-span-2 bg-black/30 border border-neon-purple/10 rounded p-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-neon-yellow text-xxs font-mono">USER GROWTH</span>
                <span className="text-neon-green text-xs font-mono">+24%</span>
              </div>
              <div className="h-12 w-full">
                <Sparkline data={[5, 15, 22, 19, 30, 42, 48, 55]} color="#34d399" />
              </div>
            </div>

            {/* Mini Stats */}
            <div className="bg-black/30 border border-neon-cyan/10 rounded p-2">
              <p className="text-neon-cyan text-xs font-mono mb-1">MODEL ACCURACY</p>
              <p className="text-white text-lg font-mono">98.2%</p>
              <div className="h-1 mt-1 bg-neon-cyan/10 rounded-full">
                <div className="h-full bg-neon-cyan rounded-full" style={{ width: '98%' }}></div>
              </div>
            </div>

            <div className="bg-black/30 border border-neon-pink/10 rounded p-2">
              <p className="text-neon-pink text-xs font-mono mb-1">API REQUESTS</p>
              <p className="text-white text-lg font-mono">1.4M</p>
              <div className="h-1 mt-1 bg-neon-pink/10 rounded-full">
                <div className="h-full bg-gradient-to-r from-neon-pink to-neon-purple rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>

          {/* Status Bars */}
          <div className="space-y-2 mt-auto">
            <div className="flex justify-between text-xxs font-mono">
              <span className="text-neon-yellow">SYSTEM LOAD</span>
              <span className="text-neon-green">OPTIMAL</span>
            </div>
            <div className="h-1.5 w-full bg-neon-blue/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-neon-blue to-neon-cyan rounded-full" 
                style={{ width: '65%' }}
              ></div>
            </div>
            
            <div className="flex justify-between text-xxs font-mono">
              <span className="text-neon-yellow">DATA PROCESSING</span>
              <span className="text-neon-green">3.2TB/DAY</span>
            </div>
            <div className="h-1.5 w-full bg-neon-green/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-neon-green to-neon-cyan rounded-full" 
                style={{ width: '82%' }}
              ></div>
            </div>
          </div>
        </motion.div>

        {/* Module 3: Access Control */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="bg-black/70 border border-neon-green rounded-lg p-4 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-neon-green rounded-full pulse-animation"></div>
              <h3 className="text-neon-green text-lg font-mono">SYSTEM ACCESS</h3>
            </div>
            <span className="text-neon-red text-xs font-mono px-2 py-1 bg-neon-red border border-neon-red rounded">
              AWAITING AUTH
            </span>
          </div>

          {/* Info Message */}
          <InfoMessage 
            message="Initiate sequence to unlock full terminal access"
            subMessage="This will grant you control over all AI systems and visualization tools"
            icon="⚠️"
            borderColor="green"
          />

          {/* Access Status */}
          <div className="font-mono text-xs space-y-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-neon-yellow">CURRENT ACCESS:</span>
              <span className="text-neon-pink">GUEST (READ-ONLY)</span>
            </div>
            <div className="h-1.5 w-full bg-neon-purple rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-neon-purple to-neon-cyan rounded-full" 
                style={{ width: '25%' }}
              ></div>
            </div>
            <p className="text-neon-green text-xxs text-right">
              Requires elevation to continue
            </p>
          </div>

          {/* CTA Section */}
          <div className="mt-auto space-y-3 flex flex-col items-center">
            <div className="relative">
              <NeonButton 
                glowColor="cyan" 
                onClick={() => console.log("Init sequence started")}
                className="py-3 text-sm px-8"
              >
                INITIATE SYSTEM ACCESS
              </NeonButton>
              <div className="absolute -top-2 -right-2 text-neon-yellow text-xs">
                ▼
              </div>
            </div>

            <p className="text-neon-green text-xxs text-center font-mono">
              [ Secure connection guaranteed ]
            </p>
          </div>
        </motion.div>

        {/* Module 4: Terminal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="bg-black/70 border border-neon-purple/20 rounded-lg p-2 flex flex-col"
        >
          <div className="flex-1 min-h-[120px] sm:min-h-0"> {/* Minimum height for mobile */}
            <Terminal compactMode={true} />
          </div>
          <div className="text-neon-purple text-xxs sm:text-xs font-mono mt-1 text-right">
            TERMINAL_ACTIVE
          </div>
        </motion.div>

      </div>
    </section>
  );
}