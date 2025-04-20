"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const switchLocale = (newLocale: string) => {
    // Set the locale cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
        
    // Refresh the page to apply the new locale
    router.refresh();
    setIsOpen(false);
  };

  const languages = [
    { code: 'en-US', label: 'English', short: 'EN' },
    { code: 'es-ES', label: 'Español', short: 'ES' }
  ];

  // Get current locale from cookie (client-side)
  const getCurrentLocale = () => {
    if (typeof window === 'undefined') return 'en-US';
    const match = document.cookie.match(/NEXT_LOCALE=([^;]+)/);
    return match ? match[1] : 'en-US';
  };

  const currentLocale = getCurrentLocale();

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen ? 'true' : 'false'}
        aria-haspopup="menu"
        aria-controls="language-menu"
        className="flex items-center gap-1 p-2 rounded-md hover:bg-white/10 transition-colors text-white"
      >
        <Globe className="w-5 h-5" />
        <span>{currentLocale === 'en-US' ? 'EN' : 'ES'}</span>
      </button>

      {isOpen && (
        <div 
          id="language-menu"
          className="absolute right-0 mt-2 w-32 bg-gray-800 rounded-md shadow-lg z-50 border border-gray-600"
          role="menu"
          onMouseLeave={() => setIsOpen(false)}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => switchLocale(lang.code)}
              role="menuitem"
              aria-current={currentLocale === lang.code ? 'true' : 'false'}
              className={`w-full text-left px-4 py-2 text-sm text-white ${
                currentLocale === lang.code 
                  ? 'bg-gray-700 font-medium' 
                  : 'hover:bg-gray-700'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}