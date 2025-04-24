// components/Footer/FuturisticFooter.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const FooterContent = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative w-full bg-slate-900 text-white overflow-hidden"
    >
      {/* Subtle background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0)_60%)]"></div>
      
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      
      <div className="relative z-10 container mx-auto px-6 py-12 sm:py-16">
        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-light tracking-wide text-white/90">
            SYMBIOSYS
          </h2>
          <div className="h-px w-24 bg-sky-400/80 mt-4"></div>
        </motion.div>

        {/* Two Column Layout */}
        <div className="flex flex-col md:flex-row justify-between">
          {/* Left Column - Navigation */}
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: i => ({
                opacity: 1,
                transition: {
                  delay: i * 0.1,
                }
              })
            }}
            initial="hidden"
            whileInView="visible"
            custom={1}
            viewport={{ once: true, margin: "-50px" }}
            className="mb-10 md:mb-0"
          >
            <div className="flex flex-wrap gap-x-10 gap-y-4 md:gap-y-6">
              <div>
                <Link href="/" className="group block text-white/70 hover:text-white transition-colors py-1">
                  <span className="inline-block">Home</span>
                  <span className="block h-px w-0 bg-sky-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </div>
              <div>
                <Link href="/suite" className="group block text-white/70 hover:text-white transition-colors py-1">
                  <span className="inline-block">Suite</span>
                  <span className="block h-px w-0 bg-sky-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </div>
              <div>
                <Link href="/team" className="group block text-white/70 hover:text-white transition-colors py-1">
                  <span className="inline-block">Team</span>
                  <span className="block h-px w-0 bg-sky-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </div>
              <div>
                <Link href="/suite/pathway" className="group block text-white/70 hover:text-white transition-colors py-1">
                  <span className="inline-block">Pathway</span>
                  <span className="block h-px w-0 bg-sky-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center relative">
              <span className="text-xl font-light">S</span>
              <div className="absolute inset-0 rounded-full border border-sky-400/20"></div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-white/50 text-sm"
            >
              © 2024 AI HAVEN LABS
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="mt-4 md:mt-0 flex items-center"
            >
              <Link href="/policy" className="group block text-white/60 hover:text-sky-400 transition-colors duration-300 text-sm">
                Privacy Policy
                <span className="block h-px w-0 bg-sky-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
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