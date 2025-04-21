// src/components/LanguageSwitcher.tsx
"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const currentLocale = (pathname ?? '').split('/')[1] || 'en';

  const switchLocale = (newLocale: string) => {
    const newPathname = (pathname ?? '').replace(/^\/[^\/]+/, `/${newLocale}`);
    router.push(newPathname);
    setIsOpen(false);
  };

  const languages = [
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'es', label: 'Español', short: 'ES' }
  ];

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 p-2 rounded-md hover:bg-white/10 transition-colors text-white"
      >
        <Globe className="w-5 h-5" />
        <span>{currentLocale === 'en' ? 'EN' : 'ES'}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-gray-800 rounded-md shadow-lg z-50 border border-gray-600">
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
        </div>
      )}
    </div>
  );
}