"use client";

import { useLocale } from 'next-intl';
import { useState } from 'react';
import { Globe } from 'lucide-react'; // Assuming you use lucide-react for icons

export default function LanguageSwitcher() {
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const switchLocale = (newLocale: string) => {
    // Get the current path without the locale
    const path = window.location.pathname;
    let newPath;
    
    // Handle paths correctly based on current locale
    if (locale === 'en-US') {
      // Current path might not have locale prefix if it's default
      newPath = newLocale === 'en-US' ? path : `/${newLocale}${path}`;
    } else {
      // Current path has a locale prefix that needs to be replaced
      const pathWithoutLocale = path.replace(`/${locale}`, '');
      newPath = newLocale === 'en-US' ? pathWithoutLocale : `/${newLocale}${pathWithoutLocale}`;
    }
    
    // Navigate to the new path
    window.location.href = newPath;
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="w-5 h-5" />
        <span>{locale === 'en-US' ? 'EN' : 'NL'}</span>
      </button>

      {isOpen && (
        <div role="listbox">
          <button
            onClick={() => switchLocale('en-US')}
            role="option"
            aria-selected={locale === 'en-US'}
            className={locale === 'en-US' ? 'text-white' : 'text-white/70'}
          >
            English
          </button>
          <button
            onClick={() => switchLocale('nl-NL')}
            role="option"
            aria-selected={locale === 'nl-NL'}
            className={locale === 'nl-NL' ? 'text-white' : 'text-white/70'}
          >
            Nederlands
          </button>
        </div>
      )}
    </div>
  );
}