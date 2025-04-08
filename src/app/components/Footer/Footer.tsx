// components/Footer/CyberpunkFooter.tsx
'use client';

import { motion } from 'framer-motion';
import { TextScramble } from '../common/TextScramble';
import Link from 'next/link';

const FooterContent = () => {
  return (
    <>
      {/* Main content */}
      <div className="relative z-10 h-full flex flex-col justify-between pt-20 pb-8">
        {/* Top section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full m-0 p-0"
        >
          <h3 className="text-white text-start text-[20rem] font-mono mb-4">
            Symbiosys
          </h3>
        </motion.div>

        {/* Middle section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-40 px-8 py-12 my-8 w-full max-w-6xl mx-auto"
        >
          {/* Explore Column */}
          <div className="group flex flex-col items-center text-start">
            <h4 className="text-neon-green font-mono text-4xl mb-4">
              <TextScramble text="EXPLORE" />
            </h4>
            <ul className="space-y-4 text-xl">
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
          <div className="group flex flex-col items-center text-start">
            <h4 className="text-neon-blue font-mono text-4xl mb-4">
              <TextScramble text="PRODUCTS" />
            </h4>
            <ul className="space-y-4 text-xl">
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
          <div className="group flex flex-col items-center text-start">
            <h4 className="text-neon-pink font-mono text-4xl mb-4">
              <TextScramble text="CONTACT" />
            </h4>
            <ul className="space-y-4 text-xl">
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
        </motion.div>

        {/* Bottom section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="border-t-2 border-neon-yellow px-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className='text-white'>
              <span className="text-neon-yellow">AI HAVEN LABS</span> © 2024 | ALL SYSTEMS OPERATIONAL
            </p>
            <div className="text-neon-pink font-mono mt-4 md:mt-0 cursor-pointer">
              <Link href={"/policy"}>
                <TextScramble text=">_ PRIVACY POLICY" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export const CyberpunkFooter = () => {
  return (
    // Divs for sticky footer
    <footer 
      className="relative h-[800px] bg-blue-800"
      style={{clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)"}}
    >
      <div className="relative bottom-0 h-[calc(100vh+800px)] -top-[100vh]">
        <div className='sticky h-[800px] top-[calc(100vh-800px)]'>

          {/* Content */}
          <FooterContent />

        </div>
      </div>
    </footer>
  );
};
