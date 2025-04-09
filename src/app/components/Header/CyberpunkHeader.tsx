// components/Header/CyberpunkHeader.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState, useEffect } from 'react';
import { TextScramble } from '../common/TextScramble';
import { useMediaQuery } from 'react-responsive';

export const CyberpunkHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { scrollY } = useScroll();
  
  // Add viewport detection
  const [isReady, setIsReady] = useState(false);
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  useEffect(() => {
    setIsReady(true);
  }, []);

  // Scroll direction detection
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > lastScrollY && latest > 100) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setLastScrollY(latest);
  });

  // Close mobile menu when switching to desktop
  useEffect(() => {
    if (isDesktop) {
      setMenuOpen(false);
    }
  }, [isDesktop]);

  const navItems = [
    { name: 'Suite', href: '/suite' },
    { name: 'Team', href: '/team' },
    { name: 'Sing in', href: '/sign-in' },
  ];

  return (
    <motion.header 
      className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-10xl z-50 bg-black/80 backdrop-blur-sm border border-neon-blue rounded-lg"
      animate={{
        y: hidden ? -100 : 0,
        opacity: hidden ? 0 : 1
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="container px-6 py-4 min-w-full flex justify-between">
        {/* Logo section */}
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
        {isReady && isDesktop && (
          <nav className="flex items-center space-x-8 text-white">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <TextScramble text={item.name} />
              </Link>
            ))}
          </nav>
        )}

        {/* Mobile menu button - Only shown when not desktop */}
        {isReady && !isDesktop && (
          <motion.button
            className="focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            <div className="w-8 flex flex-col items-end space-y-1.5">
              <span className={`block h-0.5 bg-neon-blue transition-all duration-300 ${menuOpen ? 'w-8 rotate-45 translate-y-2' : 'w-6'}`}></span>
              <span className={`block h-0.5 bg-neon-pink transition-all duration-300 ${menuOpen ? 'opacity-0' : 'w-8'}`}></span>
              <span className={`block h-0.5 bg-neon-cyan transition-all duration-300 ${menuOpen ? 'w-8 -rotate-45 -translate-y-2' : 'w-5'}`}></span>
            </div>
          </motion.button>
        )}
      </div>

      {/* Mobile Navigation */}
      {isReady && !isDesktop && (
        <motion.div 
          initial={false}
          animate={menuOpen ? "open" : "closed"}
          variants={{
            open: { 
              opacity: 1, 
              height: "auto",
              transition: {
                duration: 0.3,
                ease: "easeInOut"
              }
            },
            closed: { 
              opacity: 0, 
              height: 0,
              transition: {
                duration: 0.3,
                ease: "easeInOut"
              }
            }
          }}
          className="overflow-hidden"
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