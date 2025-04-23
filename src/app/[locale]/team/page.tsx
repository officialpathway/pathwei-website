// app/team/page.tsx
'use client';

import { TeamSection } from './Team';
import { CyberpunkHeader } from '../components/Header/CyberpunkHeader';
import { motion } from 'framer-motion';
import { CyberpunkFooter } from '../components/Footer/Footer';
import { BigTitle } from '../components/common/BigTitle';
import Stairs from '@/lib/styles/animations/StairTransition';

export default function TeamPage() {
  return (
    <Stairs backgroundColor='#ffffff'>
      <div className="main-container bg-white/95 text-white/10 min-h-screen">
        <CyberpunkHeader />
        
        <BigTitle 
          text="NEURAL NETWORK"
          subtitle='THE MINDS POWERING AI HAVEN LABS' 
          highlightWords={["NETWORK"]} 
          highlightColor='neon-pink'
          className='bg-green-500 py-50' 
        />

        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto px-6 py-12"
        >
          <TeamSection />

          {/* Investors Section - Updated */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-28"
          >
            <h2 className="text-neon-blue text-4xl font-bold mb-12 text-center">
              <span className="border-b-4 border-neon-blue pb-2">INVESTORS</span>
            </h2>
            
            <div className="text-center py-16 border-2 border-dashed border-neon-blue/30 rounded-lg">
              <div className="text-neon-blue text-5xl mb-6">🚀</div>
              <h3 className="text-white text-xl font-bold mb-4">Looking for Strategic Investors</h3>
              <p className="text-gray-400 max-w-2xl mx-auto">
                We&apos;re currently bootstrapping our vision but are open to conversations with 
                forward-thinking investors who believe in the future of AI-powered productivity.
              </p>
            </div>
          </motion.section>

          {/* Partners Section - Updated */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-20"
          >
            <h2 className="text-neon-purple text-4xl font-bold mb-12 text-center">
              <span className="border-b-4 border-neon-purple pb-2">PARTNERS</span>
            </h2>
            
            <div className="text-center py-16 border-2 border-dashed border-neon-purple/30 rounded-lg">
              <div className="text-neon-purple text-5xl mb-6">🤝</div>
              <h3 className="text-white text-xl font-bold mb-4">Future Collaboration Opportunities</h3>
              <p className="text-gray-400 max-w-2xl mx-auto">
                We&apos;re actively seeking partnerships with innovative companies in the AI and productivity space.
                Let&apos;s explore how we can create synergies together.
              </p>
            </div>
          </motion.section>

          {/* Join CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-24 text-center"
          >
            <h2 className="text-neon-yellow text-3xl md:text-4xl font-bold mb-6">
              READY TO <span className="text-neon-pink">JOIN</span> THE NETWORK?
            </h2>
            <p className="text-neon-blue text-xl mb-8 max-w-3xl mx-auto">
              We&apos;re looking for talented individuals to join our growing team.
            </p>
            <button className="bg-neon-purple text-white/70 font-bold px-8 py-4 rounded-lg hover:bg-neon-pink transition-colors text-lg">
              EXPLORE CAREER OPPORTUNITIES
            </button>
          </motion.div>
        </motion.main>
        
        <CyberpunkFooter />
      </div>
    </Stairs>
  );
}