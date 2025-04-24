// components/Header/CyberpunkHeader.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { TextScramble } from '../common/TextScramble';
import { useMediaQuery } from 'react-responsive';
import LanguageSwitcher from '@/components/locales/LanguageSwitcher';

export const CyberpunkHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { scrollY } = useScroll();
  
  // Add viewport detection with SSR handling
  const [mounted, setMounted] = useState(false);
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  // Mount effect for hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Optimized scroll direction detection
  useMotionValueEvent(scrollY, "change", (latest) => {
    const currentScrollY = Math.round(latest);
    if (currentScrollY > lastScrollY + 5 && currentScrollY > 100) {
      setHidden(true);
    } else if (currentScrollY < lastScrollY - 5 || currentScrollY <= 100) {
      setHidden(false);
    }
    
    // Only update if difference is significant to avoid tiny scroll changes
    if (Math.abs(currentScrollY - lastScrollY) > 5) {
      setLastScrollY(currentScrollY);
    }
  });

  // Close mobile menu when switching to desktop - optimized with useCallback
  useEffect(() => {
    if (isDesktop && menuOpen) {
      setMenuOpen(false);
    }
  }, [isDesktop, menuOpen]);

  // Close menu when route changes (clicking a link)
  const handleNavClick = useCallback(() => {
    setMenuOpen(false);
  }, []);

  // Navigation items memoized to prevent re-rendering
  const navItems = useMemo(() => [
    { name: 'Suite', href: '/suite' },
    { name: 'Team', href: '/team' },
    //{ name: 'Sign in', href: '/sign-in' },
  ], []);

  // Calculate logo size based on screen size
  const logoSize = isDesktop ? 40 : 30;

  // Only render what's needed for the current viewport
  const renderNavigation = () => {
    if (!mounted) return null;
    
    if (isDesktop) {
      return (
        <nav className="flex items-center space-x-8 text-white">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <TextScramble text={item.name} />
            </Link>
          ))}
          <LanguageSwitcher />
        </nav>
      );
    }

    return (
      <>
        <motion.button
          className="focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle menu"
        >
          <div className="w-8 flex flex-col items-end space-y-1.5">
            <span className={`block h-0.5 bg-neon-blue transform-gpu transition-all duration-200 ${menuOpen ? 'w-8 rotate-45 translate-y-2' : 'w-6'}`}></span>
            <span className={`block h-0.5 bg-neon-pink transform-gpu transition-all duration-200 ${menuOpen ? 'opacity-0' : 'w-8'}`}></span>
            <span className={`block h-0.5 bg-neon-cyan transform-gpu transition-all duration-200 ${menuOpen ? 'w-8 -rotate-45 -translate-y-2' : 'w-5'}`}></span>
          </div>
        </motion.button>

        {/* Optimized Mobile Navigation */}
        <motion.div 
          initial={false}
          animate={menuOpen ? "open" : "closed"}
          variants={{
            open: { 
              opacity: 1, 
              height: "auto",
              transition: {
                duration: 0.2,
                ease: "easeOut"
              }
            },
            closed: { 
              opacity: 0, 
              height: 0,
              transition: {
                duration: 0.15,
                ease: "easeIn"
              }
            }
          }}
          className="absolute top-full left-0 right-0 bg-black/80 backdrop-blur-sm border-t-0 border border-neon-blue rounded-b-lg overflow-hidden transform-gpu"
        >
          <div className="container mx-auto px-6 py-2 flex flex-col">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-neon-cyan hover:text-neon-pink py-2 border-b border-neon-blue/20 transition-colors"
                onClick={handleNavClick}
              >
                {item.name}
              </Link>
            ))}
            <div className="py-2">
              <LanguageSwitcher />
            </div>
          </div>
        </motion.div>
      </>
    );
  };

  return (
    <motion.header 
      className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-10xl z-50 bg-black/80 backdrop-blur-sm border border-neon-blue rounded-lg transform-gpu"
      animate={{
        y: hidden ? -100 : 0,
        opacity: hidden ? 0 : 1
      }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <div className="container px-6 py-4 min-w-full flex justify-between items-center relative">
        {/* Logo section with improved animation */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link href="/" className="flex items-center">
            <Image 
              src="/images/logo.png" 
              alt="AI Haven Labs Logo" 
              width={logoSize}
              height={logoSize}
              className="hover:drop-shadow-neon transition-all duration-300"
              priority={true}
            />
          </Link>
        </motion.div>

        {/* Conditional Navigation */}
        {renderNavigation()}
      </div>
    </motion.header>
  );
};