// src/components/LanguageSwitcher.tsx
"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { useScroll, useMotionValueEvent, motion, AnimatePresence } from 'framer-motion';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();

  const currentLocale = (pathname ?? '').split('/')[1] || 'es';

  const switchLocale = (newLocale: string) => {
    const newPathname = (pathname ?? '').replace(/^\/[^\/]+/, `/${newLocale}`);
    router.push(newPathname);
    setIsOpen(false);
  };

  // Close dropdown when user scrolls
  useMotionValueEvent(scrollY, "change", () => {
    if (isOpen) {
      setIsOpen(false);
    }
  });

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('.language-switcher-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  const languages = [
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'es', label: 'Español', short: 'ES' }
  ];

  return (
    <div className="relative inline-block language-switcher-container">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-1 p-2 rounded-md hover:bg-white/10 transition-colors text-white"
      >
        <Globe className="w-5 h-5" />
        <span>{currentLocale === 'en' ? 'EN' : 'ES'}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="absolute right-0 mt-2 w-32 bg-gray-800 rounded-md shadow-lg z-50 border border-gray-600"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ 
              duration: 0.2,
              ease: "easeOut"
            }}
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => switchLocale(lang.code)}
                className={`w-full text-left px-4 py-2 text-sm ${
                  currentLocale === lang.code 
                    ? 'bg-gray-700 font-medium text-gray-400' 
                    : 'hover:bg-gray-700 text-gray-200'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}