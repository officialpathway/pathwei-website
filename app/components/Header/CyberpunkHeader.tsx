// components/Header/CyberpunkHeader.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { NeonButton } from '../common/NeonButton';
import { useState } from 'react';

export const CyberpunkHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-sm border-b border-neon-blue/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center"
            >
              <div className="w-3 h-3 bg-neon-cyan rounded-full mr-2 pulse-animation"></div>
              <span className="text-neon-cyan font-mono text-lg sm:text-xl font-bold tracking-wider">
                AI HAVEN LABS
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/about" 
              className="text-neon-purple hover:text-neon-cyan font-mono text-sm transition-colors duration-300"
            >
              ABOUT
            </Link>
            <Link 
              href="/labs" 
              className="text-neon-green hover:text-neon-cyan font-mono text-sm transition-colors duration-300"
            >
              LABS
            </Link>
            <Link 
              href="/research" 
              className="text-neon-pink hover:text-neon-cyan font-mono text-sm transition-colors duration-300"
            >
              RESEARCH
            </Link>
            <NeonButton 
              glowColor="cyan" 
              className="ml-4 text-xs sm:text-sm"
              onClick={() => console.log('Access requested')}
            >
              REQUEST ACCESS
            </NeonButton>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            type='button'
            title='menu'
            className="md:hidden text-neon-cyan focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="w-6 flex flex-col items-end space-y-1.5">
              <span className={`block h-0.5 bg-neon-cyan transition-all duration-300 ${menuOpen ? 'w-6 rotate-45 translate-y-2' : 'w-6'}`}></span>
              <span className={`block h-0.5 bg-neon-cyan transition-all duration-300 ${menuOpen ? 'opacity-0' : 'w-4'}`}></span>
              <span className={`block h-0.5 bg-neon-cyan transition-all duration-300 ${menuOpen ? 'w-6 -rotate-45 -translate-y-2' : 'w-5'}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: menuOpen ? 1 : 0,
            height: menuOpen ? 'auto' : 0
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="flex flex-col space-y-3 py-4 border-t border-neon-blue/20">
            <Link 
              href="/about" 
              className="text-neon-purple hover:text-neon-cyan font-mono text-sm px-2 py-1"
              onClick={() => setMenuOpen(false)}
            >
              ABOUT
            </Link>
            <Link 
              href="/labs" 
              className="text-neon-green hover:text-neon-cyan font-mono text-sm px-2 py-1"
              onClick={() => setMenuOpen(false)}
            >
              LABS
            </Link>
            <Link 
              href="/research" 
              className="text-neon-pink hover:text-neon-cyan font-mono text-sm px-2 py-1"
              onClick={() => setMenuOpen(false)}
            >
              RESEARCH
            </Link>
            <NeonButton 
              glowColor="cyan" 
              className="mt-2 text-sm"
              onClick={() => {
                console.log('Mobile access requested');
                setMenuOpen(false);
              }}
            >
              REQUEST ACCESS
            </NeonButton>
          </div>
        </motion.div>
      </div>
    </header>
  );
};