"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const SloganSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Smooth scroll-driven animations
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0.2, 0.8], [0, 1]);

  return (
    <section
      ref={ref}
      className="relative h-[100vh] w-full overflow-hidden bg-transparent"
    >

      {/* Glowing Grid Overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[length:100px_100px]"></div>
      </div>

      {/* Animated Content */}
      <motion.div
        className="h-full flex flex-col justify-center px-8 sm:px-16 lg:px-32"
        style={{ opacity }}
      >
        <motion.div style={{ y: y1 }} className="space-y-6">
          {/* Main Headline */}
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight"
          >
            <span className="block mb-2">¡LA</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-orange-500">
              REVOLUCIÓN
            </span>
            <span className="block">COMIENZA CONTIGO!</span>
          </motion.h3>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl sm:text-2xl md:text-3xl text-white/80 max-w-2xl"
          >
            <span className="text-white/60">Toma el</span>{" "}
            <span className="font-semibold text-white">control</span>{" "}
            <span className="text-white/60">de tus</span>{" "}
            <span className="font-bold text-amber-300">metas</span>{" "}
            <span className="text-white/60">y potencia tu</span>{" "}
            <span className="italic text-purple-300">productividad.</span>
          </motion.p>
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