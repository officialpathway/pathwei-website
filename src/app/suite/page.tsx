// app/suite/page.tsx
'use client';

import { CyberpunkHeader } from '../components/Header/CyberpunkHeader';
import { motion } from 'framer-motion';
import { BigTitle } from '../components/common/BigTitle';
import { CyberpunkFooter } from '../components/Footer/Footer';
import Stairs from '@/src/lib/animations/StairTransition';
import { apps } from '@/src/lib/constants';
import { FlipCard } from '../components/common/FlipCard';

export default function SuitePage() {
  return (
    <Stairs backgroundColor='#ffffff'>
      <div className="main-container bg-black text-white min-h-screen">
        <CyberpunkHeader />

        <BigTitle 
          text="AI HAVEN SUITE" 
          highlightWords={["SUITE"]} 
          highlightColor='neon-yellow'
          className='bg-purple-600 py-50' 
        />
        
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto px-6 py-12"
        >
          {/* Hero Section */}
          <motion.div 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-20 text-center"
          >
            <p className="text-neon-blue text-xl md:text-2xl">
              NEXT-GEN <span className="text-neon-yellow">CYBERNETIC</span> SOLUTIONS
            </p>
          </motion.div>

          {/* Apps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {apps.map((app, index) => (
              <FlipCard key={app.id} app={app} index={index} />
            ))}
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto px-6 py-12"
          >
            {/* Hero Section */}
            <motion.div 
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-20 text-center"
            >
              <p className="text-neon-blue text-xl md:text-2xl">
                NEXT-GEN <span className="text-neon-yellow">CYBERNETIC</span> SOLUTIONS
              </p>
            </motion.div>

          </motion.div>
        </motion.main>

        {/* Footer */}
        <footer className="border-t border-neon-purple/30 py-8 text-center text-gray-400 text-sm">
          <p>
            <span className="text-neon-pink">AI HAVEN LABS</span> © 2024 | ALL SYSTEMS OPERATIONAL
          </p>
          <p className="mt-1">
            v2.3.7 | [Network Status: <span className="text-neon-green">SECURE</span>]
          </p>
        </footer>

        <CyberpunkFooter />
      </div>
    </Stairs>
  );
}