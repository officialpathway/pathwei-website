// src/components/client/pathway/CookieBanner.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cookie, Settings } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    preferences: false,
  });

  const t = useTranslations('Pathway.ui.cookies');

  useEffect(() => {
    // Check if user has already made a choice
    const hasConsent = localStorage.getItem('cookie-consent');
    if (!hasConsent) {
      // Delay showing banner to avoid layout shift
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Load saved preferences
      try {
        const savedPreferences = JSON.parse(hasConsent);
        setCookiePreferences(savedPreferences);
        // Apply saved preferences
        applyCookieSettings(savedPreferences);
      } catch (error) {
        console.error('Error parsing saved cookie preferences:', error);
      }
    }
  }, []);

  const applyCookieSettings = (preferences: CookiePreferences) => {
    // Handle analytics cookies (Vercel Analytics)
    if (preferences.analytics) {
      // Enable analytics
      if (typeof window !== 'undefined' && window.va) {
        window.va('event', { event: 'Cookie Consent', type: 'analytics_enabled' });
      }
    }

    // Handle marketing cookies
    if (preferences.marketing) {
      // You can add marketing cookie logic here
      console.log('Marketing cookies enabled');
    }

    // Handle preference cookies
    if (preferences.preferences) {
      // You can add preference cookie logic here
      console.log('Preference cookies enabled');
    }
  };

  const savePreferences = (preferences: CookiePreferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    applyCookieSettings(preferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    setCookiePreferences(allAccepted);
    savePreferences(allAccepted);
  };

  const acceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    setCookiePreferences(necessaryOnly);
    savePreferences(necessaryOnly);
  };

  const CookieSettingsModal = () => {
    // Create a stable reference to prevent re-renders
    const currentPreferences = React.useRef(cookiePreferences);
    const [localPreferences, setLocalPreferences] = useState(cookiePreferences);

    // Update local preferences when component mounts
    React.useEffect(() => {
      setLocalPreferences(cookiePreferences);
      currentPreferences.current = cookiePreferences;
    }, []);

    const handleLocalPreferenceChange = (type: keyof CookiePreferences) => {
      if (type === 'necessary') return; // Cannot disable necessary cookies
      
      setLocalPreferences(prev => ({
        ...prev,
        [type]: !prev[type]
      }));
    };

    const saveLocalPreferences = () => {
      setCookiePreferences(localPreferences);
      savePreferences(localPreferences);
    };

    const acceptAllLocal = () => {
      const allAccepted = {
        necessary: true,
        analytics: true,
        marketing: true,
        preferences: true,
      };
      setLocalPreferences(allAccepted);
      setCookiePreferences(allAccepted);
      savePreferences(allAccepted);
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
        onClick={() => setShowSettings(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Settings className="w-6 h-6 text-indigo-600" />
                {t('settings.title')}
              </h3>
              <button
                title='Close Settings'
                type='button'
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <p className="text-gray-600">
                {t('settings.description')}
              </p>

              {/* Necessary Cookies */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">
                    {t('settings.categories.necessary.title')}
                  </h4>
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                    {t('settings.always_active')}
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {t('settings.categories.necessary.description')}
                </p>
              </div>

              {/* Analytics Cookies */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">
                    {t('settings.categories.analytics.title')}
                  </h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      title='Enable Analytics Cookies'
                      type="checkbox"
                      checked={localPreferences.analytics}
                      onChange={() => handleLocalPreferenceChange('analytics')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                <p className="text-sm text-gray-600">
                  {t('settings.categories.analytics.description')}
                </p>
              </div>

              {/* Marketing Cookies */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">
                    {t('settings.categories.marketing.title')}
                  </h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      title='Marketing Cookies'
                      type="checkbox"
                      checked={localPreferences.marketing}
                      onChange={() => handleLocalPreferenceChange('marketing')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                <p className="text-sm text-gray-600">
                  {t('settings.categories.marketing.description')}
                </p>
              </div>

              {/* Preference Cookies */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">
                    {t('settings.categories.preferences.title')}
                  </h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      title='preferences'
                      type="checkbox"
                      checked={localPreferences.preferences}
                      onChange={() => handleLocalPreferenceChange('preferences')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                <p className="text-sm text-gray-600">
                  {t('settings.categories.preferences.description')}
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={saveLocalPreferences}
                className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                {t('settings.buttons.save')}
              </button>
              <button
                onClick={acceptAllLocal}
                className="flex-1 bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                {t('settings.buttons.accept_all')}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg"
          >
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Cookie className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {t('banner.title')}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {t('banner.description')}{' '}
                      <a
                        href="/cookies"
                        className="text-indigo-600 hover:text-indigo-700 underline font-medium"
                      >
                        {t('banner.learn_more')}
                      </a>
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
                  <button
                    onClick={() => setShowSettings(true)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg transition-colors font-medium"
                  >
                    {t('banner.buttons.customize')}
                  </button>
                  <button
                    onClick={acceptNecessary}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg transition-colors font-medium"
                  >
                    {t('banner.buttons.necessary_only')}
                  </button>
                  <button
                    onClick={acceptAll}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    {t('banner.buttons.accept_all')}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSettings && <CookieSettingsModal />}
      </AnimatePresence>
    </>
  );
};

export default CookieBanner;