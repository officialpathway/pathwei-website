// app/team/page.tsx
'use client';

import { TeamSection } from './Team';
import { CyberpunkHeader } from '../components/Header/CyberpunkHeader';
import { motion } from 'framer-motion';
import { CyberpunkFooter } from '../components/Footer/Footer';

const teamMembers = [
  {
    id: 'ceo',
    name: 'ALEX RYDER',
    title: 'FOUNDER & CEO',
    role: 'VISIONARY ARCHITECT',
    bio: 'Former neural interface researcher turned tech entrepreneur. Spearheads our quantum leap into human-AI symbiosis.',
    color: 'neon-pink',
    status: 'ONLINE',
    connections: ['NeuroTech Inc', 'Quantum Leap Ventures', 'Future Humanity Fund']
  },
  {
    id: 'cto',
    name: 'DR. KIRA ZHANG',
    title: 'CHIEF TECHNOLOGY OFFICER',
    role: 'SYSTEMS OVERLORD',
    bio: 'Ex-Google DeepMind lead engineer. Built the first self-evolving AI architecture at age 23.',
    color: 'neon-blue',
    status: 'IN LAB',
    connections: ['MIT Synthetic Intelligence', 'OpenNeuro Collective', 'The Turing Guild']
  },
  {
    id: 'cmo',
    name: 'JORDAN VEX',
    title: 'CHIEF MARKETING OFFICER',
    role: 'NEURAL BRAND SHAPER',
    bio: 'Digital consciousness marketing pioneer. Formerly grew NeuroLink to 50M users in 12 months.',
    color: 'neon-purple',
    status: 'IN FIELD',
    connections: ['Hologram Advertising', 'MindShare Collective', 'The Viral Cortex']
  }
];

const investors = [
  {
    name: 'NEURAL CAPITAL',
    type: 'LEAD INVESTOR',
    investment: 'Series A - $42M',
    focus: 'Human-AI convergence technologies',
    color: 'neon-green'
  },
  {
    name: 'QUANTUM VENTURES',
    type: 'STRATEGIC PARTNER',
    investment: 'Seed - $15M',
    focus: 'Disruptive neurotech',
    color: 'neon-cyan'
  },
  {
    name: 'FUTURE HORIZON FUND',
    type: 'GROWTH INVESTOR',
    investment: 'Series B - $75M',
    focus: 'Consciousness expansion platforms',
    color: 'neon-yellow'
  }
];

const supporters = [
  {
    name: 'THE TURING INSTITUTE',
    role: 'RESEARCH PARTNER',
    contribution: 'AI ethics framework development',
    color: 'neon-aqua'
  },
  {
    name: 'NEUROTECH FOUNDATION',
    role: 'OPEN SOURCE SUPPORTER',
    contribution: 'Core algorithm contributions',
    color: 'neon-violet'
  },
  {
    name: 'DIGITAL HUMANITY COUNCIL',
    role: 'ADVISORY BOARD',
    contribution: 'Policy guidance',
    color: 'neon-red'
  }
];

export default function TeamPage() {
  return (
    <div className="main-container bg-black text-white min-h-screen pt-20">
      <CyberpunkHeader />
      
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
          <h1 className="text-neon-cyan text-5xl md:text-7xl font-bold mb-4 tracking-tighter">
            NEURAL <span className="text-neon-pink">NETWORK</span>
          </h1>
          <p className="text-neon-blue text-xl md:text-2xl">
            THE MINDS POWERING <span className="text-neon-yellow">AI HAVEN LABS</span>
          </p>
        </motion.div>

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
                  <button className={`text-${member.color} text-xs font-mono hover:underline`}>
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
          <button className="bg-neon-purple text-black font-bold px-8 py-4 rounded-lg hover:bg-neon-pink transition-colors text-lg">
            INITIATE PARTNERSHIP PROTOCOL
          </button>
        </motion.div>
      </motion.main>

      {/* Footer */}
      <footer className="border-t border-neon-purple/30 py-8 text-center text-gray-400 text-sm">
        <p>
          <span className="text-neon-pink">AI HAVEN LABS</span> © 2024 | NETWORK STATUS: <span className="text-neon-green">SECURE</span>
        </p>
        <p className="mt-1">
          v2.3.7 | [AUTHENTICATED ACCESS ONLY]
        </p>
      </footer>
      
      <div className='z-30'>
        <CyberpunkFooter />
      </div>
    </div>
  );
}