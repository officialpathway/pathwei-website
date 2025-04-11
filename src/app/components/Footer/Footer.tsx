// components/Footer/CyberpunkFooter.tsx
'use client';

import { motion } from 'framer-motion';
import { TextScramble } from '../common/TextScramble';
import Link from 'next/link';
import Terminal from '../common/Terminal';

const FooterContent = () => {
  return (
    <div className="relative z-10 w-full bg-black backdrop-blur-sm border-t-2 border-neon-cyan">
      {/* Big Title Section */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="w-full px-4 md:px-8 pt-20"
      >
        <h3 className="text-white text-start text-6xl sm:text-8xl md:text-[8rem] lg:text-[10rem] xl:text-[15rem] mb-16 leading-none">
          Symbiosys
        </h3>

      </motion.div>

      {/* Main Content Grid */}
      <div className="w-full px-4 md:px-8 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full min-h-[40vh] max-w-7xl mx-auto"
        >
          {/* Left Group - 3 Columns (Centered) */}
          <div className="grid grid-cols-3  gap-8 w-full h-full place-items-center">
            {/* Explore Column */}
            <div className="group flex flex-col items-center md:items-start text-center md:text-start justify-center h-full">
              <h4 className="text-neon-green text-2xl md:text-3xl mb-4">
                <TextScramble text="EXPLORE" />
              </h4>
              <ul className="space-y-2 md:space-y-3 text-lg">
                <li className="text-white/80 hover:text-neon-green transition-colors cursor-pointer">
                  <TextScramble text="> Showcase" />
                </li>
                <li className="text-white/80 hover:text-neon-green transition-colors cursor-pointer">
                  <TextScramble text="> Research" />
                </li>
                <li className="text-white/80 hover:text-neon-green transition-colors cursor-pointer">
                  <TextScramble text="> Roadmap" />
                </li>
              </ul>
            </div>

            {/* Products Column */}
            <div className="group flex flex-col items-center md:items-start text-center md:text-start justify-center h-full">
              <h4 className="text-neon-blue text-2xl md:text-3xl mb-4">
                <TextScramble text="PRODUCTS" />
              </h4>
              <ul className="space-y-2 md:space-y-3 text-lg">
                <li className="text-white/80 hover:text-neon-blue transition-colors cursor-pointer">
                  <TextScramble text="> NeuroLink" />
                </li>
                <li className="text-white/80 hover:text-neon-blue transition-colors cursor-pointer">
                  <TextScramble text="> BioChip" />
                </li>
                <li className="text-white/80 hover:text-neon-blue transition-colors cursor-pointer">
                  <TextScramble text="> NanoMesh" />
                </li>
              </ul>
            </div>

            {/* Contact Column */}
            <div className="group flex flex-col items-center md:items-start text-center md:text-start justify-center h-full">
              <h4 className="text-neon-pink text-2xl md:text-3xl mb-4">
                <TextScramble text="CONTACT" />
              </h4>
              <ul className="space-y-2 md:space-y-3 text-lg">
                <li className="text-white/80 hover:text-neon-pink transition-colors cursor-pointer">
                  <TextScramble text="> Support" />
                </li>
                <li className="text-white/80 hover:text-neon-pink transition-colors cursor-pointer">
                  <TextScramble text="> Careers" />
                </li>
                <li className="text-white/80 hover:text-neon-pink transition-colors cursor-pointer">
                  <TextScramble text="> Network" />
                </li>
              </ul>
            </div>
          </div>

          {/* Right Group - Terminal (Centered vertically) */}
          <div className="w-full h-full flex items-center justify-center">
            <Terminal
              width="100%"
              height="300px"
              borderColor="var(--neon-cyan)"
              accentColor="var(--neon-green)"
              secondaryColor="var(--neon-pink)"
              tertiaryColor="var(--neon-blue)"
            />
          </div>
        </motion.div>
      </div>

      {/* Bottom Copyright Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 }}
        className="min-w-full px-4 py-8 border-t border-white/20"
      >
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-white text-sm md:text-base">
            <span className="text-neon-yellow">AI HAVEN LABS</span> © 2024 | ALL SYSTEMS OPERATIONAL
          </p>
          <div className="text-neon-pink mt-4 md:mt-0 cursor-pointer">
            <Link href="/policy">
              <TextScramble text=">_ PRIVACY POLICY" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const CyberpunkFooter = () => {
  return (
    <footer className="w-full">
      <FooterContent />
    </footer>
  );
};