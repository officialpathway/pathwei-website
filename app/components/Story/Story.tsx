// components/Story/StorySection.tsx
'use client';

import { motion } from 'framer-motion';
import { useScreenContext } from '@/app/context/ScreenContext';

export default function StorySection() {
  const { resetTransition } = useScreenContext();

  return (
    <motion.div 
      className="fixed inset-0 z-50 overflow-y-auto pt-20 pb-20 px-6 md:px-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-4xl mx-auto bg-black/90 border-2 border-neon-cyan p-8 md:p-12 rounded-lg">
        {/* Close button */}
        <button 
          onClick={resetTransition}
          className="absolute top-4 right-4 text-neon-pink hover:text-neon-cyan transition-colors"
        >
          [CLOSE]
        </button>

        {/* Content */}
        <h2 className="text-4xl md:text-6xl font-bold text-neon-cyan mb-8">
          ABOUT AI HAVEN LABS
        </h2>
        
        <div className="space-y-6 text-neon-green font-mono text-lg leading-relaxed">
          <p>
            We&apos;re pioneering the next generation of human-AI collaboration tools. 
            Our mission is to create technology that enhances human potential 
            without replacing the human touch.
          </p>
          
          <div className="border-t border-neon-purple/50 pt-6">
            <h3 className="text-2xl md:text-3xl text-neon-purple mb-4">OUR PHILOSOPHY</h3>
            <ul className="space-y-4 list-disc list-inside">
              <li>AI should be invisible until needed</li>
              <li>Technology must respect cognitive limits</li>
              <li>Ethical design is non-negotiable</li>
            </ul>
          </div>

          <div className="border-t border-neon-purple/50 pt-6">
            <h3 className="text-2xl md:text-3xl text-neon-purple mb-4">TECH STACK</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['React', 'TensorFlow', 'Three.js', 'Rust', 'PostgreSQL', 'WebGL'].map((tech) => (
                <div key={tech} className="border border-neon-cyan/30 p-3 text-center">
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}