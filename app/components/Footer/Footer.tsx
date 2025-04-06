// components/Footer/CyberpunkFooter.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export const CyberpunkFooter = () => {
  return (
    <footer className="relative bg-black border-t-4 border-neon-pink overflow-hidden">
      {/* Glowing background effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-purple-900/30 to-black/90 z-0" />
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        {/* Giant headline */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center"
        >
          <h2 className="text-[8vw] md:text-[6vw] font-bold text-neon-pink leading-none">
            JOIN THE REVOLUTION
          </h2>
          <p className="text-2xl md:text-3xl text-neon-green mt-6">
            THE FUTURE IS BEING WRITTEN NOW
          </p>
        </motion.div>

        {/* Oversized navigation */}
        <nav className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {[
            { title: 'EXPLORE', links: ['Projects', 'Technology', 'Research', 'Vision'] },
            { title: 'COMPANY', links: ['About', 'Team', 'Careers', 'Press'] },
            { title: 'RESOURCES', links: ['Blog', 'Docs', 'Tutorials', 'API'] },
            { title: 'CONNECT', links: ['Twitter', 'Discord', 'GitHub', 'Email'] },
          ].map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <h3 className="text-neon-yellow text-3xl md:text-4xl font-mono mb-6 border-b-2 border-neon-blue pb-2">
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <Link 
                      href="#" 
                      className="text-white hover:text-neon-cyan text-xl md:text-2xl block transition-colors duration-300"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </nav>

        <div className="inline-block px-6 py-2 border border-neon-purple/50">
            <p className="text-gray-400  text-sm">
              {`> ENGINEERING HUMAN-AI SYMBIOSIS SINCE 2025`}
            </p>
          </div>

        {/* Massive copyright text */}
        <div className="border-t-2 border-neon-purple/50 pt-10">
          <p className="text-center text-6xl md:text-5xl text-neon-pink font-bold">
            © {new Date().getFullYear()} CYBERPUNK INDUSTRIES
          </p>
          <p className="text-center text-[12rem] tracking-widest text-white mt-4">
            FORWARD
          </p>
        </div>
      </div>

      {/* Animated scanning line */}
      <motion.div 
        className="absolute bottom-0 left-0 h-1 bg-neon-cyan w-full"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </footer>
  );
};