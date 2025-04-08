"use client";

import { motion } from 'framer-motion';
import { TextScramble } from '../common/TextScramble';

export default function Hero() {
  return (
    <section>
      <div className="flex flex-col items-center justify-center h-screen">
        <TextScramble text="The Future of AI" className='text-5xl font-bold text-white' scrambleOnHover={true} />
        <p className="mt-4 text-lg text-gray-400">Experience the fusion of technology and humanity.</p>
        
        <motion.button
          type="button"
          className="relative mt-8 px-8 py-4 bg-black border-2 border-neon-cyan text-neon-cyan rounded-full overflow-hidden group cursor-pointer"
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 15px rgba(0, 242, 255, 0.7)"
          }}
          transition={{ 
            duration: 0.3,
            ease: "easeOut"
          }}
        >
          {/* Button text */}
          <span className="relative z-10 font-mono text-xl tracking-wider">
            EXPLORE NOW
          </span>
          
          {/* Animated background */}
          <motion.span
            className="absolute inset-0 bg-neon-cyan opacity-0 group-hover:opacity-10"
            initial={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
          
          {/* Glowing border animation */}
          <motion.span
            className="absolute inset-0 border-2 border-neon-cyan opacity-0 group-hover:opacity-100"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 0],
              transition: { 
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }
            }}
          />
          
          {/* Scanning line effect */}
          <motion.div
            className="absolute bottom-0 left-0 w-full h-0.5 bg-neon-cyan"
            initial={{ x: "-100%" }}
            animate={{
              x: ["-100%", "100%"],
              transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }
            }}
          />
        </motion.button>
      </div>
    </section>
  );
}