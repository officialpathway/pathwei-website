// components/Footer/CyberpunkFooter.tsx
'use client';

import { motion } from 'framer-motion';
import { TextScramble } from '../common/TextScramble';

const FooterContent = () => {
  return (
    <>
      {/* Main content */}
      <div className="relative z-10 h-full flex flex-col justify-between pt-20 pb-8">
        {/* Top section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <h2 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-pink mb-6">
            <TextScramble text="SYNTHWAVE FUTURE" />
          </h2>
          <p className="text-xl md:text-2xl text-neon-green max-w-3xl mx-auto">
            YOUR JOURNEY INTO THE DIGITAL FRONTIER BEGINS HERE
          </p>
        </motion.div>

        {/* Middle section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full m-0 p-0"
        >
          <h3 className="text-white text-center text-[20rem] font-mono mb-4">
            Symbiosys
          </h3>
        </motion.div>

        {/* Bottom section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="border-t-2 border-neon-purple/50 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-neon-cyan font-mono mb-4 md:mb-0">
              <TextScramble text="EST. 2023" />
            </div>
            <div className="text-white/70 text-center">
              <p className="text-sm">ALL SYSTEMS OPERATIONAL</p>
              <p className="text-xs mt-1">v3.1.4.7.8.2</p>
            </div>
            <div className="text-neon-pink font-mono mt-4 md:mt-0">
              <TextScramble text=">_ TERMINATE_SESSION" />
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
      className="relative h-[800px] bg-gray-900"
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
