// components/Footer/FuturisticFooter.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

const FooterContent = () => {
  const [popupLink, setPopupLink] = useState<string | null>(null);
  
  // Animation variants for better organization
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: "easeOut" 
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };

  // Navigation links data with types for TypeScript
  interface NavLink {
    href: string;
    label: string;
    showPopup?: boolean;
  }
  
  const navLinks: NavLink[] = [
    { href: "/", label: "Home" },
    { href: "/suite", label: "Suite" },
    { href: "/team", label: "Team" },
    { href: "/suite/pathway", label: "Pathway" },
    { href: "/contact", label: "Contact", showPopup: true }
  ];

  // Simple link renderer with proper TypeScript types
  const renderNavLink = (link: NavLink) => {
    const handleClick = (e: React.MouseEvent) => {
      if (link.showPopup) {
        e.preventDefault();
        setPopupLink(link.label);
        
        // Hide popup after 2 seconds
        setTimeout(() => {
          setPopupLink(null);
        }, 2000);
      }
    };
    
    return (
      <div key={link.label} className="px-4 md:px-6 py-2">
        <Link 
          href={link.href} 
          className="group block text-white/70 hover:text-white transition-colors py-1"
          onClick={link.showPopup ? handleClick : undefined}
        >
          <span className="inline-block">{link.label}</span>
          <span className="block h-0.5 w-0 bg-sky-400 transition-all duration-300 group-hover:w-full"></span>
        </Link>
      </div>
    );
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative w-full bg-slate-900 text-white overflow-hidden"
    >
      {/* Enhanced background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(56,189,248,0.03)_0%,rgba(255,255,255,0)_60%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_70%,rgba(99,102,241,0.03)_0%,rgba(255,255,255,0)_60%)]"></div>
      
      {/* Enhanced top accent line with animation */}
      <motion.div 
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-400/30 to-transparent origin-left"
      ></motion.div>
      
      <div className="relative z-10 container mx-auto px-6 py-16 sm:py-20">
        {/* Main Title with enhanced styling */}
        <motion.div
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-light tracking-wide text-white">
            SYMBIOSYS
          </h2>
          <div className="h-px w-24 bg-sky-400/80 mt-4"></div>
        </motion.div>

        {/* Navigation - Now centered and expanded */}
        <div className="mb-16">
          <div className="flex flex-wrap justify-center w-full">
            {navLinks.map(renderNavLink)}
          </div>
        </div>
        
        {/* Popup notification */}
        {popupLink && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50
                      px-6 py-3 rounded-md bg-black/80 backdrop-blur-md text-white 
                      border border-sky-500/20 shadow-lg shadow-sky-500/10"
          >
            {popupLink} is not available yet
          </motion.div>
        )}

        {/* Bottom Bar with enhanced styling */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-white/50 text-sm"
            >
              © 2025 AI HAVEN LABS
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="mt-4 md:mt-0 flex items-center gap-6"
            >
              <Link href="/suite/pathway/policy" className="group block text-white/60 hover:text-sky-400 transition-colors duration-300 text-sm">
                Privacy Policy
                <span className="block h-px w-0 bg-gradient-to-r from-sky-400 to-indigo-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/suite/pathway/terms" className="group block text-white/60 hover:text-sky-400 transition-colors duration-300 text-sm">
                Terms of Service
                <span className="block h-px w-0 bg-gradient-to-r from-sky-400 to-indigo-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      <div className="absolute bottom-24 left-10 w-32 h-32 rounded-full bg-sky-500/5 blur-3xl"></div>
      <div className="absolute top-20 right-10 w-24 h-24 rounded-full bg-indigo-500/5 blur-2xl"></div>
    </motion.div>
  );
};

export const FuturisticFooter = () => {
  return (
    <footer className="w-full">
      <FooterContent />
    </footer>
  );
};

// For backward compatibility with existing imports
export const CyberpunkFooter = FuturisticFooter;