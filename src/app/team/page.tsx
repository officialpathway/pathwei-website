// app/team/page.tsx
'use client';

import { TeamSection } from './Team';
import { CyberpunkHeader } from '../components/Header/CyberpunkHeader';
import { motion } from 'framer-motion';
import { CyberpunkFooter } from '../components/Footer/Footer';
import { BigTitle } from '../components/common/BigTitle';
import Stairs from '@/src/lib/animations/StairTransition';
import { teamMembers, investors, supporters } from '@/src/lib/constants';

export default function TeamPage() {
  return (
    <Stairs backgroundColor='#ffffff'>
      <div className="main-container bg-black/95 text-white/10 min-h-screen">
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

          {/* Core Team */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-28"
          >
            <h2 className="text-neon-green text-4xl font-bold mb-12 text-center">
              <span className="border-b-4 border-neon-green pb-2">FOUNDING CIRCUIT</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`border-2 border-${member.color} rounded-lg overflow-hidden bg-black/50 hover:bg-black/70 transition-all duration-300`}
                >
                  {/* Header */}
                  <div className={`p-6 bg-gradient-to-r from-black to-${member.color}/10 border-b-2 border-${member.color}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className={`text-${member.color} text-2xl font-bold mb-1`}>{member.name}</h3>
                        <p className="text-white/80 text-sm">{member.title}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full bg-${member.color}/20 text-${member.color} border border-${member.color}`}>
                        {member.status}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <p className={`text-${member.color} font-mono text-sm mb-3`}>{member.role}</p>
                    <p className="text-gray-300 mb-6">{member.bio}</p>
                    
                    <div className="mt-6">
                      <h4 className={`text-${member.color} text-sm font-mono mb-3`}>NEURAL CONNECTIONS:</h4>
                      <ul className="space-y-2">
                        {member.connections.map((connection, i) => (
                          <li key={i} className="flex items-start">
                            <span className={`text-${member.color} mr-2`}>↳</span>
                            <span className="text-gray-400 text-sm">{connection}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className={`px-6 py-3 bg-${member.color}/10 border-t-2 border-${member.color} text-center`}>
                    <button type='button' className={`text-${member.color} text-xs font-mono hover:underline`}>
                      INITIATE NEURAL LINK
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Investors */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-28"
          >
            <h2 className="text-neon-blue text-4xl font-bold mb-12 text-center">
              <span className="border-b-4 border-neon-blue pb-2">QUANTUM BACKERS</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {investors.map((investor, index) => (
                <motion.div
                  key={investor.name}
                  initial={{ y: 30 }}
                  whileInView={{ y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`border-2 border-${investor.color} rounded-lg p-6 bg-black/30 hover:bg-black/50 transition-all`}
                >
                  <h3 className={`text-${investor.color} text-2xl font-bold mb-2`}>{investor.name}</h3>
                  <p className="text-white/80 text-sm mb-4">{investor.type}</p>
                  
                  <div className="mb-4">
                    <p className="text-gray-300 text-sm font-mono">INVESTMENT:</p>
                    <p className={`text-${investor.color} font-bold`}>{investor.investment}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-300 text-sm font-mono">FOCUS AREA:</p>
                    <p className="text-gray-400">{investor.focus}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Supporters */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-20"
          >
            <h2 className="text-neon-purple text-4xl font-bold mb-12 text-center">
              <span className="border-b-4 border-neon-purple pb-2">SYSTEM ALLIES</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {supporters.map((supporter, index) => (
                <motion.div
                  key={supporter.name}
                  initial={{ scale: 0.95 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`border border-${supporter.color} rounded-lg p-6 bg-black/20 hover:bg-black/40 transition-all`}
                >
                  <h3 className={`text-${supporter.color} text-xl font-bold mb-1`}>{supporter.name}</h3>
                  <p className="text-white/80 text-sm mb-4">{supporter.role}</p>
                  <p className="text-gray-400 text-sm">{supporter.contribution}</p>
                </motion.div>
              ))}
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
              We&apos;re always seeking visionary investors and strategic partners.
            </p>
            <button className="bg-neon-purple text-white/70 font-bold px-8 py-4 rounded-lg hover:bg-neon-pink transition-colors text-lg">
              INITIATE PARTNERSHIP PROTOCOL
            </button>
          </motion.div>
        </motion.main>
        
        <CyberpunkFooter />
      </div>
    </Stairs>
  );
}