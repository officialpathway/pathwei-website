// components/ProductGridSection.tsx
'use client';

import { motion } from 'framer-motion';
import { ProductCard } from './ProductCard';

import type { Product } from './ProductCard';
import Particles from '../../common/Particles';

const products: Product[] = [
  {
    name: 'Pathway',
    description: 'Productivity companion that enhances focus while protecting digital wellbeing',
    stats: '↑ 89% task completion | ↓ 62% screen fatigue',
    color: 'neon-cyan'
  },
  {
    name: 'ContentForge',
    description: 'AI-powered creative suite that organizes and generates content ideas',
    stats: '3.1x output speed | 40% better engagement',
    color: 'neon-pink'
  },
  {
    name: 'NeuroLink',
    description: 'Coming soon: Neural interface for thought-to-text workflows',
    stats: 'Patent pending',
    color: 'neon-purple'
  },
  {
    name: 'Chronos',
    description: 'Coming soon: Time optimization engine for creative professionals',
    stats: 'Beta testing Q3 2024',
    color: 'neon-green'
  }
];

export default function ProductGridSection() {
  return (
    <section className="relative bg-white py-20 px-6 overflow-hidden">
      <div className="container mx-auto">
        {/* Particles Background */}
        <div className="absolute inset-0 z-0">
          <Particles color="#000000" />
        </div>

        <h2 className="text-4xl md:text-6xl font-bold mb-6 text-black">
          Our <span className="text-neon-blue">Product Suite</span>
        </h2>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl">
          AI tools designed to amplify human potential without replacement
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Diagonal grid background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,_#f8fafc_1px,_transparent_1px)] bg-[size:24px_24px] opacity-10" />
      </div>
    </section>
  );
}