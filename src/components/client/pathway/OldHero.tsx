"use client";

import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useTranslations } from "next-intl";

const STATIC_PRICE = 1.99;

// Size multiplier constant - modify this to change all emoji sizes
const SIZE_MULTIPLIER = 1.0;

// Parallax intensity values for different movement depths
const PARALLAX_INTENSITY = {
  SUBTLE: 0.5, // Least movement
  MEDIUM: 1.0, // Standard movement
  STRONG: 1.8, // Most movement
};

// Emoji data for productivity/routine planner theme with parallax values
const FLOATING_EMOJIS = [
  {
    id: 1,
    emoji: "💪",
    finalX: "10%",
    finalY: "20%",
    delay: 0.2,
    size: "4rem",
    parallaxIntensity: PARALLAX_INTENSITY.MEDIUM,
  },
  {
    id: 2,
    emoji: "🏃‍♂️",
    finalX: "85%",
    finalY: "15%",
    delay: 0.3,
    size: "3.5rem",
    parallaxIntensity: PARALLAX_INTENSITY.STRONG,
  },
  {
    id: 3,
    emoji: "📚",
    finalX: "15%",
    finalY: "70%",
    delay: 0.4,
    size: "3rem",
    parallaxIntensity: PARALLAX_INTENSITY.SUBTLE,
  },
  {
    id: 4,
    emoji: "🎯",
    finalX: "90%",
    finalY: "65%",
    delay: 0.5,
    size: "3.5rem",
    parallaxIntensity: PARALLAX_INTENSITY.STRONG,
  },
  {
    id: 5,
    emoji: "⏰",
    finalX: "5%",
    finalY: "45%",
    delay: 0.6,
    size: "3rem",
    parallaxIntensity: PARALLAX_INTENSITY.MEDIUM,
  },
  {
    id: 6,
    emoji: "🧠",
    finalX: "88%",
    finalY: "40%",
    delay: 0.7,
    size: "3.2rem",
    parallaxIntensity: PARALLAX_INTENSITY.SUBTLE,
  },
  {
    id: 7,
    emoji: "✅",
    finalX: "12%",
    finalY: "85%",
    delay: 0.8,
    size: "2.8rem",
    parallaxIntensity: PARALLAX_INTENSITY.MEDIUM,
  },
  {
    id: 8,
    emoji: "🏆",
    finalX: "85%",
    finalY: "85%",
    delay: 0.9,
    size: "3.8rem",
    parallaxIntensity: PARALLAX_INTENSITY.STRONG,
  },
  {
    id: 9,
    emoji: "🤝",
    finalX: "8%",
    finalY: "60%",
    delay: 1.0,
    size: "3rem",
    parallaxIntensity: PARALLAX_INTENSITY.SUBTLE,
  },
  {
    id: 10,
    emoji: "📈",
    finalX: "92%",
    finalY: "75%",
    delay: 1.1,
    size: "3.2rem",
    parallaxIntensity: PARALLAX_INTENSITY.MEDIUM,
  },
];

const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const t = useTranslations("Pathway");

  // Mouse position tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Start emoji animation after a brief delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEmojis(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Close modal with escape key
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [isModalOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  // Create cursor-responsive emoji component
  const CursorResponsiveEmoji = ({
    item,
  }: {
    item: (typeof FLOATING_EMOJIS)[0];
  }) => {
    // Calculate movement range based on parallax intensity
    const movementRange = 15 * item.parallaxIntensity;
    const verticalRange = 8 * item.parallaxIntensity;

    // Transform mouse position to emoji movement with individual parallax intensity
    const emojiX = useTransform(
      mouseX,
      [0, typeof window !== "undefined" ? window.innerWidth : 1920],
      [-movementRange, movementRange]
    );

    const emojiY = useTransform(
      mouseY,
      [0, typeof window !== "undefined" ? window.innerHeight : 1080],
      [-verticalRange, verticalRange]
    );

    // Calculate final size with multiplier
    const finalSize = `calc(${item.size} * ${SIZE_MULTIPLIER})`;

    return (
      <motion.div
        key={item.id}
        initial={{
          left: "50%",
          top: "50%",
          scale: 0,
          opacity: 0,
          rotate: 0,
        }}
        animate={{
          left: item.finalX,
          top: item.finalY,
          scale: 1,
          opacity: 0.8,
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          delay: item.delay,
          duration: 1.5,
          type: "spring",
          stiffness: 100,
          damping: 15,
          rotate: {
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          },
        }}
        className="absolute z-5 bg- pointer-events-none select-none transform -translate-x-1/2 -translate-y-1/2"
        style={{
          fontSize: finalSize,
          x: emojiX,
          y: emojiY,
        }}
      >
        <motion.span
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
            delay: item.delay + 2,
          }}
        >
          {item.emoji}
        </motion.span>
      </motion.div>
    );
  };

  return (
    <>
      <section className="relative bg-transparent overflow-hidden h-screen flex items-center justify-center">
        {/* Floating Emojis */}
        <AnimatePresence>
          {showEmojis &&
            FLOATING_EMOJIS.map((item) => (
              <CursorResponsiveEmoji key={item.id} item={item} />
            ))}
        </AnimatePresence>

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
                          rounded-full font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer
                          hover:scale-105 transform"
                onClick={() => setIsModalOpen(true)}
              >
                <span className="relative z-10">
                  {`${t("ui.hero.cta")} ${STATIC_PRICE.toFixed(2)}€`}
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>

              <button
                type="button"
                className="bg-transparent border-2 border-white/30 text-white px-8 py-4 rounded-full font-medium text-lg 
                         hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer
                         hover:scale-105 transform hover:border-white/50"
                onClick={() => {
                  const demoSection = document.getElementById("demo-section");
                  if (demoSection) {
                    demoSection.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
              >
                <span>{t("ui.hero.demo_cta")}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
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
                repeatType: "loop",
              }}
              className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center pt-2"
            >
              <motion.div
                animate={{
                  y: [0, 6, 0],
                  opacity: [1, 0.3, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
                className="w-1 h-2 bg-gray-300 rounded-full"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Modal - Built directly into the Hero component */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              onClick={() => setIsModalOpen(false)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-gray-900 to-gray-800 
                        rounded-2xl shadow-2xl p-8 max-w-md w-full z-50 text-center"
            >
              <button
                title="close modal"
                type="button"
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                onClick={() => setIsModalOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              <div className="py-8 px-4">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Aún no disponible
                </h3>
                <p className="text-gray-300 mb-6">
                  Estamos trabajando para lanzar pronto. ¡Gracias por tu
                  interés!
                </p>
                <button
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 
                            rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Hero;
