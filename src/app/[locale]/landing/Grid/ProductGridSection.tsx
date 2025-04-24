// components/ProductGridSection.tsx
'use client';

import { motion } from 'framer-motion';
import { ProductCard } from './ProductCard';
import { products } from '@/lib/constants';
import { useTranslations } from 'next-intl';

export default function ProductGridSection() {
  // Get the translator for the aihavenlabs namespace
  const t = useTranslations('aihavenlabs');
  
  // Call the products function with the translator to get the array
  const productsArray = products(t);

  return (
    <section className="relativepy-20 px-6 overflow-hidden">
      <div className="container mx-auto">

        <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
          Our <span className="text-neon-blue">Product Suite</span>
        </h2>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl">
          AI tools designed to amplify human potential without replacement
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {productsArray.map((product, index) => (
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