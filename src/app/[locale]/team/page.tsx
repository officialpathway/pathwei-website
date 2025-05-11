'use client';

import { TeamSection } from './Team';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { NeonFuturismBackground } from '@/components/client/pathway/NeonBackground';

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
    <NeonFuturismBackground>  
      <div className="min-h-screen overflow-hidden">
        
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-orange-500 opacity-10 blur-3xl animate-float"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-yellow-400 opacity-10 blur-3xl animate-float animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-80 h-80 rounded-full bg-purple-500 opacity-10 blur-3xl animate-float animation-delay-4000"></div>
        </div>

        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-6xl mx-auto px-6 py-12"
        >
          {/* Team Section */}
          <TeamSection />

          {/* Decorative divider */}
          <div className="flex items-center justify-center my-12">
            <div className="h-px w-16 bg-orange-500/30"></div>
            <div className="mx-4 text-orange-400">✦</div>
            <div className="h-px w-48 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>
            <div className="mx-4 text-orange-400">✦</div>
            <div className="h-px w-16 bg-orange-500/30"></div>
          </div>
          
          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-20 mb-12 text-center p-12 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600/0 via-orange-500/70 to-purple-600/0"></div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              {t('cta.title.preHighlight')} <span className="text-orange-400">{t('cta.title.highlight')}</span> {t('cta.title.postHighlight')}
            </h2>
            <p className="text-white/80 text-xl mb-10 max-w-3xl mx-auto">
              {t('cta.description')}
            </p>
            <motion.button 
              className="bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-white font-medium px-10 py-4 rounded-lg shadow-lg text-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContactClick}
            >
              {t('cta.buttonText')}
            </motion.button>
            
            {/* Notification Popup */}
            {showPopup && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-purple-950 text-white px-6 py-3 rounded-lg shadow-lg z-50 border border-orange-500/30"
              >
                <div className="flex items-center">
                  <span className="text-orange-400 mr-2">✦</span>
                  <span>{t('notification.comingSoon')}</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.main>
      </div>
    </NeonFuturismBackground>
  );
}