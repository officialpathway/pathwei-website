'use client';

import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/locales/LanguageSwitcher';
import Link from 'next/link';

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const { scrollY } = useScroll();

  const t = useTranslations("Pathway");

  // Mobile detection without resize listeners
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Optimized scroll handler
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (!ticking.current) {
      requestAnimationFrame(() => {
        if (latest > lastScrollY.current && latest > 50) {
          setHidden(true);
        } else {
          setHidden(false);
        }
        lastScrollY.current = latest;
        ticking.current = false;
      });
      ticking.current = true;
    }
  });

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      {/* Fixed Header Bar - Constant Height */}
      <motion.header
        className="fixed w-full z-50 bg-black/50 backdrop-blur-sm"
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ 
          type: 'tween',
          ease: 'easeInOut',
          duration: 0.3
        }}
        style={{
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          height: '4rem' // Fixed height (h-16)
        }}
      >
        <div className="container mx-auto px-4 h-full flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center">
              <Image 
                src="/images/pathway/logo.png"
                alt="Pathway"
                width={32}
                height={32}
              />
              <span className="ml-2 text-white font-bold">Pathway</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          {!isMobile && (
            <nav className="flex space-x-6 items-center">
              {[
                { label: `${t("ui.header.team")}`, href: '/team' },
              ].map((item) => (
                <a 
                  key={item.label} 
                  href={item.href}
                  className="text-white/80 hover:text-white text-sm transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <LanguageSwitcher />
            </nav>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <div className='flex gap-6 items-center'>
              <LanguageSwitcher />

              <button
                type='button'
                onClick={toggleMenu}
                className="w-8 h-8 flex flex-col justify-center items-center"
                aria-label="Menú"
              >
                <motion.span
                  className="block w-6 h-0.5 bg-white mb-1.5"
                  animate={{
                    rotate: menuOpen ? 45 : 0,
                    y: menuOpen ? 6 : 0
                  }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="block w-6 h-0.5 bg-white"
                  animate={{ opacity: menuOpen ? 0 : 1 }}
                  transition={{ duration: 0.1 }}
                />
                <motion.span
                  className="block w-6 h-0.5 bg-white mt-1.5"
                  animate={{
                    rotate: menuOpen ? -45 : 0,
                    y: menuOpen ? -6 : 0
                  }}
                  transition={{ duration: 0.2 }}
                />
              </button>
            </div>
          )}
        </div>
      </motion.header>

      {/* Mobile Menu - Separate Absolute Positioned Element */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{
            opacity: menuOpen ? 1 : 0,
            y: menuOpen ? 0 : -20,
            display: menuOpen ? 'block' : 'none'
          }}
          transition={{ duration: 0.2 }}
          className="fixed top-16 left-0 w-full z-40 bg-black/95"
          style={{
            pointerEvents: menuOpen ? 'auto' : 'none'
          }}
        >
          <div className="container mx-auto px-4 py-2 flex flex-col">
            {[
              { label: t("header-team"), href: '/team' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="py-3 text-white/80 hover:text-white border-b border-white/10 text-sm"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </>
  );
};