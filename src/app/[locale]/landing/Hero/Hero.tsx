"use client";

import { motion } from 'framer-motion';
import { TextScramble } from '@/components/client/common/TextScramble';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const router = useRouter();
  const t = useTranslations('aihavenlabs.heroSection');
  const title = t("title");

  const handleButtonClick = () => {
    router.push('/suite');
  };

  return (
    <div className="w-full max-w-full px-4 sm:px-6 md:px-8">
      <div className="flex flex-col items-center justify-center w-full">
        <div className="w-full max-w-4xl mx-auto">
          <TextScramble 
            text={title}
            className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center leading-tight break-words" 
            scrambleOnHover 
          />
          
          <p className="mt-3 sm:mt-4 md:mt-5 text-sm sm:text-base md:text-lg text-gray-400 text-center mx-auto max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg">
            {t("subtitle")}
          </p>
          
          <div className="flex justify-center mt-4 sm:mt-6 md:mt-8">
            <motion.button
              type="button"
              onClick={handleButtonClick}
              className="relative px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-black border-2 border-neon-cyan text-neon-cyan rounded-full overflow-hidden group cursor-pointer"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 15px rgba(0, 242, 255, 0.7)"
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ 
                duration: 0.3,
                ease: "easeOut"
              }}
            >
              {/* Button text */}
              <span className="relative z-10 text-sm sm:text-base md:text-lg font-medium tracking-wider whitespace-nowrap">
                {t("ctaButton")}
              </span>
              
              {/* Animated background */}
              <motion.span
                className="absolute inset-0 bg-neon-cyan opacity-0 group-hover:opacity-10"
                initial={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              />
              
              {/* Glowing border animation */}
              <motion.span
                className="absolute inset-0 border-2 border-neon-cyan opacity-0 group-hover:opacity-100 rounded-full"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.95, 1.05, 0.95],
                  transition: { 
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }
                }}
              />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}