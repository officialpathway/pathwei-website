"use client";

import { motion } from 'framer-motion';
import { TextScramble } from '@/components/client/common/TextScramble';
import { useTranslations } from 'next-intl';

export default function Hero() {

  const t = useTranslations('aihavenlabs.heroSection');
  const title = t("title");

  return (
    <section className="px-4 md:px-0"> {/* Added horizontal padding for mobile */}
      <div className="flex flex-col items-center justify-center h-[90vh] md:h-screen px-4"> {/* Adjusted height and padding */}
        <TextScramble 
          text={title}
          className='text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center' 
          scrambleOnHover 
        />
        <p className="mt-3 md:mt-4 text-base md:text-lg text-gray-400 text-center max-w-md md:max-w-lg px-4">
          {t("subtitle")}
        </p>
        
        <motion.button
          type="button"
          className="relative mt-6 md:mt-8 px-6 py-3 md:px-8 md:py-4 bg-black border-2 border-neon-cyan text-neon-cyan rounded-full overflow-hidden group cursor-pointer"
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 15px rgba(0, 242, 255, 0.7)"
          }}
          whileTap={{ scale: 0.98 }} // Added tap feedback for mobile
          transition={{ 
            duration: 0.3,
            ease: "easeOut"
          }}
        >
          {/* Button text */}
          <span className="relative z-10 text-lg md:text-xl tracking-wider">
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
            className="absolute inset-0 border-2 border-neon-cyan opacity-0 group-hover:opacity-100"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 0],
              transition: { 
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }
            }}
          />
        </motion.button>
      </div>
    </section>
  );
}