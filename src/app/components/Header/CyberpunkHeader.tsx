// components/Header/CyberpunkHeader.tsx
'use client';

import Link from 'next/link';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import { TextScramble } from '../common/TextScramble';

export const CyberpunkHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { scrollY } = useScroll();

  const navItems = [
    { name: 'Suite', href: '/suite' },
    { name: 'Team', href: '/team' },
    { name: 'Sing in', href: '/sign-in' },
  ];

  // Scroll direction detection
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > lastScrollY && latest > 100) {
      // Scrolling down
      setHidden(true);
    } else {
      // Scrolling up
      setHidden(false);
    }
    setLastScrollY(latest);
  });

  return (
    <motion.header 
      className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-10xl z-50 bg-black/80 backdrop-blur-sm border border-neon-blue rounded-lg"
      animate={{
        y: hidden ? -100 : 0,
        opacity: hidden ? 0 : 1
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo section on the left */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="flex items-center">
            <Image 
              src="/images/logo.png" 
              alt="Cyberpunk Logo" 
              width={40}
              height={40}
              className="h-10 w-10 hover:drop-shadow-neon transition-all duration-300"
            />
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="sm:hidden md:block items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-white text-lg font-bold underline"
            >
              <TextScramble text={item.name} className="text-white" scrambleOnHover={true} />
            </Link>
          ))}
        </nav>

        {/* Mobile menu button */}
        <motion.button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          whileTap={{ scale: 0.9 }}
        >
          <div className="w-8 flex flex-col items-end space-y-1.5">
            <span className={`block h-0.5 bg-neon-blue transition-all duration-300 ${menuOpen ? 'w-8 rotate-45 translate-y-2' : 'w-6'}`}></span>
            <span className={`block h-0.5 bg-neon-pink transition-all duration-300 ${menuOpen ? 'opacity-0' : 'w-8'}`}></span>
            <span className={`block h-0.5 bg-neon-cyan transition-all duration-300 ${menuOpen ? 'w-8 -rotate-45 -translate-y-2' : 'w-5'}`}></span>
          </div>
        </motion.button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden overflow-hidden"
        >
          <div className="container mx-auto px-6 pb-4 flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-neon-cyan hover:text-neon-pink py-2 border-b border-neon-blue/20 transition-colors duration-300"
                onClick={() => setMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};