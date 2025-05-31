"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';

const Hero = () => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  
  const t = useTranslations("Pathway");

  useEffect(() => {
    // Move targetDate inside useEffect to prevent recalculation
    const targetDate = new Date('2025-07-01T00:00:00Z').getTime();

    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = targetDate - now;

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        };
      } else {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());
    
    // Set up interval
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []); // Empty dependency array since targetDate is now inside the effect

  const CountdownUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="relative group">
      {/* Glow effect background */}
      <div className="absolute inset-0 bg-amber-500/20 rounded-2xl blur-xl group-hover:bg-amber-500/30 transition-all duration-300" />
      
      {/* Main container */}
      <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-6 md:p-8 
                      hover:bg-white/15 hover:border-amber-500/30 transition-all duration-300
                      shadow-2xl hover:shadow-amber-500/20">
        {/* Value */}
        <div
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-amber-500 mb-2 
                     drop-shadow-lg font-mono tracking-tight"
          style={{
            textShadow: '0 0 20px rgba(245, 158, 11, 0.5)'
          }}
        >
          {value.toString().padStart(2, '0')}
        </div>
        
        {/* Label */}
        <div className="text-white/80 text-xs sm:text-sm md:text-base font-medium uppercase tracking-wider">
          {label}
        </div>
        
        {/* Animated border */}
        <div className="absolute inset-0 rounded-2xl border border-amber-500/0 group-hover:border-amber-500/50 transition-all duration-300" />
      </div>
    </div>
  );

  return (
    <section className="relative bg-transparent overflow-hidden h-screen flex items-center pt-20 justify-center">
      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Main Headline */}
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <span className="block mb-2">{t("ui.hero.heading.part1")}</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-orange-500">
              {t("ui.hero.heading.part2")}
            </span>
          </motion.h1>

          {/* Countdown announcement */}
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Lanazmiento el 1 de Julio, 2025
          </motion.p>

          {/* Countdown Timer - Only render when timeLeft is available */}
          {timeLeft && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-8 mb-8 sm:mb-12">
              <CountdownUnit value={timeLeft.days} label="Días" />
              <CountdownUnit value={timeLeft.hours} label="Horas" />
              <CountdownUnit value={timeLeft.minutes} label="Minutos" />
              <CountdownUnit value={timeLeft.seconds} label="Segundos" />
            </div>
          )}

          {/* Loading state for countdown */}
          {!timeLeft && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-8 mb-8 sm:mb-12">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="relative">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-6 md:p-8">
                    <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-amber-500/50 mb-2 font-mono">
                      --
                    </div>
                    <div className="text-white/40 text-xs sm:text-sm md:text-base font-medium uppercase tracking-wider">
                      {['Days', 'Hours', 'Minutes', 'Seconds'][i]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Call to action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="space-y-4"
          >
            <p className="text-white/60 text-sm md:text-base mb-4 sm:mb-6">
              Sé el primero en enterarte de las novedades y el lanzamiento de Pathway
            </p>
            
            {/* Newsletter signup button */}
            <motion.button 
              type="button" 
              className="relative overflow-hidden group bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 sm:px-8 py-3 sm:py-4 
                        rounded-full font-medium text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer
                        hover:scale-105 transform hover:shadow-amber-500/25"
              onClick={() => {
                const newsletterSection = document.getElementById('newsletter');
                if (newsletterSection) {
                  newsletterSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                  });
                }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Ser Notificado
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 7h10v10"/>
                  <path d="M7 17 17 7"/>
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </motion.div>

          {/* Scroll Down Indicator */}
          <motion.div 
            className="flex flex-col items-center mt-8 sm:mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.8 }}
          >
            <p className="text-gray-300 mb-2 text-sm font-medium">
              Aprende más sobre Pathway
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
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;