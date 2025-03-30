// components/ProductGridSection.tsx
'use client';

import { motion } from 'framer-motion';
import { ProductCard } from './ProductCard';

const products = [
  {
    id: 1,
    name: 'NeuroFlow',
    description: 'Cognitive task manager that learns your mental patterns',
    stats: '↑ 142% focus duration',
    color: 'neon-cyan'
  },
  {
    id: 2,
    name: 'Chronos Sync',
    description: 'Time warping scheduler for optimal productivity',
    stats: '↓ 68% missed deadlines',
    color: 'neon-pink'
  },
  {
    id: 3,
    name: 'DataHive',
    description: 'Swarm intelligence for knowledge workers',
    stats: '3.5x info retrieval',
    color: 'neon-purple'
  },
  {
    id: 4,
    name: 'Sentient Mail',
    description: 'Email that writes itself based on your communication style',
    stats: '↓ 92% email time',
    color: 'neon-green'
  }
];

export default function ProductGridSection() {
  return (
    <section className="relative bg-black py-20 px-6 overflow-hidden">
      <div className="container mx-auto">
        <h2 className="text-4xl md:text-6xl font-bold mb-6 text-neon-yellow">
          Our <span className="text-white">Cyberware</span>
        </h2>
        <p className="text-xl text-gray-400 mb-12 max-w-3xl">
          Augment your productivity with our neural-enhanced digital tools
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
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
      
      {/* Grid pattern background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-small-neon-cyan/20 [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]" />
      </div>
    </section>
  );
}