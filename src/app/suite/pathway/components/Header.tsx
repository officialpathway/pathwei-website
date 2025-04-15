'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { scrollY } = useScroll();
  const [isReady, setIsReady] = useState(false);
  const isDesktop = useMediaQuery({ minWidth: 768 }); // Changed to md breakpoint

  useEffect(() => {
    setIsReady(true);
  }, []);

  // Improved scroll handling
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > lastScrollY && latest > 50) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setLastScrollY(latest);
  });

  // Close menu when resizing to desktop
  useEffect(() => {
    if (isDesktop) {
      setMenuOpen(false);
    }
  }, [isDesktop]);

  const navItems = [
    { name: 'Apps', href: '/suite' },
    { name: 'Equipo', href: '/team' },
    { name: 'Iniciar sesión', href: '#signin' },
  ];

  return (
    <motion.header
      className="fixed w-full z-50 bg-gradient-to-b from-black/90 to-transparent backdrop-blur-sm"
      animate={{
        y: hidden ? -100 : 0,
      }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo - Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/suite/pathway" className="flex items-center gap-3">
              <Image 
                src="/images/pathway/logo.png" 
                alt="Pathway Logo"
                width={40}
                height={40}
                className="hover:opacity-80 transition-opacity"
              />
              <span className="text-xl font-bold text-white">Pathway</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation - Right */}
          {isReady && isDesktop && (
            <nav className="flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 relative group"
                >
                  {item.name}
                  <motion.span
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 group-hover:w-full transition-all duration-300"
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                  />
                </Link>
              ))}
            </nav>
          )}

          {/* Mobile menu button */}
          {isReady && !isDesktop && (
            <motion.button
              className="flex flex-col items-center justify-center w-8 h-8 focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
              whileTap={{ scale: 0.9 }}
              aria-label="Menú"
            >
              <motion.span
                className="block w-6 h-0.5 bg-white mb-1.5"
                animate={{
                  rotate: menuOpen ? 45 : 0,
                  y: menuOpen ? 6 : 0,
                  width: menuOpen ? 8 : 6
                }}
              />
              <motion.span
                className="block w-8 h-0.5 bg-white"
                animate={{
                  opacity: menuOpen ? 0 : 1
                }}
              />
              <motion.span
                className="block w-5 h-0.5 bg-white mt-1.5"
                animate={{
                  rotate: menuOpen ? -45 : 0,
                  y: menuOpen ? -6 : 0,
                  width: menuOpen ? 8 : 5
                }}
              />
            </motion.button>
          )}
        </div>

        {/* Mobile Navigation */}
        {isReady && !isDesktop && (
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="px-2 pt-2 pb-4 space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block px-3 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800/20 rounded-md transition-colors duration-300"
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </motion.header>
  );
};