// app/[locale]/team/page.tsx
'use client';

import { TeamSection } from './Team';
import { CyberpunkHeader } from '@/components/client/aihavenlabs/CyberpunkHeader';
import { motion } from 'framer-motion';
import { MainFooter } from '@/components/client/aihavenlabs/Footer';
import { BigTitle } from '@/components/client/common/BigTitle';
import Stairs from '@/lib/styles/animations/StairTransition';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

type NeonColor = "neon-pink" | "neon-blue" | "neon-green" | "neon-cyan" | "neon-yellow";

function getNeonColor(color: string): NeonColor {
  const validColors: NeonColor[] = ["neon-pink", "neon-blue", "neon-green", "neon-cyan", "neon-yellow"];
  return validColors.includes(color as NeonColor) 
    ? (color as NeonColor) 
    : "neon-pink"; // Default fallback
}

export default function TeamPage() {
  // Get translations specifically for the team page
  const t = useTranslations('teamPage');
  
  // State for popup visibility
  const [showPopup, setShowPopup] = useState(false);
  
  // Handle button click
  const handleContactClick = () => {
    setShowPopup(true);
    // Auto hide after 3 seconds
    setTimeout(() => setShowPopup(false), 3000);
  };

  return (
    <Stairs backgroundColor='#ffffff'>
      <div className="main-container bg-white text-slate-800 min-h-screen">
        <CyberpunkHeader />
        
        {/* Keep BigTitle with vibrant gradient background */}
        <div className="bg-gradient-to-r from-cyan-700 via-indigo-600 to-purple-700">
          <BigTitle 
            text={t('title')}
            subtitle={t('subtitle')} 
            highlightWords={t.raw('highlightWords') as string[]} 
            highlightColor={getNeonColor(t('highlightColor'))}
            className='py-50' 
          />
        </div>

        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto px-6 py-12"
        >
          {/* Intro Divider */}
          <div className="mb-16 text-center">
            <div className="h-px w-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 mx-auto mb-16"></div>
          </div>
          
          <TeamSection />

          {/* Investors Section - Updated */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="mb-24"
          >
            <h2 className="text-indigo-700 text-3xl font-medium mb-10 text-center relative">
              <span className="relative">
                {t('investorsSection.title')}
                <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-indigo-500/70"></span>
              </span>
            </h2>
            
            <div className="text-center py-16 px-6 bg-gradient-to-r from-slate-50 to-white rounded-lg shadow-md border border-indigo-100 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-400 to-indigo-300"></div>
              
              <div className="text-indigo-600 text-5xl mb-6">{t('investorsSection.emoji')}</div>
              <h3 className="text-slate-800 text-xl font-medium mb-4">{t('investorsSection.heading')}</h3>
              <p className="text-slate-600 max-w-2xl mx-auto">
                {t('investorsSection.description')}
              </p>
            </div>
          </motion.section>

          {/* Partners Section - Updated */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="mb-24"
          >
            <h2 className="text-purple-700 text-3xl font-medium mb-10 text-center relative">
              <span className="relative">
                {t('partnersSection.title')}
                <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-purple-500/70"></span>
              </span>
            </h2>
            
            <div className="text-center py-16 px-6 bg-gradient-to-r from-slate-50 to-white rounded-lg shadow-md border border-purple-100 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-indigo-400 to-purple-300"></div>
              
              <div className="text-purple-600 text-5xl mb-6">{t('partnersSection.emoji')}</div>
              <h3 className="text-slate-800 text-xl font-medium mb-4">{t('partnersSection.heading')}</h3>
              <p className="text-slate-600 max-w-2xl mx-auto">
                {t('partnersSection.description')}
              </p>
            </div>
          </motion.section>

          {/* Join CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 mb-8 text-center p-12 sm:p-16 bg-gradient-to-r from-slate-100 to-white rounded-lg shadow-md relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-300"></div>
            
            <h2 className="text-slate-800 text-3xl md:text-4xl font-medium mb-8">
              {t('joinCTA.preHighlight')}<span className="text-indigo-600">{t('joinCTA.highlight')}</span>{t('joinCTA.postHighlight')}
            </h2>
            <p className="text-slate-600 text-xl mb-10 max-w-3xl mx-auto">
              {t('joinCTA.description')}
            </p>
            <motion.button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-10 py-4 rounded shadow-sm transition-colors duration-300 text-lg relative"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContactClick}
            >
              {t('joinCTA.buttonText')}
            </motion.button>
            
            {/* Notification Popup */}
            {showPopup && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-lg shadow-lg z-50"
              >
                <div className="flex items-center">
                  <span className="text-indigo-300 mr-2">ℹ️</span>
                  <span>This feature is not yet available.</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.main>
        
        <MainFooter />
      </div>
    </Stairs>
  );
}