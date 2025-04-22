"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Modal from "./PricingModal";
import { useTranslations } from 'next-intl';

const PRICE_OPTIONS = [4.99, 7.49, 9.99];

const Hero = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [price, setPrice] = useState(PRICE_OPTIONS[0]);
  const [priceLoaded, setPriceLoaded] = useState(false);

  const t = useTranslations("Pathway");

  // Set random price on component mount
  useEffect(() => {
    // Check for existing cookie first
    const cookiePrice = document.cookie
      .split('; ')
      .find(row => row.startsWith('selected_price='))
      ?.split('=')[1];
    
    if (cookiePrice) {
      setPrice(Number(cookiePrice));
      setPriceLoaded(true);
      return;
    }
    
    // Fallback to random selection
    const randomPrice = PRICE_OPTIONS[Math.floor(Math.random() * PRICE_OPTIONS.length)];
    setPrice(randomPrice);
    setPriceLoaded(true);
  }, []);

  const trackClick = async (clickedPrice: number) => {
    try {
      await fetch('/api/public/track-price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ price: clickedPrice }),
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
              <span className="block mb-2">{t("hero-heading-1")}</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-orange-500">
                {t("hero-heading-2")}
              </span>
            </motion.h1>

            <motion.p 
              className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {t("hero-subheading")}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              {/* Modal Button for tracking */}
              <button 
                type="button" 
                className="relative overflow-hidden group bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-4 
                          rounded-full font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => {
                  setIsModalOpen(true);
                  trackClick(price);
                }}
              >
                <span className="relative z-10">
                  {priceLoaded ? `${t("cta")} $${price.toFixed(2)}` : `${t("loading")}`}
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>

              <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                price={price}
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
                <span>{t("demo-cta")}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </button>
            </motion.div>
          </motion.div>

          {/* Floating Phone Mockup (Optional) */}
          <motion.div 
            className="mt-16 hidden lg:block"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <div className="relative mx-auto w-64 h-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl blur-xl opacity-20 animate-pulse"></div>
              <div className="relative bg-gray-900 border border-gray-700 rounded-3xl p-2 shadow-2xl">
                <div className="bg-gray-800 rounded-2xl overflow-hidden h-96 flex items-center justify-center">
                  <div className="text-center p-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </div>
                    <h3 className="text-white font-medium mb-1">App Demo</h3>
                    <p className="text-gray-400 text-sm">Explora las funciones</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Hero;