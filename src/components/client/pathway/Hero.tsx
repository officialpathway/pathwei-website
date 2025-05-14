"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Modal from "./PricingModal";
import { useTranslations } from 'next-intl';

const STATIC_PRICE = 4.99;

const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const t = useTranslations("Pathway");

  const trackClick = async () => {
    try {
      await fetch('/api/admin/price-A-B/track-price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ price: STATIC_PRICE }),
      });
      console.log("tracked correctly")
    } catch (error) {
      console.error('Error tracking price click:', error);
    }
  };

  return (
    <>
      <section className="relative bg-transparent overflow-hidden h-screen flex items-center justify-center">

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Animated Headline */}
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span className="block mb-2">{t("ui.hero.heading.part1")}</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-orange-500">
                {t("ui.hero.heading.part2")}
              </span>
            </motion.h1>

            <motion.p 
              className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {t("ui.hero.subheading")}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              {/* Modal Button with static price */}
              <button 
                type="button" 
                className="relative overflow-hidden group bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-4 
                          rounded-full font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => {
                  setIsModalOpen(true);
                  trackClick();
                }}
              >
                <span className="relative z-10">
                  {`${t("ui.hero.cta")} ${STATIC_PRICE.toFixed(2)}€`}
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>

              <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                price={STATIC_PRICE}
                trackClick={trackClick}
              />

              <button 
                type="button" 
                className="bg-transparent border-2 border-white/30 text-white px-8 py-4 rounded-full font-medium text-lg 
                         hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                onClick={() => {
                  const demoSection = document.getElementById('demo-section');
                  if (demoSection) {
                    demoSection.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'start' // Explicitly set scroll position
                    });
                  }
                }}
              >
                <span>{t("ui.hero.demo_cta")}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </button>
            </motion.div>
          </motion.div>

          {/* Scroll Down Indicator */}
          <motion.div 
            className="flex flex-col items-center mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <p className="text-gray-300 mb-2 text-sm font-medium">
              {t("ui.hero.scroll_down") || "Scroll down for more"}
            </p>
            <motion.div
              animate={{ 
                y: [0, 10, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop"
              }}
              className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center pt-2"
            >
              <motion.div 
                animate={{ 
                  y: [0, 6, 0],
                  opacity: [1, 0.3, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
                className="w-1 h-2 bg-gray-300 rounded-full"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Hero;