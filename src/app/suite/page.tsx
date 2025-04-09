// app/suite/page.tsx
'use client';

import Link from 'next/link';
import { CyberpunkHeader } from '../components/Header/CyberpunkHeader';
import { motion } from 'framer-motion';
import { BigTitle } from '../components/common/BigTitle';
import { CyberpunkFooter } from '../components/Footer/Footer';
import { FlipCard } from '../components/common/FlipCard';

const apps = [
  {
    id: 'pathway',
    title: 'PATHWAY',
    subtitle: 'Your Progress Partner',
    description: 'Track and achieve your goals with Pathway, the productivity neural-net designed to optimize your human potential.',
    keywords: ['productivity', 'goals', 'progress', 'social web', 'self-improvement'],
    color: 'neon-green',
    features: [
      'Neural goal tracking',
      'Social accountability networks',
      'AI-powered progress predictions',
      'Biometric integration',
      'Blockchain achievement tokens'
    ],
    status: 'ONLINE'
  },
  {
    id: 'neuroforge',
    title: 'NEUROFORGE',
    subtitle: 'Cognitive Enhancement Suite',
    description: 'Augment your mental capabilities with our AI-driven neuro-enhancement platform.',
    keywords: ['brain training', 'focus', 'memory', 'cognitive'],
    color: 'neon-blue',
    features: [
      'Real-time neural optimization',
      'Adaptive learning algorithms',
      'EEG integration',
      'Neurochemical balancing',
      'Dreamstate programming'
    ],
    status: 'BETA'
  },
  {
    id: 'quantumlink',
    title: 'QUANTUMLINK',
    subtitle: 'Decentralized Thought Network',
    description: 'The first truly decentralized AI-human consciousness sharing platform.',
    keywords: ['blockchain', 'AI', 'neural', 'decentralized'],
    color: 'neon-purple',
    features: [
      'Quantum encrypted messaging',
      'Hive-mind knowledge pools',
      'Neural NFT marketplace',
      'Consensus reality builder',
      'Temporal communication channels'
    ],
    status: 'ALPHA'
  },
  {
    id: 'biocore',
    title: 'BIOCORE',
    subtitle: 'Organic-Digital Interface',
    description: 'Bridging the gap between biological and artificial intelligence systems.',
    keywords: ['biotech', 'implants', 'augmentation', 'cybernetics'],
    color: 'neon-pink',
    features: [
      'DNA-based authentication',
      'Nanite health monitoring',
      'Synaptic cloud backup',
      'Biological API endpoints',
      'Regenerative firmware'
    ],
    status: 'PROTOTYPE'
  }
];

export default function SuitePage() {
  return (
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
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-24 text-center"
        >
          <h2 className="text-neon-yellow text-3xl md:text-4xl font-bold mb-6">
            READY TO <span className="text-neon-pink">UPGRADE</span> YOUR EXISTENCE?
          </h2>
          <p className="text-neon-blue text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of augmented humans already experiencing the future today.
          </p>
          <button type="button" className="bg-neon-purple text-black font-bold px-8 py-4 rounded-lg hover:bg-neon-pink transition-colors text-lg">
            DEPLOY ALL SYSTEMS
          </button>
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
  );
}