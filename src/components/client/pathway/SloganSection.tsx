"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from 'next-intl';

const SloganSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  
  const t = useTranslations("Pathway");
  
  // Smooth scroll-driven animations
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0.1, 0.6], [0, 1]);
  
  return (
    <section
      ref={ref}
      className="relative h-[70vh] w-full overflow-hidden bg-transparent" 
    >
      {/* Glowing Grid Overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[length:100px_100px]"></div>
      </div>
      
      {/* Animated Content - Moved higher with flex alignment */}
      <motion.div
        className="h-full flex flex-col justify-start pt-16 sm:pt-24 px-8 sm:px-16 lg:px-32"
        style={{ opacity }}
      >
        <motion.div style={{ y: y1 }} className="space-y-6">
          {/* Main Headline */}
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight"
          >
            <span className="block mb-2">{t("ui.subhero.heading.part1")}</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-orange-500">
              {t("ui.subhero.heading.part2")}
            </span>
            <span className="block">{t("ui.subhero.heading.part3")}</span>
          </motion.h3>
        </motion.div>
      </motion.div>
      
      {/* Floating Decorative Elements */}
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-purple-900/80 to-transparent pointer-events-none"
      />
    </section>
  );
};

export default SloganSection;