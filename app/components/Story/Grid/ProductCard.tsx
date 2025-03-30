// components/ProductCard.tsx
'use client';

import { motion } from 'framer-motion';

interface Product {
  color: string;
  name: string;
  description: string;
  stats: string;
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className={`relative p-0.5 bg-gradient-to-br from-${product.color} to-black`}>
      <div className="relative bg-black p-6 h-full group">
        {/* Diagonal cut effect */}
        <div className="absolute top-0 right-0 w-8 h-8 bg-black transform translate-x-4 -translate-y-4 rotate-45" />
        <div className="absolute bottom-0 left-0 w-8 h-8 bg-black transform -translate-x-4 translate-y-4 rotate-45" />
        
        <motion.div 
          whileHover={{ scale: 1.03 }}
          className="relative z-10"
        >
          <h3 className={`text-3xl font-bold mb-3 text-${product.color}`}>
            {product.name}
          </h3>
          <p className="text-gray-300 mb-4">{product.description}</p>
          <div className="flex items-center">
            <span className="inline-block w-4 h-4 mr-2 bg-neon-green animate-pulse" />
            <span className="text-sm font-mono text-neon-green">{product.stats}</span>
          </div>
        </motion.div>
        
        {/* Hover glow */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 bg-${product.color} transition-opacity duration-300 pointer-events-none`} />
      </div>
    </div>
  );
}