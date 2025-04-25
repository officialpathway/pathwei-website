'use client';

import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ProductCard } from './ProductCard';
import { products } from '@/lib/constants';
import { useTranslations } from 'next-intl';

export default function ProductGridSection() {
  const t = useTranslations('aihavenlabs.productSection');
  const tProduct = useTranslations('aihavenlabs');
  const productsArray = products(tProduct);
  
  // For parallax scrolling effect
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  // Transform values for parallax elements
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  
  // For animating products on scroll
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="relative py-16 md:py-24 px-4 md:px-8 overflow-hidden"
      data-scroll-section
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Diagonal grid background */}
        <motion.div 
          style={{ y: bgY }}
          className="absolute inset-0 bg-[linear-gradient(45deg,_#f0f0f0_1px,_transparent_1px)] bg-[size:30px_30px] opacity-5"
        />
        
        {/* Circular gradient */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-gradient-to-tr from-blue-500/10 to-purple-500/5 blur-3xl opacity-50" />
          <div className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 rounded-full bg-gradient-to-tr from-cyan-500/10 to-green-500/5 blur-3xl opacity-50" />
        </div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section header with improved layout for title */}
        <div className="mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-3xl mx-auto md:mx-0"
          >
            {/* Title section with inline display to prevent wrapping to 3 lines */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <h2 className="text-3xl md:text-5xl font-bold text-white inline-flex items-center flex-wrap">
                <span className="mr-2">{t('title.our')}</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500">
                  {t('title.productSuite')}
                </span>
              </h2>
            </div>
            
            {/* Subtitle as a separate element for better spacing */}
            <motion.p 
              className="text-lg text-gray-400 max-w-xl mb-8"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              {t('subtitle')}
            </motion.p>
          </motion.div>
          
          {/* Product filters */}
          <motion.div 
            className="flex flex-wrap gap-2 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {['all', 'neon-cyan', 'neon-pink', 'neon-purple', 'neon-green'].map((filter) => (
              <button
                type="button"
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300
                  ${activeFilter === filter 
                    ? 'bg-white/10 text-white' 
                    : 'bg-transparent text-gray-500 hover:text-white'}`}
              >
                {filter === 'all' ? t('filters.all') : t(`filters.${filter}`)}
              </button>
            ))}
          </motion.div>
        </div>
        
        {/* Product grid with staggered animations */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {productsArray
            .filter(product => activeFilter === 'all' || product.color === activeFilter)
            .map((product, index) => (
              <div key={index} className="h-full">
                <ProductCard product={product} />
              </div>
            ))
          }
        </motion.div>
        
        {/* View all products link */}
        <motion.div 
          className="mt-12 md:mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <a 
            href="#explore-all" 
            className="inline-flex items-center text-lg text-blue-400 hover:text-blue-300 transition-colors duration-300 group"
          >
            {t('viewAllLink')}
            <span className="ml-2 transform translate-x-0 group-hover:translate-x-2 transition-transform duration-300">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}