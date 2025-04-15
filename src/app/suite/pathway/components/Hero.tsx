"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Hero = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 overflow-hidden h-screen flex items-center justify-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Mesh */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-purple-500/10 to-transparent"></div>
        </div>

        {/* Floating Particles */}
        {[...Array(isMobile ? 20 : 40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            initial={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              scale: Math.random() * 0.5 + 0.5,
              opacity: Math.random() * 0.6 + 0.2
            }}
            animate={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              transition: {
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse"
              }
            }}
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

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
            <span className="block mb-2">Potencia Tu</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-orange-500">
              Aprendizaje Con IA
            </span>
          </motion.h1>

          <motion.p 
            className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            La primera plataforma que combina inteligencia artificial con gamificación y técnicas de aprendizaje probadas para resultados extraordinarios.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <button 
              type="button" 
              className="relative overflow-hidden group bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-4 
                         rounded-full font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <span className="relative z-10">Empieza Gratis</span>
              <span className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </button>

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
              <span>Ver Demo</span>
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
  );
};

export default Hero;