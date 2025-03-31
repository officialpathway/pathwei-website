'use client';

import { motion } from 'framer-motion';

export default function AboutSection() {
  return (
    <motion.div 
      className="space-y-8 text-neon-green font-mono text-lg leading-relaxed p-6 md:p-10 lg:p-12 bg-black/80 border border-neon-cyan/20 rounded-lg mt-0" // Added mt-0
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h2 className="text-4xl md:text-6xl font-bold text-neon-cyan mb-10">
        ABOUT AI HAVEN LABS
      </h2>
      
      <div className="space-y-8">
        <p className="md:text-xl">
          We&apos;re pioneering the next generation of human-AI collaboration tools. 
          Our mission is to create technology that enhances human potential 
          without replacing the human touch.
        </p>
        
        <div className="border-t border-neon-purple/50 pt-8 pb-6 px-2">
          <h3 className="text-2xl md:text-3xl text-neon-purple mb-6">OUR PHILOSOPHY</h3>
          <ul className="space-y-4 pl-6">
            <li className="relative before:absolute before:left-[-1.5rem] before:content-['▹'] before:text-neon-cyan">
              AI should be invisible until needed
            </li>
            <li className="relative before:absolute before:left-[-1.5rem] before:content-['▹'] before:text-neon-cyan">
              Technology must respect cognitive limits
            </li>
            <li className="relative before:absolute before:left-[-1.5rem] before:content-['▹'] before:text-neon-cyan">
              Ethical design is non-negotiable
            </li>
          </ul>
        </div>

        <div className="border-t border-neon-purple/50 pt-8 pb-6 px-2">
          <h3 className="text-2xl md:text-3xl text-neon-purple mb-6">TECH STACK</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {['React', 'NodeJS', 'NextJS', 'TypeScript', 'MySQL', 'WebGL'].map((tech) => (
              <div 
                key={tech} 
                className="border border-neon-cyan/30 p-3 text-center hover:bg-neon-cyan/10 transition-colors duration-300"
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}