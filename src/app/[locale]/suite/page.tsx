'use client';

import { useState } from 'react';
import { CyberpunkHeader } from '@/components/client/aihavenlabs/CyberpunkHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { BigTitle } from '@/components/client/common/BigTitle';
import { CyberpunkFooter } from '@/components/client/aihavenlabs/Footer';
import Stairs from '@/lib/styles/animations/StairTransition';
import { apps } from '@/lib/constants';
import { FlipCard } from '@/components/client/common/FlipCard';
import { useTranslations } from 'next-intl';

export default function SuitePage() {
  // Add state for controlling popup visibility
  const [showPopup, setShowPopup] = useState(false);
  
  // Get translations for the Suite namespace
  const t = useTranslations('Suite');
  
  // Get translations for the aihavenlabs namespace (for the apps data)
  const tAihaven = useTranslations('aihavenlabs');
  
  // Call the apps function with the translator to get the array
  const appsArray = apps(tAihaven);

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  // Animation variants for popup
  const popupVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring", 
        damping: 15, 
        stiffness: 300 
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.8,
      transition: { 
        duration: 0.2 
      }
    }
  };

  // Function to handle button click
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleButtonClick = (e: any) => {
    e.preventDefault();
    setShowPopup(true);
    
    // Automatically hide popup after 3 seconds
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  return (
    <Stairs backgroundColor='#ffffff'>
      <div className="main-container bg-white text-slate-800 min-h-screen">
        <CyberpunkHeader />

        {/* Keep BigTitle with original styling */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-400 to-violet-600">
          <BigTitle 
            text={t('page-title')}
            highlightWords={["SUITE"]} 
            highlightColor='neon-yellow'
            className='py-50' 
          />
        </div>
        
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto px-6 py-12"
        >
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-16 text-center"
          >
            <p className="text-slate-800 text-xl md:text-2xl font-normal tracking-wide">
              {t('subtitle-1')} <span className="text-indigo-600 font-medium">{t('subtitle-2')}</span> {t('subtitle-3')}
            </p>
            <div className="h-px w-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 mx-auto mt-6"></div>
          </motion.div>

          {/* Apps Container - Centered */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex justify-center flex-wrap gap-6 mb-16"
          >
            {appsArray.map((app, index) => (
              <motion.div 
                key={app.id}
                variants={itemVariants}
                className="transform transition-all duration-300 hover:translate-y-[-5px] flex-shrink-0"
              >
                <FlipCard app={app} index={index} />
              </motion.div>
            ))}
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="rounded-lg p-8 bg-gradient-to-r from-slate-100 to-white mb-10 shadow-md border border-indigo-100 relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 via-purple-500 to-indigo-400"></div>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-indigo-500 via-purple-400 to-transparent"></div>
            
            <h2 className="text-xl font-medium text-slate-800 mb-3 pl-2">
              {t('cta-title')}
            </h2>
            <div className="flex flex-wrap items-center justify-between">
              <p className="text-slate-700 max-w-2xl mb-4 md:mb-0 pl-2">
                {t('cta-description')}
              </p>
              <motion.a
                href="#" 
                onClick={handleButtonClick}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded 
                  transition-colors duration-300 flex items-center group shadow-sm"
                whileTap={{ scale: 0.98 }}
              >
                <span>{t('cta-button')}</span>
                <span className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1">→</span>
              </motion.a>
            </div>
          </motion.div>
        </motion.main>

        <CyberpunkFooter />
        
        {/* Popup Component */}
        <AnimatePresence>
          {showPopup && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50"
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setShowPopup(false)}
            >
              <motion.div 
                className="absolute inset-0 bg-black bg-opacity-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowPopup(false)}
              />
              <motion.div
                variants={popupVariants}
                className="bg-white rounded-lg shadow-xl p-6 relative z-10 mx-4 border-l-4 border-indigo-500"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium text-slate-800">Todavía no disponible</p>
                </div>
                <button
                  type='button'
                  title='close button'
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPopup(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Stairs>
  );
}