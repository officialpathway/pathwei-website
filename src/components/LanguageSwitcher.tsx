"use client";

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const switchLocale = (newLocale: string) => {
    if (pathname) {
      const newPathname = `/${newLocale}${pathname.startsWith(`/${locale}`) ? pathname.slice(locale.length + 1) : pathname}`;
      router.push(newPathname);
    }
    setIsOpen(false);
  };

  const languages = [
    { code: 'en-US', label: 'English', short: 'EN' },
    { code: 'es-ES', label: 'Español', short: 'ES' }
  ];

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
        <span>{locale === 'en-US' ? 'EN' : 'ES'}</span>
      </button>

      {isOpen && (
        <div 
          id="language-menu"
          className="absolute right-0 mt-2 w-32 bg-gray-800 rounded-md shadow-lg z-50 border border-gray-600"
          role="menu"
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => switchLocale(lang.code)}
              role="menuitem"
              aria-current={locale === lang.code ? 'true' : 'false'}
              className={`w-full text-left px-4 py-2 text-sm text-white ${
                locale === lang.code 
                  ? 'bg-gray-700' 
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